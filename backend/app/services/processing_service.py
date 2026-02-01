"""
Processing Service - Async Document Processing
"""
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from uuid import UUID
from fastapi import BackgroundTasks
import asyncio

from app.models.document import Document
from app.services.ocr_service import OCRService
from app.services.vector_service import VectorService
from app.services.rag_service import RAGService
from app.services.deadline_extractor import DeadlineExtractor


class ProcessingService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.ocr = OCRService()
        self.vector = VectorService()
        self.deadline_extractor = DeadlineExtractor()
    
    async def process_document_async(
        self,
        document_id: UUID,
        user_id: UUID,
        background_tasks: BackgroundTasks = None,
    ):
        """Process document asynchronously"""
        if background_tasks:
            background_tasks.add_task(
                self._process_document,
                document_id,
                user_id
            )
        else:
            # Run in background
            asyncio.create_task(
                self._process_document(document_id, user_id)
            )
    
    async def _process_document(self, document_id: UUID, user_id: UUID):
        """Internal processing function"""
        try:
            # Get document
            result = await self.db.execute(
                select(Document).where(
                    Document.id == document_id,
                    Document.uploaded_by == user_id
                )
            )
            document = result.scalar_one_or_none()
            
            if not document:
                return
            
            # Update status
            document.status = "processing"
            await self.db.commit()
            
            # Step 1: OCR
            ocr_text = await self.ocr.extract_text(document.file_path)
            document.ocr_text = ocr_text
            
            # Step 2: Extract deadline
            deadline = await self.deadline_extractor.extract(ocr_text)
            if deadline:
                document.extracted_deadline = deadline
            
            # Step 3: Generate embeddings and store in Pinecone
            chunks = await self.vector.chunk_text(ocr_text)
            vector_ids = []
            
            for i, chunk in enumerate(chunks):
                embedding = await self.vector.embed_text(chunk)
                vector_id = f"{document_id}_{i}"
                
                # Store in Pinecone
                from app.core.config import settings
                from pinecone import Pinecone
                pc = Pinecone(api_key=settings.PINECONE_API_KEY)
                index = pc.Index(settings.PINECONE_INDEX_NAME)
                
                index.upsert(vectors=[{
                    "id": vector_id,
                    "values": embedding,
                    "metadata": {
                        "document_id": str(document_id),
                        "text": chunk,
                        "chunk_index": i,
                    }
                }])
                
                vector_ids.append(vector_id)
            
            document.vector_id = ",".join(vector_ids)
            document.status = "completed"
            
            await self.db.commit()
            
        except Exception as e:
            # Update status to failed
            result = await self.db.execute(
                select(Document).where(Document.id == document_id)
            )
            document = result.scalar_one_or_none()
            if document:
                document.status = "failed"
                await self.db.commit()
            raise e

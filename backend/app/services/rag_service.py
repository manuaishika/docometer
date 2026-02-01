"""
RAG Service - Optimized Retrieval-Augmented Generation
"""
from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID
from typing import List, Optional
import google.generativeai as genai
from pinecone import Pinecone, ServerlessSpec
import asyncio

from app.core.config import settings
from app.models.document import Document
from app.services.vector_service import VectorService


class RAGService:
    def __init__(self, db: AsyncSession):
        self.db = db
        genai.configure(api_key=settings.GEMINI_API_KEY)
        self.model = genai.GenerativeModel(settings.GEMINI_MODEL)
        self.pinecone = Pinecone(api_key=settings.PINECONE_API_KEY)
        self.index = self.pinecone.Index(settings.PINECONE_INDEX_NAME)
        self.vector_service = VectorService()
    
    async def ask_question(
        self,
        question: str,
        document_id: Optional[UUID] = None,
        language: str = "en",
        top_k: int = 5,
    ) -> dict:
        """Ask question using RAG pipeline"""
        # Generate question embedding
        question_embedding = await self.vector_service.embed_text(question)
        
        # Retrieve relevant chunks
        if document_id:
            # Filter by document
            filter_dict = {"document_id": str(document_id)}
        else:
            filter_dict = {}
        
        results = self.index.query(
            vector=question_embedding,
            top_k=top_k,
            include_metadata=True,
            filter=filter_dict,
        )
        
        # Build context from retrieved chunks
        context = "\n\n".join([
            match.metadata.get("text", "") for match in results.matches
        ])
        
        # Generate answer with Gemini
        prompt = f"""Context: {context}

Question: {question}

Answer the question based on the context provided. If the answer is not in the context, say so.
Respond in {language} language."""
        
        response = await asyncio.to_thread(
            self.model.generate_content,
            prompt
        )
        
        answer = response.text
        
        return {
            "answer": answer,
            "sources": [match.id for match in results.matches],
            "confidence": results.matches[0].score if results.matches else 0.0,
            "language": language,
        }
    
    async def generate_summary(
        self,
        document_id: UUID,
        language: str = "en",
    ) -> str:
        """Generate multilingual summary"""
        # Get document
        from sqlalchemy import select
        result = await self.db.execute(
            select(Document).where(Document.id == document_id)
        )
        document = result.scalar_one_or_none()
        
        if not document or not document.ocr_text:
            return "No content available for summary."
        
        prompt = f"""Summarize the following document in {language} language. 
Provide a concise summary covering the main points.

Document:
{document.ocr_text[:5000]}  # Limit to avoid token limits

Summary:"""
        
        response = await asyncio.to_thread(
            self.model.generate_content,
            prompt
        )
        
        return response.text

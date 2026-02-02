"""
Document Service - Optimized Document Operations
"""
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import UploadFile
from uuid import UUID
import aiofiles
import os
from pathlib import Path
import asyncio

from app.models.document import Document
from app.services.supabase_service import SupabaseService
from app.services.processing_service import ProcessingService


class DocumentService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.supabase = SupabaseService()
        self.processing = ProcessingService(db)
    
    async def upload_and_process(
        self,
        file: UploadFile,
        user_id: UUID,
    ) -> Document:
        """Upload file to Supabase and create document record"""
        # Upload to Supabase
        file_path = await self.supabase.upload_file(file, user_id)
        
        # Create document record
        document = Document(
            title=file.filename or "Untitled",
            file_name=file.filename or "untitled",
            file_path=file_path,
            file_type=file.content_type or "application/octet-stream",
            file_size=0,  # Will be updated
            uploaded_by=user_id,
            status="pending",
        )
        
        self.db.add(document)
        await self.db.commit()
        await self.db.refresh(document)
        
        # Trigger async processing (fire and forget)
        asyncio.create_task(
            self.processing.process_document_async(document.id, user_id)
        )
        
        return document
    
    async def delete_document(self, document: Document):
        """Delete document and associated files"""
        # Delete from Supabase
        await self.supabase.delete_file(document.file_path)
        
        # Delete from database
        await self.db.delete(document)
        await self.db.commit()

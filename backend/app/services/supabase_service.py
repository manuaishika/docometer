"""
Supabase Service - Cloud File Storage
"""
from supabase import create_client, Client
from fastapi import UploadFile
from uuid import UUID
import asyncio

from app.core.config import settings


class SupabaseService:
    def __init__(self):
        self.client: Client = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)
        self.bucket = settings.SUPABASE_BUCKET
    
    async def upload_file(self, file: UploadFile, user_id: UUID) -> str:
        """Upload file to Supabase storage"""
        file_path = f"{user_id}/{file.filename}"
        
        # Read file content
        content = await file.read()
        
        # Upload to Supabase
        await asyncio.to_thread(
            self.client.storage.from_(self.bucket).upload,
            file_path,
            content,
            file_options={"content-type": file.content_type or "application/octet-stream"}
        )
        
        return file_path
    
    async def download_file(self, file_path: str) -> bytes:
        """Download file from Supabase storage"""
        result = await asyncio.to_thread(
            self.client.storage.from_(self.bucket).download,
            file_path
        )
        return result
    
    async def delete_file(self, file_path: str):
        """Delete file from Supabase storage"""
        await asyncio.to_thread(
            self.client.storage.from_(self.bucket).remove,
            [file_path]
        )

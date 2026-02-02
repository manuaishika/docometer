"""
Supabase Service - Cloud File Storage
"""
from fastapi import UploadFile
from uuid import UUID
import asyncio
from pathlib import Path

from app.core.config import settings


class SupabaseService:
    def __init__(self):
        self.bucket = settings.SUPABASE_BUCKET
        self.local_root = Path(__file__).resolve().parents[2] / "storage"

        # Optional dependency: if supabase isn't installed or creds missing, we fall back to local storage.
        self._supabase_ok = False
        self.client = None
        try:
            if settings.SUPABASE_URL and settings.SUPABASE_KEY:
                from supabase import create_client  # type: ignore

                self.client = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)
                self._supabase_ok = True
        except Exception:
            self._supabase_ok = False
    
    async def upload_file(self, file: UploadFile, user_id: UUID) -> str:
        """Upload file to Supabase storage"""
        file_path = f"{user_id}/{file.filename}"
        
        # Read file content
        content = await file.read()

        if self._supabase_ok and self.client is not None:
            # Upload to Supabase
            await asyncio.to_thread(
                self.client.storage.from_(self.bucket).upload,
                file_path,
                content,
                file_options={"content-type": file.content_type or "application/octet-stream"},
            )
            return file_path

        # Local fallback (dev): store file under backend/storage/<user_id>/<filename>
        target = self.local_root / str(user_id)
        target.mkdir(parents=True, exist_ok=True)
        out_path = target / (file.filename or "upload.bin")
        out_path.write_bytes(content)
        return str(out_path)
    
    async def download_file(self, file_path: str) -> bytes:
        """Download file from Supabase storage"""
        if self._supabase_ok and self.client is not None and not file_path.startswith(str(self.local_root)):
            result = await asyncio.to_thread(
                self.client.storage.from_(self.bucket).download,
                file_path,
            )
            return result

        # Local fallback
        return Path(file_path).read_bytes()
    
    async def delete_file(self, file_path: str):
        """Delete file from Supabase storage"""
        if self._supabase_ok and self.client is not None and not file_path.startswith(str(self.local_root)):
            await asyncio.to_thread(
                self.client.storage.from_(self.bucket).remove,
                [file_path],
            )
            return

        # Local fallback
        try:
            Path(file_path).unlink(missing_ok=True)
        except Exception:
            pass

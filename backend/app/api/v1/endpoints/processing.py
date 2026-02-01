"""
Document Processing Endpoints
"""
from fastapi import APIRouter, Depends, BackgroundTasks
from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID

from app.core.database import get_db
from app.api.v1.dependencies import get_current_user
from app.models.user import User
from app.services.processing_service import ProcessingService

router = APIRouter()


@router.post("/process/{document_id}")
async def process_document(
    document_id: UUID,
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Trigger document processing (OCR, embedding, etc.)"""
    service = ProcessingService(db)
    await service.process_document_async(document_id, current_user.id, background_tasks)
    
    return {"status": "processing_started", "document_id": str(document_id)}

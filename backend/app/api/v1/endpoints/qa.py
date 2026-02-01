"""
Q&A API Endpoints - Optimized RAG Pipeline
"""
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from uuid import UUID
from typing import Optional

from app.core.database import get_db
from app.core.cache import get_cached, set_cached
from app.models.document import Document
from app.models.user import User
from app.api.v1.dependencies import get_current_user
from app.services.rag_service import RAGService
from app.api.v1.schemas.qa import QuestionRequest, QuestionResponse

router = APIRouter()


@router.post("/ask", response_model=QuestionResponse)
async def ask_question(
    question_data: QuestionRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Ask question using RAG pipeline - Cached"""
    # Validate document access
    if question_data.document_id:
        result = await db.execute(
            select(Document).where(
                Document.id == question_data.document_id,
                Document.uploaded_by == current_user.id,
                Document.status == "completed"
            )
        )
        document = result.scalar_one_or_none()
        if not document:
            raise HTTPException(status_code=404, detail="Document not found")
    
    # Check cache
    cache_key = f"qa:{question_data.document_id}:{hash(question_data.question)}"
    cached_result = await get_cached(cache_key)
    if cached_result:
        return cached_result
    
    # Process with RAG
    rag_service = RAGService(db)
    response = await rag_service.ask_question(
        question=question_data.question,
        document_id=question_data.document_id,
        language=question_data.language or "en",
    )
    
    # Cache response
    await set_cached(cache_key, response.dict(), ttl=3600)  # 1 hour
    
    return response


@router.get("/summaries/{document_id}")
async def get_summary(
    document_id: UUID,
    language: str = Query("en", regex="^(en|hi|ml|ta|te)$"),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Get multilingual summary - Cached"""
    cache_key = f"summary:{document_id}:{language}"
    
    cached_result = await get_cached(cache_key)
    if cached_result:
        return cached_result
    
    # Validate access
    result = await db.execute(
        select(Document).where(
            Document.id == document_id,
            Document.uploaded_by == current_user.id,
            Document.status == "completed"
        )
    )
    document = result.scalar_one_or_none()
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")
    
    # Generate summary
    rag_service = RAGService(db)
    summary = await rag_service.generate_summary(document_id, language)
    
    # Cache result
    await set_cached(cache_key, {"summary": summary}, ttl=7200)  # 2 hours
    
    return {"summary": summary}

"""
Documents API Endpoints - Optimized with Caching
"""
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, desc
from typing import List, Optional
from uuid import UUID

from app.core.database import get_db
from app.core.cache import get_cached, set_cached, delete_pattern
from app.models.document import Document
from app.models.user import User
from app.api.v1.schemas.document import DocumentCreate, DocumentResponse, DocumentListResponse
from app.services.document_service import DocumentService
from app.api.v1.dependencies import get_current_user

router = APIRouter()


@router.post("/upload", response_model=DocumentResponse, status_code=201)
async def upload_document(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Upload and process document - Async processing"""
    service = DocumentService(db)
    document = await service.upload_and_process(file, current_user.id)
    
    # Invalidate cache
    await delete_pattern(f"documents:user:{current_user.id}:*")
    
    return document


@router.get("/", response_model=DocumentListResponse)
async def list_documents(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    status: Optional[str] = None,
    language: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """List documents with pagination and filters - Cached"""
    cache_key = f"documents:user:{current_user.id}:{skip}:{limit}:{status}:{language}"
    
    # Try cache first
    cached_result = await get_cached(cache_key)
    if cached_result:
        return cached_result
    
    # Build query
    query = select(Document).where(Document.uploaded_by == current_user.id)
    
    if status:
        query = query.where(Document.status == status)
    if language:
        query = query.where(Document.language == language)
    
    # Get total count
    count_query = select(func.count()).select_from(query.subquery())
    total = await db.scalar(count_query)
    
    # Get documents
    query = query.order_by(desc(Document.created_at)).offset(skip).limit(limit)
    result = await db.execute(query)
    documents = result.scalars().all()
    
    response = DocumentListResponse(
        items=[DocumentResponse.from_orm(doc) for doc in documents],
        total=total,
        skip=skip,
        limit=limit,
    )
    
    # Cache result
    await set_cached(cache_key, response.dict(), ttl=300)  # 5 minutes
    
    return response


@router.get("/{document_id}", response_model=DocumentResponse)
async def get_document(
    document_id: UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Get document by ID - Cached"""
    cache_key = f"document:{document_id}"
    
    cached_result = await get_cached(cache_key)
    if cached_result:
        return cached_result
    
    result = await db.execute(
        select(Document).where(
            Document.id == document_id,
            Document.uploaded_by == current_user.id
        )
    )
    document = result.scalar_one_or_none()
    
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")
    
    response = DocumentResponse.from_orm(document)
    await set_cached(cache_key, response.dict(), ttl=600)  # 10 minutes
    
    return response


@router.delete("/{document_id}", status_code=204)
async def delete_document(
    document_id: UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Delete document"""
    result = await db.execute(
        select(Document).where(
            Document.id == document_id,
            Document.uploaded_by == current_user.id
        )
    )
    document = result.scalar_one_or_none()
    
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")
    
    service = DocumentService(db)
    await service.delete_document(document)
    
    # Invalidate cache
    await delete_pattern(f"document:{document_id}*")
    await delete_pattern(f"documents:user:{current_user.id}:*")
    
    return None

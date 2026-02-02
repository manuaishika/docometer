"""
Document Schemas
"""
from pydantic import BaseModel, Field
from uuid import UUID
from datetime import datetime
from typing import Optional, List, Dict, Any


class DocumentCreate(BaseModel):
    title: str
    file_name: str
    file_type: str


class DocumentResponse(BaseModel):
    id: str
    title: str
    file_name: str
    file_path: str
    file_type: str
    file_size: int
    language: Optional[str] = None
    summary: Optional[str] = None
    extracted_deadline: Optional[datetime] = None
    metadata: Optional[Dict[str, Any]] = None
    status: str
    ocr_text: Optional[str] = None
    vector_id: Optional[str] = None
    uploaded_by: str
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class DocumentListResponse(BaseModel):
    items: List[DocumentResponse]
    total: int
    skip: int
    limit: int

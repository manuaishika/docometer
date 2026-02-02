"""
Document Model - Optimized with Indexes
"""
from sqlalchemy import Column, String, DateTime, Text, Integer, ForeignKey, Index, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid

from app.core.database import Base


class Document(Base):
    __tablename__ = "documents"
    
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    title = Column(String(500), nullable=False, index=True)
    file_name = Column(String(500), nullable=False)
    file_path = Column(String(1000), nullable=False)
    file_type = Column(String(50), nullable=False, index=True)
    file_size = Column(Integer, nullable=False)
    
    # Metadata
    language = Column(String(10), nullable=True, index=True)
    summary = Column(Text, nullable=True)
    extracted_deadline = Column(DateTime, nullable=True, index=True)
    extra_metadata = Column("metadata", JSON, nullable=True)
    
    # Processing status
    status = Column(String(50), default="pending", index=True)  # pending, processing, completed, failed
    ocr_text = Column(Text, nullable=True)
    vector_id = Column(String(200), nullable=True, index=True)  # Pinecone vector ID
    
    # Relationships
    uploaded_by = Column(String(36), ForeignKey("users.id"), nullable=False, index=True)
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Indexes for common queries
    __table_args__ = (
        Index("idx_document_status_created", "status", "created_at"),
        Index("idx_document_user_status", "uploaded_by", "status"),
        Index("idx_document_language_status", "language", "status"),
    )
    
    def __repr__(self):
        return f"<Document(id={self.id}, title={self.title[:50]})>"

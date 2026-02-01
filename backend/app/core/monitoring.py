"""
Performance Monitoring and Metrics
"""
from prometheus_fastapi_instrumentator import Instrumentator
from fastapi import FastAPI

from app.core.config import settings


def setup_monitoring(app: FastAPI):
    """Setup Prometheus metrics"""
    if settings.ENABLE_MONITORING:
        Instrumentator().instrument(app).expose(app)

"""
Database Configuration - Async SQLAlchemy

Defaults to SQLite for easy local dev; supports Postgres in production.
"""
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import declarative_base
from sqlalchemy.pool import NullPool
from contextlib import asynccontextmanager

from app.core.config import settings


def _create_engine():
    url = settings.DATABASE_URL or ""
    is_sqlite = url.startswith("sqlite")

    # SQLite doesn't support the same pooling args; use NullPool for simplicity.
    if is_sqlite:
        return create_async_engine(
            url,
            poolclass=NullPool,
            echo=False,
            future=True,
        )

    # Postgres / other DBs
    return create_async_engine(
        url,
        pool_size=settings.DB_POOL_SIZE,
        max_overflow=settings.DB_MAX_OVERFLOW,
        pool_pre_ping=settings.DB_POOL_PRE_PING,
        pool_recycle=3600,
        echo=False,
        future=True,
    )


engine = _create_engine()

# Create async session factory
AsyncSessionLocal = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False,
)

Base = declarative_base()


async def get_db() -> AsyncSession:
    """Dependency for getting database session"""
    async with AsyncSessionLocal() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()


@asynccontextmanager
async def get_db_context():
    """Context manager for database sessions"""
    async with AsyncSessionLocal() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise


async def init_db():
    """Initialize database - create tables"""
    async with engine.begin() as conn:
        # Import all models here to ensure they're registered
        from app.models import document, user, role  # noqa
        
        await conn.run_sync(Base.metadata.create_all)

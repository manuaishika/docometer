"""
API Dependencies
"""
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from jose import JWTError, jwt

from app.core.database import get_db
from app.core.config import settings
from app.models.user import User

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")


async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: AsyncSession = Depends(get_db),
) -> User:
    """Get current authenticated user"""
    # Dev-mode shortcut: allow requests without auth and auto-provision a demo user.
    if settings.DEV_MODE and not token:
        result = await db.execute(select(User).where(User.username == settings.DEV_USERNAME))
        user = result.scalar_one_or_none()
        if user is None:
            user = User(
                email=settings.DEV_USER_EMAIL,
                username=settings.DEV_USERNAME,
                hashed_password="dev",
                full_name="Demo User",
                is_active=True,
                is_superuser=True,
            )
            db.add(user)
            await db.commit()
            await db.refresh(user)
        return user

    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    
    if user is None:
        raise credentials_exception
    
    if not user.is_active:
        raise HTTPException(status_code=403, detail="Inactive user")
    
    return user

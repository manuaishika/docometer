"""
Redis Cache Configuration - High-Performance Caching
"""
import redis.asyncio as redis
import json
from typing import Optional, Any
from functools import wraps
import hashlib

from app.core.config import settings

redis_client: Optional[redis.Redis] = None


async def init_cache():
    """Initialize Redis connection"""
    global redis_client
    if settings.ENABLE_CACHE:
        redis_client = await redis.from_url(
            settings.REDIS_URL,
            encoding="utf-8",
            decode_responses=True,
            max_connections=50,
        )


async def get_cache() -> Optional[redis.Redis]:
    """Get Redis cache instance"""
    return redis_client


async def get_cached(key: str) -> Optional[Any]:
    """Get value from cache"""
    if not redis_client or not settings.ENABLE_CACHE:
        return None
    
    try:
        value = await redis_client.get(key)
        if value:
            return json.loads(value)
    except Exception:
        pass
    return None


async def set_cached(key: str, value: Any, ttl: int = None) -> bool:
    """Set value in cache"""
    if not redis_client or not settings.ENABLE_CACHE:
        return False
    
    try:
        ttl = ttl or settings.CACHE_TTL
        await redis_client.setex(
            key,
            ttl,
            json.dumps(value, default=str)
        )
        return True
    except Exception:
        return False


async def delete_cached(key: str) -> bool:
    """Delete key from cache"""
    if not redis_client or not settings.ENABLE_CACHE:
        return False
    
    try:
        await redis_client.delete(key)
        return True
    except Exception:
        return False


async def delete_pattern(pattern: str) -> int:
    """Delete all keys matching pattern"""
    if not redis_client or not settings.ENABLE_CACHE:
        return 0
    
    try:
        keys = []
        async for key in redis_client.scan_iter(match=pattern):
            keys.append(key)
        if keys:
            return await redis_client.delete(*keys)
        return 0
    except Exception:
        return 0


def cache_key(*args, **kwargs) -> str:
    """Generate cache key from arguments"""
    key_str = f"{args}:{sorted(kwargs.items())}"
    return hashlib.md5(key_str.encode()).hexdigest()


def cached(ttl: int = None):
    """Decorator for caching function results"""
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            # Generate cache key
            key = f"{func.__module__}:{func.__name__}:{cache_key(*args, **kwargs)}"
            
            # Try to get from cache
            cached_value = await get_cached(key)
            if cached_value is not None:
                return cached_value
            
            # Execute function
            result = await func(*args, **kwargs)
            
            # Store in cache
            await set_cached(key, result, ttl)
            
            return result
        return wrapper
    return decorator

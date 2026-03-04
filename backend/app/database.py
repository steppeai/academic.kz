"""
Async SQLAlchemy engine and session factory.
All routes should use `get_db` dependency to access DB sessions.
"""
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.orm import DeclarativeBase

from app.config import settings


# ── Engine ──────────────────────────────────────────────────────
engine = create_async_engine(
    settings.database_url,
    echo=settings.debug,
    pool_pre_ping=True,
    pool_size=10,
    max_overflow=20,
)

# ── Session factory ─────────────────────────────────────────────
AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autoflush=False,
    autocommit=False,
)


# ── Base class for all ORM models ───────────────────────────────
class Base(DeclarativeBase):
    pass


# ── FastAPI dependency ──────────────────────────────────────────
async def get_db() -> AsyncSession:
    """Yield an async DB session; roll back on error."""
    async with AsyncSessionLocal() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise

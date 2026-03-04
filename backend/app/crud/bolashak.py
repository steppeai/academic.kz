"""CRUD for Bolashak module (read-only data seeded via scripts)."""
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.models.bolashak import BolashakCriteria, BolashakStep, BolashakDocument


async def get_criteria(db: AsyncSession) -> list[BolashakCriteria]:
    result = await db.execute(
        select(BolashakCriteria).order_by(BolashakCriteria.sort_order)
    )
    return result.scalars().all()


async def get_steps(db: AsyncSession) -> list[BolashakStep]:
    result = await db.execute(
        select(BolashakStep).order_by(BolashakStep.step_number)
    )
    return result.scalars().all()


async def get_documents(db: AsyncSession) -> list[BolashakDocument]:
    result = await db.execute(select(BolashakDocument))
    return result.scalars().all()

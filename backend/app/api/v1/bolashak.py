"""Bolashak module: eligibility criteria, steps, documents."""
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.crud.bolashak import get_criteria, get_steps, get_documents
from app.schemas.bolashak import BolashakOverview, BolashakCriteriaRead, BolashakStepRead, BolashakDocumentRead

router = APIRouter(prefix="/bolashak")


@router.get("", response_model=BolashakOverview, summary="Full Bolashak overview")
async def bolashak_overview(db: AsyncSession = Depends(get_db)):
    """
    Returns all Bolashak criteria, application steps, and required documents.
    Supports Week 4 feature: Bolashak Module.
    """
    criteria = await get_criteria(db)
    steps = await get_steps(db)
    documents = await get_documents(db)
    return BolashakOverview(criteria=criteria, steps=steps, documents=documents)


@router.get("/criteria", response_model=list[BolashakCriteriaRead])
async def list_criteria(db: AsyncSession = Depends(get_db)):
    return await get_criteria(db)


@router.get("/steps", response_model=list[BolashakStepRead])
async def list_steps(db: AsyncSession = Depends(get_db)):
    return await get_steps(db)


@router.get("/documents", response_model=list[BolashakDocumentRead])
async def list_documents(db: AsyncSession = Depends(get_db)):
    return await get_documents(db)

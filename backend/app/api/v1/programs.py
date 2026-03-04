"""Programs catalog: search, filter, and program detail endpoints."""
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional

from app.database import get_db
from app.crud.programs import get_programs, get_program_by_id
from app.schemas.program import ProgramListResponse, ProgramRead, ProgramFilter

router = APIRouter(prefix="/programs")


@router.get("", response_model=ProgramListResponse, summary="List & filter programs")
async def list_programs(
    search: Optional[str] = Query(None, description="Search by program name"),
    city: Optional[str] = Query(None, description="Filter by city"),
    degree_level: Optional[str] = Query(None, description="bachelor | master | phd"),
    language: Optional[str] = Query(None, description="Language of instruction"),
    max_tuition_fee: Optional[float] = Query(None, description="Max tuition fee"),
    university_id: Optional[str] = Query(None),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
):
    """
    Return a paginated, filtered list of programs.
    Supports Week 3 feature: Program Search & Filter.
    """
    filters = ProgramFilter(
        search=search, city=city, degree_level=degree_level,
        language=language, max_tuition_fee=max_tuition_fee,
        university_id=university_id, page=page, page_size=page_size,
    )
    programs, total = await get_programs(db, filters)
    return ProgramListResponse(
        total=total, page=page, page_size=page_size,
        items=programs,
    )


@router.get("/{program_id}", response_model=ProgramRead, summary="Program detail page")
async def get_program(program_id: str, db: AsyncSession = Depends(get_db)):
    """
    Return full details of a program including requirements, deadlines, and documents.
    """
    program = await get_program_by_id(db, program_id)
    if not program:
        raise HTTPException(status_code=404, detail="Program not found")
    return program

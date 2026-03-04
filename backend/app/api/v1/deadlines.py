"""Deadlines tracker: upcoming deadlines across all programs."""
from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from datetime import date
from typing import Optional
from pydantic import BaseModel, ConfigDict

from app.database import get_db
from app.models.deadline import Deadline

router = APIRouter(prefix="/deadlines")


class DeadlineRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    program_id: Optional[str] = None
    scholarship_id: Optional[str] = None
    term: Optional[str] = None
    date: Optional[date] = None
    type: Optional[str] = None


@router.get("", response_model=list[DeadlineRead], summary="List upcoming deadlines")
async def list_deadlines(
    program_id: Optional[str] = Query(None),
    upcoming_days: Optional[int] = Query(None, description="Filter deadlines within N days from today"),
    db: AsyncSession = Depends(get_db),
):
    """
    Return deadlines, optionally filtered by program or upcoming time window.
    Supports Week 6 feature: Application Deadline Reminders.
    """
    query = select(Deadline).order_by(Deadline.date)

    if program_id:
        query = query.filter(Deadline.program_id == program_id)

    if upcoming_days is not None:
        from datetime import timedelta
        cutoff = date.today() + timedelta(days=upcoming_days)
        query = query.filter(Deadline.date >= date.today(), Deadline.date <= cutoff)

    result = await db.execute(query)
    return result.scalars().all()

"""Pydantic schemas for personal checklist items."""
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict
from enum import Enum


class ChecklistStatus(str, Enum):
    TODO = "todo"
    IN_PROGRESS = "in_progress"
    DONE = "done"


class ChecklistItemBase(BaseModel):
    title: str
    description: Optional[str] = None
    status: ChecklistStatus = ChecklistStatus.TODO
    due_date: Optional[datetime] = None
    program_id: Optional[str] = None


class ChecklistItemCreate(ChecklistItemBase):
    pass


class ChecklistItemUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[ChecklistStatus] = None
    due_date: Optional[datetime] = None


class ChecklistItemRead(ChecklistItemBase):
    model_config = ConfigDict(from_attributes=True)
    id: str
    user_id: str
    created_at: datetime
    updated_at: datetime

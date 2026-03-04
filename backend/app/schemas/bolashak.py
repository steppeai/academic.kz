"""Pydantic schemas for Bolashak module."""
from typing import Optional
from pydantic import BaseModel, ConfigDict


class BolashakCriteriaRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    category: str
    title: str
    description: Optional[str] = None
    is_mandatory: bool
    sort_order: int


class BolashakStepRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    step_number: int
    title: str
    description: Optional[str] = None
    documents_required: Optional[str] = None


class BolashakDocumentRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    name: str
    description: Optional[str] = None
    is_required: bool
    notes: Optional[str] = None


class BolashakOverview(BaseModel):
    """Full Bolashak overview returned to the frontend."""
    criteria: list[BolashakCriteriaRead]
    steps: list[BolashakStepRead]
    documents: list[BolashakDocumentRead]

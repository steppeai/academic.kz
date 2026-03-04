"""Pydantic schemas for Program and University endpoints."""
from datetime import date
from typing import Optional
from pydantic import BaseModel, ConfigDict


# ── University ───────────────────────────────────────────────────
class UniversityBase(BaseModel):
    name: str
    country: Optional[str] = None
    city: Optional[str] = None
    website_url: Optional[str] = None
    logo_url: Optional[str] = None


class UniversityCreate(UniversityBase):
    pass


class UniversityRead(UniversityBase):
    model_config = ConfigDict(from_attributes=True)
    id: str


# ── Faculty ──────────────────────────────────────────────────────
class FacultyRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    name: str
    university_id: str


# ── Program ──────────────────────────────────────────────────────
class ProgramBase(BaseModel):
    name: str
    degree_level: str                   # bachelor / master / phd
    language: Optional[str] = None
    city: Optional[str] = None
    duration: Optional[str] = None
    tuition_fee: Optional[float] = None
    description: Optional[str] = None


class ProgramCreate(ProgramBase):
    university_id: str
    faculty_id: Optional[str] = None


class ProgramRead(ProgramBase):
    model_config = ConfigDict(from_attributes=True)
    id: str
    university_id: str
    faculty_id: Optional[str] = None
    university: Optional[UniversityRead] = None


class ProgramFilter(BaseModel):
    """Query params for program search & filter."""
    city: Optional[str] = None
    degree_level: Optional[str] = None          # bachelor/master/phd
    language: Optional[str] = None
    max_tuition_fee: Optional[float] = None
    university_id: Optional[str] = None
    search: Optional[str] = None                # full-text search on name
    page: int = 1
    page_size: int = 20


class ProgramListResponse(BaseModel):
    total: int
    page: int
    page_size: int
    items: list[ProgramRead]

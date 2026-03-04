"""Requirement ORM models (requirement set, test requirements, document requirements)."""
import uuid
from sqlalchemy import String, Text, Numeric, Boolean, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class RequirementSet(Base):
    """Top-level requirements for a program."""
    __tablename__ = "requirement_sets"

    id: Mapped[str] = mapped_column(
        String(36), primary_key=True, default=lambda: str(uuid.uuid4())
    )
    program_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("programs.id", ondelete="CASCADE"), unique=True, nullable=False
    )
    min_gpa: Mapped[float | None] = mapped_column(Numeric(4, 2))
    notes: Mapped[str | None] = mapped_column(Text)

    # Relationships
    program: Mapped["Program"] = relationship(back_populates="requirement_set")
    test_requirements: Mapped[list["TestRequirement"]] = relationship(
        back_populates="requirement_set", cascade="all, delete-orphan"
    )
    document_requirements: Mapped[list["DocumentRequirement"]] = relationship(
        back_populates="requirement_set", cascade="all, delete-orphan"
    )


class TestRequirement(Base):
    """Language / qualification test requirements (IELTS, TOEFL, GRE, etc.)."""
    __tablename__ = "test_requirements"

    id: Mapped[str] = mapped_column(
        String(36), primary_key=True, default=lambda: str(uuid.uuid4())
    )
    requirement_set_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("requirement_sets.id", ondelete="CASCADE"), nullable=False
    )
    test_type: Mapped[str | None] = mapped_column(String(100))   # IELTS, TOEFL, GRE…
    min_score: Mapped[float | None] = mapped_column(Numeric(6, 2))

    requirement_set: Mapped["RequirementSet"] = relationship(
        back_populates="test_requirements"
    )


class DocumentRequirement(Base):
    """Documents required for application."""
    __tablename__ = "document_requirements"

    id: Mapped[str] = mapped_column(
        String(36), primary_key=True, default=lambda: str(uuid.uuid4())
    )
    requirement_set_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("requirement_sets.id", ondelete="CASCADE"), nullable=False
    )
    document_type: Mapped[str | None] = mapped_column(String(100))
    required: Mapped[bool] = mapped_column(Boolean, default=True)
    notes: Mapped[str | None] = mapped_column(Text)

    requirement_set: Mapped["RequirementSet"] = relationship(
        back_populates="document_requirements"
    )


from app.models.program import Program  # noqa: E402, F401

"""University and Faculty ORM models."""
import uuid
from sqlalchemy import String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class University(Base):
    __tablename__ = "universities"

    id: Mapped[str] = mapped_column(
        String(36), primary_key=True, default=lambda: str(uuid.uuid4())
    )
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    country: Mapped[str | None] = mapped_column(String(100))
    city: Mapped[str | None] = mapped_column(String(100))
    website_url: Mapped[str | None] = mapped_column(Text)
    logo_url: Mapped[str | None] = mapped_column(Text)

    # Relationships
    faculties: Mapped[list["Faculty"]] = relationship(
        back_populates="university", cascade="all, delete-orphan"
    )
    programs: Mapped[list["Program"]] = relationship(
        back_populates="university", cascade="all, delete-orphan"
    )
    scholarships: Mapped[list["Scholarship"]] = relationship(
        back_populates="university", cascade="all, delete-orphan"
    )


class Faculty(Base):
    __tablename__ = "faculties"

    id: Mapped[str] = mapped_column(
        String(36), primary_key=True, default=lambda: str(uuid.uuid4())
    )
    university_id: Mapped[str] = mapped_column(
        String(36), nullable=False
    )
    name: Mapped[str] = mapped_column(String(255), nullable=False)

    # Relationships
    university: Mapped["University"] = relationship(back_populates="faculties")
    programs: Mapped[list["Program"]] = relationship(
        back_populates="faculty", cascade="all, delete-orphan"
    )


# Avoid circular import by importing here
from app.models.program import Program  # noqa: E402, F401
from app.models.scholarship import Scholarship  # noqa: E402, F401

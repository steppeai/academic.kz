"""Deadline ORM model."""
import uuid
from datetime import date
from sqlalchemy import String, Date, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class Deadline(Base):
    __tablename__ = "deadlines"

    id: Mapped[str] = mapped_column(
        String(36), primary_key=True, default=lambda: str(uuid.uuid4())
    )
    program_id: Mapped[str | None] = mapped_column(
        String(36), ForeignKey("programs.id", ondelete="CASCADE")
    )
    scholarship_id: Mapped[str | None] = mapped_column(
        String(36), ForeignKey("scholarships.id", ondelete="CASCADE")
    )
    term: Mapped[str | None] = mapped_column(String(100))     # e.g. "Fall 2025"
    date: Mapped[date | None] = mapped_column(Date)
    type: Mapped[str | None] = mapped_column(String(100))     # application / document / result

    # Relationships
    program: Mapped["Program | None"] = relationship(back_populates="deadlines")
    scholarship: Mapped["Scholarship | None"] = relationship(back_populates="deadlines")


from app.models.program import Program  # noqa: E402, F401
from app.models.scholarship import Scholarship  # noqa: E402, F401

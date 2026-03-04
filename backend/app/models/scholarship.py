"""Scholarship ORM model."""
import uuid
from sqlalchemy import String, Text, Numeric, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class Scholarship(Base):
    __tablename__ = "scholarships"

    id: Mapped[str] = mapped_column(
        String(36), primary_key=True, default=lambda: str(uuid.uuid4())
    )
    university_id: Mapped[str | None] = mapped_column(
        String(36), ForeignKey("universities.id", ondelete="CASCADE")
    )
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    type: Mapped[str | None] = mapped_column(String(100))       # full/partial/grant
    amount: Mapped[float | None] = mapped_column(Numeric(15, 2))
    currency: Mapped[str | None] = mapped_column(String(10))
    eligibility: Mapped[str | None] = mapped_column(Text)
    is_bolashak: Mapped[bool] = mapped_column(default=False)

    # Relationships
    university: Mapped["University | None"] = relationship(back_populates="scholarships")
    deadlines: Mapped[list["Deadline"]] = relationship(
        back_populates="scholarship", cascade="all, delete-orphan"
    )


from app.models.university import University  # noqa: E402, F401
from app.models.deadline import Deadline  # noqa: E402, F401

"""Program ORM model — supports Bachelor, Master, PhD."""
import uuid
from sqlalchemy import String, Text, Numeric, ForeignKey, CheckConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class Program(Base):
    __tablename__ = "programs"
    __table_args__ = (
        CheckConstraint(
            "degree_level IN ('bachelor', 'master', 'phd')",
            name="ck_program_degree_level",
        ),
    )

    id: Mapped[str] = mapped_column(
        String(36), primary_key=True, default=lambda: str(uuid.uuid4())
    )
    university_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("universities.id", ondelete="CASCADE"), nullable=False
    )
    faculty_id: Mapped[str | None] = mapped_column(
        String(36), ForeignKey("faculties.id", ondelete="SET NULL")
    )
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    degree_level: Mapped[str] = mapped_column(String(50), nullable=False)
    language: Mapped[str | None] = mapped_column(String(100))
    city: Mapped[str | None] = mapped_column(String(100))
    duration: Mapped[str | None] = mapped_column(String(50))
    tuition_fee: Mapped[float | None] = mapped_column(Numeric(12, 2))
    description: Mapped[str | None] = mapped_column(Text)

    # Relationships
    university: Mapped["University"] = relationship(back_populates="programs")
    faculty: Mapped["Faculty | None"] = relationship(back_populates="programs")
    deadlines: Mapped[list["Deadline"]] = relationship(
        back_populates="program", cascade="all, delete-orphan"
    )
    requirement_set: Mapped["RequirementSet | None"] = relationship(
        back_populates="program", cascade="all, delete-orphan"
    )


from app.models.university import University, Faculty  # noqa: E402, F401
from app.models.deadline import Deadline  # noqa: E402, F401
from app.models.requirement import RequirementSet  # noqa: E402, F401

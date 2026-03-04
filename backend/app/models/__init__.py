"""Import all models so Alembic and SQLAlchemy can discover them."""
from app.models.university import University, Faculty
from app.models.program import Program
from app.models.scholarship import Scholarship
from app.models.deadline import Deadline
from app.models.requirement import RequirementSet, TestRequirement, DocumentRequirement
from app.models.user import User
from app.models.checklist import ChecklistItem
from app.models.bolashak import BolashakCriteria, BolashakStep, BolashakDocument

__all__ = [
    "University", "Faculty",
    "Program",
    "Scholarship",
    "Deadline",
    "RequirementSet", "TestRequirement", "DocumentRequirement",
    "User",
    "ChecklistItem",
    "BolashakCriteria", "BolashakStep", "BolashakDocument",
]

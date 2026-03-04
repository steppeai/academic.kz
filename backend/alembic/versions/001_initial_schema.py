"""
Initial Alembic migration — creates all Academic.kz tables.
Generated from SQLAlchemy ORM models.
"""
from alembic import op
import sqlalchemy as sa

revision = "001"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    # universities
    op.create_table("universities",
        sa.Column("id", sa.String(36), primary_key=True),
        sa.Column("name", sa.String(255), nullable=False),
        sa.Column("country", sa.String(100)),
        sa.Column("city", sa.String(100)),
        sa.Column("website_url", sa.Text()),
        sa.Column("logo_url", sa.Text()),
    )
    # faculties
    op.create_table("faculties",
        sa.Column("id", sa.String(36), primary_key=True),
        sa.Column("university_id", sa.String(36), sa.ForeignKey("universities.id", ondelete="CASCADE"), nullable=False),
        sa.Column("name", sa.String(255), nullable=False),
    )
    # programs
    op.create_table("programs",
        sa.Column("id", sa.String(36), primary_key=True),
        sa.Column("university_id", sa.String(36), sa.ForeignKey("universities.id", ondelete="CASCADE"), nullable=False),
        sa.Column("faculty_id", sa.String(36), sa.ForeignKey("faculties.id", ondelete="SET NULL")),
        sa.Column("name", sa.String(255), nullable=False),
        sa.Column("degree_level", sa.String(50), nullable=False),
        sa.Column("language", sa.String(100)),
        sa.Column("city", sa.String(100)),
        sa.Column("duration", sa.String(50)),
        sa.Column("tuition_fee", sa.Numeric(12, 2)),
        sa.Column("description", sa.Text()),
        sa.CheckConstraint("degree_level IN ('bachelor', 'master', 'phd')", name="ck_program_degree_level"),
    )
    # scholarships
    op.create_table("scholarships",
        sa.Column("id", sa.String(36), primary_key=True),
        sa.Column("university_id", sa.String(36), sa.ForeignKey("universities.id", ondelete="CASCADE")),
        sa.Column("name", sa.String(255), nullable=False),
        sa.Column("type", sa.String(100)),
        sa.Column("amount", sa.Numeric(15, 2)),
        sa.Column("currency", sa.String(10)),
        sa.Column("eligibility", sa.Text()),
        sa.Column("is_bolashak", sa.Boolean(), server_default="false"),
    )
    # deadlines
    op.create_table("deadlines",
        sa.Column("id", sa.String(36), primary_key=True),
        sa.Column("program_id", sa.String(36), sa.ForeignKey("programs.id", ondelete="CASCADE")),
        sa.Column("scholarship_id", sa.String(36), sa.ForeignKey("scholarships.id", ondelete="CASCADE")),
        sa.Column("term", sa.String(100)),
        sa.Column("date", sa.Date()),
        sa.Column("type", sa.String(100)),
    )
    # requirement_sets
    op.create_table("requirement_sets",
        sa.Column("id", sa.String(36), primary_key=True),
        sa.Column("program_id", sa.String(36), sa.ForeignKey("programs.id", ondelete="CASCADE"), unique=True, nullable=False),
        sa.Column("min_gpa", sa.Numeric(4, 2)),
        sa.Column("notes", sa.Text()),
    )
    op.create_table("test_requirements",
        sa.Column("id", sa.String(36), primary_key=True),
        sa.Column("requirement_set_id", sa.String(36), sa.ForeignKey("requirement_sets.id", ondelete="CASCADE"), nullable=False),
        sa.Column("test_type", sa.String(100)),
        sa.Column("min_score", sa.Numeric(6, 2)),
    )
    op.create_table("document_requirements",
        sa.Column("id", sa.String(36), primary_key=True),
        sa.Column("requirement_set_id", sa.String(36), sa.ForeignKey("requirement_sets.id", ondelete="CASCADE"), nullable=False),
        sa.Column("document_type", sa.String(100)),
        sa.Column("required", sa.Boolean(), server_default="true"),
        sa.Column("notes", sa.Text()),
    )
    # users
    op.create_table("users",
        sa.Column("id", sa.String(36), primary_key=True),
        sa.Column("email", sa.String(255), nullable=False, unique=True),
        sa.Column("hashed_password", sa.String(255), nullable=False),
        sa.Column("full_name", sa.String(255)),
        sa.Column("is_active", sa.Boolean(), server_default="true"),
        sa.Column("is_verified", sa.Boolean(), server_default="false"),
        sa.Column("degree_target", sa.String(50)),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
    )
    op.create_index("ix_users_email", "users", ["email"])
    # checklist_items
    op.create_table("checklist_items",
        sa.Column("id", sa.String(36), primary_key=True),
        sa.Column("user_id", sa.String(36), sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False),
        sa.Column("program_id", sa.String(36), sa.ForeignKey("programs.id", ondelete="SET NULL")),
        sa.Column("title", sa.String(255), nullable=False),
        sa.Column("description", sa.Text()),
        sa.Column("status", sa.String(20), server_default="todo"),
        sa.Column("due_date", sa.DateTime(timezone=True)),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.CheckConstraint("status IN ('todo', 'in_progress', 'done')", name="ck_checklist_status"),
    )
    op.create_index("ix_checklist_items_user_id", "checklist_items", ["user_id"])
    # bolashak tables
    op.create_table("bolashak_criteria",
        sa.Column("id", sa.String(36), primary_key=True),
        sa.Column("category", sa.String(100), nullable=False),
        sa.Column("title", sa.String(255), nullable=False),
        sa.Column("description", sa.Text()),
        sa.Column("is_mandatory", sa.Boolean(), server_default="true"),
        sa.Column("sort_order", sa.Integer(), server_default="0"),
    )
    op.create_table("bolashak_steps",
        sa.Column("id", sa.String(36), primary_key=True),
        sa.Column("step_number", sa.Integer(), nullable=False),
        sa.Column("title", sa.String(255), nullable=False),
        sa.Column("description", sa.Text()),
        sa.Column("documents_required", sa.Text()),
    )
    op.create_table("bolashak_documents",
        sa.Column("id", sa.String(36), primary_key=True),
        sa.Column("name", sa.String(255), nullable=False),
        sa.Column("description", sa.Text()),
        sa.Column("is_required", sa.Boolean(), server_default="true"),
        sa.Column("notes", sa.Text()),
    )


def downgrade() -> None:
    op.drop_table("bolashak_documents")
    op.drop_table("bolashak_steps")
    op.drop_table("bolashak_criteria")
    op.drop_index("ix_checklist_items_user_id", "checklist_items")
    op.drop_table("checklist_items")
    op.drop_index("ix_users_email", "users")
    op.drop_table("users")
    op.drop_table("document_requirements")
    op.drop_table("test_requirements")
    op.drop_table("requirement_sets")
    op.drop_table("deadlines")
    op.drop_table("scholarships")
    op.drop_table("programs")
    op.drop_table("faculties")
    op.drop_table("universities")

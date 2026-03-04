"""CRUD operations for programs and universities."""
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, or_
from sqlalchemy.orm import selectinload

from app.models.program import Program
from app.models.university import University
from app.schemas.program import ProgramCreate, ProgramFilter


# ── Programs ────────────────────────────────────────────────────
async def get_programs(
    db: AsyncSession, filters: ProgramFilter
) -> tuple[list[Program], int]:
    """Return paginated + filtered programs and total count."""
    query = select(Program).options(selectinload(Program.university))

    if filters.city:
        query = query.filter(Program.city.ilike(f"%{filters.city}%"))
    if filters.degree_level:
        query = query.filter(Program.degree_level == filters.degree_level.lower())
    if filters.language:
        query = query.filter(Program.language.ilike(f"%{filters.language}%"))
    if filters.max_tuition_fee is not None:
        query = query.filter(
            or_(Program.tuition_fee <= filters.max_tuition_fee, Program.tuition_fee.is_(None))
        )
    if filters.university_id:
        query = query.filter(Program.university_id == filters.university_id)
    if filters.search:
        query = query.filter(Program.name.ilike(f"%{filters.search}%"))

    # Count
    count_q = select(func.count()).select_from(query.subquery())
    total = (await db.execute(count_q)).scalar_one()

    # Paginate
    offset = (filters.page - 1) * filters.page_size
    query = query.offset(offset).limit(filters.page_size)
    result = await db.execute(query)
    return result.scalars().all(), total


async def get_program_by_id(db: AsyncSession, program_id: str) -> Program | None:
    result = await db.execute(
        select(Program)
        .options(
            selectinload(Program.university),
            selectinload(Program.faculty),
            selectinload(Program.deadlines),
            selectinload(Program.requirement_set),
        )
        .filter(Program.id == program_id)
    )
    return result.scalar_one_or_none()


async def create_program(db: AsyncSession, data: ProgramCreate) -> Program:
    program = Program(**data.model_dump())
    db.add(program)
    await db.flush()
    return program


# ── Universities ────────────────────────────────────────────────
async def get_universities(db: AsyncSession) -> list[University]:
    result = await db.execute(select(University).order_by(University.name))
    return result.scalars().all()


async def get_university_by_id(db: AsyncSession, uni_id: str) -> University | None:
    result = await db.execute(
        select(University)
        .options(selectinload(University.faculties))
        .filter(University.id == uni_id)
    )
    return result.scalar_one_or_none()

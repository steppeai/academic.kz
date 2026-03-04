"""CRUD for personal application checklists."""
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.models.checklist import ChecklistItem
from app.schemas.checklist import ChecklistItemCreate, ChecklistItemUpdate


async def get_user_checklist(db: AsyncSession, user_id: str) -> list[ChecklistItem]:
    result = await db.execute(
        select(ChecklistItem)
        .filter(ChecklistItem.user_id == user_id)
        .order_by(ChecklistItem.created_at)
    )
    return result.scalars().all()


async def create_checklist_item(
    db: AsyncSession, user_id: str, data: ChecklistItemCreate
) -> ChecklistItem:
    item = ChecklistItem(user_id=user_id, **data.model_dump())
    db.add(item)
    await db.flush()
    return item


async def update_checklist_item(
    db: AsyncSession, item_id: str, user_id: str, data: ChecklistItemUpdate
) -> ChecklistItem | None:
    result = await db.execute(
        select(ChecklistItem).filter(
            ChecklistItem.id == item_id, ChecklistItem.user_id == user_id
        )
    )
    item = result.scalar_one_or_none()
    if not item:
        return None
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(item, field, value)
    await db.flush()
    return item


async def delete_checklist_item(
    db: AsyncSession, item_id: str, user_id: str
) -> bool:
    result = await db.execute(
        select(ChecklistItem).filter(
            ChecklistItem.id == item_id, ChecklistItem.user_id == user_id
        )
    )
    item = result.scalar_one_or_none()
    if not item:
        return False
    await db.delete(item)
    return True

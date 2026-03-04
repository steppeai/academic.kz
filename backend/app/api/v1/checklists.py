"""Personal application checklist endpoints (requires authentication)."""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.auth.dependencies import get_current_user
from app.models.user import User
from app.crud.checklists import (
    get_user_checklist,
    create_checklist_item,
    update_checklist_item,
    delete_checklist_item,
)
from app.schemas.checklist import ChecklistItemCreate, ChecklistItemUpdate, ChecklistItemRead

router = APIRouter(prefix="/checklists")


@router.get("", response_model=list[ChecklistItemRead], summary="Get my checklist")
async def my_checklist(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Return the personal application checklist for the authenticated user."""
    return await get_user_checklist(db, current_user.id)


@router.post("", response_model=ChecklistItemRead, status_code=201, summary="Add checklist item")
async def add_item(
    data: ChecklistItemCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    return await create_checklist_item(db, current_user.id, data)


@router.patch("/{item_id}", response_model=ChecklistItemRead, summary="Update checklist item")
async def update_item(
    item_id: str,
    data: ChecklistItemUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    item = await update_checklist_item(db, item_id, current_user.id, data)
    if not item:
        raise HTTPException(status_code=404, detail="Checklist item not found")
    return item


@router.delete("/{item_id}", status_code=204, summary="Delete checklist item")
async def delete_item(
    item_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    success = await delete_checklist_item(db, item_id, current_user.id)
    if not success:
        raise HTTPException(status_code=404, detail="Checklist item not found")

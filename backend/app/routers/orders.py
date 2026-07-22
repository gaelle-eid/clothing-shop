from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from .. import models, schemas
from ..database import get_db
from ..auth import get_current_user

from ..checkout_service import (
    perform_checkout,
    EmptyCartError,
    InsufficientStockError,
    InsufficientBalanceError,
)

router = APIRouter(prefix="/orders", tags=["orders"])




@router.post("/checkout", response_model=schemas.OrderOut)
def checkout(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    try:
        return perform_checkout(db, current_user)
    except (EmptyCartError, InsufficientStockError, InsufficientBalanceError) as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/", response_model=List[schemas.OrderOut])
def list_orders(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    return (
        db.query(models.Order)
        .filter(models.Order.user_id == current_user.id)
        .order_by(models.Order.created_at.desc())
        .all()
    )


@router.get("/{order_id}", response_model=schemas.OrderOut)
def get_order(
    order_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    order = (
        db.query(models.Order)
        .filter(models.Order.id == order_id, models.Order.user_id == current_user.id)
        .first()
    )
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order
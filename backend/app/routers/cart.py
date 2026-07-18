from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from .. import models, schemas
from ..database import get_db
from ..auth import get_current_user

router = APIRouter(prefix="/cart", tags=["cart"])


@router.get("/", response_model=List[schemas.CartItemOut])
def get_cart(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    return db.query(models.CartItem).filter(models.CartItem.user_id == current_user.id).all()


@router.post("/", response_model=schemas.CartItemOut)
def add_to_cart(
    item_in: schemas.CartItemCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    product = db.query(models.Product).filter(models.Product.id == item_in.product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    existing = (
        db.query(models.CartItem)
        .filter(
            models.CartItem.user_id == current_user.id,
            models.CartItem.product_id == item_in.product_id,
        )
        .first()
    )

    if existing:
        existing.quantity += item_in.quantity
        db.commit()
        db.refresh(existing)
        return existing

    cart_item = models.CartItem(
        user_id=current_user.id,
        product_id=item_in.product_id,
        quantity=item_in.quantity,
    )
    db.add(cart_item)
    db.commit()
    db.refresh(cart_item)
    return cart_item


@router.put("/{item_id}", response_model=schemas.CartItemOut)
def update_cart_item(
    item_id: int,
    item_in: schemas.CartItemUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    cart_item = (
        db.query(models.CartItem)
        .filter(models.CartItem.id == item_id, models.CartItem.user_id == current_user.id)
        .first()
    )
    if not cart_item:
        raise HTTPException(status_code=404, detail="Cart item not found")

    cart_item.quantity = item_in.quantity
    db.commit()
    db.refresh(cart_item)
    return cart_item


@router.delete("/{item_id}")
def remove_from_cart(
    item_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    cart_item = (
        db.query(models.CartItem)
        .filter(models.CartItem.id == item_id, models.CartItem.user_id == current_user.id)
        .first()
    )
    if not cart_item:
        raise HTTPException(status_code=404, detail="Cart item not found")

    db.delete(cart_item)
    db.commit()
    return {"detail": "Item removed from cart"}
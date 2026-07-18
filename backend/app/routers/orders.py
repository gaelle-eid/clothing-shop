from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from .. import models, schemas
from ..database import get_db
from ..auth import get_current_user

router = APIRouter(prefix="/orders", tags=["orders"])


@router.post("/checkout", response_model=schemas.OrderOut)
def checkout(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    # 1. Get everything currently in this user's cart
    cart_items = db.query(models.CartItem).filter(
        models.CartItem.user_id == current_user.id
    ).all()

    if not cart_items:
        raise HTTPException(status_code=400, detail="Your cart is empty")

    # 2. Check stock BEFORE creating anything - fail the whole checkout
    # if even one item doesn't have enough stock, rather than partially
    # completing an order that can't actually be fulfilled
    for item in cart_items:
        if item.product.stock < item.quantity:
            raise HTTPException(
                status_code=400,
                detail=f"Not enough stock for {item.product.name} "
                       f"(only {item.product.stock} left)",
            )

    # 3. Calculate the total using the REAL, current price of each product
    total = sum(item.product.price * item.quantity for item in cart_items)

    # 4. Create the Order itself
    order = models.Order(user_id=current_user.id, total=total, status="pending")
    db.add(order)
    db.flush()  # writes the order to the DB session so it gets a real id,
                # WITHOUT fully committing yet - we need order.id below

    # 5. For each cart item: create a snapshot OrderItem, and decrement stock
    for item in cart_items:
        order_item = models.OrderItem(
            order_id=order.id,
            product_id=item.product.id,
            product_name=item.product.name,  # snapshot - won't change even if
            price=item.product.price,        # the real product does later
            quantity=item.quantity,
        )
        db.add(order_item)
        item.product.stock -= item.quantity  # actually reduce real stock

    # 6. Clear the cart - it's been "converted" into an order now
    for item in cart_items:
        db.delete(item)

    db.commit()
    db.refresh(order)
    return order


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
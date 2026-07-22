from sqlalchemy.orm import Session
from . import models


class EmptyCartError(Exception):
    pass


class InsufficientStockError(Exception):
    pass


class InsufficientBalanceError(Exception):
    pass


def perform_checkout(db: Session, user: models.User) -> models.Order:
    """The real purchase logic - shared by the normal 'Proceed to Checkout'
    button AND the AI agent's checkout tool, so both go through the exact
    same rules rather than two separate implementations that could drift."""
    cart_items = db.query(models.CartItem).filter(models.CartItem.user_id == user.id).all()

    if not cart_items:
        raise EmptyCartError("Your cart is empty.")

    for item in cart_items:
        if item.product.stock < item.quantity:
            raise InsufficientStockError(
                f"Not enough stock for {item.product.name} (only {item.product.stock} left)."
            )

    total = sum(item.product.price * item.quantity for item in cart_items)

    if user.balance < total:
        raise InsufficientBalanceError(
            f"Insufficient balance: you have €{user.balance:.2f}, this order costs €{total:.2f}."
        )

    order = models.Order(user_id=user.id, total=total, status="paid")
    db.add(order)
    db.flush()

    for item in cart_items:
        order_item = models.OrderItem(
            order_id=order.id,
            product_id=item.product.id,
            product_name=item.product.name,
            price=item.product.price,
            quantity=item.quantity,
        )
        db.add(order_item)
        item.product.stock -= item.quantity

    user.balance -= total  # the mock "payment"

    for item in cart_items:
        db.delete(item)

    db.commit()
    db.refresh(order)
    return order
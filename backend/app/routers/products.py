from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from .. import models, schemas
from ..database import get_db
from typing import Optional

router = APIRouter(prefix="/products", tags=["products"])



@router.get("/", response_model=List[schemas.ProductOut])
def list_products(
    search: Optional[str] = None,
    category: Optional[str] = None,
    db: Session = Depends(get_db),
):
    query = db.query(models.Product)

    if search:
        query = query.filter(models.Product.name.ilike(f"%{search}%"))

    if category:
        query = query.filter(models.Product.category == category)

    return query.all()

    return db.query(models.Product).all()


@router.get("/{product_id}", response_model=schemas.ProductOut)
def get_product(product_id: int, db: Session = Depends(get_db)):
    product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product


@router.post("/", response_model=schemas.ProductOut)
def create_product(product_in: schemas.ProductCreate, db: Session = Depends(get_db)):
    product = models.Product(**product_in.model_dump())
    db.add(product)
    db.commit()
    db.refresh(product)
    return product
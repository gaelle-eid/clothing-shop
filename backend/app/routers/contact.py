from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from .. import models, schemas
from ..database import get_db

router = APIRouter(prefix="/contact", tags=["contact"])


@router.post("/", response_model=schemas.ContactMessageOut)
def create_contact_message(message_in: schemas.ContactMessageCreate, db: Session = Depends(get_db)):
    message = models.ContactMessage(**message_in.model_dump())
    db.add(message)
    db.commit()
    db.refresh(message)
    return message


@router.get("/", response_model=List[schemas.ContactMessageOut])
def list_contact_messages(db: Session = Depends(get_db)):
    return db.query(models.ContactMessage).order_by(models.ContactMessage.created_at.desc()).all()
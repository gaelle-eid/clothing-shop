#this file receives the incoming registration request (name, email, password)
#Validates it automatically against UserCreate
#Checks the database to prevent duplicate emails
#Hashes the password before storing anything
#Saves the new user to Postgres
#Responds with safe user info (no password) back to whoever made the request
#So this file is the bridge between the outside world and everything we've built so far. Without it, all our previous files are just... definitions sitting there, unreachable.


from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from .. import models, schemas
from ..database import get_db
from ..auth import hash_password

router = APIRouter(prefix="/auth", tags=["auth"]) #Creates a router object. prefix="/auth" means every route we define below automatically gets /auth stuck in front of its URL (so /register becomes /auth/register)


@router.post("/register", response_model=schemas.UserOut)
def register(user_in: schemas.UserCreate, db: Session = Depends(get_db)):
    existing = db.query(models.User).filter(models.User.email == user_in.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    user = models.User(
        name=user_in.name,
        email=user_in.email,
        password_hash=hash_password(user_in.password),
    )
    db.add(user) # stages this new user to be saved
    db.commit()#actually writes it to Postgres permanently
    db.refresh(user)#reloads the object from the database, so user now includes the auto-generated id that Postgres assigned
    return user#Returns the user object. FastAPI automatically converts it into UserOut shape (because of response_model=schemas.UserOut), silently dropping password_hash from the response.
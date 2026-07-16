from pydantic import BaseModel, EmailStr
from datetime import datetime

#for register
class UserCreate(BaseModel): # This schema is used for creating a new user
    name: str # The user's name of type string
    email: EmailStr # The user's email of type EmailStr
    password: str # The user's password of type string


class UserOut(BaseModel): # This schema is used for returning user data in responses
    id: int
    name: str
    email: EmailStr

    class Config:
        from_attributes = True
        # by default Pydantic models do not read data from ORM models, but with this config, it will allow Pydantic to read data from SQLAlchemy models.
        #q   by default it reads from dictionaries like json

#for login
class UserLogin(BaseModel):
    email: str
    password: str


#for the product page
class ProductCreate(BaseModel):
    name: str
    description: str | None = None
    price: float
    original_price: float | None = None
    size: str | None = None
    color: str | None = None
    category: str | None = None
    stock: int = 0
    image_url: str | None = None
    on_sale: bool = False


class ProductOut(BaseModel):
    id: int
    name: str
    description: str | None
    price: float
    original_price: float | None
    size: str | None
    color: str | None
    category: str | None
    stock: int
    image_url: str | None
    on_sale: bool
    created_at: datetime


    class Config:
        from_attributes = True

#for the journal page
class PostCreate(BaseModel):
    title: str
    excerpt: str
    content: str
    image_url: str | None = None
    date: str | None = None


class PostOut(BaseModel):
    id: int
    title: str
    excerpt: str
    content: str
    image_url: str | None
    date: str | None

    class Config:
        from_attributes = True
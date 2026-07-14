from pydantic import BaseModel, EmailStr


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
from sqlalchemy import Column, Integer, String
from .database import Base


class User(Base): # what marks it as "this should become a real table"
    __tablename__ = "users" #the actual table name that will appear in Postgres

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
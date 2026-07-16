from sqlalchemy import Column, Integer, String, Float, Boolean
from .database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)


#for the product page
class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(String, nullable=True)
    price = Column(Float, nullable=False)
    original_price = Column(Float, nullable=True)
    size = Column(String, nullable=True)
    color = Column(String, nullable=True)
    category = Column(String, nullable=True)
    stock = Column(Integer, default=0)
    image_url = Column(String, nullable=True)
    on_sale = Column(Boolean, default=False)
   
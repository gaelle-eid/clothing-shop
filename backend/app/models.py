
import datetime
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, func
from .database import Base
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, func, ForeignKey
from sqlalchemy.orm import relationship


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
    created_at = Column(DateTime, default=datetime.datetime.now(datetime.timezone.utc))  # ← CHANGE THIS LINE
   


class Post(Base):
    __tablename__ = "posts"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    excerpt = Column(String, nullable=False)
    content = Column(String, nullable=False)
    image_url = Column(String, nullable=True)
    date = Column(String, nullable=True)

class ContactMessage(Base):
    __tablename__ = "contact_messages"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, nullable=False)
    message = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())  # ← This is fine as is


#fpr cart task
class CartItem(Base):
    __tablename__ = "cart_items"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    quantity = Column(Integer, nullable=False, default=1)

    user = relationship("User")
    product = relationship("Product")
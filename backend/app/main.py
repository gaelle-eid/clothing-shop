from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from . import models
from .database import engine
from .routers import auth, products, posts
from .routers import auth, products, posts, contact
# This reads every model defined in models.py (since they inherit from Base)
# and creates the actual tables in Postgres if they don't already exist.
models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(products.router)
app.include_router(posts.router)
app.include_router(contact.router)

@app.get("/")
def root():
    return {"message": "Clothing Shop API is running"}
from fastapi import FastAPI
from . import models
from .database import engine

# This reads every model defined in models.py (since they inherit from Base)
# and creates the actual tables in Postgres if they don't already exist.
models.Base.metadata.create_all(bind=engine)

app = FastAPI()


@app.get("/")
def root():
    return {"message": "Clothing Shop API is running"}
#this file is used to configure the database connection for the backend application. It uses SQLAlchemy to manage the connection and sessions with a PostgreSQL database. The database URL is read from an environment variable defined in a .env file, allowing for easy configuration without hardcoding sensitive information.
#It's the file that sets up the actual connection between your Python code and your Postgres database. Think of it as the "wiring" — it doesn't create tables or store data itself, it just establishes how to talk to the database, so other files can use it.

import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

load_dotenv() #read the .env file and makes database url available to python

DATABASE_URL = os.getenv("DATABASE_URL")

engine = create_engine(DATABASE_URL) #creates the actual connection object that knows how to talk to your postgres database
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base() #this lets SQLAlchemy  know that this python class represents a database table 


def get_db(): #this is a helper fct that the api will use to open a database session  fr each request and automatically close it when done
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
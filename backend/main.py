from fastapi import FastAPI, Depends, HTTPException, status, Form
from typing import Annotated
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import models_db
from database_connect import engine, SessionLocal
from sqlalchemy.orm import Session
from routers.auth import router as auth_router
from routers.lectures import router as lectures_router
from routers.posters import router as posters_router

app = FastAPI()

models_db.Base.metadata.create_all(bind=engine)

app.include_router(auth_router)
app.include_router(lectures_router)
app.include_router(posters_router)

origins = [
    "http://localhost:5173"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    except Exception:
        db.rollback()
    finally:
        db.close()


@app.get("/")
def root():
    return "super licznik"


@app.get("/get_votes")
def get_data(db: Session = Depends(get_db)):
    return db.query(models_db.Votes).all()


if __name__ == "__main__":
    uvicorn.run("main:app", host="localhost", port=5555, reload=True, log_level="debug")

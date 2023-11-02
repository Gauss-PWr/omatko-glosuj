from fastapi import FastAPI, Depends
import uvicorn
import models_db
from database_connect import engine, SessionLocal
from sqlalchemy.orm import Session

app = FastAPI()

models_db.Base.metadata.create_all(bind=engine)



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

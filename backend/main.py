from fastapi import FastAPI, Depends, HTTPException, status, Form
from typing import Annotated
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import models_db
from database_connect import engine, SessionLocal
from sqlalchemy.orm import Session
import schemas
from datetime import datetime, timedelta
from jose import JWTError, jwt

app = FastAPI()

models_db.Base.metadata.create_all(bind=engine)

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


# =======================================================  USER AUTHENTICATION

ALGORITHM = "HS256"
SECRET_KEY = "8abf2afcd7190402b53b8a9d1597391e"
ACCESS_TOKEN_EXPIRE_MINUTES = 30
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


def get_user(db: Session, username: str):
    user = db.query(models_db.Users).filter(models_db.Users.user_login == username).first()
    if user:
        return schemas.UserInDB(**{"username" : user.user_login, 
                                   "email"    : user.user_mail, 
                                   "password" : user.user_password})


def authenticate_user(db: Session, username: str, password: str):
    user = get_user(db, username)
    if user and user.password == password:
        return user
    return False


def create_access_token(data: dict, expires_delta: timedelta or None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credential_exception = HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, 
                                         detail="Could not validate credentials", 
                                         headers={"WWW-Authenticate": "Bearer"})
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credential_exception
        token_data = schemas.TokenData(username=username)
    except JWTError:
        raise credential_exception
    user = get_user(db, username=token_data.username)
    if user is None:
        raise credential_exception
    return user


@app.post("/token", response_model=schemas.Token)
async def login_for_acces_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)): 
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, 
                            detail="Incorrect username of password", 
                            headers={"WWW-Authenticate": "Bearer"})

    acces_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    acces_token = create_access_token(data={"sub": user.username}, expires_delta=acces_token_expires)
    return {"access_token": acces_token, "token_type": "bearer"}


@app.get("/users/me/", response_model=schemas.User)
async def read_users_me(current_user: schemas.User = Depends(get_current_user)):
    return current_user


if __name__ == "__main__":
    uvicorn.run("main:app", host="localhost", port=5555, reload=True, log_level="debug")

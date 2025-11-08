from fastapi import APIRouter, Depends, HTTPException, Response, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
import models as models_db
from database_connect import SessionLocal
from sqlalchemy.orm import Session
import schemas
from typing import cast
from datetime import datetime, timedelta, timezone
from jose import JWTError, jwt
from passlib.context import CryptContext

router = APIRouter(prefix="/auth", tags=["auth"])
SECRET_KEY = "8abf2afcd7190402b53b8a9d1597391e"
ALGORITHM = "HS256"
bcrypt_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/token")
ACCESS_TOKEN_EXPIRE_HOURS = 10


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


pwd_context = CryptContext(
    schemes=["argon2"],
    deprecated="auto",
    argon2__rounds=4,
)


def get_user(db: Session, username: str):
    """
    Maps database fields from models_db.Users to schema fields in UserInDB:
    - user_id: models_db.Users.user_id (int)
    - username: models_db.Users.user_login (str)
    - password: models_db.Users.user_password (str)
    """
    user = (
        db.query(models_db.Users).filter(models_db.Users.user_login == username).first()
    )
    if user:
        return schemas.UserInDB(
            user_id=cast(int, user.user_id), username=cast(str, user.user_login)
        )
    return None


def authenticate_user(db: Session, username: str):
    user = get_user(db, username)
    if user is None:
        return False
    return user


def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


async def get_current_user(
    token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)
):
    credential_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str | None = payload.get("sub")
        if not isinstance(username, str):
            raise credential_exception
        token_data = schemas.User(username=username)
    except JWTError:
        raise credential_exception
    user = get_user(db, username=token_data.username)
    if user is None:
        raise credential_exception
    return user


@router.post("/login", response_model=schemas.Token)
async def login(
    response: Response,
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db),
):
    user = authenticate_user(db, form_data.username)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    expires = timedelta(hours=ACCESS_TOKEN_EXPIRE_HOURS)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=expires
    )
    response.set_cookie(
        key="access_token",
        value=f"Bearer {access_token}",
        httponly=True,
        secure=True,
        max_age=ACCESS_TOKEN_EXPIRE_HOURS * 60,
        expires=ACCESS_TOKEN_EXPIRE_HOURS * 60,
        samesite="lax",
    )
    return {"authenticated": True}


@router.post("/logout", response_model=schemas.Token)
async def logout(response: Response):
    response.delete_cookie(key="access_token")
    return {"authenticated": False}


@router.get("/user", response_model=schemas.User)
async def read_users_me(current_user: schemas.User = Depends(get_current_user)):
    return current_user

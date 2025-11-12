from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    Request,
    Response,
    status as fastapi_status,
    WebSocket,
    WebSocketDisconnect,
)
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
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/token", auto_error=False)
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
            user_id=cast(int, user.user_id),
            username=cast(str, user.user_login),
            is_admin=cast(bool, user.is_admin),
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
    request: Request,
    token: str | None = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
):
    credential_exception = HTTPException(
        status_code=fastapi_status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    raw_token = token
    if raw_token is None:
        cookie_token = request.cookies.get("access_token")
        if cookie_token:
            raw_token = cookie_token

    if not raw_token:
        raise credential_exception

    token_value = raw_token.removeprefix("Bearer ").strip()
    if not token_value:
        raise credential_exception

    try:
        payload = verify_access_token(token_value)
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


def verify_access_token(token: str) -> dict:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        raise


@router.post("/login", response_model=schemas.AuthResponse)
async def login(
    response: Response,
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db),
):
    user = authenticate_user(db, form_data.username)
    if not user:
        raise HTTPException(
            status_code=fastapi_status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )


    db_user = db.query(models_db.Users).filter(models_db.Users.user_login == user.username).first()
    if db_user:
        db_user.is_active = True
        db.commit()
        
    expires = timedelta(hours=ACCESS_TOKEN_EXPIRE_HOURS)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=expires
    )
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        secure=False,
        max_age=ACCESS_TOKEN_EXPIRE_HOURS * 60 * 60,
        expires=ACCESS_TOKEN_EXPIRE_HOURS * 60 * 60,
        samesite="lax",
    )
    return {"authenticated": True, "is_admin": user.is_admin}


@router.post("/logout", response_model=schemas.AuthResponse)
async def logout(response: Response):
    response.delete_cookie(key="access_token")
    return {"authenticated": False}


@router.get("/status", response_model=schemas.AuthResponse)
async def status(
    current_user: schemas.UserInDB = Depends(get_current_user),
):
    return {"authenticated": True, "is_admin": current_user.is_admin}

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
import models_db
from database_connect import SessionLocal
from sqlalchemy.orm import Session
import schemas
from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext
import uvicorn

router = APIRouter(prefix='/auth', tags=['auth'])
SECRET_KEY = '8abf2afcd7190402b53b8a9d1597391e'
ALGORITHM = 'HS256'
bcrypt_context = CryptContext(schemes=['bcrypt'], deprecated='auto')
oauth2_scheme = OAuth2PasswordBearer(tokenUrl='auth/token')
ACCESS_TOKEN_EXPIRE_MINUTES = 30


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def get_user(db: Session, username: str):
    user = db.query(models_db.Users).filter(models_db.Users.user_login == username).first()
    if user:
        return schemas.UserInDB(user_id=user.user_id, username=user.user_login,
                                password=user.user_password)


def authenticate_user(db: Session, username: str, password: str):
    user = get_user(db, username)
    if user and pwd_context.verify(password, user.password):
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


@router.post("/token", response_model=schemas.Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            detail="Incorrect username or password",
                            headers={"WWW-Authenticate": "Bearer"})
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(data={"sub": user.username}, expires_delta=access_token_expires)
    return {"access_token": access_token, "token_type": "bearer"}


@router.get("/users/me/", response_model=schemas.User)
async def read_users_me(current_user: schemas.User = Depends(get_current_user)):
    return current_user


@router.put("/change-email")
async def change_email(new_email: str, user=Depends(get_current_user), db: Session = Depends(get_db)):
    db_user = db.query(models_db.Users).filter(models_db.Users.user_login == user.username).first()
    if db_user:
        db_user.user_mail = new_email
        db.commit()
        db.refresh(db_user)
        return {"message": "Email updated successfully"}
    else:
        raise HTTPException(status_code=404, detail="User not found")


@router.put("/change-password")
async def change_password(password_change_request: schemas.PasswordChangeRequest, user=Depends(get_current_user),
                          db: Session = Depends(get_db)):
    if password_change_request.new_password != password_change_request.new_password_confirm:
        raise HTTPException(status_code=400, detail="Passwords do not match")
    db_user = db.query(models_db.Users).filter(models_db.Users.user_id == user.user_id).first()
    if db_user:
        hashed_password = bcrypt_context.hash(password_change_request.new_password)
        db_user.user_password = hashed_password
        db.commit()
        db.refresh(db_user)
        return {"message": "Password changed successfully"}
    else:
        raise HTTPException(status_code=404, detail="User not found")


@router.post("/reset-password")
async def reset_password(email: str, db: Session = Depends(get_db)):
    user = db.query(models_db.Users).filter(models_db.Users.user_mail == email).first()
    if user:
        # Logika wysyłania emaila z linkiem resetującym
        return {"message": "Password reset link sent"}
    else:
        raise HTTPException(status_code=404, detail="User not found")

from pydantic import BaseModel

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: str or None = None

class User(BaseModel):
    username: str
    email: str or None = None

class UserInDB(User):
    password: str

class LoginForm(BaseModel):
    username: str or None = None
    password: str or None = None
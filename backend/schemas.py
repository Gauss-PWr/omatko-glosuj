from pydantic import BaseModel, Field
from typing import Optional


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    username: str or None = None


class User(BaseModel):
    username: str = Field(..., max_length=30)
    email: str or None = None


class UserInDB(User):
    user_id: Optional[int] = Field(None, gt=0)
    username: str = Field(..., max_length=30)
    password: str


class LoginForm(BaseModel):
    username: str = Field(..., max_length=30)
    password: str or None = None


class PasswordChangeRequest(BaseModel):
    new_password: str = Field(..., min_length=8)
    new_password_confirm: str = Field(..., min_length=8)


class LectureResponse(BaseModel):
    lecture_name: str = Field(..., max_length=200)
    speaker_name: str = Field(..., max_length=80)
    vote_merytoryka: Optional[int] = Field(None, ge=1, le=10)
    vote_forma: Optional[int] = Field(None, ge=1, le=10)

    class Config:
        orm_mode = True


class VoteRequest(BaseModel):
    merytoryka_points: Optional[int] = Field(None, ge=1, le=10)
    forma_points: Optional[int] = Field(None, ge=1, le=10)


class LectureAddRequest(BaseModel):
    lecture_code: str = Field(..., min_length=1, max_length=7)


class PosterResponse(BaseModel):
    poster_name: str
    poster_author: str
    vote_merytoryka: Optional[float] = None
    vote_estetyka: Optional[float] = None

class VotePosterRequest(BaseModel):
    merytoryka_points: Optional[int] = Field(None, ge=1, le=10)
    estetyka_points: Optional[int] = Field(None, ge=1, le=10)

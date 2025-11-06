from pydantic import BaseModel, Field
from typing import Optional


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    username: str | None = None


class User(BaseModel):
    username: str = Field(..., max_length=30)
    email: str | None = None


class UserInDB(User):
    user_id: Optional[int] = Field(None, gt=0)
    username: str = Field(..., max_length=30)
    password: str


class LoginForm(BaseModel):
    username: str = Field(..., max_length=30)
    password: str | None = None


class PasswordChangeRequest(BaseModel):
    new_password: str = Field(..., min_length=8)
    new_password_confirm: str = Field(..., min_length=8)


class LectureResponse(BaseModel):
    lecture_id: int
    lecture_category: str
    lecture_name: str = Field(..., max_length=200)
    speaker_name: str = Field(..., max_length=80)
    vote_merytoryka: Optional[int] = Field(None, ge=1, le=10)
    vote_forma: Optional[int] = Field(None, ge=1, le=10)

    class Config:
        from_atributes = True


class VoteRequest(BaseModel):
    merytoryka_points: Optional[int] = Field(None, ge=1, le=10)
    forma_points: Optional[int] = Field(None, ge=1, le=10)


class LectureAddRequest(BaseModel):
    lecture_code: str = Field(..., min_length=1, max_length=7)


class PosterResponse(BaseModel):
    poster_id: int
    poster_name: str
    poster_author: str
    vote_merytoryka: float | None = None
    vote_estetyka: float | None = None


class VotePosterRequest(BaseModel):
    merytoryka_points: Optional[int] = Field(None, ge=1, le=10)
    estetyka_points: Optional[int] = Field(None, ge=1, le=10)

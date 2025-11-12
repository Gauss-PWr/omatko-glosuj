from typing import Sequence
from pydantic import BaseModel, Field


class AuthResponse(BaseModel):
    authenticated: bool
    is_admin: bool | None = None


class User(BaseModel):
    username: str = Field(..., max_length=10)


class UserInDB(User):
    user_id: int = Field(..., gt=0)
    username: str = Field(..., max_length=10)
    is_admin: bool


class LoginForm(BaseModel):
    username: str = Field(..., max_length=10)


class Config:
    from_attributes = True


class LectureRequest(BaseModel):
    lecture_id: int


class VoteLectureRequest(BaseModel):
    merytoryka_points: int | None = Field(None, ge=1, le=10)
    forma_points: int | None = Field(None, ge=1, le=10)


class VotePosterRequest(BaseModel):
    merytoryka_points: int | None = Field(None, ge=1, le=10)
    estetyka_points: int | None = Field(None, ge=1, le=10)


class VoteLectureResponse(BaseModel):
    lecture_id: int
    merytoryka_points: int | None = Field(None, ge=1, le=10)
    forma_points: int | None = Field(None, ge=1, le=10)


class VotePosterResponse(BaseModel):
    poster_id: int
    merytoryka_points: int | None = Field(None, ge=1, le=10)
    estetyka_points: int | None = Field(None, ge=1, le=10)


class LectureResponse(BaseModel):
    lecture_id: int
    lecture_category: str
    lecture_name: str = Field(..., max_length=200)
    speaker_name: str = Field(..., max_length=80)
    lecture_description: str | None = Field(..., max_length=3000)
    lecture_datetime: str


class PosterResponse(BaseModel):
    poster_id: int
    poster_name: str
    poster_author: str
    poster_description: str | None = Field(..., max_length=3000)


class VoteLectureResponseExtended(VoteLectureResponse):
    user_id: int
    vote_id: int


class AllVotesResponse(BaseModel):
    lectures: Sequence[VoteLectureResponseExtended]
    posters: Sequence[VotePosterResponse]
    active_users: int

from pydantic import BaseModel, Field


class Token(BaseModel):
    authenticated: bool


class User(BaseModel):
    username: str = Field(..., max_length=10)


class UserInDB(User):
    user_id: int = Field(..., gt=0)
    username: str = Field(..., max_length=10)


class LoginForm(BaseModel):
    username: str = Field(..., max_length=10)


class Config:
    from_attributes = True


class LectureRequest(BaseModel):
    lecture_id: int


class VoteLectureRequest(BaseModel):
    lecture_id: int
    merytoryka_points: int | None = Field(None, ge=1, le=10)
    forma_points: int | None = Field(None, ge=1, le=10)


class VotePosterRequest(BaseModel):
    poster_id: int
    merytoryka_points: int | None = Field(None, ge=1, le=10)
    estetyka_points: int | None = Field(None, ge=1, le=10)


class LectureResponse(BaseModel):
    lecture_id: int
    lecture_category: str
    lecture_name: str = Field(..., max_length=200)
    speaker_name: str = Field(..., max_length=80)
    lecture_description: str = Field(..., max_length=1000)
    lecture_datetime: str


class PosterResponse(BaseModel):
    poster_id: int
    poster_name: str
    poster_author: str
    poster_description: str = Field(..., max_length=1000)

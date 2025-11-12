from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from schemas import AllVotesResponse, VoteLectureResponseExtended, VotePosterResponse
from database_connect import SessionLocal
from models import Votes_lectures, Votes_posters, Users
from .auth import get_current_user

router = APIRouter(prefix="/votes", tags=["votes"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("", response_model=AllVotesResponse)
async def get_votes(db: Session = Depends(get_db), user=Depends(get_current_user)):
    if not user.is_admin:
        return {"detail": "Not authorized"}, 403

    lecture_votes = []
    poster_votes = []

    for l_vote in db.query(Votes_lectures).all():
        lecture_votes.append(
            VoteLectureResponseExtended(
                lecture_id=l_vote.lecture_id,
                merytoryka_points=l_vote.merytoryka_points,
                forma_points=l_vote.forma_points,
                user_id=l_vote.user_id,
                vote_id=l_vote.vote_id,
            )
        )

    for p_vote in db.query(Votes_posters).all():
        poster_votes.append(
            VotePosterResponse(
                poster_id=p_vote.poster_id,
                merytoryka_points=p_vote.merytoryka_points,
                estetyka_points=p_vote.estetyka_points,
            )
        )

    active_users = db.query(Users).filter(Users.is_active).count()
    return AllVotesResponse(
        lectures=lecture_votes, posters=poster_votes, active_users=active_users
    )

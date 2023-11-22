from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
import schemas
from .auth import get_current_user
from models_db import Users, Posters, Votes_posters
from database_connect import SessionLocal

router = APIRouter(prefix='/posters', tags=['posters'])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


db_dependency = Depends(get_db)


@router.get("/user/posters")
async def get_all_posters_for_user(db: Session = Depends(get_db), user: Users = Depends(get_current_user)):
    all_posters = db.query(Posters).all()
    posters_list = []

    for poster in all_posters:
        user_vote = db.query(Votes_posters).filter(Votes_posters.poster_id == poster.poster_id,
                                                   Votes_posters.user_id == user.user_id).first()

        poster_info = {
            "poster_name": poster.poster_name,
            "poster_author": poster.poster_author,
            "vote_merytoryka": user_vote.merytoryka_points if user_vote else None,
            "vote_estetyka": user_vote.estetyka_points if user_vote else None
        }
        posters_list.append(poster_info)

    return {"posters": [schemas.PosterResponse(**poster_info) for poster_info in posters_list]}



@router.post("/votes-posters/{poster_id}/")
async def create_vote_on_poster(poster_id: int, vote_request: schemas.VotePosterRequest, db: Session = Depends(get_db),
                                user: Users = Depends(get_current_user)):
    existing_vote = db.query(Votes_posters).filter(Votes_posters.user_id == user.user_id, Votes_posters.poster_id == poster_id).first()

    if existing_vote:
        raise HTTPException(status_code=400, detail="Vote already exists")

    new_vote = Votes_posters(
        user_id=user.user_id,
        poster_id=poster_id,
        merytoryka_points=vote_request.merytoryka_points,
        estetyka_points=vote_request.estetyka_points
    )
    db.add(new_vote)
    db.commit()

    return {"message": "Vote successfully created"}


@router.put("/votes-posters/{poster_id}/")
async def update_vote_on_poster(poster_id: int, vote_request: schemas.VotePosterRequest, db: Session = Depends(get_db),
                                user: Users = Depends(get_current_user)):
    vote = db.query(Votes_posters).filter(Votes_posters.user_id == user.user_id, Votes_posters.poster_id == poster_id).first()

    if not vote:
        raise HTTPException(status_code=404, detail="Vote not found")

    vote.merytoryka_points = vote_request.merytoryka_points
    vote.estetyka_points = vote_request.estetyka_points
    db.commit()
    return {"message": "Vote successfully updated"}




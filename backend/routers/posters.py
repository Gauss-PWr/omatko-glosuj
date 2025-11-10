from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import schemas as schemas
from .auth import get_current_user
from typing import Annotated
from models import Users, Posters, Votes_posters as Votes
from database_connect import SessionLocal

router = APIRouter(prefix="/posters", tags=["posters"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


db_dependency = Depends(get_db)


@router.get("")
async def get_all_posters(db: Session = Depends(get_db)):
    all_posters = db.query(Posters).all()
    posters_list = []

    for poster in all_posters:
        poster_info: schemas.PosterResponse = schemas.PosterResponse(
            poster_id=poster.poster_id,
            poster_name=poster.poster_name,
            poster_author=poster.poster_author,
            poster_description=poster.poster_description,
        )
        posters_list.append(poster_info)

    return posters_list


@router.get("/votes")
async def get_all_posters_for_user(
    db: Session = Depends(get_db), user: Users = Depends(get_current_user)
):
    all_posters = db.query(Posters).all()
    posters_list = []

    for poster in all_posters:
        user_vote = (
            db.query(Votes)
            .filter(Votes.poster_id == poster.poster_id, Votes.user_id == user.user_id)
            .first()
        )

        poster_info: schemas.VotePosterResponse = schemas.VotePosterResponse(
            poster_id=poster.poster_id,
            merytoryka_points=user_vote.merytoryka_points if user_vote else None,
            estetyka_points=user_vote.estetyka_points if user_vote else None,
        )
        posters_list.append(poster_info)

    return posters_list


@router.post("/{poster_id}/vote")
async def create_vote_on_poster(
    poster_id: int,
    vote_request: Annotated[schemas.VotePosterRequest, Body(embed=True)],
    db: Session = Depends(get_db),
    user: Users = Depends(get_current_user),
):
    existing_vote = (
        db.query(Votes)
        .filter(Votes.user_id == user.user_id, Votes.poster_id == poster_id)
        .first()
    )

    if existing_vote:
        raise HTTPException(status_code=400, detail="Vote already exists")

    new_vote = Votes(
        user_id=user.user_id,
        poster_id=poster_id,
        merytoryka_points=vote_request.merytoryka_points,
        estetyka_points=vote_request.estetyka_points,
    )
    db.add(new_vote)
    db.commit()

    return {"message": f"Vote successfully created with values {vote_request.merytoryka_points}, {vote_request.estetyka_points}"}


@router.put("/{poster_id}/vote")
async def update_vote_on_poster(
    poster_id: int,
    vote_request: Annotated[schemas.VotePosterRequest, Body(embed=True)],
    db: Session = Depends(get_db),
    user: Users = Depends(get_current_user),
):
    vote = (
        db.query(Votes)
        .filter(Votes.user_id == user.user_id, Votes.poster_id == poster_id)
        .first()
    )

    if not vote:
        raise HTTPException(status_code=404, detail="Vote not found")

    if vote_request.merytoryka_points is not None:
        vote.merytoryka_points = vote_request.merytoryka_points

    if vote_request.estetyka_points is not None:
        vote.estetyka_points = vote_request.estetyka_points

    db.flush()
    db.commit()
    db.refresh(vote)

    return {"message": "Vote successfully updated"}


@router.delete("/{poster_id}/vote")
async def delete_vote_on_poster(
    poster_id: int,
    db: Session = Depends(get_db),
    user: Users = Depends(get_current_user),
):
    vote = (
        db.query(Votes)
        .filter(Votes.user_id == user.user_id, Votes.poster_id == poster_id)
        .first()
    )

    if not vote:
        raise HTTPException(status_code=404, detail="Vote not found")

    db.delete(vote)
    db.commit()
    return {"message": "Vote successfully deleted"}
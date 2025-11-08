from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import schemas as schemas
from .auth import get_current_user
from models import Lectures, Users, Votes_lectures as Votes
from database_connect import SessionLocal

router = APIRouter(prefix="/lectures", tags=["lectures"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


db_dependency = Depends(get_db)


@router.get("")
async def get_all_lectures(db: Session = Depends(get_db)):
    all_lectures = db.query(Lectures).all()
    lectures_list = []

    for lecture in all_lectures:
        lecture_info: schemas.LectureResponse = schemas.LectureResponse(
            lecture_id=lecture.lecture_id,
            lecture_category=lecture.lecture_category,
            lecture_name=lecture.lecture_name,
            speaker_name=lecture.speaker_name,
            lecture_datetime=lecture.lecture_timestamp,
            lecture_description=lecture.lecture_description,
        )
        lectures_list.append(lecture_info)

    return lectures_list


@router.get("/votes")
async def get_user_lectures(
    db: Session = Depends(get_db), user: Users = Depends(get_current_user)
):
    user_votes = (
        db.query(Votes.lecture_id)
        .filter(Votes.user_id == user.user_id)
        .distinct()
        .all()
    )

    lectures_list = []

    for vote in user_votes:
        lecture = (
            db.query(Lectures).filter(Lectures.lecture_id == vote.lecture_id).first()
        )
        if lecture:
            user_vote = (
                db.query(Votes)
                .filter(
                    Votes.lecture_id == lecture.lecture_id,
                    Votes.user_id == user.user_id,
                )
                .first()
            )

            lecture_info: schemas.VoteLectureRequest = schemas.VoteLectureRequest(
                lecture_id=lecture.lecture_id,
                merytoryka_points=(user_vote.merytoryka_points if user_vote else None),
                forma_points=user_vote.forma_points if user_vote else None,
            )
            lectures_list.append(lecture_info)

    return lectures_list


@router.post("/{lecture_id}/vote")
async def add_lecture_to_user(
    lecture_id: int,
    lecture_request: schemas.LectureRequest,
    db: Session = Depends(get_db),
    user: Users = Depends(get_current_user),
):
    lecture_id = lecture_request.lecture_id
    lecture = db.query(Lectures).filter(Lectures.lecture_id == lecture_id).first()

    if not lecture:
        raise HTTPException(status_code=404, detail="Lecture not found")

    existing_vote = (
        db.query(Votes)
        .filter(Votes.user_id == user.user_id, Votes.lecture_id == lecture.lecture_id)
        .first()
    )

    if existing_vote:
        raise HTTPException(status_code=400, detail="Lecture already added by user")

    new_vote = Votes(
        user_id=user.user_id,
        lecture_id=lecture.lecture_id,
        merytoryka_points=None,
        forma_points=None,
    )
    db.add(new_vote)
    db.commit()

    return {"message": "Lecture successfully added to user with initial votes"}


@router.put("/{lecture_id}/vote")
async def update_vote(
    lecture_id: int,
    vote_request: schemas.VoteLectureRequest,
    db: Session = Depends(get_db),
    user: Users = Depends(get_current_user),
):
    vote = (
        db.query(Votes)
        .filter(Votes.user_id == user.user_id, Votes.lecture_id == lecture_id)
        .first()
    )

    if not vote:
        raise HTTPException(status_code=404, detail="Vote not found")

    if vote_request.merytoryka_points is not None:
        vote.merytoryka_points = vote_request.merytoryka_points

    if vote_request.forma_points is not None:
        vote.forma_points = vote_request.forma_points

    db.commit()

    return {"message": "Vote successfully updated"}

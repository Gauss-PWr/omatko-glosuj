from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
import schemas
from .auth import get_current_user
from models_db import Lectures, Votes, Users
from database_connect import SessionLocal

router = APIRouter(prefix='/lectures', tags=['lectures'])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


db_dependency = Depends(get_db)


@router.post("/lectures/add-to-user")
async def add_lecture_to_user(lecture_request: schemas.LectureAddRequest, db: Session = Depends(get_db),
                              user: Users = Depends(get_current_user)):
    lecture_code = lecture_request.lecture_code
    lecture = db.query(Lectures).filter(Lectures.lecture_code == lecture_code).first()

    if not lecture:
        raise HTTPException(status_code=404, detail="Lecture not found")

    existing_vote = db.query(Votes).filter(Votes.user_id == user.user_id,
                                           Votes.lecture_id == lecture.lecture_id).first()

    if existing_vote:
        raise HTTPException(status_code=400, detail="Lecture already added by user")

    new_vote = Votes(
        user_id=user.user_id,
        lecture_id=lecture.lecture_id,
        merytoryka_points=None,
        forma_points=None
    )
    db.add(new_vote)
    db.commit()

    return {"message": "Lecture successfully added to user with initial votes"}


@router.get("/user/lectures")
async def get_user_lectures(db: Session = Depends(get_db), user: Users = Depends(get_current_user)):
    user_votes = db.query(Votes.lecture_id).filter(Votes.user_id == user.user_id).distinct().all()

    lectures_list = []

    for vote in user_votes:
        lecture = db.query(Lectures).filter(Lectures.lecture_id == vote.lecture_id).first()
        if lecture:
            user_vote = db.query(Votes).filter(Votes.lecture_id == lecture.lecture_id,
                                               Votes.user_id == user.user_id).first()

            lecture_info = {
                "lecture_name": lecture.lecture_name,
                "speaker_name": lecture.speaker_name,
                "vote_merytoryka": user_vote.merytoryka_points if user_vote else "No vote",
                "vote_forma": user_vote.forma_points if user_vote else "No vote"
            }
            lectures_list.append(lecture_info)

    return {"lectures": [schemas.LectureResponse(**lecture_info) for lecture_info in lectures_list]}


@router.put("/votes/{lecture_id}/")
async def update_vote(lecture_id: int, vote_request: schemas.VoteRequest, db: Session = Depends(get_db),
                      user: Users = Depends(get_current_user)):
    vote = db.query(Votes).filter(Votes.user_id == user.user_id, Votes.lecture_id == lecture_id).first()

    if not vote:
        raise HTTPException(status_code=404, detail="Vote not found")

    if vote_request.merytoryka_points is not None:
        vote.merytoryka_points = vote_request.merytoryka_points

    if vote_request.forma_points is not None:
        vote.forma_points = vote_request.forma_points

    db.commit()

    return {"message": "Vote successfully updated"}

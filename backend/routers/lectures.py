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
async def add_lecture_to_user(lecture_request: schemas.LectureAddRequest, db: Session = Depends(get_db), user: Users = Depends(get_current_user)):
    lecture_code = lecture_request.lecture_code
    lecture = db.query(Lectures).filter(Lectures.lecture_code == lecture_code).first()
    if not lecture:
        raise HTTPException(status_code=404, detail="Lecture not found")

    existing_votes = db.query(Votes).filter(
        Votes.user_id == user.user_id,
        Votes.lecture_id == lecture.lecture_id
    ).all()

    if len(existing_votes) >= 2:
        raise HTTPException(status_code=400, detail="Lecture already added by user")

    new_vote_merytoryka = Votes(user_id=user.user_id, lecture_id=lecture.lecture_id, category='merytoryka')
    new_vote_forma = Votes(user_id=user.user_id, lecture_id=lecture.lecture_id, category='forma prezentacji')
    db.add(new_vote_merytoryka)
    db.add(new_vote_forma)
    db.commit()

    return {"message": "Lecture successfully added to user with initial votes"}




@router.get("/user/lectures")
async def get_user_lectures(db: Session = Depends(get_db), user: Users = Depends(get_current_user)):
    user_votes = db.query(Votes).filter(Votes.user_id == user.user_id).all()
    unique_lecture_ids = set(vote.lecture_id for vote in user_votes)

    lectures_list = []

    for lecture_id in unique_lecture_ids:
        lecture = db.query(Lectures).filter(Lectures.lecture_id == lecture_id).first()
        if lecture:
            votes_for_lecture = db.query(Votes).filter(Votes.lecture_id == lecture_id, Votes.user_id == user.user_id).all()

            vote_merytoryka = next((v for v in votes_for_lecture if v.category == "merytoryka"), None)
            vote_forma = next((v for v in votes_for_lecture if v.category == "forma prezentacji"), None)

            lecture_info = {
                "lecture_id": lecture.lecture_id,
                "lecture_name": lecture.lecture_name,
                "speaker_name": lecture.speaker_name,
                "lecture_code": lecture.lecture_code,
                "vote_merytoryka": vote_merytoryka.points if vote_merytoryka else "No vote",
                "vote_forma": vote_forma.points if vote_forma else "No vote"
            }
            lectures_list.append(lecture_info)

    return {"lectures": [schemas.LectureResponse(**lecture_info) for lecture_info in lectures_list]}




@router.put("/votes/merytoryka/")
async def update_vote_merytoryka(vote_request: schemas.VoteRequest, db: Session = Depends(get_db), user: Users = Depends(get_current_user)):
    vote = db.query(Votes).filter(
        Votes.user_id == user.user_id,
        Votes.category == 'merytoryka'
    ).first()

    if not vote:
        raise HTTPException(status_code=404, detail="Vote not found")

    vote.points = vote_request.points
    db.commit()

    return {"message": "Vote for merytoryka successfully updated"}



@router.put("/votes/forma/")
async def update_vote_merytoryka(vote_request: schemas.VoteRequest, db: Session = Depends(get_db), user: Users = Depends(get_current_user)):
    vote = db.query(Votes).filter(
        Votes.user_id == user.user_id,
        Votes.category == 'forma prezentacji'
    ).first()

    if not vote:
        raise HTTPException(status_code=404, detail="Vote not found")

    vote.points = vote_request.points
    db.commit()

    return {"message": "Vote for forma prezentacji successfully updated"}




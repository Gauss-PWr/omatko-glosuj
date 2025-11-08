from database_connect import engine, SessionLocal, Base
from models import Users, Posters, Lectures

Base.metadata.drop_all(bind=engine)
Base.metadata.create_all(bind=engine)

db = SessionLocal()


def add_data():
    data = [
        Users(user_login="admin"),
        Posters(
            poster_name="Poster 1",
            poster_author="Author 1",
            poster_description="Description 1",
        ),
        Lectures(
            lecture_name="Lecture 1",
            speaker_name="Speaker 1",
            lecture_description="Description 1",
            lecture_category="stosowana",
            lecture_timestamp="2025-12-05 10:00:00",
        ),
        Lectures(
            lecture_name="Lecture 2",
            speaker_name="Speaker 2",
            lecture_description="Description 2",
            lecture_category="teoretyczna",
            lecture_timestamp="2025-12-06 10:00:00",
        ),
        Lectures(
            lecture_name="Lecture 3",
            speaker_name="Speaker 3",
            lecture_description="Description 3",
            lecture_category="stosowana",
            lecture_timestamp="2025-12-07 10:00:00",
        ),
        Posters(
            poster_name="Poster 2",
            poster_author="Author 2",
            poster_description="Description 2",
        ),
    ]

    db.add_all(data)
    db.commit()
    db.close()


add_data()

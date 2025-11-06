from database_connect import engine, SessionLocal, Base
from models_db import Votes, Users
from passlib.context import CryptContext

Base.metadata.drop_all(bind=engine)
Base.metadata.create_all(bind=engine)

db = SessionLocal()

bcrypt_context = CryptContext(
    schemes=["argon2"],
    deprecated="auto",
    argon2__rounds=4,
)


def add_data():
    data = [
        # votes
        # models_db.Votes(lecture_id=1, merytoryka_points=7, forma_points=5, user_id=7),
        # models_db.Votes(lecture_id=2, merytoryka_points=9, forma_points=6, user_id=7),
        # users
        # models_db.Users(user_id=1, user_login="adminMK", user_mail="", user_password="admin-omatko23"),
        Users(user_login="admin", user_password=bcrypt_context.hash("admin")),
        # models_db.Users(user_id=3, user_login="adminAS", user_mail="", user_password="admin-omatko23"),
        # models_db.Users(user_id=4, user_login="adminWT", user_mail="", user_password="admin-omatko23"),
        # models_db.Users(user_id=5, user_login="adminMM", user_mail="", user_password="admin-omatko23"),
    ]

    db.add_all(data)
    db.commit()
    db.close()


def delete_data(id_to_delete):
    try:
        item = (
            db.query(models_db.Votes).filter(models_db.Votes.id == id_to_delete).first()
        )

        db.delete(item)
        db.commit()

    except Exception as e:
        print(f"error: {e}")

    finally:
        db.close()


def display_all_data():
    try:
        items = db.query(models_db.Votes).all()
        if items:
            for item in items:
                print(
                    f"ID: {item.vote_id}, Lecture Name: {item.lecture_id}, Category: {item.category}, Points: {item.points}, User: {item.user_id}"
                )
        else:
            print("no records.")

    except Exception as e:
        print(f"error {e}")

    finally:
        db.close()


add_data()

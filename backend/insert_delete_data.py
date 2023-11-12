import models_db
from database_connect import engine, SessionLocal

models_db.Base.metadata.create_all(bind=engine)

db = SessionLocal()


def add_data():
    data = [
        # votes
        models_db.Votes(lecture_id=1115, category='merytoryka', points=7, user_id=7),
        models_db.Votes(lecture_id=1115, category='forma prezentacji', points=4, user_id=7),

        # users
        models_db.Users(user_id=1, user_login="adminMK", user_mail="", user_password="admin-omatko23"),
        models_db.Users(user_id=2, user_login="adminKB", user_mail="", user_password="admin-omatko23"),
        models_db.Users(user_id=3, user_login="adminAS", user_mail="", user_password="admin-omatko23"),
        models_db.Users(user_id=4, user_login="adminWT", user_mail="", user_password="admin-omatko23"),
        models_db.Users(user_id=5, user_login="adminMM", user_mail="", user_password="admin-omatko23"),
    ]

    db.add_all(data)
    db.commit()

    db.close()


def delete_data(id_to_delete):
    try:
        item = db.query(models_db.Votes).filter(models_db.Votes.id == id_to_delete).first()

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
                    f"ID: {item.vote_id}, Lecture Name: {item.lecture_id}, Category: {item.category}, Points: {item.points}, User: {item.user_id}")
        else:
            print("no records.")

    except Exception as e:
        print(f"error {e}")

    finally:
        db.close()

"""
zeby usunac tabele jesli byly jakies zmiany i macie juz stworzone je w bazie to sqlalchemy ich nie edytuje bo jak widzi ze jej nie ma to ja tworzy ale 
jak sa jakies zmiany w strukturze to tej struktury nie edytuje (zupelnie nie good practise ale tak najszybciej
najszybszy) bo jak nie ma tabeli to komenda models_db.Base.metadata.create_all(bind=engine) ja stworzy z nową strukturą.
"""

#models_db.Users.__table__.drop(engine)


# add_data()
display_all_data()
# delete_data(1)




"""sql
mozecie
INSERT INTO votes (lecture_id, category, points, "user_id")
VALUES
    (1, 'merytoryka', 7, 1),
    (1, 'forma prezentacji', 4, 1),
    (2, 'merytoryka', 9, 2),
    (2, 'forma prezentacji', 2, 2),
    (3, 'merytoryka', 5, 3),
    (4, 'forma prezentacji', 8, 3),
    (5, 'merytoryka', 6, '4'),
    (6, 'forma prezentacji', 3, 4),
    (6, 'merytoryka', 1, 5),
    (1, 'forma prezentacji', 10, 5),
    (1, 'merytoryka', 8, 6);
"""
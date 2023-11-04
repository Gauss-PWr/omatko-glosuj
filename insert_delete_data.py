import models_db
from database_connect import engine, SessionLocal

models_db.Base.metadata.create_all(bind=engine)

db = SessionLocal()


def add_data():
    data = [
        models_db.Votes(lecture_name='fajna1', category='merytoryka', points=7, user='user11'),
        models_db.Votes(lecture_name='fajna1', category='forma prezentacji', points=4, user='user11'),
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
                    f"ID: {item.id}, Lecture Name: {item.lecture_name}, Category: {item.category}, Points: {item.points}, User: {item.user}")
        else:
            print("no records.")

    except Exception as e:
        print(f"error {e}")

    finally:
        db.close()


# add_data()
display_all_data()
# delete_data(1)


"""sql
mozecie
INSERT INTO votes (lecture_name, category, points, "user")
VALUES
    ('fajna1', 'merytoryka', 7, 'user1'),
    ('fajna1', 'forma prezentacji', 4, 'user1'),
    ('fajna2', 'merytoryka', 9, 'user2'),
    ('fajna2', 'forma prezentacji', 2, 'user2'),
    ('fajna3', 'merytoryka', 5, 'user3'),
    ('fajna3', 'forma prezentacji', 8, 'user3'),
    ('fajna4', 'merytoryka', 6, 'user4'),
    ('fajna4', 'forma prezentacji', 3, 'user4'),
    ('fajna5', 'merytoryka', 1, 'user5'),
    ('fajna5', 'forma prezentacji', 10, 'user5'),
    ('fajna6', 'merytoryka', 8, 'user6'),
    ('fajna6', 'forma prezentacji', 4, 'user6'),
    ('fajna5', 'merytoryka', 3, 'user7'),
    ('fajna5', 'forma prezentacji', 7, 'user7'),
    ('fajna4', 'merytoryka', 2, 'user8'),
    ('fajna4', 'forma prezentacji', 9, 'user8'),
    ('fajna5', 'merytoryka', 6, 'user9'),
    ('fajna5', 'forma prezentacji', 1, 'user9'),
    ('fajna1', 'merytoryka', 5, 'user10'),
    ('fajna1', 'forma prezentacji', 8, 'user10');


"""
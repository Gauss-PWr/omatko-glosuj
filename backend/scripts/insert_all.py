from dotenv import load_dotenv
import os

if os.getenv("RUNNING_IN_CONTAINER", "0") != "1":
    load_dotenv(".env.dev")


from scripts.insert_posters import load_posters
from scripts.insert_lectures import load_lectures
from scripts.insert_logins import load_users
from database_connect import engine, SessionLocal, Base
import logging
logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)



def add_data():
    Base.metadata.drop_all(bind=engine)
    logger.info("Dropped all tables")
    Base.metadata.create_all(bind=engine)
    logger.info("Created all tables")
    db = SessionLocal()

    lectures = load_lectures()
    db.add_all(lectures)
    db.commit()


    posters = load_posters()
    db.add_all(posters)
    db.commit()


    users = load_users()
    db.add_all(users)
    db.commit()

    sztab = load_users(path='./data/sztab.csv')
    db.add_all(sztab)
    db.commit()

    admin_users = load_users(path='./data/koordynatorzy.csv', admin=True)
    db.add_all(admin_users)
    db.commit()

    logger.info("All data added to the database")
    db.close()


add_data()

from database_connect import engine, SessionLocal, Base
from models import Users, Posters, Lectures
import pandas as pd

Base.metadata.drop_all(bind=engine)
Base.metadata.create_all(bind=engine)

db = SessionLocal()

from datetime import datetime, timedelta

def add_data():
    data = [
        Users(user_login="admin"),
    ]

    df = pd.read_csv('./scripts/data.csv')

    timestamp_teoretyczna = datetime(2025, 12, 5, 10, 0, 0)
    timestamp_stosowana = datetime(2025, 12, 5, 10, 0, 0)
    timestamp_format = '%Y-%m-%d %H:%M:%S'

    for index, row in df.iterrows():
        if row['Accepted track'] == "T":
            data.append(Lectures(
                lecture_name=row['Title'],
                speaker_name=row['Submitter'],
                lecture_description=row['Content'],
                lecture_category='teoretyczna',
                lecture_timestamp=timestamp_teoretyczna
            ))
            timestamp_teoretyczna += timedelta(minutes=30)

            if timestamp_teoretyczna.hour >= 15:
                timestamp_teoretyczna = timestamp_teoretyczna.replace(hour=10, minute=0, second=0)
                timestamp_teoretyczna += timedelta(days=1)
        elif row['Accepted track'] == "S":
            data.append(Lectures(
                lecture_name=row['Title'],
                speaker_name=row['Submitter'],
                lecture_description=row['Content'],
                lecture_category='stosowana',
                lecture_timestamp=timestamp_stosowana
            ))
            timestamp_stosowana += timedelta(minutes=30)


            if timestamp_stosowana.hour >= 13:
                timestamp_stosowana = timestamp_stosowana.replace(hour=10, minute=0, second=0)
                timestamp_stosowana += timedelta(days=1)
        else:
            data.append(Posters(
                poster_name=row['Title'],
                poster_author=row['Submitter'],
                poster_description=row['Content'],
            ))

    db.add_all(data)
    db.commit()
    db.close()


add_data()

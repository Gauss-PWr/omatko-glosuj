from models import Lectures
import pandas as pd
import logging
logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)


def load_lectures(path='./data/lectures.csv'):
    df = pd.read_csv(path)
    logger.info(f"Loaded data from {path}")



    lectures = []

    for index, row in df.iterrows():
        lecture = Lectures(
            lecture_category= "stosowana" if row['Track'] == "Matematyka stosowana" else "teoretyczna",
            lecture_name=row['Title'],
            speaker_name=row['Presenters'],
            lecture_description=row['Description'],
            lecture_timestamp=row['Date'],
        )
        lectures.append(lecture)
    

    logger.info(f"Returning {len(lectures)} lectures")
    return lectures
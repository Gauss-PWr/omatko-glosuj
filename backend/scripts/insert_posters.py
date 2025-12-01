from models import Posters
import pandas as pd
import logging
logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

def load_posters(path='./data/posters.csv'):
    df = pd.read_csv(path)
    logger.info(f"Loaded data from {path}")

    df['Co-Authors'] = df['Co-Authors'].fillna('')
    df['Content'] = df['Content'].fillna('')

    posters = []

    for index, row in df.iterrows():
        authors = str(row['Primary authors'])
        print(type(row['Content']))
        if row['Co-Authors'] != '':
            authors += ", " + str(row['Co-Authors'])

        poster = Posters(
            poster_author=authors,
            poster_name=row['Title'],
            poster_description=row['Content'],
        )
        posters.append(poster)
    

    logger.info(f"Returning {len(posters)} posters")
    return posters
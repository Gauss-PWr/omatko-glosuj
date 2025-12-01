from models import Users
import pandas as pd
import logging
logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

def load_users(path='./data/uczestnicy.csv', admin=False):
    df = pd.read_csv(path)
    logger.info(f"Loaded data from {path}")

    users = []

    for index, row in df.iterrows():
        user = Users(
            user_login=row['login'],
            is_admin=admin
        )
        users.append(user)
    

    logger.info(f"Returning {len(users)} users")
    return users
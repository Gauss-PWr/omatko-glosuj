from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base
from sqlalchemy.orm import sessionmaker
import os

Base = declarative_base()


DB_PASSWORD_FILE = os.getenv("DB_PASSWORD_FILE", None)
if DB_PASSWORD_FILE and os.path.isfile(DB_PASSWORD_FILE):
    with open(DB_PASSWORD_FILE, 'r') as file:
        db_password = file.read().strip()
else:
    db_password = os.getenv("DB_PASSWORD", "admin")

user = os.getenv("DB_USER", "admin")
password = db_password
database = os.getenv("DB_NAME", "licznik_db")
host = os.getenv("DB_HOST", "localhost")
port = os.getenv("DB_PORT", "5432")

database_url = f"postgresql+psycopg2://{user}:{password}@{host}:{port}/{database}"

engine = create_engine(url=database_url, pool_pre_ping=True)  # echo=True

Base.metadata.create_all(bind=engine)
SessionLocal = sessionmaker(bind=engine)

from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv
import os

load_dotenv()


Base = declarative_base()


user = os.getenv("DB_USER", "admin")
password = os.getenv("DB_PASSWORD", "zli_ludzie_na_omatko")
database = os.getenv("DB_NAME", "licznik_db")
host = os.getenv("DB_HOST", "localhost")
port = os.getenv("DB_PORT", "5432")


database_url = f"postgresql+psycopg2://{user}:{password}@{host}:{port}/{database}"

engine = create_engine(url=database_url, pool_pre_ping=True)  # echo=True

Base.metadata.create_all(bind=engine)
SessionLocal = sessionmaker(bind=engine)

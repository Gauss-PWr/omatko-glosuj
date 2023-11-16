from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base
from sqlalchemy.orm import sessionmaker
# import psycopg2

Base = declarative_base()


user = "admin"
password = "zli_ludzie_na_omatko"
database = "licznik_db"
host = "localhost"
port = "5432"


database_url = f'postgresql+psycopg2://{user}:{password}@{host}:{port}/{database}'

engine = create_engine(url=database_url, pool_pre_ping=True) #echo=True

Base.metadata.create_all(bind=engine)
SessionLocal = sessionmaker(bind=engine)
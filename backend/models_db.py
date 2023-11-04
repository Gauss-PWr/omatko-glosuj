from sqlalchemy import Column, String, Integer
from database_connect import Base


class Votes(Base):
    __tablename__ = "votes"
    id = Column("id", Integer, primary_key=True, autoincrement=True)
    lecture_name= Column("lecture_name", String(80))
    category = Column("category", String(80))
    points = Column("points", Integer)
    user = Column("user", String(40))


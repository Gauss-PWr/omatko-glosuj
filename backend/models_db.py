from sqlalchemy import Column, String, Integer
from database_connect import Base


class Votes(Base):
    __tablename__ = "votes"
    vote_id = Column("vote_id", Integer, primary_key=True, autoincrement=True)
    lecture_id = Column("lecture_id", Integer)
    category = Column("category", String(80))
    points = Column("points", Integer)
    user_id = Column("user_id", Integer)


class Lectures(Base):
    __tablename__ = "lectures"
    lecture_id = Column("lecture_id", Integer, primary_key=True, autoincrement=True)
    lecture_name = Column("lecture_name", String(100))
    speaker_name = Column("speaker_name", String(80))
    lecture_code = Column("lecture_code", Integer)
    sum_points = Column("sun_points", Integer)


class Users(Base):
    __tablename__ = "users"
    user_id = Column("user_id", Integer, primary_key=True, autoincrement=True)
    user_login = Column("user_login", String(80))
    user_mail = Column("user_mail", String(80))
    user_password = Column("user_password", String(30))

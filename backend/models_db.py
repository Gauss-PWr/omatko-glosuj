from sqlalchemy import Column, String, Integer, Float
from database_connect import Base


class Votes(Base):
    __tablename__ = "votes"
    vote_id = Column("vote_id", Integer, primary_key=True, autoincrement=True)
    lecture_id = Column("lecture_id", Integer)
    merytoryka_points = Column("mertytoryka_points", Float)
    forma_points = Column("forma_points", Float)
    user_id = Column("user_id", Integer)


class Lectures(Base):
    __tablename__ = "lectures"
    lecture_id = Column("lecture_id", Integer, primary_key=True, autoincrement=True)
    lecture_category = Column("lecture_category", String(80))
    lecture_name = Column("lecture_name", String(200))
    speaker_name = Column("speaker_name", String(80))
    lecture_code = Column("lecture_code", String(30)) #zmiana na str 
    sum_points = Column("sum_points", Float)


class Posters(Base):
    __tablename__ = "posters"
    poster_id = Column("poster_id", Integer, primary_key=True, autoincrement=True)
    poster_name = Column("poster_name", String(200))
    poster_author = Column("poster_author", String(80))
    sum_points = Column("sum_points", Float)


class Votes_posters(Base):
    __tablename__ = "votes_posters"
    vote_id = Column("vote_id", Integer, primary_key=True, autoincrement=True)
    poster_id = Column("poster_id", Integer)
    merytoryka_points = Column("mertytoryka_points", Float)
    estetyka_points = Column("estetyka_points", Float)
    user_id = Column("user_id", Integer)



class Users(Base):
    __tablename__ = "users"
    user_id = Column("user_id", Integer, primary_key=True, autoincrement=True)
    user_login = Column("user_login", String(80))
    user_password = Column("user_password", String(100)) #zmiana do 100 aby się dało hasła hashowąć

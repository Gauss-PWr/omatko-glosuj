from sqlalchemy import String, Integer, Boolean, ForeignKey
from database_connect import Base
from sqlalchemy.orm import Mapped, relationship, mapped_column


class Lectures(Base):
    __tablename__ = "lectures"
    lecture_id: Mapped[int] = mapped_column(
        Integer, primary_key=True, autoincrement=True
    )
    lecture_category: Mapped[str] = mapped_column(String(80))
    lecture_name: Mapped[str] = mapped_column(String(200))
    speaker_name: Mapped[str] = mapped_column(String(80))
    lecture_description: Mapped[str] = mapped_column(String(3000))
    lecture_timestamp: Mapped[str]

    vote = relationship("Votes_lectures", back_populates="lecture")


class Posters(Base):
    __tablename__ = "posters"
    poster_id: Mapped[int] = mapped_column(
        Integer, primary_key=True, autoincrement=True
    )
    poster_name: Mapped[str] = mapped_column(String(200))
    poster_author: Mapped[str] = mapped_column(String(80))
    poster_description: Mapped[str] = mapped_column(String(3000))

    vote = relationship("Votes_posters", back_populates="poster")


class Votes_posters(Base):
    __tablename__ = "votes_posters"
    vote_id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    poster_id: Mapped[int] = mapped_column(ForeignKey("posters.poster_id"))
    user_id: Mapped[int] = mapped_column(ForeignKey("users.user_id"))

    merytoryka_points: Mapped[int | None] = mapped_column(Integer)
    estetyka_points: Mapped[int | None] = mapped_column(Integer)

    poster: Mapped["Posters"] = relationship("Posters", back_populates="vote")
    user: Mapped["Users"] = relationship("Users", back_populates="vote_poster")


class Votes_lectures(Base):
    __tablename__ = "votes_lectures"
    vote_id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    lecture_id: Mapped[int] = mapped_column(ForeignKey("lectures.lecture_id"))
    user_id: Mapped[int] = mapped_column(ForeignKey("users.user_id"))

    merytoryka_points: Mapped[int | None] = mapped_column(Integer)
    forma_points: Mapped[int | None] = mapped_column(Integer)

    lecture: Mapped["Lectures"] = relationship("Lectures", back_populates="vote")
    user: Mapped["Users"] = relationship("Users", back_populates="vote_lecture")


class Users(Base):
    __tablename__ = "users"
    user_id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    user_login: Mapped[str] = mapped_column(String(10))  # zwykly hash

    vote_lecture: Mapped[list[Votes_lectures]] = relationship(
        "Votes_lectures", back_populates="user"
    )
    vote_poster: Mapped[list[Votes_posters]] = relationship(
        "Votes_posters", back_populates="user"
    )

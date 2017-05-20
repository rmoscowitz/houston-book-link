from sqlalchemy import Column, String, DateTime, Integer, ForeignKey
from sqlalchemy.dialects.postgresql import JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship


Base = declarative_base()

class Library(Base):
    __tablename__ = "libraries"

    id = Column(Integer, primary_key=True, autoincrement=True)
    overdrive_id = Column(String)
    name = Column(String)
    collection_token = Column(String)


class Book(Base):
    __tablename__ = "books"

    id = Column(Integer, primary_key=True, autoincrement=True)
    overdrive_id = Column(String)
    media_type = Column(String)
    title = Column(String)
    subtitle = Column(String)
    sort_title = Column(String)
    primary_creator_role = Column(String)
    primary_creator_name = Column(String)
    star_rating = Column(String)
    date_added = Column(DateTime)
    response = Column(JSON)
    library_id = Column(Integer, ForeignKey(Library.id))


class BookImage(Base):
    __tablename__ = "book_images"

    id = Column(Integer, primary_key=True, autoincrement=True)
    book_id = Column(Integer, ForeignKey(Book.id))
    title = Column(String)
    type = Column(String)
    href = Column(String)


class Format(Base):
    __tablename__ = "formats"

    id = Column(Integer, primary_key=True, autoincrement=True)
    key = Column(String)
    label = Column(String)

#
class BookFormat(Base):
    __tablename__ = "book_formats"

    id = Column(Integer, primary_key=True, autoincrement=True)
    book_id = Column(Integer, ForeignKey(Book.id))
    format_id = Column(Integer, ForeignKey(Format.id))





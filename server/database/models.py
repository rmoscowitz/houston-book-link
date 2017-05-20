from sqlalchemy import Column, String, DateTime, Integer, ForeignKey
from sqlalchemy.dialects.postgresql import JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship


Base = declarative_base()

class Library(Base):
    __tablename__ = "libraries"

    id = Column(Integer, primary_key=True, autoincrement=True)
    overdrive_id = Column(String, unique=True)
    name = Column(String)
    collection_token = Column(String)


class Book(Base):
    __tablename__ = "books"

    id = Column(Integer, primary_key=True, autoincrement=True)
    overdrive_id = Column(String, unique=True)
    media_type = Column(String)
    title = Column(String)
    series = Column(String)
    subtitle = Column(String)
    sort_title = Column(String)
    primary_creator_role = Column(String)
    primary_creator_name = Column(String)
    star_rating = Column(String)
    date_added = Column(DateTime)
    overdrive_href = Column(String)
    img_thumbnail = Column(String)
    img_cover_150_wide = Column(String)
    img_cover = Column(String)
    img_cover_300_wide = Column(String)
    response = Column(JSON)
    library_id = Column(Integer, ForeignKey(Library.id))


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





from sqlalchemy import create_engine
from sqlalchemy import Column, String, DateTime, Integer
from sqlalchemy.dialects.postgres import JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

USER = "dylan"
PASSWORD = ""
DBNAME = "mydb"
CONN = create_engine("postgresql+psycopg2://{}:{}@/{}".format(USER, PASSWORD, DBNAME))

Base = declarative_base()

class Library(Base):
    __tablename__ = "libraries"

    id = Column(Integer, primary_key=True, autoincrement=True)
    overdrive_id = Column(String)
    name = Column(String)
    collection_token = Column(String)


class Book(Base):
    __tablename__ = "books"

    id = Column(Integer, primary_key=True)
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
    library_id = Column(Integer, ForeignKey("library.id"))


Base.metadata.create_all(CONN)




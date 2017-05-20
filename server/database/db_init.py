from sqlalchemy import create_engine
from sqlalchemy import Column, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

USER = "dylan"
PASSWORD = ""
DBNAME = "mydb"
CONN = create_engine("postgresql+psycopg2://{}:{}@/{}".format(USER, PASSWORD, DBNAME))

Base = declarative_base()


class Book(Base):
    __tablename__ = 'books'

    title = Column(String, primary_key=True)
    director = Column(String)
    year = Column(String)


Base.metadata.create_all(CONN)




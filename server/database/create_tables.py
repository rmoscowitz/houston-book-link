from sqlalchemy import create_engine

from db_init import Base

USER = "dylan"
PASSWORD = ""
DBNAME = "mydb"
CONN = create_engine("postgresql+psycopg2://{}:{}@/{}".format(USER, PASSWORD, DBNAME))

Base.metadata.drop_all(CONN)
Base.metadata.create_all(CONN)
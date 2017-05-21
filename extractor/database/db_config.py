from sqlalchemy import create_engine

import os

USER = os.environ.get("PG_USER", "dylan")
PASSWORD = os.environ.get("PG_PASSWORD", "")
DBNAME = os.environ.get("PG_DBNAME", "mydb")
CONN = create_engine("postgresql+psycopg2://{}:{}@/{}".format(USER, PASSWORD, DBNAME))

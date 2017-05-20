from sqlalchemy import create_engine

from db_init import Base

USER = "dylan"
PASSWORD = ""
DBNAME = "mydb"
CONN = create_engine("postgresql+psycopg2://{}:{}@/{}".format(USER, PASSWORD, DBNAME))

Base.metadata.drop_all(CONN)
Base.metadata.create_all(CONN)

CONN.execute("INSERT INTO libraries (overdrive_id, name, collection_token) VALUES (1356, 'Houston Area Digital Media Catalog (TX)', 'v1L1BLQAAAA2p')")
CONN.execute("INSERT INTO libraries (overdrive_id, name, collection_token) VALUES (1172, 'Harris County Public Library (TX)', 'v1L1BQAAAAA2e')")


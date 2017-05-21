"""One-off script to add a full text search column to books table."""
from sqlalchemy import create_engine

from models import Base
from db_config import CONN


def to_tsvector(col):
    return "to_tsvector(coalesce({},''))".format(col)

def run():
    CONN.execute("ALTER TABLE books ADD COLUMN tsv tsvector")
    CONN.execute("CREATE INDEX tsv_idx ON books USING gin(tsv)")
    SEARCHABLES = " || ".join([to_tsvector(s) for s in [
        "title",
        "series",
        "subtitle",
        "primary_creator_name",
        "media_type",
    ]])
    CONN.execute("UPDATE books SET tsv = {}".format(SEARCHABLES))

if __name__ == "__main__":
    run()


# TODO https://blog.lateral.io/2015/05/full-text-search-in-milliseconds-with-postgresql/
# should add triggers in future

"""
One off script to insert response data into postgres
"""
import os
import json
import glob
import time

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.sql.expression import ClauseElement

from models import Library, Book, BookFormat, Format, LibraryBook
from db_config import CONN

LIBRARY_MAP = {
    "v1L1BLQAAAA2p": 1,
    "v1L1BQAAAAA2e": 2
}

FORMAT_MAP = {
    "ebook-pdf-adobe": 1,
    "ebook-mediado": 2,
    "periodicals-nook": 3,
    "ebook-epub-adobe": 4,
    "ebook-kindle": 5,
    "audiobook-mp3": 6,
    "ebook-pdf-open": 7,
    "ebook-overdrive": 8,
    "audiobook-overdrive": 9,
    "video-streaming": 10,
    "ebook-epub-open": 11
}

session = sessionmaker(bind=CONN)()

def run():
    t0 = time.time()
    for i, path in enumerate(glob.glob("./extractor/response_data/*.json")):
        process_file(path)
        print "Elapsed time after {} files is {}".format(i, time.time() - t0)

def process_file(path):
    with open(path, 'r') as fp:
        data = json.load(fp)
    lib_id = LIBRARY_MAP[data["id"]]
    for i, p in enumerate(data["products"]):
        store_product(p, lib_id)

def store_product(p, lib_id):
    book, _ = get_or_create(session, Book, **dict(
        overdrive_id=p["id"],
        media_type=p.get("mediaType"),
        title=p.get("title"),
        series=p.get("series"),
        subtitle=p.get("subtitle"),
        sort_title=p.get("sortTitle"),
        primary_creator_role=p.get("primaryCreator", {}).get("role"),
        primary_creator_name=p.get("primaryCreator", {}).get("name"),
        img_thumbnail=p.get("images", {}).get("thumbnail", {}).get("href"),
        img_cover_150_wide=p.get("images", {}).get("cover150Wide", {}).get("href"),
        img_cover=p.get("images", {}).get("cover", {}).get("href"),
        img_cover_300_wide=p.get("images", {}).get("cover300Wide", {}).get("href"),
    ))
    l_book = LibraryBook(
        book=book,
        library_id=lib_id,
        date_added=p.get("dateAdded"),
        star_rating=p.get("starRating"),
        overdrive_href=p.get("contentDetails", [{}])[0].get("href"),
        response=p,
    )
    for format in p.get("formats", []):
        f_id = FORMAT_MAP[format["id"]]
        session.add(BookFormat(book=book, format_id=f_id))

    # print "Storing book {}".format(book.overdrive_id)
    session.add(l_book)
    session.add(book)
    session.commit()

def get_or_create(session, model, defaults=None, **kwargs):
    instance = session.query(model).filter_by(**kwargs).first()
    if instance:
        return instance, False
    else:
        params = dict((k, v) for k, v in kwargs.iteritems() if not isinstance(v, ClauseElement))
        params.update(defaults or {})
        instance = model(**params)
        session.add(instance)
        return instance, True

if __name__ == "__main__":
    run()

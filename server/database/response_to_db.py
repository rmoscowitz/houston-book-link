"""
One off script to insert response data into postgres
"""
import os
import json
import glob

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from models import Library, Book, BookFormat, Format

"""
{
  "primaryCreator": {
    "role": "Author",
    "name": "Homer"
  },
  "dateAdded": "2013-11-25T18:00:00-05:00",
  "links": {
    "self": {
      "href": "http://api.overdrive.com/v1/collections/v1L1BLQAAAA2p/products/f3b6716c-b1f5-4fea-a63c-906aa6f6de1a",
      "type": "application/vnd.overdrive.api+json"
    },
    "availability": {
      "href": "http://api.overdrive.com/v1/collections/v1L1BLQAAAA2p/products/f3b6716c-b1f5-4fea-a63c-906aa6f6de1a/availability",
      "type": "application/vnd.overdrive.api+json"
    },
    "metadata": {
      "href": "http://api.overdrive.com/v1/collections/v1L1BLQAAAA2p/products/f3b6716c-b1f5-4fea-a63c-906aa6f6de1a/metadata",
      "type": "application/vnd.overdrive.api+json"
    }
  },
  "title": "The  <I>Odyssey</I>",
  "series": "Johns Hopkins New Translations from Antiquity",
  "formats": [
    {
      "id": "ebook-epub-adobe",
      "name": "Adobe EPUB eBook"
    },
    {
      "id": "ebook-overdrive",
      "name": "OverDrive Read"
    }
  ],
  "mediaType": "eBook",
  "starRating": 4.2,
  "contentDetails": [
    {
      "account": {
        "id": 1356,
        "name": "Houston Area Digital Media Catalog (TX)"
      },
      "href": "http://hadc.lib.overdrive.com/ContentDetails.htm?ID=f3b6716c-b1f5-4fea-a63c-906aa6f6de1a",
      "type": "text/html"
    }
  ],
  "sortTitle": " Odyssey",
  "images": {
    "cover150Wide": {
      "href": "https://img1.od-cdn.com/ImageType-150/3161-1/F3B/671/6C/{F3B6716C-B1F5-4FEA-A63C-906AA6F6DE1A}Img150.jpg",
      "type": "image/jpeg"
    },
    "cover300Wide": {
      "href": "https://img1.od-cdn.com/ImageType-400/3161-1/F3B/671/6C/{F3B6716C-B1F5-4FEA-A63C-906AA6F6DE1A}Img400.jpg",
      "type": "image/jpeg"
    },
    "cover": {
      "href": "https://img1.od-cdn.com/ImageType-100/3161-1/{F3B6716C-B1F5-4FEA-A63C-906AA6F6DE1A}Img100.jpg",
      "type": "image/jpeg"
    },
    "thumbnail": {
      "href": "https://img1.od-cdn.com/ImageType-200/3161-1/{F3B6716C-B1F5-4FEA-A63C-906AA6F6DE1A}Img200.jpg",
      "type": "image/jpeg"
    }
  },
  "id": "f3b6716c-b1f5-4fea-a63c-906aa6f6de1a"
}
"""

LIBRARY_MAP = {
    "v1L1BLQAAAA2p": 1,
    "v1L1BQAAAAA2e": 2
}


USER = "dylan"
PASSWORD = ""
DBNAME = "mydb"
CONN = create_engine("postgresql+psycopg2://{}:{}@/{}".format(USER, PASSWORD, DBNAME))
session = sessionmaker(bind=CONN)()

def run():
    for path in glob.glob("../../extractor/response_data/*.json"):
        process_file(path)

def process_file(path):
    with open(path, 'r') as fp:
        data = json.load(fp)
    lib_id = LIBRARY_MAP[data["id"]]
    for p in data["products"]:
        store_product(p, lib_id)

def store_product(p, lib_id):
    book = Book(
        overdrive_id=p["id"],
        media_type=p.get("mediaType"),
        title=p.get("title"),
        series=p.get("series"),
        subtitle=p.get("subtitle"),
        sort_title=p.get("sortTitle"),
        primary_creator_role=p.get("primaryCreator", {}).get("role"),
        primary_creator_name=p.get("primaryCreator", {}).get("name"),
        star_rating=p.get("starRating"),
        date_added=p.get("dateAdded"),
        overdrive_href=p.get("contentDetails", [{}])[0].get("href"),
        img_thumbnail=p.get("images", {}).get("thumbnail", {}).get("href"),
        img_cover_150_wide=p.get("images", {}).get("cover150Wide", {}).get("href"),
        img_cover=p.get("images", {}).get("cover", {}).get("href"),
        img_cover_300_wide=p.get("images", {}).get("cover300Wide", {}).get("href"),
        response=p,
        library_id=lib_id
    )
    print "Storing book {}".format(book.overdrive_id)
    session.add(book)
    session.commit()






if __name__ == "__main__":
    run()
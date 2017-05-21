from sqlalchemy import create_engine

from models import Base
from db_config import CONN


Base.metadata.drop_all(CONN)
Base.metadata.create_all(CONN)

# libs
CONN.execute("INSERT INTO libraries (overdrive_id, name, collection_token) VALUES (1356, 'Houston Area Digital Media Catalog (TX)', 'v1L1BLQAAAA2p')")
CONN.execute("INSERT INTO libraries (overdrive_id, name, collection_token) VALUES (1172, 'Harris County Public Library (TX)', 'v1L1BQAAAAA2e')")

# formats
CONN.execute("INSERT INTO formats (key, label) VALUES ('ebook-pdf-adobe', 'Adobe PDF eBook')")
CONN.execute("INSERT INTO formats (key, label) VALUES ('ebook-mediado', 'MediaDo eBook')")
CONN.execute("INSERT INTO formats (key, label) VALUES ('periodicals-nook', 'NOOK Periodical')")
CONN.execute("INSERT INTO formats (key, label) VALUES ('ebook-epub-adobe', 'Adobe EPUB eBook')")
CONN.execute("INSERT INTO formats (key, label) VALUES ('ebook-kindle', 'Kindle Book')")
CONN.execute("INSERT INTO formats (key, label) VALUES ('audiobook-mp3', 'OverDrive MP3 Audiobook')")
CONN.execute("INSERT INTO formats (key, label) VALUES ('ebook-pdf-open', 'Open PDF eBook')")
CONN.execute("INSERT INTO formats (key, label) VALUES ('ebook-overdrive', 'OverDrive Read')")
CONN.execute("INSERT INTO formats (key, label) VALUES ('audiobook-overdrive', 'OverDrive Listen')")
CONN.execute("INSERT INTO formats (key, label) VALUES ('video-streaming', 'Streaming Video')")
CONN.execute("INSERT INTO formats (key, label) VALUES ('ebook-epub-open', 'Open EPUB eBook')")



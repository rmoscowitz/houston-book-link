"""
Extractor for overdrive API.

Usage:
  main.py

Options:
...
"""
import json
import math
import os
import requests


COLLECTIONS = ["v1L1BQAAAAA2e", "v1L1BLQAAAA2p"]
BASE = "https://api.overdrive.com/v1/collections/{collection}/products?limit=300&offset={offset}"
HEADERS = {
    "User-Agent": "MOSCOWITZTX",
    "Authorization": "Bearer {}".format(os.environ["OVERDRIVE_AUTH_TOKEN"])
}
OFFSET_SCALAR = 300

def run():
    for c in COLLECTIONS:
        scrape_collection(c)

def scrape_collection(token):
    print "Scraping collection {}".format(token)
    init = do_request(token, 0)
    total = init["totalItems"]
    req_num = 1
    while math.ceil(total/300) > req_num:
        print req_num
        do_request(token, req_num)
        req_num += 1

def do_request(token, req_num):
    resp = requests.get(request_url(token, req_num), headers=HEADERS).json()
    write_response(req_num, resp, token)
    return resp

def request_url(token, n):
    return BASE.format(collection=token, offset=OFFSET_SCALAR*n)

def write_response(n, out, token):
    fn = "response_data/{}_{}.json".format(token, n)
    with open(fn, 'w') as fp:
        fp.write(json.dumps(out))
    print "Wrote: {}".format(fn)

if __name__ == "__main__":
    run()

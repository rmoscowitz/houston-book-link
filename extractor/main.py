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
    "Authorization": "Bearer AAEAAGch55ePvsd_HtZjkEV_CyYUskF-jYux8u8oe92_MnbuHQ_0HtqKhndJrdYpxeYvhZm0drcZ8UvT_KCaHvxW8L0wEm74i0NXpgO4WeU_GkrHMSX09QJJAers6CrOLYjZSzLkvqdtlPZ2r38UijN4rIcO9fzppC8rkwcrDLimPfjNUFuEIxsKyE0zpXyFpylBQpAF4ocY_YVqh2tPR5sumFCKJ3q5BPqLhQS_l6VO-4X5bB-SQ2_Dll7s6JFRtfqvlkObPq9SNqEdRt5KUe82mIGCkXpNtmjuu4IkxFu0UhzYA5ghAq7zTC9YqYx6vsDXR0Un9mBWS5aVvJPTHqe-hJuEAQAAAAEAADaSXqAxUfQnjpE2AyrMLNxNzPDtb9hmg_WC9bUbwav3jIbH3giQeXcqZJsgA16ABEJnQi4ZcHB56xtCdia-Edc6wCH_HQuPxjKbdHG5z1Da-SAWUcHCuosFoRlWulR7GstR-R0YvnzZt8deCKbHlBqeoyH7DAu3v616vIatwyyc74wQSKHnhQo8Z8g4VkJ2QyQ9Jric64zIu0Ssxp0zDqFZLMfEZZFUAi5NBElhGZhePMeW6nhMVtqgpef_Anq-LKuHWPMXR-UHdLH43oQSIGJ-esSRq8-mLUT-XFYOZh8_QTfSSAiANC6QPi5tteJ5aoMHchZ2peebRSV7xeE0KOo5D_WUxuoP0qeiFLJ9mUQPVbkVg_HushkMHQhPl6vElFINEJq3I__UpYVxcdPvSk9Dk5fP7zxMrSl6K4fxC8GDgzg65SztDpavYLSbetCEJJ8-GptZDaamTYj6aKIHPPJJkxYZfLkidmINVUKubnifgoikJMcC9O5pRdvLhFgyUw"
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

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
    "Authorization": "Bearer AAEAAHeljz9D6yZ3M8ThkVFvv6WXELufrbg_wtgOt5j9D1l6xS4jrBvs3_yWi-WViHzhpsk_83_aN-0EyKA52JUS6Bezvvgj_hop__kMNMLMEYPgTS9eph8cGLFUu9CS8VPtaPwtGkhuZADH0_XT5OW3GNE6qMTq268RQlfhK9pCkGYkc8bzuja_BgOroXfkDjPBxvshbTzD05nKQxXkMGp3raIf3ITzjiGdbI7MR43QdBaHoavkmJ2fFRWr59AeEdU-rnvIYPaKfYJXOx25aNWHEOXnbyVE6hPaxaH4BWkkBGY-ohTQZFYCcTpZSt4pHwOyDFxD1fXzSA-sxN6TPNYcQg-EAQAAAAEAAK2fmbJGQ1a2cipKQhUSWf0D0NwU761wasX9M2JesgX029M3yCL2plZfRVF_vq4qg546Frb8Jv53W60S3PFI95k5jTNdBEkrASDRtWUwKlnRwg3cTKt2GFMsgLUyo30-Dy1BWZ62IcaPtZ8tigIPar1Cu5WotLZv2YeENKEetaCqhamVLXHW-Sz9sxbKRiDhf_CCHzjc_PMHeioVz9Qj8PuPOhtvuH6f0iLCLg7gc9T9c96dWKe632P6fNRetLGxxAVq0bVxGCCcRq2rf3LKhwOEA3NnajLWwJcAN4zbpIz1Prxhx029RIHOugEgFyZy_pWSRd92Xsx0WjDGyGFFayVkYSoITzJQgSkT44oeL1DzyPXodLhTMHdceZrJBXL0x2mNsCBJARLBSDlENOvYu3bzLUyRWpUS3VlKsQ2SQ67-mq-AGSUgBPMyrLJ9wyt2lx0Ce-rPwZ2v322HlZwhnQFEMsSFpQXhoyrWutdqe2pSPYmB_4fqmkn5x3GfJ0NICg"
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
    write_response(req_num, resp)
    return resp

def request_url(token, n):
    return BASE.format(collection=token, offset=OFFSET_SCALAR*n)



def write_response(n, out):
    with open("response_data/{}.json".format(n), 'w') as fp:
        fp.write(json.dumps(out))

if __name__ == "__main__":
    run()
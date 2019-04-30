#!/usr/bin/env python3

from bs4 import BeautifulSoup
import requests
import sys
import json

with requests.get(sys.argv[1]) as req:
    soup = BeautifulSoup(req.content)
    recipe = json.loads(soup.find('script', type='application/ld+json').text)
    print(recipe)
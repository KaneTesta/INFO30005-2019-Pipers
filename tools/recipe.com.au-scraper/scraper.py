#!/usr/bin/env python3

from bs4 import BeautifulSoup
import requests
import sys

with requests.get(sys.argv[1]) as req:
    soup = BeautifulSoup(req.content)
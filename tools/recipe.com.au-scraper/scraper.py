#!/usr/bin/env python3

from bs4 import BeautifulSoup
import requests
import sys
import json

base = 'https://www.taste.com.au'

def get_recipe(url):
    req = requests.get(url)
    soup = BeautifulSoup(req.content)
    recipe = json.loads(soup.find('script', type='application/ld+json').text)
    return recipe


def get_recipes(page):
    url = base + f"/search-recipes/?page={page}&q=main&sort=rating"
    req = requests.get(url)
    soup = BeautifulSoup(req.content)
    figures = soup.find_all('figure', class_='list-image-block')
    links = []
    for f in figures:
        links.append(base + f.a['href'])
    return links

for r in get_recipes(1):
    print(get_recipe(r))
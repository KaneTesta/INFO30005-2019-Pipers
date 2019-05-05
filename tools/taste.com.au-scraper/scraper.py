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
    ingredients = json.loads(soup.find('script', type='application/json').text)
    notes = ""
    notes = soup.find('section', class_='recipe-notes collapsible-text-box')
    if notes:
        notes = notes.div.text.strip()
    return {'recipe': recipe, 'ingredients': ingredients, 'notes': notes}


def get_recipes(page, query):
    url = base + f"/search-recipes/?page={page}&q={query}&sort=rating"
    req = requests.get(url)
    soup = BeautifulSoup(req.content)
    figures = soup.find_all('figure', class_='list-image-block')
    links = []
    for f in figures:
        links.append(base + f.a['href'])
    return links

def grab(page_range, query, outputfile):
    links = []
    for i in page_range:
        links.extend(get_recipes(i, query))

    print(links)
    r = []
    for link in links:
        r.append(get_recipe(link))

    with open(outputfile, 'w') as file:
        json.dump(r, file)

#grab(list(range(1, 10+1)), 'main', 'test.json')

import json
import re

r = re.compile(r'Refrigerator: (.*)')
t = re.compile(r'Tip: (.*)')
p = re.compile(r'Pantry: (.*)')


with open('fruit_and_veggie_storage.txt') as file:
    text = file.read().split('\n\n')
    out = {}
    for line in text:
        ingredient = line.split('\n')[0]
        tip = t.search(line)
        if tip:
            tip = tip.group(1)
        fridge = r.search(line)
        if fridge:
            fridge = fridge.group(1)
        pantry = p.search(line)
        if pantry:
            pantry = pantry.group(1)
        out[ingredient] = {'tip':tip, 'fridge': fridge, 'pantry': pantry}
    print(json.dumps(out))

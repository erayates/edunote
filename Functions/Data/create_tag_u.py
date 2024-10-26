import google.generativeai as genai
import json
import sys
sys.path.append('API/Secrets')
sys.path.append('API/app')
from loaders import Loaders # type: ignore
import KEY # type: ignore
import csv

genai.configure(api_key=KEY.GEMINI_API_KEY)

def generate_tags():
    tags = []
    
    file_path = 'Test/world-universities.csv'

    universities = []
    with open(file_path, mode='r') as file:
        csv_reader = csv.reader(file)
        for row in csv_reader:
            university_name = row[1]
            universities.append(university_name)    
    
    for uni_name in universities:

        tag = {
            "name": uni_name,
            "slug": uni_name.lower().replace(' ', '-')
        }

        tags.append(tag)

    return tags


tags = generate_tags()
with open("tags.json", "w") as file:
    json.dump(tags, file, indent=4)

print("Realistic notes generated and saved to 'tags.json'.")

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
    
    faculty_names = [
        "Faculty of Engineering",
        "Faculty of Arts and Humanities",
        "Faculty of Science",
        "Faculty of Medicine",
        "Faculty of Business and Economics",
        "Faculty of Law",
        "Faculty of Social Sciences",
        "Faculty of Education",
        "Faculty of Health Sciences",
        "Faculty of Information Technology",
        "Faculty of Environmental Studies",
        "Faculty of Architecture and Design",
        "Faculty of Agriculture",
        "Faculty of Pharmacy",
        "Faculty of Dentistry",
        "Faculty of Nursing",
        "Faculty of Music and Fine Arts",
        "Faculty of Veterinary Medicine",
        "Faculty of Political Science and International Relations",
        "Faculty of Communication"
    ]  
    
    for faculty_name in faculty_names:

        tag = {
            "name": faculty_name,
            "slug": faculty_name.lower().replace(' ', '-')
        }

        tags.append(tag)

    return tags


faculties = generate_tags()
with open("faculties.json", "w") as file:
    json.dump(faculties, file, indent=4)

print("Realistic notes generated and saved to 'faculties.json'.")

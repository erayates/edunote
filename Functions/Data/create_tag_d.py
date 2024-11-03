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
    
    department_names = [
        "Department of Civil Engineering",
        "Department of Mechanical Engineering",
        "Department of Electrical Engineering",
        "Department of Computer Engineering",
        "Department of Chemical Engineering",
        "Department of Industrial Engineering",
        "Department of History",
        "Department of Philosophy",
        "Department of Literature",
        "Department of Languages",
        "Department of Archaeology",
        "Department of Sociology",
        "Department of Physics",
        "Department of Chemistry",
        "Department of Biology",
        "Department of Mathematics",
        "Department of Earth Sciences",
        "Department of Medicine",
        "Department of Business Administration",
        "Department of Economics",
        "Department of Law",
        "Department of Psychology",
        "Department of Education",
        "Department of Nursing",
        "Department of Health Sciences",
        "Department of Information Technology",
        "Department of Environmental Studies",
        "Department of Architecture",
        "Department of Design",
        "Department of Agriculture",
        "Department of Pharmacy",
        "Department of Dentistry",
        "Department of Music",
        "Department of Fine Arts",
        "Department of Veterinary Medicine",
        "Department of Political Science",
        "Department of International Relations",
        "Department of Communication"
    ]
    
    for department_name in department_names:

        tag = {
            "name": department_name,
            "slug": department_name.lower().replace(' ', '-')
        }

        tags.append(tag)

    return tags


department_names = generate_tags()
with open("department_names.json", "w") as file:
    json.dump(department_names, file, indent=4)

print("Realistic notes generated and saved to 'department_names.json'.")

import google.generativeai as genai
import json
import sys
sys.path.append('API/Secrets')
sys.path.append('API/app')
from loaders import Loaders # type: ignore
import KEY # type: ignore
import uuid
from datetime import datetime
import random,time
import random

# Further expanded keyword groups
actions = [
    "Exploring methods in",
    "Understanding concepts of",
    "Developing strategies for",
    "Analyzing implications of",
    "Creating solutions in",
    "Investigating trends in",
    "Designing frameworks for",
    "Evaluating effectiveness of",
    "Implementing approaches to",
    "Harnessing advancements in",
    "Optimizing processes in",
    "Leveraging technology for",
    "Integrating systems for",
    "Assessing impact of",
    "Facilitating collaboration in",
    "Enhancing experiences in",
    "Promoting awareness of",
    "Fostering innovation in",
    "Supporting practices for",
    "Exploring the future of"
]

subjects = [
    "Cloud Storage Impact",
    "Machine Learning in Healthcare",
    "Historical Battle Strategies",
    "Discoveries in Astronomy",
    "Classroom Learning Techniques",
    "Cybersecurity Practices",
    "Data Visualization Techniques",
    "Blockchain in Finance",
    "Ethics in AI",
    "Sustainable Urban Practices",
    "IoT in Smart Cities",
    "Renewable Energy Trends",
    "AI in Everyday Life",
    "Mobile App Development",
    "Virtual Reality in Education",
    "Big Data Analytics",
    "E-commerce Strategies",
    "Social Media Marketing",
    "Digital Transformation",
    "Workplace Health Innovations"
]

contexts = [
    "in web applications",
    "for defense capabilities",
    "in historical events",
    "to promote science",
    "in education",
    "in business intelligence",
    "for healthcare services",
    "in digital transformation",
    "for sustainability",
    "in global exchanges",
    "in public policy",
    "for innovation in startups",
    "in supply chains",
    "for community engagement",
    "in social media",
    "for project management",
    "to improve customer experience",
    "in remote work environments",
    "to drive growth",
    "for public health"
]

modifiers = [
    "addressing challenges",
    "highlighting trends",
    "focusing on principles",
    "considering ethics",
    "exploring solutions",
    "identifying risks",
    "emphasizing collaboration",
    "discussing future directions",
    "assessing growth opportunities",
    "examining best practices",
    "proposing frameworks",
    "evaluating engagement impacts",
    "considering perspectives",
    "investigating case studies",
    "proposing insights",
    "evaluating metrics"
]

def create_varied_dataset(num_entries):
    dataset = []
    for _ in range(num_entries):
        action = random.choice(actions)
        subject = random.choice(subjects)
        context = random.choice(contexts)
        modifier = random.choice(modifiers)
        
        # Randomly decide if the entry should be shorter or longer
        if random.random() < 0.8:  # 50% chance for a shorter entry
            row = f"{action} {subject} - {modifier}"
        else:
            row = f"{action} {subject} {context} - {modifier}"
        
        dataset.append(row)
    return dataset

genai.configure(api_key=KEY.GEMINI_API_KEY)

def generate_realistic_notes(num_notes=2):
    notes = []
    retry_delay = 1  # Initial delay
    max_retries = 5  # Max retry attempts
    users = []

    for n in range(int(num_notes/5)):
        users.append(str(uuid.uuid4()))
    
    topics = create_varied_dataset(num_notes)
    
    for n in range(num_notes):
        try:
            model = Loaders.config_model(model_name='gemini-1.5-flash')

            title = topics[n]

            time.sleep(4)
            description = model.generate_content(
                f"Generate me a short description of a couple (2-3) of sentences of this title : {title}. Only give the topic as description."
            ).text
            time.sleep(4)

            content = model.generate_content(
                f"Generate me simple content (something like taken notes by a person) for this title : {title} and description : {description}. Only give the topic as content."
            ).text

            note = {
                "title": title,
                "content": content,
                "description": description,
                "is_public": bool(random.getrandbits(1)),
                "share_link": "Generated by Gemini-pro",
                "user_id": random.choice(users),
                "group_ids": [],
                "tag_ids": [str(uuid.uuid4()) for _ in range(random.randint(1, 5))],
                "favorited_by_ids": [str(uuid.uuid4()) for _ in range(random.randint(0, 5))],
                "created_at": datetime.now().isoformat(),
                "updated_at": datetime.now().isoformat(),
                "deleted_at": None
            }

            print(title, description)

            notes.append(note)
            retry_delay = 1

        except Exception as e:
            print(f"Error encountered: {e}. Retrying in {retry_delay} seconds...")
            time.sleep(retry_delay)
            retry_delay = min(retry_delay * 2, 30)

    return notes


realistic_notes = generate_realistic_notes(500)
with open("Functions/Data/realistic_notes_3.json", "w") as file:
    json.dump(realistic_notes, file, indent=4)

print("Realistic notes generated and saved to 'realistic_notes.json'.")
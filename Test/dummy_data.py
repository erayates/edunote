from faker import Faker
import random
import json
import uuid
from datetime import datetime
from random import choice

fake = Faker()

def generate_dummy_note_data(num_notes=1000):
    user_ids = []
    for _ in range(30):
        user_ids.append(str(uuid.uuid4()))
    
    notes = []

    for _ in range(num_notes):
        keyword = fake.word()  # Generate a keyword for relevance

        note = {
            "title": f"{keyword.capitalize()}: {fake.sentence(nb_words=5)}",
            "content": f"This note is about {keyword}. " + fake.paragraph(nb_sentences=10),
            "description": f"(Test) Summary about {keyword}. " + fake.paragraph(nb_sentences=5),
            "is_public": fake.boolean(),
            "share_link": "Test",
            "user_id": choice(user_ids),
            "group_ids": [],
            "tag_ids": [str(uuid.uuid4()) for _ in range(random.randint(1, 5))],
            "favorited_by_ids": [str(uuid.uuid4()) for _ in range(random.randint(0, 5))],
            "created_at": datetime.now().isoformat(),
            "updated_at": datetime.now().isoformat(),
            "deleted_at": None if random.choice([True, False]) else datetime.now().isoformat()
        }
        notes.append(note)

    return notes

# Generate 1000 notes and save to a JSON file
dummy_notes = generate_dummy_note_data(1000)
with open("dummy_notes.json", "w") as file:
    json.dump(dummy_notes, file, indent=4)

print("Dummy data for notes generated and saved to 'dummy_notes.json'.")

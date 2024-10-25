from faker import Faker
import random
import json
import uuid
from datetime import datetime

fake = Faker()

def generate_dummy_note_data(num_notes=1000):
    notes = []

    for _ in range(num_notes):
        keyword = fake.word()  # Generate a keyword for relevance

        note = {
            "_id": str(uuid.uuid4()),
            "title": f"{keyword.capitalize()}: {fake.sentence(nb_words=5)}",
            "content": f"This note is about {keyword}. " + fake.paragraph(nb_sentences=10),
            "description": f"Summary about {keyword}. " + fake.paragraph(nb_sentences=5),
            "slug": fake.slug(),
            "is_public": fake.boolean(),
            "share_link": fake.url() if random.choice([True, False]) else None,
            "user_id": str(uuid.uuid4()),
            "group_ids": [str(uuid.uuid4()) for _ in range(random.randint(1, 3))],
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

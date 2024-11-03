from bson.objectid import ObjectId
import sys, random
sys.path.append('Functions/Data')
import KEY # type: ignore
from faker import Faker

fake = Faker()

def random_paragraph(min_sentences=1, max_sentences=15):
    # Generate a random number of sentences for the paragraph
    num_sentences = fake.random_int(min=min_sentences, max=max_sentences)
    return fake.paragraph(nb_sentences=num_sentences)

def load_note():
    tags = KEY.TAGS.find()
    tag_ids = [ObjectId(str(tag['_id'])) for tag in tags]
    return tag_ids

# Define your new tag_ids and description logic
def update_fields():
    tags = load_note()
    new_tag_ids = []
    for _ in range(random.randint(1, 5)):
        new_tag_ids.append(random.choice(tags))
    # Example: Modify description and tag_ids here
    new_description = random_paragraph()
    
    return {
        "tag_ids": new_tag_ids,
        "description": new_description
    }

# Find all notes in the collection
notes = KEY.NOTES.find()

total = KEY.NOTES.count_documents({})  # Counts all documents in the collection

print(f"Total notes: {total}")

# Loop through each note and update fields
for index, note in enumerate(notes):
    percent = (index / total)
    filled_length = int(40 * percent)
    bar = '█' * filled_length + '-' * (40 - filled_length)
    update_data = update_fields()
    
    # Update the note in the database
    KEY.NOTES.update_one(
        {"_id": note["_id"]},  # Find the note by its _id
        {"$set": update_data}   # Set the updated fields
    )
    
        
    prefix = 'Loading: '
    sys.stdout.write(f'\r{prefix} |{bar}| {percent:.2%}')
    sys.stdout.flush()

# Close the connection
KEY.MONGO_CLIENT.close()

print("All notes have been updated.")

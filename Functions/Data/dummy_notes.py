import json
import pandas as pd
import sys
sys.path.append('API/Secrets')
sys.path.append('Functions/Data')
from datetime import datetime
import random
from KEY import *

def load_note():
    users = USERS.find()
    tags = TAGS.find()
    user_ids = [str(user['_id']) for user in users]
    tag_ids = [str(tag['_id']) for tag in tags]
    return user_ids, tag_ids

def create_article_dataset():
    file_path = 'Functions/Data/Articles.csv'

    # Read the CSV file
    df = pd.read_csv(file_path, encoding='ISO-8859-1')

    df_filtered = df[df["Heading"].notnull() & df["NewsType"].notnull() & df["Article"].notnull() &
                    (df["Heading"] != "") & (df["NewsType"] != "") & (df["Article"] != "")]

    # Create list of dictionaries with Article, Heading, and NewsType
    list_of_dicts = df_filtered[["Article", "Heading", "NewsType"]].to_dict(orient="records")

    for data in list_of_dicts:
        data['Article'] = data["Article"].replace('\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n', '').replace('              ', '')

    new_list_of_dicts = [
        {
            'content': item['Article'],
            'title': item['Heading'],
            'description': item['NewsType']
        }
        for item in list_of_dicts
    ]

    return new_list_of_dicts

def create_test_dataset():
    file_path = 'Functions/Data/test.csv'

    # Read the CSV file
    df = pd.read_csv(file_path, encoding='ISO-8859-1')

    df_filtered = df[df["TITLE"].notnull() & df["ID"].notnull() & df["ABSTRACT"].notnull() &
                    (df["TITLE"] != "") & (df["ID"] != "") & (df["ABSTRACT"] != "")]

    # Create list of dictionaries with ABSTRACT, TITLE, and ID
    list_of_dicts = df_filtered[["ABSTRACT", "TITLE", "ID"]].to_dict(orient="records")

    for data in list_of_dicts:
        data['ABSTRACT'] = data["ABSTRACT"].replace('\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n', '').replace('              ', '')

    new_list_of_dicts = [
        {
            'content': item['ABSTRACT'],
            'title': item['TITLE'],
            'description': item['ID']
        }
        for item in list_of_dicts
    ]

    return new_list_of_dicts

def generate_realistic_notes(notes: list[dict], users: list[str], tags: list[str]):
    collected_note = []
    for note in notes:
        random_tags = []
        for _ in range(random.randint(0, 5)):
            random_tags.append(random.choice(tags))

        random_favorited = []
        for _ in range(random.randint(0, 5)):
            random_favorited.append(random.choice(users))

        note = {
            "title": str(note['title']),
            "content": str(note['content']),
            "description": str(note['description']),
            "is_public": bool(random.getrandbits(1)),
            "share_link": "TEST",
            "user_id": random.choice(users),
            "group_ids": [],
            "tag_ids": random_tags,
            "favorited_by_ids": random_favorited,
            "created_at": datetime.now().isoformat(),
            "updated_at": datetime.now().isoformat()
        }

        collected_note.append(note)
    print(len(collected_note))

    return collected_note

users, tags = load_note()

notes = create_test_dataset() + create_article_dataset()

realistic_notes = generate_realistic_notes(notes, users=users, tags=tags)
with open("Functions/Data/extracted_notes.json", "w") as file:
    json.dump(realistic_notes, file, indent=4)

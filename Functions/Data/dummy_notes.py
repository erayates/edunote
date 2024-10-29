import json
import pandas as pd
import sys
from datetime import datetime
import random
sys.path.append('Functions/Data')
import KEY # type: ignore
import re, pytz, string, requests
from bson.objectid import ObjectId
import time
import sys

def generate_id(length=24):
    # Generate a random 24-character hex string
    return ''.join(random.choices('0123456789abcdef', k=length))

def remove_non_english_chars(text):
    # This pattern matches any character that is not a basic Latin character (ASCII)
    return re.sub(r'[^\x00-\x7F]+', '', text)

def thumbnail_list(total = 100):
    urls = []
    for index in range(total):
        percent = (index / total)
        filled_length = int(40 * percent)
        bar = '█' * filled_length + '-' * (40 - filled_length)
        
        prefix = 'Creating Thumbnail List: '
        sys.stdout.write(f'\r{prefix} |{bar}| {percent:.2%}')
        sys.stdout.flush()        
        response = requests.get("https://picsum.photos/640/640")
        urls.append(response.url)
    print()
    return urls

def load_note():
    users = KEY.USERS.find()
    tags = KEY.TAGS.find()
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
    total = len(notes)
    thumbnails = thumbnail_list()
    for index, note in enumerate(notes):
        percent = (index / total)
        filled_length = int(40 * percent)
        bar = '█' * filled_length + '-' * (40 - filled_length)
        
        prefix = 'Realistic Notes: '
        sys.stdout.write(f'\r{prefix} |{bar}| {percent:.2%}')
        sys.stdout.flush()
        
        random_tags = []
        for _ in range(random.randint(0, 5)):
            random_tags.append(ObjectId(random.choice(tags)))

        random_favorited = []
        for _ in range(random.randint(0, 5)):
            random_favorited.append(random.choice(users))

        id = ObjectId(generate_id())
        thumbnail = random.choice(thumbnails)     

        note = {
            "_id": id,
            "title": str(note['title']),
            "content": str(note['content']),
            "description": str(note['description']),
            "is_public": bool(random.getrandbits(1)),
            "share_link": generate_id(length=20),
            "user_id": random.choice(users),
            "group_ids": ['test'],
            "tag_ids": random_tags,
            "thumbnail": thumbnail,
            "favorited_by_ids": random_favorited,
            "createdAt": datetime.now(pytz.utc),
            "updatedAt": datetime.now(pytz.utc),
            "slug": f"{remove_non_english_chars(str(note['title'])).lower().replace(' ', '-').replace('---', '-').replace('--', '-')}-{id}"
        }

        collected_note.append(note)
    percent = 1
    filled_length = int(40 * percent)
    bar = '█' * filled_length + '-' * (40 - filled_length)
    
    prefix = 'Realistic Notes: '
    sys.stdout.write(f'\r{prefix} |{bar}| {percent:.2%}')
    sys.stdout.flush()        
    print()
    return collected_note

users, tags = load_note()

notes = create_test_dataset() + create_article_dataset()

notes = generate_realistic_notes(notes, users, tags)

print(len(notes))

# Connect to MongoDB
collection = KEY.NOTES

# Insert data into MongoDB
collection.insert_many(notes)
import random
import string, sys
sys.path.append('Functions/Data')
from faker import Faker
from datetime import datetime
from datetime import datetime, timezone
import pytz, requests
import KEY # type: ignore

# Initialize Faker for generating random data
faker = Faker()

def generate_user_id(prefix='user_', length=24):
    # Generate a random alphanumeric string of the specified length
    random_string = ''.join(random.choices(string.ascii_letters + string.digits, k=length))
    return f"{prefix}{random_string}"

# Function to create random data entries for MongoDB
def generate_random_data(n):
    data = []
    for _ in range(n):
        id = generate_user_id()
        email = faker.email()
        username = email.split('@')[0]
        fullname = faker.name()
        response = requests.get("https://picsum.photos/64/64")
        avatar = response.url
        role = "USER"
        status = "ACTIVE"
        created_at = datetime.now(pytz.utc)
        updated_at = created_at
        
        entry = {
            "_id": id,
            "email": email,
            "username": username,
            "fullname": f"{fullname} TEST_USER",
            "avatar": avatar,
            "role": role,
            "status": status,
            "createdAt": created_at,
            "updatedAt": updated_at
        }
        data.append(entry)
    return data

# Generate 5 random data entries
random_data = generate_random_data(100)

# Connect to MongoDB
collection = KEY.USERS

# Insert data into MongoDB
collection.insert_many(random_data)

# Print the inserted data
for entry in random_data:
    print(entry)

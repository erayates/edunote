import sys, json
sys.path.append('API')
from KEY import ELASTICSEARCH_CLIENT # type: ignore

client = ELASTICSEARCH_CLIENT

print(client.info())

try:
    results = client.search(q="Just admit")
    results_dict = results.body

    with open("test.json", 'w') as json_file:
        json.dump(results_dict, json_file, indent=4)

    print(f"Results saved to test.json")
except Exception as e:
    print(f"An error occurred: {e}")
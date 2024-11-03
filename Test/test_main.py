import pytest
from fastapi.testclient import TestClient
import os
import sys
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from API.app.loaders import app 

client = TestClient(app)

def test_root():
    
    response = client.get("/")
    assert response.status_code == 200
    assert "Welcome to the Edunote API" in response.json()["message"]

def test_elasticsearch_simple():
    
    response = client.get("/search/simple/", params={"query": "example query"})
    assert response.status_code == 200
    assert "hits" in response.json()

def test_elasticsearch_all():
    
    response = client.get("/search/all/", json={"query": {"match_all": {}}})
    assert response.status_code == 200
    assert "hits" in response.json()

def test_elasticsearch_ask():
    
    body = {
        "query": "example query",
        "user_id": "test_user"
    }
    response = client.get("/search/ask/", json=body)
    assert response.status_code == 200
    assert "hits" in response.json()

def test_file_upload():
    
    body = {
        "user_id": "test_user",
        "if_exists": "replace"
    }
    files = {"files": ("test_file.txt", "This is a test file")}
    response = client.post("/file/upload/", data=body, files=files)
    assert response.status_code == 200
    assert response.json()["success"] == True

def test_file_download():
   
    body = {
        "user_id": "test_user",
        "file_name": "test_file.txt"
    }
    response = client.post("/file/download/", json=body)
    assert response.status_code == 200
    assert response.headers["Content-Disposition"] == "attachment; filename=test_file.txt"

def test_file_extraction():
    
    files = {"file": ("test.pdf", "PDF content", "application/pdf")}
    response = client.post("/file/extract/", files=files)
    assert response.status_code == 200
    assert "text" in response.json()

def test_caption_extraction():
   
    response = client.post("/caption/extract/", json={"youtube_video_id": "video_id"})
    assert response.status_code == 200
    assert "captions" in response.json()

def test_bucket_check():
    
    body = {
        "user_id": "test_user",
        "file_name": "test_file.txt"
    }
    response = client.post("/bucket/check/", json=body)
    assert response.status_code == 200
    assert response.json()["state"] in [0, 1]

def test_gemini_process():
    
    body = {
        "option": "summarize",
        "prompt": "This is a test prompt.",
        "command": "Summarize this content."
    }
    response = client.get("/gemini/", json=body)
    assert response.status_code == 200
    assert response.json()  


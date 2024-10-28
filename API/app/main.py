from fastapi import FastAPI, HTTPException, File, Depends, Request
from fastapi.responses import PlainTextResponse
import google.generativeai as genai
import Secrets.KEY as KEY
import asyncio, requests
import io
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from google.api_core.exceptions import ResourceExhausted
from app.loaders import *

# TODO: MongoDB Tag Propriety Check
# TODO: API Test
# TODO: Elasticsearch Implementation Test

origins = ["*"]

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
model = Loaders.config_model()
genai.configure(api_key=KEY.GEMINI_API_KEY)
prompt_obj = Prompt()
client = KEY.ELASTICSEARCH_CLIENT

@app.post("/search/simple/")
async def elasticsearch_simple(query: str):
    global client
    try:
        response = client.search(q=query)
        return response.body
    except Exception as e:
        raise HTTPException(status_code=404, detail=f"Elasticsearch client error: {str(e)}")

@app.post("/search/all/")
async def elasticsearch_all(body: Request):
    global client
    try:
        response = client.search(body=body)
        return response.body
    except Exception as e:
        raise HTTPException(status_code=404, detail=f"Elasticsearch client error: {str(e)}")

@app.post("/search/ask/")
async def elasticsearch_ask(body: SearchINNotes):
    query = body.query
    user_id = body.user_id
    global client
    try:
        response = client.search(
            body={
                "query": {
                    "bool": {
                        "must": [
                            {"match": {"content": query}}
                        ],
                        "filter": [
                            {"term": {"user_id": user_id}}
                        ]
                    }
                },
                "from": 0,
                "size": 5
            }
        )
        
        messages = [
            {'role': 'user', 'parts': ["You are an AI assistant that takes some notes and a question or a query or else. In the result, you will answer the question with only using the information in the notes provided to you. You will answer me with a string of JSON. Add JSON only the notes you use to answer the query and the answer. So the JSON template is {{'notes': [notes...], 'response': 'response...'}}"]},
            # {'role': 'user', 'parts': [f'{user_query}, Here is the text: {prompt}']}
        ]

        model.generate_content(contents=messages, stream=True)

        return response.body
    except Exception as e:
        raise HTTPException(status_code=404, detail=f"Elasticsearch client error: {str(e)}")

@app.post("/file/upload/")
async def file_upload(body: FileUploadBody = Depends(), files: List[UploadFile] = File(...)):
    return Process.file_upload(body ,files)

@app.post("/file/download/")
async def file_download(body: FileDownloadBody = Depends()):
    user_id = body.user_id
    file_name = body.file_name    

    bucket = Loaders.config_bucket()
    
    destination_file_name = f'{user_id}/{file_name}'
    blob = bucket.blob(destination_file_name)

    # Check if the file exists
    if not blob.exists():
        raise HTTPException(status_code=404, detail=f"File {file_name} not found in bucket.")
    
    try:
        # Download the file as bytes
        file_data = blob.download_as_bytes()

        # Use StreamingResponse to return the file as a response
        return StreamingResponse(io.BytesIO(file_data), media_type="application/octet-stream", headers={
            "Content-Disposition": f"attachment; filename={file_name}"
        })
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"File download failed: {str(e)}")

@app.post("/file/extract/")
async def file_text_extraction(body: FileExtract):
    global model
    url = body.url
    user_id = body.user_id
    try:
        response = requests.get(str(url))
        response.raise_for_status()
    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=400, detail=f"Error downloading file: {e}")

    ext = str(url).split('.')[-1].lower()

    if ext in AUDIO_EXTENSIONS+PDF_EXTENSIONS+IMAGE_EXTENSIONS:
        file_content = io.BytesIO(response.content)
        return StreamingResponse(Process.extract_text(file_content, str(url).replace('https://brnx9rsmvjqlixb6.public.blob.vercel-storage.com/', ''), ext, model, user_id), media_type="text/plain")
    else:
        raise HTTPException(status_code=400, detail="Unsupported file type")

@app.post("/caption/extract/")
async def file_text_extraction(youtube_video_id: str):
    link = f"https://www.youtube.com/watch?v={youtube_video_id}"
    return Loaders.caption_loader(link)

@app.post("/bucket/check/")
async def file_text_extraction(body: FileDownloadBody = Depends()):
    user_id = body.user_id
    file_name = body.file_name    
    bucket = Loaders.config_bucket()
    destination_file_name = f'{user_id}/{file_name}'
    blob = bucket.blob(destination_file_name)
    if blob.exists():
        return {'details': f"{user_id}/{file_name} found.", 'state': 1}
    return {'details': f"{user_id}/{file_name} not found.", 'state': 0}

@app.get("/chat/history/")
async def get_chat_history(user_id: str, note_id: str = 'gemini'):
    return ChatHistory.get_chat_history(user_id=user_id, note_id=note_id)

@app.get("/chat/clear/")
async def clear_chat_history(user_id: str, note_id: str = 'gemini'):
    return ChatHistory.clear_chat_history(user_id=user_id, note_id=note_id)

@app.post("/gemini/", response_class=PlainTextResponse)
async def gemini_process(body: MainBody):
    return StreamingResponse(stream_text(body.option, body.prompt, body.command, body.user_id, body.note_id), media_type="text/plain")

async def stream_text(option: str, text: str, user_query: str, user_id: str, note_id: str):
    global prompt_obj
    text_response = ""
    max_retries = 3
    retry_delay = 0.2
    for attempt in range(max_retries):
        try:
            for chunk in model.generate_content(**prompt_obj.generate_response(user_id=user_id, prompt=text, option=option, note_id=note_id, user_query=user_query), stream=True):
                try:
                    text_response += chunk.text
                    yield chunk.text
                except: 
                    pass
            ChatHistory.update_chat_history(user_id=user_id, propmts=[{"role": "model", "parts": [text_response]}], note_id=note_id)
            break
        except ResourceExhausted as e:
            if attempt < max_retries - 1:
                await asyncio.sleep(retry_delay)
                retry_delay *= 2
            else:
                raise HTTPException(status_code=429, detail="API quota exceeded. Please try again later.") 

@app.get("/")
async def root():
    """Root endpoint providing information about the API."""
    return {
        "message": "Welcome to the Edunote API",
        "description": "This API leverages Gemini by Google to enhance note-taking, file handling, and content generation.",
        "endpoints": {
            "File Operations": {
                "/file/upload/": {
                    "method": "POST",
                    "description": "Upload files to the server.",
                    "parameters": {
                        "user_id": "User ID for tracking the file.",
                        "if_exists": "Replace the file if it already exists.",
                        "files": "List of files to be uploaded."
                    }
                },
                "/file/download/": {
                    "method": "POST",
                    "description": "Download a file from the storage bucket.",
                    "parameters": {
                        "user_id": "User ID for tracking the file.",
                        "file_name": "Name of the file to download."
                    }
                },
                "/file/extract/": {
                    "method": "POST",
                    "description": "Extract text from a file (audio, image, PDF).",
                    "parameters": {
                        "file": "The file from which text will be extracted."
                    }
                },
                "/caption/extract/": {
                    "method": "POST",
                    "description": "Extract captions from a YouTube video.",
                    "parameters": {
                        "youtube_video_id": "The ID of the YouTube video."
                    }
                },
                "/bucket/check/": {
                    "method": "POST",
                    "description": "Check if a file exists in the storage bucket.",
                    "parameters": {
                        "user_id": "User ID for tracking the file.",
                        "file_name": "Name of the file to check."
                    }
                }
            },
            "Elasticsearch Operations": {
                "/search/simple/": {
                    "method": "GET",
                    "description": "Perform a simple search in Elasticsearch.",
                    "parameters": {
                        "query": "Search query string."
                    }
                },
                "/search/all/": {
                    "method": "GET",
                    "description": "Perform a search with a request body in Elasticsearch.",
                    "parameters": {
                        "body": "Request body for the search."
                    }
                },
                "/search/ask/": {
                    "method": "GET",
                    "description": "Perform a filtered search in Elasticsearch based on user notes and queries.",
                    "parameters": {
                        "query": "Search query string.",
                        "user_id": "User ID to filter the search results."
                    }
                }
            },
            "Gemini Operations": {
                "/gemini/": {
                    "method": "GET",
                    "description": "Interact with Gemini AI for text processing and queries.",
                    "parameters": {
                        "option": "Option for processing the text (e.g., summarize, explain, note, etc.).",
                        "prompt": "The text to be processed.",
                        "command": "Specific user command for the text (optional).",
                        "user_id": "User ID for tracking."
                    }
                }
            },
            "Chat History": {
                "/chat/history/": {
                    "method": "GET",
                    "description": "Retrieve chat history for a given user.",
                    "parameters": {
                        "user_id": "User ID to retrieve the chat history."
                    }
                }
            }
        }
    }

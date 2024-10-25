from fastapi import FastAPI, HTTPException, File, Depends
import google.generativeai as genai
from typing import List, Optional
import KEY as KEY
import json, asyncio
from fastapi.responses import StreamingResponse
from google.api_core.exceptions import ResourceExhausted
from app.loaders import *

# TODO: MongoDB Keyword Control
# TODO: 

app = FastAPI()
model = Loaders.config_model()
genai.configure(api_key=KEY.GEMINI_API_KEY)
prompt_obj = Prompt()

async def json_stream(option: str, text: str, user_query: str):
    global prompt_obj
    max_retries = 3
    retry_delay = 0.2
    for attempt in range(max_retries):
        try:
            for chunk in model.generate_content(**prompt_obj.generate_response(text, option, user_query), stream=True):
                chunk_dict = chunk.to_dict()
                json_chunk = json.dumps(dict(chunk_dict), allow_nan=True, skipkeys=True)
                yield json_chunk
            break
        except ResourceExhausted as e:
            if attempt < max_retries - 1:
                await asyncio.sleep(retry_delay)
                retry_delay *= 2
            else:
                raise HTTPException(status_code=429, detail="API quota exceeded. Please try again later.")

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
async def file_text_extraction(file: Optional[UploadFile] = File(None)):
    global model
    ext = file.filename.split('.')[-1].lower()
    return Process.extract_text(file, ext, model)

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

@app.get("/gemini/")
async def gemini_porcess(body: MainBody = Depends()):
    # if body.prompt is None and body.command is None:
    #     raise HTTPException(status_code=000, detail="Required endpoints.")
    return StreamingResponse(json_stream(body.option, body.prompt, body.command), media_type="application/json")

@app.get("/")
async def root():
    """Root endpoint providing information about the API."""
    return {
        "message": "Welcome to the Edunote API",
        "description": "Edunote API leverages Gemini by Google to enhance your note-taking experience.",
        "endpoints": {
            "/file/upload/": {
                "method": "POST",
                "description": "Upload files to the server.",
                "parameters": {
                    "user_id": "User ID for tracking.",
                    "if_exists": "Specify if the file should be replaced if it exists.",
                    "files": "List of files to upload."
                }
            },
            "/file/download/": {
                "method": "POST",
                "description": "Download a file from the storage bucket.",
                "parameters": {
                    "user_id": "User ID for tracking.",
                    "file_name": "Name of the file to check."
                }
            },
            "/file/extract/": {
                "method": "POST",
                "description": "Extract text from a PDF file.",
                "parameters": {
                    "file": "PDF file to extract text from."
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
                    "user_id": "User ID for tracking.",
                    "file_name": "Name of the file to check."
                }
            },
            "/gemini/": {
                "method": "GET",
                "description": "Process prompt and user command.",
                "parameters": {
                    "body": {
                        "prompt": "Provide text to Gemini to use options. Defaults to None.",
                        "command": "Ask AI a question about the content. Defaults to None.",
                        "option": {
                            "user": "Default option. Provide {{commands}}. Feeds Gemini with user query.",
                            "ask": "Provide {{prompt}} and {{commands}} to ask a question about the text.",
                            "explain": "Provide {{prompt}}. Gemini explains the text.",
                            "template": "Provide {{prompt}}. Gemini creates a template of the text.",
                            "summarize": "Provide {{prompt}}. Gemini summarizes the text.",
                            "note": "Provide {{prompt}}. Gemini takes notes for you from the text.",
                            "improve": "Provide {{prompt}}. Gemini improves the text.",
                            "shorter": "Provide {{prompt}}. Gemini shortens the text.",
                            "longer": "Provide {{prompt}}. Gemini lengthens the text.",
                            "continue": "Provide {{prompt}}. Gemini continues the text.",
                            "fix": "Provide {{prompt}}. Gemini fixes the text.",
                            "zap": "Provide {{commands}}. Gemini generates new text from user query."
                        }
                    }
                }
            }
        }
    }

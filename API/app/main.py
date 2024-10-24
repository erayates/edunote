from fastapi import FastAPI, UploadFile, HTTPException # Query, File, 
# from typing import Optional
import google.generativeai as genai
import KEY as KEY
import json, asyncio # fitz, io, 
from google.ai.generativelanguage_v1beta.types import content
# from langchain_community.document_loaders import YoutubeLoader
from fastapi.responses import StreamingResponse
from google.api_core.exceptions import ResourceExhausted
# from time import perf_counter


def config_model():
    generation_config = {
        "temperature": 1,
        "top_p": 0.95,
        "top_k": 64,
        "max_output_tokens": 500,
        "response_schema": content.Schema(
            type=content.Type.STRING
        ),
        "response_mime_type": "text/plain",
    }
    return genai.GenerativeModel(model_name="gemini-1.5-pro", generation_config=generation_config)


app = FastAPI()
model = config_model()
genai.configure(api_key=KEY.GEMINI_API_KEY)

def format_response(prompt):
    global gemini
    response = gemini.generate_content(prompt)
    response = response.to_dict()
    print(response["candidates"][0]["content"]["parts"][0]["text"])
    try:
        response["candidates"][0]["content"]["parts"][0]["text"] = json.loads(response["candidates"][0]["content"]["parts"][0]["text"])
    except json.JSONDecodeError as e:
        print(f"JSON decoding failed: {e}")
    return response

# async def caption_loader(link: str, language: str = "en"):
#     content = ""
#     loader = YoutubeLoader.from_youtube_url(link, add_video_info=True, language=language)

#     try:
#         youtube_data = loader.load()

#         for doc in youtube_data:
#             content += doc.page_content
#         return content

#     except Exception as e:
#         print(f"Error loading video data: {e}")
#         return ""

# async def pdf_loader(file: UploadFile):
#     # Read the content of the uploaded PDF file as bytes
#     pdf_bytes = await file.read()

#     # Check if the file is empty
#     if not pdf_bytes:
#         raise HTTPException(status_code=400, detail="Uploaded PDF file is empty.")

#     # Create a BytesIO stream from the bytes
#     pdf_stream = io.BytesIO(pdf_bytes)

#     # Open the PDF file with PyMuPDF from the BytesIO stream
#     try:
#         pdf_document = fitz.open("pdf", pdf_stream)
#     except Exception as e:
#         raise HTTPException(status_code=400, detail=f"Failed to open PDF: {str(e)}")

#     # Extract text from the PDF
#     extracted_text = ""
#     for page in pdf_document:
#         extracted_text += page.get_text()  # Extract text from each page

#     pdf_document.close()  # Close the document

#     return extracted_text

async def audio_loader(file: UploadFile):
    raise NotImplementedError
    extracted_text: str
    return extracted_text

async def image_loader(file: UploadFile):
    raise NotImplementedError
    extracted_text: str
    return extracted_text

# @app.get("/gemini/")
# async def gemini_process(
#     text: str = None,
#     option: str = None,
#     language: str = None,
#     user_query: str = None,
# ):

#     if text is None and user_query is None:
#         return {"error": "Error occured."}

#     if text.startswith("https://www.youtube.com/watch?v="): text = caption_loader(text, language)

#     query_part = f"({user_query})" if user_query else ''

#     if option:
#         match option:
#             case "summarize":
#                 prompt = f"Please provide a summary of the following text {query_part}: {text}"
#             case "explain":
#                 prompt = f"Please provide an explanation of the following text {query_part}: {text}"
#             case "note":
#                 prompt = f"Please provide a note of the following text {query_part}: {text}"
#     elif user_query:
#         prompt = user_query
#     else:
#         return {"error": "Invalid option."}

#     return format_response(prompt)

app = FastAPI()

async def json_stream(text: str):
    max_retries = 3
    retry_delay = 0.2

    for attempt in range(max_retries):
        try:
            for chunk in model.generate_content(contents=text, stream=True):
                chunk_dict = chunk.to_dict()
                print(chunk_dict)
                print(type(chunk_dict))
                json_chunk = json.dumps(dict(chunk_dict), allow_nan=True, skipkeys=True)
                yield json_chunk
            break
        except ResourceExhausted as e:
            if attempt < max_retries - 1:
                await asyncio.sleep(retry_delay)
                retry_delay *= 2
            else:
                raise HTTPException(status_code=429, detail="API quota exceeded. Please try again later.")

@app.get("/gemini/")
async def gemini(text: str = None, option: str = None, language: str = None, user_query: str = None):
    if text is None and user_query is None:
        raise HTTPException(status_code=000, detail="Can not find required endpoints.")

    # if text and text.startswith("https://www.youtube.com/watch?v="): text = caption_loader(text, language)

    query_part = f"({user_query})" if user_query else ''

    if option:
        match option:
            case "summarize":
                prompt = f"Please provide a summary of the following text {query_part}: {text}"
            case "explain":
                prompt = f"Please provide an explanation of the following text {query_part}: {text}"
            case "note":
                prompt = f"Please provide a note of the following text {query_part}: {text}"
    elif user_query:
        prompt = user_query
    else:
        raise HTTPException(status_code=000, detail="Invalid option.")
    return StreamingResponse(json_stream(prompt), media_type="application/json")

@app.get("/")
async def root():
    return {
        "message": "Edunote API",
        "description": "Edunote API, uses Gemini by Google to present you the best note taking experience.",
        "endpoints": {
            "/gemini/": {
                "method": "get",
                "description": "Process text.",
                "parameters": {
                    "text": "Provide text to Gemini to use options.",
                    "language": "Language for Gemini. (Not implemented yet.)",
                    "option": "Choose an option from 'summarize', 'explain', or 'note'. Defaults to None.",
                    "user_query": "Ask AI a question about the content. Defaults to None.",
                },
                "help": "Provide at least an option (only one: youtube link/text/file) and choose source or a user query (only user query to ask any question) or both." 
            }
        }
    }

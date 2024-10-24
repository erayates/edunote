from fastapi import FastAPI, HTTPException
import google.generativeai as genai
import KEY as KEY
import json, asyncio, sys
sys.path.append('app')
from fastapi.responses import StreamingResponse
from google.api_core.exceptions import ResourceExhausted
from loaders import *

app = FastAPI()
model = Loaders.config_model()
genai.configure(api_key=KEY.GEMINI_API_KEY)
prompt = Prompt()

async def json_stream(option: str, text: str, language: str, user_query: str):
    global prompt
    max_retries = 3
    retry_delay = 0.2
    for attempt in range(max_retries):
        try:
            for chunk in model.generate_content(**prompt.generate_response(text, option, user_query, language), stream=True):
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

@app.get("/gemini/")
async def gemini_porcess(option: str = 'user', text: str = None, language: str = 'English', user_query: str = None):
    if text is None and user_query is None:
        raise HTTPException(status_code=000, detail="Required endpoints.")
    return StreamingResponse(json_stream(option, text, language, user_query), media_type="application/json")

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
                    "text": "Provide text to Gemini to use options. Defaults to None.",
                    "language": "Language of answers. Defaults to 'English'.",
                    "user_query": "Ask AI a question about the content. Defaults to None.",
                    "option": {
                        "user" : "Default option. Provide {{user_query}}. Feeds Gemini with user query.",
                        "ask" : "Provide {{text}} and {{user_query}} to ask a question about the text.",
                        "explain" : "Provide {{text}}. Gemini explains the text.",
                        "summarize" : "Provide {{text}}. Gemini summarizes the text.",
                        "note" : "Provide {{text}}. Gemini takes notes for you from the text.",
                        "improve" : "Provide {{text}}. Gemini improves the text.",
                        "shorter" : "Provide {{text}}. Gemini shorters the text.",
                        "longer" : "Provide {{text}}. Gemini longers the text.",
                        "continue" : "Provide {{text}}. Gemini continues the text.",
                        "fix" : "Provide {{text}}. Gemini fixes the text.",
                        "zap" : "Provide {{user_query}}. Gemini generates new text from user query."
                    }
                }
            }
        }
    }

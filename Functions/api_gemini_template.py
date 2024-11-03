from fastapi import FastAPI, Query, File, UploadFile
from typing import Optional
import KEY

app = FastAPI()

# def config_model():
#     generation_config = {
#         "temperature": 1,
#         "top_p": 0.95,
#         "top_k": 64,
#         "max_output_tokens": 1000,
#         "response_schema": content.Schema(
#             type=content.Type.ARRAY,
#             items=content.Schema(
#                 type=content.Type.OBJECT,
#                 required=[
#                     "result_text_title",
#                     "result_text"
#                 ],
#                 properties={
#                     "result_text_title": content.Schema(
#                         type=content.Type.STRING
#                     ),
#                     "result_text": content.Schema(
#                         type=content.Type.STRING
#                     )
#                 }
#             )
#         ),
#         "response_mime_type": "application/json",
#     }
#     return genai.GenerativeModel(model_name="gemini-1.5-pro",generation_config=generation_config)

@app.post("/text/")
async def text_process(
    text: str, 
    option: str = Query("summarize", enum=["summarize", "explain", "user_query"], description="Choose an option: 'summarize', 'explain', or 'user_query'"),
    user_query: Optional[str] = Query(None, description="Ask AI a question about the text"),
    detailed: Optional[bool] = Query(False, description="Ask AI for detailed output")
):
    """
    Summarizes, explains, or answers a question about the given text.

    Args:
    - text (str): The text to be processed.
    - option (str): The option to choose: 'summarize', 'explain', or 'user_query'.
    - user_query (str): Optional question to ask AI about the text (used with 'user_query' option).
    - detailed (bool): Optional flag to request detailed output.

    Returns:
    - A summary, explanation, or answer to the question.
    """
    pass

@app.post("/audio/")
async def audio_process(
    file: UploadFile = File(...), 
    option: str = Query("summarize", enum=["summarize", "explain", "user_query"], description="Choose an option: 'summarize', 'explain', or 'user_query'"),
    user_query: Optional[str] = Query(None, description="Ask AI a question about the audio"),
    detailed: Optional[bool] = Query(False, description="Ask AI for detailed output")
):
    """
    Summarizes, explains, or answers a question about the content of an audio file.

    Args:
    - file (UploadFile): The audio file to be processed.
    - option (str): The option to choose: 'summarize', 'explain', or 'user_query'.
    - user_query (str): Optional question to ask AI about the audio (used with 'user_query' option).
    - detailed (bool): Optional flag to request detailed output.

    Returns:
    - A summary, explanation, or answer to the question.
    """
    pass

@app.post("/pdf/")
async def pdf_process(
    file: UploadFile = File(...), 
    option: str = Query("summarize", enum=["summarize", "explain", "user_query"], description="Choose an option: 'summarize', 'explain', or 'user_query'"),
    user_query: Optional[str] = Query(None, description="Ask AI a question about the PDF"),
    detailed: Optional[bool] = Query(False, description="Ask AI for detailed output")
):
    """
    Summarizes, explains, or answers a question about the content of a PDF document.

    Args:
    - file (UploadFile): The PDF file to be processed.
    - option (str): The option to choose: 'summarize', 'explain', or 'user_query'.
    - user_query (str): Optional question to ask AI about the PDF (used with 'user_query' option).
    - detailed (bool): Optional flag to request detailed output.

    Returns:
    - A summary, explanation, or answer to the question.
    """
    pass

@app.post("/youtube/")
async def youtube_process(
    link: str, 
    option: str = Query("summarize", enum=["summarize", "explain", "user_query"], description="Choose an option: 'summarize', 'explain', or 'user_query'"),
    user_query: Optional[str] = Query(None, description="Ask AI a question about the YouTube video"),
    detailed: Optional[bool] = Query(False, description="Ask AI for detailed output")
):
    """
    Summarizes, explains, or answers a question about a YouTube video.

    Args:
    - link (str): The YouTube video URL.
    - option (str): The option to choose: 'summarize', 'explain', or 'user_query'.
    - user_query (str): Optional question to ask AI about the video (used with 'user_query' option).
    - detailed (bool): Optional flag to request detailed output.

    Returns:
    - A summary, explanation, or answer to the question.
    """
    pass

@app.get("/tag-propriety-check/")
async def tag_propriety_check(tag: str):
    """
    Checks if the provided tag is appropriate for use.

    Args:
    - tag (str): The tag to be checked.

    Returns:
    - A boolean value indicating if the tag is proper or not.
    """
    pass

@app.get("/")
async def root():
    return {
        "message": "Edunote API",
        "description": "Edunote API, uses Gemini by Google to present you the best note taking experience.",
        "endpoints": {
            "/text/": {
                "method": "POST",
                "description": "Process text."
            },
            "/audio/": {
                "method": "POST",
                "description": "Process audio content."
            },
            "/pdf/": {
                "method": "POST",
                "description": "Process PDF documents."
            },
            "/youtube/": {
                "method": "POST",
                "description": "Process YouTube videos."
            },
            "/image/": {
                "method": "POST",
                "description": "Process image content."
            },
            "/tag-propriety-check/": {
                "method": "GET",
                "description": "Checks if the provided tag is appropriate for use."
            }
        }
    }
from fastapi import FastAPI, Query, File, UploadFile
from typing import Optional
import genai
import KEY
from google.ai.generativelanguage_v1beta.types import content

app = FastAPI()

def config_model():
    generation_config = {
        "temperature": 1,
        "top_p": 0.95,
        "top_k": 64,
        "max_output_tokens": 1000,
        "response_schema": content.Schema(
            type=content.Type.ARRAY,
            items=content.Schema(
                type=content.Type.OBJECT,
                required=[
                    "result_text_title",
                    "result_text"
                ],
                properties={
                    "result_text_title": content.Schema(
                        type=content.Type.STRING
                    ),
                    "result_text": content.Schema(
                        type=content.Type.STRING
                    )
                }
            )
        ),
        "response_mime_type": "application/json",
    }
    return genai.GenerativeModel(model_name="gemini-1.5-pro",generation_config=generation_config)

@app.post("/text/")
async def text_summarization(
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
    model = config_model()

    if option == "summarize":
        prompt = f"Please provide {'a detailed' if detailed else 'a'} summary of the following text: {text}"
    elif option == "explain":
        prompt = f"Please provide {'a detailed' if detailed else 'an'} explanation of the following text: {text}"
    elif option == "user_query":
        if user_query is None:
            return {"error": "Please provide a user query."}
        prompt = f"Here's some text: {text} \n\n{user_query}"
    else:
        return {"error": "Invalid option."}

    response = model.generate_content(prompt=prompt)
    return response

@app.post("/audio/")
async def audio_summarization(
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
    # **Important:** You'll need to integrate an audio transcription service here
    transcript = "This is a placeholder for the transcribed audio."  # Replace with actual transcription
    model = config_model()

    if option == "summarize":
        prompt = f"Please provide {'a detailed' if detailed else 'a'} summary of the following audio transcript: {transcript}"
    elif option == "explain":
        prompt = f"Please provide {'a detailed' if detailed else 'an'} explanation of the following audio transcript: {transcript}"
    elif option == "user_query":
        if user_query is None:
            return {"error": "Please provide a user query."}
        prompt = f"Here's a transcript of an audio file: {transcript} \n\n{user_query}"
    else:
        return {"error": "Invalid option."}

    response = model.generate_content(prompt=prompt)
    return response

@app.post("/pdf/")
async def pdf_summarization(
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
    # **Important:** You'll need to integrate a PDF parsing library here
    pdf_text = "This is a placeholder for the extracted PDF text."  # Replace with actual extracted text
    model = config_model()

    if option == "summarize":
        prompt = f"Please provide {'a detailed' if detailed else 'a'} summary of the following PDF text: {pdf_text}"
    elif option == "explain":
        prompt = f"Please provide {'a detailed' if detailed else 'an'} explanation of the following PDF text: {pdf_text}"
    elif option == "user_query":
        if user_query is None:
            return {"error": "Please provide a user query."}
        prompt = f"Here's the text from a PDF file: {pdf_text} \n\n{user_query}"
    else:
        return {"error": "Invalid option."}

    response = model.generate_content(prompt=prompt)
    return response

@app.post("/youtube/")
async def youtube_summarization(
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
    # **Important:** You'll need to integrate a YouTube transcript extraction method here
    transcript = "This is a placeholder for the YouTube video transcript."  # Replace with actual transcript
    model = config_model()

    if option == "summarize":
        prompt = f"Please provide {'a detailed' if detailed else 'a'} summary of the following YouTube video transcript: {transcript}"
    elif option == "explain":
        prompt = f"Please provide {'a detailed' if detailed else 'an'} explanation of the following YouTube video transcript: {transcript}"
    elif option == "user_query":
        if user_query is None:
            return {"error": "Please provide a user query."}
        prompt = f"Here's the transcript from a YouTube video: {transcript} \n\n{user_query}"
    else:
        return

@app.get("/")
async def root():
    return {
        "message": "Edunote API",
        "description": "Edunote API, uses Gemini by Google to present you the best note taking experience.",
        "endpoints": {
            "/text/": {
                "method": "POST",
                "description": "Summarizes text."
            },
            "/audio/": {
                "method": "POST",
                "description": "Summarizes audio content."
            },
            "/pdf/": {
                "method": "POST",
                "description": "Summarizes PDF documents."
            },
            "/youtube/": {
                "method": "POST",
                "description": "Summarizes YouTube videos."
            },
            "/image/": {
                "method": "POST",
                "description": "Summarizes image content."
            },
            "/tag-propriety-check/": {
                "method": "GET",
                "description": "Checks if the provided tag is appropriate for use."
            }
        }
    }
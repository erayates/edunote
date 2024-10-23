from fastapi import FastAPI, Query, File, UploadFile, HTTPException
from typing import Optional
import google.generativeai as genai
import KEY
import json, fitz, io
from google.ai.generativelanguage_v1beta.types import content
from langchain_community.document_loaders import YoutubeLoader
from langchain_community.document_loaders import PyPDFLoader

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

app = FastAPI()
gemini = config_model()
genai.configure(api_key=KEY.GEMINI_API_KEY)

def format_response(prompt):
    response = gemini.generate_content(prompt)
    response = response.to_dict()
    response["candidates"][0]["content"]["parts"][0]["text"] = json.loads(response["candidates"][0]["content"]["parts"][0]["text"])
    return response    

async def caption_loader(link: str, language: str = "en"):
    content = ""
    loader = YoutubeLoader.from_youtube_url(link, add_video_info=True, language=language)

    try:
        youtube_data = loader.load()

        for doc in youtube_data:
            content += doc.page_content
        return content

    except Exception as e:
        print(f"Error loading video data: {e}")
        return ""

async def pdf_loader(file: UploadFile):
    # Read the content of the uploaded PDF file as bytes
    pdf_bytes = await file.read()

    # Check if the file is empty
    if not pdf_bytes:
        raise HTTPException(status_code=400, detail="Uploaded PDF file is empty.")

    # Create a BytesIO stream from the bytes
    pdf_stream = io.BytesIO(pdf_bytes)

    # Open the PDF file with PyMuPDF from the BytesIO stream
    try:
        pdf_document = fitz.open("pdf", pdf_stream)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to open PDF: {str(e)}")

    # Extract text from the PDF
    extracted_text = ""
    for page in pdf_document:
        extracted_text += page.get_text()  # Extract text from each page

    pdf_document.close()  # Close the document

    return extracted_text

@app.get("/gemini/")
async def text_process(
    text: str = None, 
    option: Optional[str] = Query("note", enum=["summarize", "explain", "note"], description="Choose an option: 'summarize', 'explain', or 'note'"),
    source: Optional[str] = Query("text", enum=["text", "pdf", "audio", "youtube", "image"], description="Choose a source: 'text', 'pdf', 'audio', 'youtube', 'image'"),
    user_query: Optional[str] = Query(None, description="Ask AI a question"),
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
    
    if text is None and source != 'text':
        match source:
            case 'text': 
    
    if option:
        if option == "summarize":
            prompt = f"Please provide {'a detailed' if detailed else 'a'} summary of the following text {f"({user_query})" if user_query else ''}: {text}"
        elif option == "explain":
            prompt = f"Please provide {'a detailed' if detailed else 'an'} explanation of the following text {f"({user_query})" if user_query else ''}: {text}"
        elif option == "note":
            prompt = f"Please provide {'a detailed' if detailed else 'a'} note of the following text {f"({user_query})" if user_query else ''}: {text}"
    elif user_query:
        prompt = user_query
    else:
        return {"error": "Invalid option."}

    return format_response(prompt)

@app.get("/text/")
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

    return format_response(prompt)

@app.get("/audio/")
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
    
    # TODO: Convert audio to text.
    
    transcript = "transcribed audio"

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

    response = gemini.generate_content(prompt=prompt)
    return format_response(prompt)

@app.get("/pdf/")
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
    pdf_text = await pdf_loader(file)

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

    return format_response(prompt)

@app.get("/youtube/")
async def youtube_process(
    link: str,
    language: str = "en",
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

    # TODO: Get captions from Youtube video using Youtube Data v3 API.

    transcript = caption_loader(f"https://www.youtube.com/watch?v={link}", language)

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
    
    return format_response(prompt)

# @app.get("/tag-propriety-check/")
# async def tag_propriety_check(tag: str):
#     """
#     Checks if the provided tag is appropriate for use.

#     Args:
#     - tag (str): The tag to be checked.

#     Returns:
#     - A boolean value indicating if the tag is proper or not.
#     """
#     if float(predict_prob(tag.lower())[0]) > 0.7: return False
#     else: return True

@app.get("/")
async def root():
    return {
        "message": "Edunote API",
        "description": "Edunote API, uses Gemini by Google to present you the best note taking experience.",
        "endpoints": {
            "/text/": {
                "method": "get",
                "description": "Process text."
            },
            "/audio/": {
                "method": "get",
                "description": "Process audio content."
            },
            "/pdf/": {
                "method": "get",
                "description": "Process PDF documents."
            },
            "/youtube/": {
                "method": "get",
                "description": "Process YouTube videos."
            },
            "/image/": {
                "method": "get",
                "description": "Process image content."
            },
            "/tag-propriety-check/": {
                "method": "GET",
                "description": "Checks if the provided tag is appropriate for use."
            }
        }
    }
from fastapi import FastAPI, Query, File, UploadFile, HTTPException
from typing import Optional
import google.generativeai as genai
import KEY as KEY
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
    global gemini
    response = gemini.generate_content(prompt)
    response = response.to_dict()
    print(response["candidates"][0]["content"]["parts"][0]["text"])
    try:
        response["candidates"][0]["content"]["parts"][0]["text"] = json.loads(response["candidates"][0]["content"]["parts"][0]["text"])
    except json.JSONDecodeError as e:
        print(f"JSON decoding failed: {e}")
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

async def audio_loader(file: UploadFile):
    raise NotImplementedError
    extracted_text: str
    return extracted_text

async def image_loader(file: UploadFile):
    raise NotImplementedError
    extracted_text: str
    return extracted_text

@app.get("/gemini/")
async def gemini_process(
    text: str = None,
    link: str = None,
    language: str = None,
    file: Optional[UploadFile] = File(...), 
    option: Optional[str] = Query(None, enum=["summarize", "explain", "note"], description="Choose an option: 'summarize', 'explain', or 'note'"),
    source: Optional[str] = Query(None, enum=["text", "pdf", "audio", "youtube", "image"], description="Choose a source: 'text', 'pdf', 'audio', 'youtube', 'image'"),
    user_query: Optional[str] = Query(None, description="Ask AI a question"),
    detailed: Optional[bool] = Query(False, description="Ask AI for detailed output")
):
    """
    Process text or multimedia content using Gemini AI model.

    This endpoint allows you to interact with the Gemini AI model by providing text, PDF documents, YouTube links, or audio/image files (not yet implemented). 
    You can choose different options to summarize, explain, or take notes on the provided content.

    Args:
        text (str, optional): Text content to be processed. Defaults to None.
        link (str, optional): URL link to YouTube video or other sources (not yet implemented). Defaults to None.
        language (str, optional): Language of the content. Defaults to None.
        file (UploadFile, optional): File upload for PDF documents. Defaults to File(...).
        option (str, optional): Choose an option from 'summarize', 'explain', or 'note'. Defaults to None.
        source (str, optional): Choose a source from 'text', 'pdf', 'audio', 'youtube', 'image'. Defaults to None.
        user_query (str, optional): Ask AI a question about the content. Defaults to None.
        detailed (bool, optional): Ask AI for a more detailed output. Defaults to False.

    Returns:
        dict: A dictionary containing the processed response from the Gemini AI model, or an error message if the request is invalid.
    """
    match source:
        case 'text': pass
        case 'pdf': text = await pdf_loader(file)
        case 'youtube': text = caption_loader(f"https://www.youtube.com/watch?v={link}", language)
        case 'audio': {"error": "Method is not implemented."}
        case 'image': {"error": "Method is not implemented."}

    if text is None and user_query is None:
        return {"error": "Error occured."}

    if option:
        query_part = f"({user_query})" if user_query else ''
        if option == "summarize":
            prompt = f"Please provide {'a detailed' if detailed else 'a'} summary of the following text {query_part}: {text}"
        elif option == "explain":
            prompt = f"Please provide {'a detailed' if detailed else 'an'} explanation of the following text {query_part}: {text}"
        elif option == "note":
            prompt = f"Please provide {'a detailed' if detailed else 'a'} note of the following text {query_part}: {text}"
    elif user_query:
        prompt = user_query
    else:
        return {"error": "Invalid option."}

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
            "/gemini/": {
                "method": "get",
                "description": "Process text.",
                "parameters": {
                    "text": "Provide text to Gemini to use options.",
                    "link": "Youtube link to get the video transcript.",
                    "language": "Language for Gemini. (Not implemented yet.)",
                    "file": "Provide a pdf, audio or image file. (Audio and image files are not supported yet.)",
                    "option": "Choose an option from 'summarize', 'explain', or 'note'. Defaults to None.",
                    "source": "Choose a source from 'text', 'pdf', 'audio', 'youtube', 'image'. Defaults to None.",
                    "user_query": "Ask AI a question about the content. Defaults to None.",
                    "detailed": "Ask AI for a more detailed output. Defaults to false.",
                },
                "help": "Provide at least an option (only one: youtube link/text/file) and choose source or a user query (only user query to ask any question) or both." 
            }
        }
    }

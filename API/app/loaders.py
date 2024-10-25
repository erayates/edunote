from fastapi import UploadFile, HTTPException, File
import starlette.datastructures as starlette
import google.generativeai as genai
from pydantic import BaseModel
from google.cloud import storage
import fitz, io, os
from google.ai.generativelanguage_v1beta.types import content
from langchain_community.document_loaders import YoutubeLoader
from typing import List, Union
from google.cloud import vision

AUDIO_EXTENSIONS = {'mp3', 'wav', 'aac', 'm4a', 'wma'}
PDF_EXTENSIONS = {'pdf'}
IMAGE_EXTENSIONS = {'jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'}

class MainBody(BaseModel):
    option: str = 'user'
    command: str | None = None
    prompt: str | None = None

class SearchINNotes(BaseModel):
    query: str
    user_id: str

class FileUploadBody(BaseModel):
    user_id: str
    update_if_exists: bool = True

class FileDownloadBody(BaseModel):
    user_id: str
    file_name: str

class Prompt():
    def __init__(self, safety_category: int = 0, generation_config: dict = None) -> None:
        self.safety_settings = self.safety_category_choose(safety_category)
        # self.generation_config = self.generation_config_choose(generation_config)
        self.categorized_propmt = {
            "user" : "",
            "template" : "You are an AI writing assistant that creates a template of titles and subtitles and other neccessary items from the existing text. Make sure to construct complete sentences. Use Markdown formatting when appropriate.",
            "ask" : "You are an AI writing assistant that answers the questions about the existing text or done the desired changes or else on the existing text. Make sure to construct complete sentences. Use Markdown formatting when appropriate.",
            "explain" : "You are an AI writing assistant that explains the existing text. Make sure to construct complete sentences. Use Markdown formatting when appropriate.",
            "summarize" : "You are an AI writing assistant that summarizes existing text. Make sure to construct complete sentences. Use Markdown formatting when appropriate.",
            "note" : "You are an AI writing/note taking assistant that creates notes from existing text. Make sure to construct complete sentences. Use Markdown formatting when appropriate.",
            "improve" : "You are an AI writing assistant that improves existing text. Make sure to construct complete sentences. Use Markdown formatting when appropriate.",
            "shorter" : "You are an AI writing assistant that shortens existing text. Use Markdown formatting when appropriate.",
            "longer" : "You are an AI writing assistant that lengthens existing text. Use Markdown formatting when appropriate.",
            "continue" : "You are an AI writing assistant that continues to existing text. Use Markdown formatting when appropriate.",
            "fix" : "You are an AI writing assistant that fixes grammar and spelling errors in existing text. Make sure to construct complete sentences. Use Markdown formatting when appropriate.",
            "zap" : "You area an AI writing assistant that generates text based on a prompt. You take an input from the user and a command for manipulating the text. Use Markdown formatting when appropriate."
        }

    def generate_response(self, prompt, option, user_query = None):
        if option == 'ask':
            messages = [
                {'role': 'user', 'parts': [self.categorized_propmt[option]]},
                {'role': 'model', 'parts': ['I am an AI writing assistant and I will provide you the text you desire.']},
                {'role': 'user', 'parts': [f'{user_query}, Here is the text: {prompt}']}
            ]
        else:
            messages = [
                {'role': 'user', 'parts': [self.categorized_propmt[option]]},
                {'role': 'model', 'parts': ['I am an AI writing assistant and I will provide you the text you desire.']},
                {'role': 'user', 'parts': [f'Here is the text: {prompt}']}
            ] if option != 'user' else [ {'role': 'user', 'parts': [user_query]} ]
        return {
            'contents': messages,
            # 'generation_config': self.generation_config,
            'safety_settings': self.safety_settings
        }

    def generation_config_choose(self, generation_config: dict = None):
        if not generation_config:
            return None
        return genai.types.GenerationConfig(
                candidate_count=generation_config['candidate_count'],
                stop_sequences=generation_config['stop_sequences'],
                max_output_tokens=generation_config['max_output_tokens'],
                temperature=generation_config['temperature'])

    def safety_category_choose(self, safety_category):
        return [
            {
                'HARM_CATEGORY_HARASSMENT': 'BLOCK_MEDIUM_AND_ABOVE',
                'HARM_CATEGORY_HATE_SPEECH': 'BLOCK_MEDIUM_AND_ABOVE',
                'HARM_CATEGORY_SEXUALLY_EXPLICIT': 'BLOCK_MEDIUM_AND_ABOVE',
                'HARM_CATEGORY_DANGEROUS_CONTENT': 'BLOCK_MEDIUM_AND_ABOVE'
            }
        ][safety_category]

class Loaders():

    @staticmethod
    def config_model():
        generation_config = {
            "candidate_count": 1,
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

    @staticmethod
    def config_bucket():
        storage_client, bucket_name = storage.Client.from_service_account_json('Secrets/btk-24-44c0bc08cb00.json'), 'btk-api-bucket'        
        try:
            return storage_client.get_bucket(bucket_name)
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Bucket not found: {str(e)}")

    @staticmethod
    def caption_loader(link: str, language: str = "en"):
        content = ""
        loader = YoutubeLoader.from_youtube_url(link, add_video_info=True, language=language)

        try:
            youtube_data = loader.load()

            for doc in youtube_data:
                content += doc.page_content
            return content

        except Exception as e:
            print(f"Error loading video data: {e}")
            return "No caption found."

    @staticmethod
    def pdf_loader(file: Union[UploadFile, bytes]):
        pdf_stream: io.BytesIO
        if isinstance(file, starlette.UploadFile):
            pdf_bytes = file.file.read()
            if not pdf_bytes:
                raise HTTPException(status_code=400, detail="Uploaded PDF file is empty.")

            pdf_stream = io.BytesIO(pdf_bytes)
        elif isinstance(file, bytes):
            pdf_stream = io.BytesIO(file)

        try:
            pdf_document = fitz.open("pdf", pdf_stream)
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Failed to open PDF: {str(e)}")

        extracted_text = ""
        for page in pdf_document:
            extracted_text += page.get_text()

        pdf_document.close()

        return extracted_text

    @staticmethod
    def audio_loader(file: Union[UploadFile, bytes], model: genai.GenerativeModel):
        if not file.filename.endswith(('.mp3', '.wav', '.m4a')):
            raise HTTPException(status_code=400, detail="Invalid file type. Please upload an audio file (mp3, wav, or m4a).")

        file_location = f"./{file.filename}"
        with open(file_location, "wb") as f:
            content = file.file.read()
            f.write(content)

        prompt = "You are an AI writing assistant that creates closed captions from an existing audio. Make sure to construct complete sentences. Use Markdown formatting when appropriate."

        audio_file = genai.upload_file(path=file_location)
        response = model.generate_content([prompt, audio_file])

        if os.path.exists(file_location):
            os.remove(file_location)
        else: pass

        return response.text

    @staticmethod
    def image_loader(file: Union[UploadFile, bytes]) -> str:
        
        if isinstance(file, UploadFile):
            if not file.filename.endswith(('.png', '.jpg', '.jpeg')):
                raise HTTPException(status_code=400, detail="Invalid file type. Please upload an image file (png, jpg, jpeg).")
            image_data = file.file.read()
        elif isinstance(file, bytes):
            image_data = file
        else:
            raise HTTPException(status_code=400, detail="Unsupported file format.")

       
        try:
            
            client = vision.ImageAnnotatorClient()
            image = vision.Image(content=image_data)
            response = client.text_detection(image=image)
            texts = response.text_annotations
            if texts:
                extracted_text = texts[0].description
            else:
                extracted_text = "No text found."
        except Exception as vision_error:
            print(f"Google Vision API error: {vision_error}")
       

        return extracted_text
class Process():
    
    @staticmethod
    def extract_text(file, extension, model):
        if extension in AUDIO_EXTENSIONS:
            return {file.filename : Loaders.audio_loader(file, model)}
        elif extension in PDF_EXTENSIONS:
            return {file.filename : Loaders.pdf_loader(file)}
        elif extension in IMAGE_EXTENSIONS:
            return {file.filename : "Image extraction not implemented yet!"}
        else:
            raise HTTPException(status_code=400, detail=f"Unsupported file type: {extension}")        

    @staticmethod
    async def download_file(blob):
        file_data = await blob.download_as_bytes()
        return file_data

    @staticmethod
    def file_upload(body: FileUploadBody, files: List[UploadFile] = File(...)) -> dict:
        user_id = body.user_id
        update_if_exists = body.update_if_exists
        upload_states = {}
        if not files:
            raise HTTPException(status_code=400, detail="No files uploaded")

        bucket = Loaders.config_bucket()

        for file in files:
            destination_file_name = f'{user_id}/{file.filename}'

            try:
                blob = bucket.blob(destination_file_name)
                if not blob.exists() or update_if_exists:
                    try:
                        blob.upload_from_file(file.file)
                        upload_states.update({file.filename: "File uploaded successfully."})
                    except Exception as e: upload_states.update({file.filename: f"File upload failed: {str(e)}"})
                else: upload_states.update({file.filename : "File already exists in bucket."})
            except Exception as e:
                raise HTTPException(status_code=500, detail=f"{file.filename} : File upload failed: {str(e)}")

        return upload_states
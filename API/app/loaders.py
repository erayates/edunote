from fastapi import UploadFile, HTTPException, File
import starlette.datastructures as starlette
import google.generativeai as genai
from pydantic import BaseModel
from google.cloud import storage
from pydantic import HttpUrl
import fitz, io, os, json, asyncio
from google.ai.generativelanguage_v1beta.types import content
from langchain_community.document_loaders import YoutubeLoader
from typing import List, Union
from typing import Optional
from google.api_core.exceptions import ResourceExhausted
from io import BytesIO

AUDIO_EXTENSIONS = ['mp3', 'wav', 'aac', 'm4a', 'wma']
PDF_EXTENSIONS = ['pdf']
IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg']

class MainBody(BaseModel):
    user_id: str
    option: str = 'user'
    command: Optional[str] = None
    prompt: Optional[str] = None

class SearchINNotes(BaseModel):
    query: str
    user_id: str

class FileUploadBody(BaseModel):
    user_id: str
    update_if_exists: bool = True

class FileDownloadBody(BaseModel):
    user_id: str
    file_name: str

class FileExtract(BaseModel):
    url: HttpUrl
    user_id: str    

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

    def generate_response(self, user_id, prompt, option, user_query = None):
        messages = ChatHistory.get_chat_history(user_id=user_id)
        if option == 'ask':
            messages.append({'role': 'user', 'parts': [self.categorized_propmt[option]]})
            messages.append({'role': 'model', 'parts': ['I am an AI writing assistant and I will provide you only the text you desire.']})
            messages.append({'role': 'user', 'parts': [f'{user_query}, Here is the text: {prompt}']})
        else:
            if option != 'user':
                messages.append({'role': 'user', 'parts': [self.categorized_propmt[option]]})
                messages.append({'role': 'model', 'parts': ['I am an AI writing assistant and I will provide you only the text you desire.']})
                messages.append({'role': 'user', 'parts': [f'Here is the text: {prompt}']})
            else:
                messages.append({'role': 'user', 'parts': [user_query]})
        ChatHistory.upload_chat_history(user_id=user_id, chat_history=messages)
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
    def config_model(model_name="gemini-1.5-pro"):
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
        return genai.GenerativeModel(model_name=model_name, generation_config=generation_config)

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
    def pdf_loader(file: bytes):
        """Extract text from a PDF file."""
        try:
            pdf_document = fitz.open("pdf", file)
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Failed to open PDF: {str(e)}")
        for page in pdf_document:
            yield page.get_text()

    @staticmethod
    async def audio_loader(file: bytes, file_name: str, model, user_id: str):
        """Process audio and generate content using the AI model."""
        if not file_name.endswith(tuple(AUDIO_EXTENSIONS)):
            raise HTTPException(status_code=400, detail="Invalid file type. Please upload an audio file (mp3, wav).")

        file_location = f"./{file_name}"
        with open(file_location, "wb") as f:
            f.write(file.getvalue())

        prompt = "You are an AI writing assistant that creates closed captions from an existing audio. Make sure to construct complete sentences. Use Markdown formatting when appropriate."

        audio_file = genai.upload_file(path=file_location)
        if os.path.exists(file_location):
            os.remove(file_location)
        text_response = ""
        max_retries = 3
        retry_delay = 0.2
        for attempt in range(max_retries):
            try:
                for chunk in model.generate_content([prompt, audio_file], stream=True):
                    try:
                        text_response += chunk.text
                        yield chunk.text
                    except: 
                        pass
                if text_response != "": ChatHistory.update_chat_history(user_id, [{"role": "model", "parts": [text_response]}])
                break
            except ResourceExhausted as e:
                if attempt < max_retries - 1:
                    await asyncio.sleep(retry_delay)
                    retry_delay *= 2
                else:
                    raise HTTPException(status_code=429, detail="API quota exceeded. Please try again later.")

    @staticmethod
    async def image_loader(file: bytes, file_name: str, model, user_id: str):
        """Process image and generate content using the AI model."""
        if not file_name.endswith(tuple(IMAGE_EXTENSIONS)):
            raise HTTPException(status_code=400, detail="Invalid file type. Please upload an image file (jpg, jpeg, png).")

        file_location = f"./{file_name}"
        with open(file_location, "wb") as f:
            f.write(file.getvalue())

        prompt = "You are an AI writing assistant that creates closed captions from an existing image."

        image_file = genai.upload_file(path=file_location)
        if os.path.exists(file_location):
            os.remove(file_location)

        max_retries = 3
        retry_delay = 0.2
        for attempt in range(max_retries):
            try:
                for chunk in model.generate_content([prompt, image_file], stream=True):
                    try:
                        text_response += chunk.text
                        yield chunk.text
                    except: 
                        pass
                ChatHistory.update_chat_history(user_id, [{"role": "model", "parts": [text_response]}])
                break
            except ResourceExhausted as e:
                if attempt < max_retries - 1:
                    await asyncio.sleep(retry_delay)
                    retry_delay *= 2
                else:
                    raise HTTPException(status_code=429, detail="API quota exceeded. Please try again later.") 

class Process():

    @staticmethod
    def extract_text(file, filename, extension, model, user_id):
        if extension in AUDIO_EXTENSIONS:
            return Loaders.audio_loader(file, filename, model, user_id)
        elif extension in PDF_EXTENSIONS:
            return Loaders.pdf_loader(file)
        elif extension in IMAGE_EXTENSIONS:
            return Loaders.image_loader(file, filename, model, user_id)
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

class ChatHistory():
    
    @staticmethod
    def get_chat_history(user_id: str) -> list:
        try:
            bucket = Loaders.config_bucket()
        except:
            raise HTTPException(status_code=404, detail=f"Bucket load failed.")
        destination_file_name = f'chat/history-{user_id}.json'
        blob = bucket.blob(destination_file_name)

        if not blob.exists():
            # raise HTTPException(status_code=404, detail=f"File {destination_file_name} not found in bucket.")
            return []
        
        try:
            file_data = blob.download_as_bytes()
            json_string = file_data.decode('utf-8')
            chat_history = json.loads(json_string)
            return chat_history

        except Exception as e:
            raise HTTPException(status_code=500, detail=f"File download failed: {str(e)}")

    def update_chat_history(user_id: str, propmts: list[dict]):
        chat_history = ChatHistory.get_chat_history(user_id=user_id)
        for row in propmts:
            chat_history.append(row)

        bucket = Loaders.config_bucket()
        destination_file_name = f'chat/history-{user_id}.json'
        blob = bucket.blob(destination_file_name)

        try:
            json_data = json.dumps(chat_history, indent=2) 
            json_bytes = BytesIO(json_data.encode('utf-8'))
            blob.upload_from_file(json_bytes) 
        except Exception as e: HTTPException(status_code=500, detail=f"destination_file_name : File upload failed: {str(e)}")

    def upload_chat_history(user_id: str, chat_history: list[dict]):
        bucket = Loaders.config_bucket()
        destination_file_name = f'chat/history-{user_id}.json'
        blob = bucket.blob(destination_file_name)

        try:
            json_data = json.dumps(chat_history, indent=2) 
            json_bytes = BytesIO(json_data.encode('utf-8'))
            blob.upload_from_file(json_bytes) 
        except Exception as e: HTTPException(status_code=500, detail=f"destination_file_name : File upload failed: {str(e)}")

    def clear_chat_history(user_id: str):
        chat_history = []

        bucket = Loaders.config_bucket()
        destination_file_name = f'chat/history-{user_id}.json'
        blob = bucket.blob(destination_file_name)

        try:
            json_data = json.dumps(chat_history, indent=2) 
            json_bytes = BytesIO(json_data.encode('utf-8'))
            blob.upload_from_file(json_bytes) 
        except Exception as e: HTTPException(status_code=500, detail=f"destination_file_name : File upload failed: {str(e)}")


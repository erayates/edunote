from fastapi import UploadFile, HTTPException, File
import google.generativeai as genai
from pydantic import BaseModel
from google.cloud import storage
from pydantic import HttpUrl
from bson import ObjectId
import fitz, os, json, asyncio
from google.ai.generativelanguage_v1beta.types import content
from langchain_community.document_loaders import YoutubeLoader
from typing import List
from typing import Optional
from Secrets.KEY import NOTES 
from google.api_core.exceptions import ResourceExhausted
from io import BytesIO
from youtube_transcript_api import YouTubeTranscriptApi

AUDIO_EXTENSIONS = ['mp3', 'wav', 'aac', 'm4a', 'wma']
PDF_EXTENSIONS = ['pdf']
IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg']

class MainBody(BaseModel):
    user_id: str
    option: str = 'user'
    note_id: str = 'gemini'
    command: Optional[str] = None
    prompt: Optional[str] = None

class Embedding(BaseModel):
    query: str

class NoteBody(BaseModel):
    user_id: str
    note_id: str = 'gemini'

class SearchINNotes(BaseModel):
    command: str
    user_id: str
    public_search: bool = False

class FileUploadBody(BaseModel):
    user_id: str
    update_if_exists: bool = True

class FileDownloadBody(BaseModel):
    user_id: str
    file_name: str

class FileExtract(BaseModel):
    url: HttpUrl
    user_id: str    

class TranscriptLoad(BaseModel):
    youtube_video_id: str
    only_transcript: bool = False

class Prompt():
    def __init__(self, safety_category: int = 0) -> None:
        self.safety_settings = self.safety_category_choose(safety_category)
        # self.generation_config = self.generation_config_choose(generation_config)
        self.categorized_propmt = {
            "user": "",
            "template" : "You are an AI writing assistant that creates a template of titles and subtitles and other neccessary items from the existing text. Make sure to construct complete sentences. Use Markdown formatting when appropriate.",
            "ask" : "You are an AI writing assistant that answers the questions about the existing text or done the desired changes or anything else the user want using the existing text. Make sure to construct complete sentences. Use Markdown formatting when appropriate.",
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

    def generate_response(self, user_id, prompt, option: str, note_id, user_query = None):
        messages = ChatHistory.get_chat_history(user_id=user_id, note_id=note_id)
        messages_history = messages.copy()
        keep__prompt_history = True
        if option.startswith('fromnote_'): 
            prompt = self.load_note(note_id=note_id)
            option = option.replace('fromnote_', '')
            keep__prompt_history = False
        if option == 'ask':
            messages.append({'role': 'user', 'parts': [self.categorized_propmt[option]]})
            messages.append({'role': 'model', 'parts': ['I am an AI writing assistant and I will provide you only the text you desire.']})
            messages.append({'role': 'user', 'parts': [f'{user_query}\nHere is the text: {prompt}']})
            messages_history.append({'role': 'user', 'parts': [user_query, f"{prompt}"]}) if keep__prompt_history else messages_history.append({'role': 'user', 'parts': [user_query]})
        elif option == 'ask_note':
            messages.append({'role': 'user', 'parts': [self.categorized_propmt['ask']]})
            messages.append({'role': 'model', 'parts': ['I am an AI writing assistant and I will provide you only the text you desire.']})
            messages.append({'role': 'user', 'parts': [f'{user_query}\nHere is the text: {prompt}']})
            messages_history.append({'role': 'user', 'parts': [user_query, f"{prompt}"]}) if keep__prompt_history else messages_history.append({'role': 'user', 'parts': [user_query]})
        else:
            if option != 'user':
                messages.append({'role': 'user', 'parts': [self.categorized_propmt[option]]})
                messages.append({'role': 'model', 'parts': ['I am an AI writing assistant and I will provide you only the text you desire.']})
                messages.append({'role': 'user', 'parts': [f'Here is the text: {prompt}']})
                messages_history.append({'role': 'user', 'parts': [f"Make my note {option}."]})
            else:
                messages.append({'role': 'user', 'parts': [user_query]})
                messages_history.append({'role': 'user', 'parts': [user_query]})
        ChatHistory.upload_chat_history(user_id=user_id, chat_history=messages_history, note_id=note_id)
        return {
            'contents': messages,
            # 'generation_config': self.generation_config,
            'safety_settings': self.safety_settings
        }

    def load_note(self, note_id: str):
        try:
            note = NOTES.find_one({"_id": ObjectId(note_id)})
            note = {'Title': note['title'], 'Description': note['description'], 'Content': note['content']}
            return note
        except Exception as e:
            raise HTTPException(status_code=404, detail=f"Note {note_id} not found. {str(e)}")

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

    # def get_embedding(query: str):
    #     output = embed.text(
    #         texts=[query],
    #         model='nomic-embed-text-v1',
    #         task_type='search_document',
    #         long_text_mode='mean',
    #         dimensionality = 768
    #     )
    #     print(type(output['embeddings'][0]))
    #     print(output['embeddings'][0])
    #     return output['embeddings'][0]

    @staticmethod
    def config_model(model_name="gemini-1.5-flash"):
        generation_config = {
            "candidate_count": 1,
            "temperature": 1,
            "top_p": 0.95,
            "top_k": 40,
            "max_output_tokens": 1500,
            "response_mime_type": "text/plain",
        }
        return genai.GenerativeModel(model_name=model_name, generation_config=generation_config)

    @staticmethod
    def config_model_search(model_name="gemini-1.5-flash"):
        generation_config = {
            "candidate_count": 1,
            "temperature": 1,
            "top_p": 0.95,
            "top_k": 40,
            "max_output_tokens": 1500,
            "response_schema": content.Schema(
                type = content.Type.OBJECT,
                required = ["answer_found_in_the_notes_with_these_note_slugs", "response"],
                properties = {
                    "answer_found_in_the_notes_with_these_note_slugs": content.Schema(
                        type = content.Type.ARRAY,
                        items = content.Schema(
                            type = content.Type.STRING,
                        ),
                    ),
                    "response": content.Schema(
                        type = content.Type.STRING,
                    ),
                },
            ),
            "response_mime_type": "application/json",
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
    async def caption_loader(youtube_video_id: str, model, only_transcript: bool):
        def _time(seconds):
            minutes = int(seconds // 60)
            seconds = int(seconds % 60)
            return (minutes, seconds)
        def _transcript(transcript: list[dict]):
            transcript_text = ""
            last_time = (0,0)
            for text in transcript:
                transcript_text += text['text']
                transcript_text += ' '
                seconds = float(text['start'])
                new_time = _time(seconds)
                if new_time != last_time:
                    last_time = new_time
                    transcript_text += f"({new_time[0]}:{new_time[1]}) "
            return transcript_text
        try:
            try:
                transcript: list[dict] = _transcript(YouTubeTranscriptApi.get_transcript(youtube_video_id, languages=['en', 'tr']))
            except: transcript: list[dict] = _transcript(YouTubeTranscriptApi.get_transcript(youtube_video_id))
        except Exception as e:
            raise HTTPException(status_code=404, detail=f"No transcipt found: {str(e)}")
        if only_transcript: yield transcript; return ''
        messages = []
        prompt = "You are an AI writing assistant that recieves the transcript of a youtube video and creates a detailed note that includes everything in the video. Make sure to construct complete sentences. Make sure to start with a brief summary and add comments or explanations when it is needed for better understanding. Use Markdown formatting when appropriate."
        messages.append({'role': 'user', 'parts': [prompt]})
        messages.append({'role': 'model', 'parts': ['I am an AI writing assistant and I will provide you only the text you desire.']})
        messages.append({'role': 'user', 'parts': [f'Transcript: {transcript}']})
        text_response = ""
        max_retries = 3
        retry_delay = 0.2
        for attempt in range(max_retries):
            try:
                for chunk in model.generate_content(messages, stream=True):
                    try:
                        text_response += chunk.text
                        yield chunk.text
                    except: 
                        pass
                break
            except ResourceExhausted as e:
                if attempt < max_retries - 1:
                    await asyncio.sleep(retry_delay)
                    retry_delay *= 2
                else:
                    raise HTTPException(status_code=429, detail=f"API quota exceeded. Please try again later: {str(e)}")

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

BUCKET = Loaders.config_bucket()

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

        for file in files:
            destination_file_name = f'{user_id}/{file.filename}'

            try:
                blob = BUCKET.blob(destination_file_name)
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
    def get_chat_history(user_id: str, note_id: str) -> list:
        destination_file_name = f'chat/history/{user_id}/{note_id}.json'
        blob = BUCKET.blob(destination_file_name)

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

    @staticmethod
    def update_chat_history(user_id: str, propmts: list[dict], note_id: str):
        chat_history = ChatHistory.get_chat_history(user_id=user_id, note_id=note_id)
        for row in propmts:
            chat_history.append(row)

        
        destination_file_name = f'chat/history/{user_id}/{note_id}.json'
        blob = BUCKET.blob(destination_file_name)

        try:
            json_data = json.dumps(chat_history, indent=2) 
            json_bytes = BytesIO(json_data.encode('utf-8'))
            blob.upload_from_file(json_bytes) 
        except Exception as e: HTTPException(status_code=500, detail=f"{destination_file_name} : File upload failed: {str(e)}")

    @staticmethod
    def upload_chat_history(user_id: str, chat_history: list[dict], note_id: str):
        destination_file_name = f'chat/history/{user_id}/{note_id}.json'
        blob = BUCKET.blob(destination_file_name)

        try:
            json_data = json.dumps(chat_history, indent=2) 
            json_bytes = BytesIO(json_data.encode('utf-8'))
            blob.upload_from_file(json_bytes) 
        except Exception as e: HTTPException(status_code=500, detail=f"{destination_file_name} : File upload failed: {str(e)}")

    @staticmethod
    def clear_chat_history(user_id: str, note_id: str):
        chat_history = []
        destination_file_name = f'chat/history/{user_id}/{note_id}.json'
        blob = BUCKET.blob(destination_file_name)

        try:
            json_data = json.dumps(chat_history, indent=2) 
            json_bytes = BytesIO(json_data.encode('utf-8'))
            blob.upload_from_file(json_bytes) 
        except Exception as e: HTTPException(status_code=404, detail=f"{destination_file_name} : File not found: {str(e)}")


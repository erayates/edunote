from fastapi import UploadFile, HTTPException
import google.generativeai as genai
import fitz, io, os
from google.ai.generativelanguage_v1beta.types import content
from langchain_community.document_loaders import YoutubeLoader

class Prompt():
    def __init__(self, safety_category: int = 0, generation_config: dict = None) -> None:
        self.safety_settings = self.safety_category_choose(safety_category)
        # self.generation_config = self.generation_config_choose(generation_config)
        self.categorized_propmt = {
            "user" : "",
            "template" : "You are an AI writing assistant that creates a template of titles and subtitles and other neccessary items from the existing text. Make sure to construct complete sentences. Use Markdown formatting when appropriate.",
            "ask" : "You are an AI writing assistant that answers the questions about the existing text. Make sure to construct complete sentences. Use Markdown formatting when appropriate.",
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

    def generate_response(self, prompt, option, user_query = None, language = None):
        if option == 'ask':
            messages = [
                {'role': 'user', 'parts': [self.categorized_propmt[option]]},
                {'role': 'model', 'parts': ['I am an AI writing assistant and I will provide you the text you desire.']},
                {'role': 'user', 'parts': f'Answer me in {language} from now on.'},
                {'role': 'user', 'parts': [f'{user_query}, Here is the text: {prompt}']}
            ]
        else:
            messages = [
                {'role': 'user', 'parts': [self.categorized_propmt[option]]},
                {'role': 'model', 'parts': ['I am an AI writing assistant and I will provide you the text you desire.']},
                {'role': 'user', 'parts': f'Answer me in {language} from now on.'},
                {'role': 'user', 'parts': [f'Here is the text: {prompt}']}
            ] if option != 'user' else [ {'role': 'user', 'parts': f'Answer me in {language} from now on.'}, {'role': 'user', 'parts': [user_query]} ]
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
    
    @staticmethod
    async def pdf_loader(file: UploadFile):
        pdf_bytes = await file.read()

        if not pdf_bytes:
            raise HTTPException(status_code=400, detail="Uploaded PDF file is empty.")

        pdf_stream = io.BytesIO(pdf_bytes)

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
    async def audio_loader(file: UploadFile, model: genai.GenerativeModel):
        if not file.filename.endswith(('.mp3', '.wav', '.m4a')):
            raise HTTPException(status_code=400, detail="Invalid file type. Please upload an audio file (mp3, wav, or m4a).")

        file_location = f"./{file.filename}"
        with open(file_location, "wb") as f:
            content = await file.read()
            f.write(content)

        prompt = "Summarize the speech from this audio file."

        audio_file = genai.upload_file(path=file_location)
        response = model.generate_content([prompt, audio_file])

        if os.path.exists(file_location):
            os.remove(file_location)
        else: pass

        return response.text
    
    @staticmethod
    async def image_loader(file: UploadFile):
        raise NotImplementedError
        extracted_text: str
        return extracted_text

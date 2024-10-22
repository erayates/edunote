from langchain.output_parsers import StructuredOutputParser, ResponseSchema
from langchain_google_genai import ChatGoogleGenerativeAI
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from KEY import GEMINI_API_KEY

# Define your response schema using LangChain's ResponseSchema
response_schema = ResponseSchema(
    name="summarized_text",
    description="Summarized text.",
    properties={
        "summarized_text_title": {"type": "string", "description": "Title of the summarized text"},
        "summarized_text": {"type": "string", "description": "Content of the summarized text"},
    },
)
output_parser = StructuredOutputParser.from_response_schemas([response_schema])

# Get the format instructions
format_instructions = output_parser.get_format_instructions()

# Initialize the Gemini model with LangChain
chat = ChatGoogleGenerativeAI(
    model="gemini-1.5-pro",
    api_key=GEMINI_API_KEY,
    temperature=1,
    top_p=0.95,
    top_k=64,
    max_output_tokens=1000,
)

# Include the format instructions in your prompt
prompt = f"""Summarize the following text.
Text: {{text}}

{format_instructions}
"""

example_text = """
The old lighthouse keeper, Silas, squinted at the swirling grey mist that had swallowed the sea. He'd seen countless storms in his sixty years tending the light, but this one felt different. A low, mournful groan echoed across the waves, a sound that chilled him to the bone.

Suddenly, a flicker of movement in the fog. A small boat, tossed like a leaf in the churning water, drifted towards the rocks. Silas sprang into action, his old bones protesting. He raced down the winding stairs, the lantern swinging wildly, casting eerie shadows on the stone walls."""

# Run the model and parse the output
response = chat.predict(prompt.format(text=example_text))
print(response)
output_dict = output_parser.parse(response)
print(output_dict)
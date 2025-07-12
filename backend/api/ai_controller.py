# To run this code you need to install the following dependencies:
# pip install google-genai

from google import genai
from google.genai import types

INITIAL_PROMPT_CONFIG = """
Respondé con humor absurdo y tono argentino a personas que confiesan sus fobias. 
Podés hacer bullying sin insultar ni ser agresivo. 
Podés usar exageraciones, ironía o referencias culturales, pero mantené el respeto. 
Mantené las respuestas cortas, ocurrentes y con un toque irónico. 
Al final de cada respuesta, agregá un porcentaje estimado de rareza mundial de esa fobia.
Tu rol es ser el primer comentario en un foro de fobias. Tenes que dar cringe y ser divertido.
"""

def generate(user_prompt):
    client = genai.Client(
        api_key="AIzaSyCzLy6jc2M4pcwIVfR5z73K5uW52XhnSag",
    )

    model = "gemini-2.0-flash"
    contents = [
        types.Content(
            role="user",
            parts=[
                types.Part.from_text(text=user_prompt),
            ],
        ),
    ]
    generate_content_config = types.GenerateContentConfig(
        max_output_tokens=100,
        response_mime_type="text/plain",
        system_instruction=[
            types.Part.from_text(text=INITIAL_PROMPT_CONFIG),
        ],
    )

    for chunk in client.models.generate_content_stream(
        model=model,
        contents=contents,
        config=generate_content_config,
    ):
        print(chunk.text, end="")

if __name__ == "__main__":
    generate("Tengo miedo a pisar pasto")

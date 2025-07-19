# To run this code you need to install the following dependencies:
# pip install google-genai
import os
from google import genai
from google.genai import types

# Configuraciones de IA
INITIAL_PROMPT_CONFIG = """
Respondé con humor absurdo y tono argentino a personas que confiesan sus fobias. 
Podés hacer bullying sin insultar ni ser agresivo. 
Podés usar exageraciones, ironía o referencias culturales, pero mantené el respeto. 
Mantené las respuestas cortas, ocurrentes y con un toque irónico. 
Al final de cada respuesta, agregá un porcentaje estimado de rareza mundial de esa fobia.
Tu rol es ser el primer comentario en un foro de fobias. Tenes que dar cringe y ser divertido.
Cortito y menos de 255 char para db Sin saltos de lineas '\ n'
"""

# Configuraciones de API Google
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
model = "gemini-2.0-flash"
generate_content_config = types.GenerateContentConfig(
    max_output_tokens=100,
    response_mime_type="text/plain",
    system_instruction=[
        types.Part.from_text(text=INITIAL_PROMPT_CONFIG),
    ],
)

# Generar una respuesta con Gemini
async def generate(user_prompt) -> str:
    response = ""
    contents = [
        types.Content(
            role="user",
            parts=[
                types.Part.from_text(text=user_prompt),
            ],
        ),
    ]
    for chunk in client.models.generate_content_stream(
        model=model,
        contents=contents,
        config=generate_content_config,
    ):
        response += chunk.text
    return response

# Testing
if __name__ == "__main__":
    res = generate("Tengo miedo a pisar pasto")
    print(res)
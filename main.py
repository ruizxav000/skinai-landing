from fastapi import FastAPI
from pydantic import BaseModel
import openai

openai.api_key = "YOUR_OPENAI_API_KEY"

app = FastAPI()

class ImagePayload(BaseModel):
    image_base64: str

@app.post("/analyze")
async def analyze_image(payload: ImagePayload):
    image_data = payload.image_base64

    response = openai.ChatCompletion.create(
        model="gpt-4-vision-preview",
        messages=[
            {"role": "system", "content": "You are a helpful medical assistant specialized in dermatology."},
            {"role": "user", "content": [
                {"type": "text", "text": "What skin condition might this be? Provide a possible diagnosis and recommend an over-the-counter treatment."},
                {"type": "image_url", "image_url": {
                    "url": f"data:image/jpeg;base64,{image_data}"
                }}
            ]}
        ],
        max_tokens=800
    )

    answer = response.choices[0].message["content"]
    return {"diagnosis": answer}

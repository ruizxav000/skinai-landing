from fastapi import FastAPI, Request
from pydantic import BaseModel
import openai
from fastapi.middleware.cors import CORSMiddleware

openai.api_key = "YOUR_OPENAI_API_KEY"

app = FastAPI()

# CORS for local dev
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatPayload(BaseModel):
    question: str
    context: str

@app.post("/chat")
async def chat_follow_up(payload: ChatPayload):
    messages = [
        {"role": "system", "content": "You are a helpful medical assistant specialized in dermatology."},
        {"role": "user", "content": f"Here is a diagnosis summary: {payload.context}"},
        {"role": "user", "content": f"My question is: {payload.question}"}
    ]

    response = openai.ChatCompletion.create(
        model="gpt-4",
        messages=messages,
        max_tokens=400
    )

    return {"answer": response.choices[0].message["content"]}

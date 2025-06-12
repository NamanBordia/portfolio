from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict
import json
from difflib import get_close_matches
import os
from transformers import AutoTokenizer, AutoModel
import torch
import numpy as np

app = FastAPI()

# CORS middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load BERT model and tokenizer
tokenizer = AutoTokenizer.from_pretrained('bert-base-uncased')
model = AutoModel.from_pretrained('bert-base-uncased')

# Pydantic models
class ContactForm(BaseModel):
    name: str
    email: str
    message: str

class ChatRequest(BaseModel):
    question: str

# Load profile data
def load_profile_data():
    try:
        with open("data/profile.json", "r") as f:
            return json.load(f)
    except FileNotFoundError:
        return None

# Load projects data
def load_projects_data():
    try:
        with open("data/projects.json", "r") as f:
            return json.load(f)
    except FileNotFoundError:
        return []

# Load context data
def load_context_data():
    try:
        with open('data/context.json', 'r') as f:
            return json.load(f)
    except FileNotFoundError:
        return None

# Generate BERT embeddings
def get_bert_embedding(text: str) -> np.ndarray:
    inputs = tokenizer(text, return_tensors="pt", padding=True, truncation=True, max_length=512)
    with torch.no_grad():
        outputs = model(**inputs)
    # Use [CLS] token embedding as sentence embedding
    return outputs.last_hidden_state[:, 0, :].numpy().flatten()  # Flatten the array

# Calculate cosine similarity
def cosine_similarity(a: np.ndarray, b: np.ndarray) -> float:
    return float(np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b)))

# Find most relevant context
def find_relevant_context(question: str, contexts: List[Dict]) -> str:
    question_embedding = get_bert_embedding(question)
    
    max_similarity = -1
    most_relevant_context = ""
    
    for context in contexts:
        context_embedding = get_bert_embedding(context["text"])
        similarity = cosine_similarity(question_embedding, context_embedding)
        
        if similarity > max_similarity:
            max_similarity = similarity
            most_relevant_context = context["response"]
    
    return most_relevant_context

# Chat endpoint
@app.post("/api/chat")
async def chat(request: ChatRequest):
    context_data = load_context_data()
    if not context_data:
        raise HTTPException(status_code=500, detail="Context data not found")
    
    # Find relevant context
    response = find_relevant_context(request.question, context_data["contexts"])
    
    if not response:
        response = "I'm sorry, I don't have enough information to answer that question. Please try asking something else about Naman's experience, skills, or projects."
    
    return {"answer": response}

# Contact form endpoint
@app.post("/api/contact")
async def contact(form: ContactForm):
    # Here you would typically save to database or send email
    # For now, we'll just return success
    return {"message": "Message received! I'll get back to you soon."}

# Get profile data endpoint
@app.get("/api/profile")
async def get_profile():
    profile_data = load_profile_data()
    if not profile_data:
        raise HTTPException(status_code=500, detail="Profile data not found")
    return profile_data

# Get projects endpoint
@app.get("/api/projects")
async def get_projects():
    projects_data = load_projects_data()
    if not projects_data:
        raise HTTPException(status_code=500, detail="Projects data not found")
    return projects_data

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 
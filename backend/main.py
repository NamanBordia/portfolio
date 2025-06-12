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
import gc
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

# CORS middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",  # Local development
        "https://*.vercel.app",   # All Vercel preview deployments
        "https://portfolio-frontend-*.vercel.app",  # Your Vercel domain
        "https://your-portfolio.vercel.app"  # Your production Vercel domain
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize model and tokenizer as None
model = None
tokenizer = None

def load_model():
    global model, tokenizer
    try:
        logger.info("Loading BERT model...")
        tokenizer = AutoTokenizer.from_pretrained('prajjwal1/bert-mini')
        model = AutoModel.from_pretrained('prajjwal1/bert-mini')
        model.eval()
        model = model.to('cpu')
        logger.info("BERT model loaded successfully!")
    except Exception as e:
        logger.error(f"Error loading model: {str(e)}")
        raise

# Load model on startup
@app.on_event("startup")
async def startup_event():
    load_model()

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
        logger.error("Profile data file not found")
        return None
    except Exception as e:
        logger.error(f"Error loading profile data: {str(e)}")
        return None

# Load projects data
def load_projects_data():
    try:
        with open("data/projects.json", "r") as f:
            return json.load(f)
    except FileNotFoundError:
        logger.error("Projects data file not found")
        return []
    except Exception as e:
        logger.error(f"Error loading projects data: {str(e)}")
        return []

# Load context data
def load_context_data():
    try:
        with open('data/context.json', 'r') as f:
            return json.load(f)
    except FileNotFoundError:
        logger.error("Context data file not found")
        return None
    except Exception as e:
        logger.error(f"Error loading context data: {str(e)}")
        return None

# Generate BERT embeddings with memory optimization
def get_bert_embedding(text: str) -> np.ndarray:
    try:
        if model is None or tokenizer is None:
            load_model()
            
        # Tokenize with smaller max length
        inputs = tokenizer(text, return_tensors="pt", padding=True, truncation=True, max_length=64)
        
        # Move inputs to CPU
        inputs = {k: v.to('cpu') for k, v in inputs.items()}
        
        # Generate embeddings with no_grad
        with torch.no_grad():
            outputs = model(**inputs)
        
        # Use [CLS] token embedding as sentence embedding
        embedding = outputs.last_hidden_state[:, 0, :].numpy().flatten()
        
        # Clear memory
        del outputs
        del inputs
        gc.collect()
        if torch.cuda.is_available():
            torch.cuda.empty_cache()
        
        return embedding
    except Exception as e:
        logger.error(f"Error generating embedding: {str(e)}")
        raise

# Calculate cosine similarity
def cosine_similarity(a: np.ndarray, b: np.ndarray) -> float:
    return float(np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b)))

# Find most relevant context
def find_relevant_context(question: str, contexts: List[Dict]) -> str:
    try:
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
    except Exception as e:
        logger.error(f"Error finding relevant context: {str(e)}")
        return "I'm sorry, I'm having trouble processing your question right now. Please try again later."

# Chat endpoint
@app.post("/api/chat")
async def chat(request: ChatRequest):
    try:
        context_data = load_context_data()
        if not context_data:
            raise HTTPException(status_code=500, detail="Context data not found")
        
        # Find relevant context
        response = find_relevant_context(request.question, context_data["contexts"])
        
        if not response:
            response = "I'm sorry, I don't have enough information to answer that question. Please try asking something else about Naman's experience, skills, or projects."
        
        return {"answer": response}
    except Exception as e:
        logger.error(f"Error in chat endpoint: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# Contact form endpoint
@app.post("/api/contact")
async def contact(form: ContactForm):
    try:
        # Here you would typically save to database or send email
        # For now, we'll just return success
        return {"message": "Message received! I'll get back to you soon."}
    except Exception as e:
        logger.error(f"Error in contact endpoint: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# Get profile data endpoint
@app.get("/api/profile")
async def get_profile():
    try:
        profile_data = load_profile_data()
        if not profile_data:
            raise HTTPException(status_code=500, detail="Profile data not found")
        return profile_data
    except Exception as e:
        logger.error(f"Error in profile endpoint: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# Get projects endpoint
@app.get("/api/projects")
async def get_projects():
    try:
        projects_data = load_projects_data()
        if not projects_data:
            raise HTTPException(status_code=500, detail="Projects data not found")
        return projects_data
    except Exception as e:
        logger.error(f"Error in projects endpoint: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 

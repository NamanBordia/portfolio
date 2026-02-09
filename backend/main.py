from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict
import json
from difflib import get_close_matches
import os
import logging
import time
from groq import Groq
from dotenv import load_dotenv
from pathlib import Path

# Load environment variables from backend/.env
env_path = Path(__file__).parent / '.env'
load_dotenv(dotenv_path=env_path)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Portfolio Backend API",
    description="Backend API for Naman's Portfolio",
    version="1.0.0"
)

# CORS middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001", 
        "https://portfolio-livid-mu-60.vercel.app",
        "https://*.vercel.app",
        "*"
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["*"]
)

# Configure Groq API
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
groq_client = None
if GROQ_API_KEY:
    groq_client = Groq(api_key=GROQ_API_KEY)
    logger.info("Groq API configured successfully!")
else:
    logger.warning("GROQ_API_KEY not found in environment variables")

# Startup event
@app.on_event("startup")
async def startup_event():
    logger.info("Backend started with Groq API.")
    pass

# Root endpoint
@app.get("/")
async def root():
    return {
        "status": "ok",
        "message": "Welcome to Portfolio Backend API",
        "endpoints": {
            "profile": "/api/profile",
            "projects": "/api/projects",
            "chat": "/api/chat",
            "contact": "/api/contact"
        },
        "docs": "/docs"
    }

# Health check endpoint
@app.get("/health")
async def health_check():
    return {
        "status": "ok",
        "groq_configured": GROQ_API_KEY is not None,
        "groq_client_exists": groq_client is not None,
        "timestamp": time.time()
    }

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
        file_path = Path(__file__).parent / "data" / "profile.json"
        with open(file_path, "r") as f:
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
        file_path = Path(__file__).parent / "data" / "projects.json"
        with open(file_path, "r") as f:
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
        file_path = Path(__file__).parent / "data" / "context.json"
        with open(file_path, 'r') as f:
            return json.load(f)
    except FileNotFoundError:
        logger.error("Context data file not found")
        return None
    except Exception as e:
        logger.error(f"Error loading context data: {str(e)}")
        return None

# Build comprehensive context from all data sources
def build_complete_context() -> str:
    """Build a complete context string from profile, projects, and context data."""
    context_parts = []
    
    # Load and add profile data
    profile_data = load_profile_data()
    if profile_data:
        context_parts.append("=== PROFILE INFORMATION ===")
        for item in profile_data:
            context_parts.append(f"Q: {item['question']}\nA: {item['answer']}")
    
    # Load and add projects data
    projects_data = load_projects_data()
    if projects_data:
        context_parts.append("\n=== PROJECTS ===")
        for project in projects_data:
            tech_stack = ", ".join(project.get('technologies', []))
            project_info = f"""
Project: {project['title']}
Description: {project['description']}
Technologies: {tech_stack}
GitHub: {project.get('github', 'N/A')}
Live Demo: {project.get('live', 'N/A')}
"""
            context_parts.append(project_info)
    
    # Load and add context data
    context_data = load_context_data()
    if context_data and 'contexts' in context_data:
        context_parts.append("\n=== ADDITIONAL CONTEXT ===")
        for ctx in context_data['contexts']:
            context_parts.append(f"Q: {ctx['text']}\nA: {ctx['response']}")
    
    return "\n\n".join(context_parts)

# Conversational chatbot using Groq with full context
def chat_with_groq(question: str) -> str:
    print(f"=== CHAT_WITH_GROQ CALLED with question: {question} ===")
    print(f"=== groq_client is None: {groq_client is None} ===")
    try:
        if not groq_client:
            print("!!! groq_client is None, returning error message !!!")
            return "I'm sorry, the AI service is not configured. Please contact the administrator."
        
        print("=== Building context... ===")
        # Build complete context
        full_context = build_complete_context()
        
        print("=== Creating system prompt... ===")
        # Create conversational system prompt
        system_prompt = f"""You are Naman Bordia's intelligent AI assistant on his portfolio website. You have complete knowledge about Naman's background, experience, skills, projects, and achievements.

COMPLETE INFORMATION ABOUT NAMAN:
{full_context}

YOUR PERSONALITY & BEHAVIOR:
- You ARE Naman speaking in first person (use "I", "my", "me")
- Be warm, friendly, and conversational like a real person
- Show enthusiasm when talking about projects and achievements
- Be natural - use casual language when appropriate
- If asked about something not in the context, politely say you don't have that specific information
- Keep responses concise but informative (2-4 sentences for simple questions, more for complex ones)
- Feel free to add personality and context to your answers
- If greeted (hi, hello, hey), respond warmly and offer to help

REMEMBER:
- You are Naman Bordia, a B.Tech CSE student specializing in AI/ML
- You have research publications and work experience at a UC Berkeley startup
- You're passionate about RAG systems, deep learning, and full-stack development
- Answer as if YOU are the person being asked about"""
        
        # Generate response using Groq
        chat_completion = groq_client.chat.completions.create(
            messages=[
                {
                    "role": "system",
                    "content": system_prompt
                },
                {
                    "role": "user",
                    "content": question
                }
            ],
            model="llama-3.3-70b-versatile",  # Fast and capable model
            temperature=0.7,
            max_tokens=1024,
        )
        
        return chat_completion.choices[0].message.content.strip()
        
    except Exception as e:
        print(f"ERROR IN CHAT_WITH_GROQ: {str(e)}")  # Add console print
        logger.error(f"Error with Groq API: {str(e)}")
        logger.exception("Full traceback:")
        import traceback
        traceback.print_exc()  # Print full traceback to console
        return "I'm sorry, I'm having trouble responding right now. Could you please try again?"

# Fallback function using simple keyword matching
def fallback_context_search(question: str, contexts: List[Dict]) -> str:
    try:
        question_lower = question.lower()
        best_match = None
        max_score = 0
        
        for context in contexts:
            # Simple keyword matching
            context_text = context["text"].lower()
            score = sum(word in context_text for word in question_lower.split())
            
            if score > max_score:
                max_score = score
                best_match = context["response"]
        
        if best_match:
            return best_match
        else:
            return "I'm sorry, I don't have enough information to answer that question. Please try asking about Naman's experience, skills, education, or projects."
    except Exception as e:
        logger.error(f"Error in fallback search: {str(e)}")
        return "I'm sorry, I'm having trouble processing your question right now. Please try again later."

# Chat endpoint
@app.post("/api/chat")
async def chat(request: ChatRequest):
    try:
        if not groq_client:
            return {"answer": "AI service not configured. Please contact administrator."}
        
        # Build complete context
        try:
            full_context = build_complete_context()
            if not full_context:
                return {"answer": "ERROR: Context is empty!"}
        except Exception as ctx_error:
            return {"answer": f"ERROR building context: {str(ctx_error)}"}
        
        # Create system prompt
        system_prompt = f"""You are Naman Bordia's AI assistant. You have complete knowledge about Naman's background, experience, skills, projects, and achievements.

INFORMATION ABOUT NAMAN:
{full_context}

PERSONALITY:
- Speak in first person (use "I", "my", "me")
- Be warm, friendly, and conversational
- Show enthusiasm about projects and achievements
- Keep responses concise (2-4 sentences for simple questions)
- If greeted, respond warmly and offer to help

You are Naman Bordia, a B.Tech CSE student specializing in AI/ML with research publications and work experience at a UC Berkeley startup."""
        
        # Generate response - using smaller/faster model to save tokens
        chat_completion = groq_client.chat.completions.create(
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": request.question}
            ],
            model="llama-3.1-8b-instant",  # Smaller model, faster, fewer tokens
            temperature=0.7,
            max_tokens=512,  # Reduced from 1024 to save tokens
        )
        
        return {"answer": chat_completion.choices[0].message.content.strip()}
        
    except Exception as e:
        # Check if rate limit error
        if "rate_limit" in str(e).lower() or "429" in str(e):
            return {"answer": "I'm taking a quick break! The free API limit has been reached. Please try again in about an hour, or contact Naman directly via the contact form."}
        return {"answer": f"I'm sorry, I'm having trouble responding right now. Could you please try again?"}

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
// Vercel Serverless Function for Chat API
const Groq = require("groq-sdk");

// Initialize Groq AI
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Profile and context data
const profileData = [
    {
        "question": "What is your name?",
        "answer": "I'm Naman Bordia."
    },
    {
        "question": "What is your education?",
        "answer": "I'm currently pursuing B.Tech (Hons.) in Computer Science and Engineering at RV University, Bangalore (2023-2027), with a specialization in AI/ML. My current GPA is 8.965/10.0. My coursework includes Data Structures & Algorithms, Operating Systems, DBMS, Computer Networks, and Software Engineering."
    },
    {
        "question": "What are your skills?",
        "answer": "I have expertise in various technologies including:\\n- Languages: Python, Java, C++, C, JavaScript, SQL, Solidity\\n- Core CS: Data Structures & Algorithms, OOP, Operating Systems, DBMS, Computer Networks\\n- Frameworks & Libraries: React.js, Node.js, Flask, NumPy, Pandas, LangChain\\n- Systems & Tools: Docker, Git, MongoDB, ChromaDB, AWS, REST APIs\\n- Concepts: Software Engineering, Distributed Systems (Basics), RAG, Deep Learning (LSTM), IoT, Agile"
    },
    {
        "question": "What are your certifications?",
        "answer": "I have several certifications including:\\n- Machine Learning Specialization from Coursera\\n- Design & Implementation of Human-Computer Interfaces from NPTEL\\n- Programming in Modern C++ from NPTEL"
    },
    {
        "question": "What languages do you know?",
        "answer": "I am fluent in Hindi (Native) and English (Full Professional Proficiency)."
    },
    {
        "question": "What is your work experience?",
        "answer": "I have two main work experiences:\\n\\n1. Frontend Intern at Governaice (UC Berkeley Startup) - Remote (2025):\\n- Designed and developed scalable frontend architecture using React.js for a production-grade web platform\\n- Collaborated with cross-functional stakeholders to translate product requirements into performant UI components\\n- Improved responsiveness and page performance, enhancing user experience across devices\\n\\n2. Research Intern at CVCSI Research Center, RV University - Bangalore (2024):\\n- Worked on data distillation and synthetic data generation to improve ML training efficiency\\n- Applied engineering principles to preprocess large datasets and evaluate model reliability"
    },
    {
        "question": "What are your notable projects?",
        "answer": "Some of my notable projects include:\\n1. PhysioRAG: Evidence-Based Physiotherapy AI - A RAG system with 0.89 Faithfulness score using PubMedBERT embeddings and ChromaDB (2025)\\n2. Real-Time Predictive Maintenance System - IoT + LSTM-based system using ESP32 sensors with Flask backend (2025)\\n3. Community Issue Reporting Platform - Full-stack web application with React + Flask (2025)\\n4. Automatic Door Locking System - Smartphone-controlled IoT security system (2024)"
    },
    {
        "question": "What are your achievements?",
        "answer": "My achievements include:\\n- Published research paper on PhysioRAG accepted via EDAS (2025)\\n- Research paper on Synthetic Data Generation submitted to IEEE RECAP 2026 (under review)\\n- Achieved 3× improvement in minority-class F1-score in synthetic data generation research\\n- Achieved 0.89 Faithfulness score with PhysioRAG system\\n- Built multiple production-grade full-stack projects\\n- Worked with a UC Berkeley startup on production systems"
    },
    {
        "question": "How can I contact you?",
        "answer": "You can reach me through:\\n- Email: namanbordia@gmail.com\\n- Phone: +91 9351061670\\n- GitHub: NamanBordia\\n- LinkedIn: naman-bordia"
    }
];

const projectsData = [
    {
        "id": 1,
        "title": "PhysioRAG: Evidence-Based Physiotherapy AI",
        "description": "A modular Retrieval-Augmented Generation (RAG) system grounded in peer-reviewed medical literature. Built a large-scale knowledge base from 20,000+ PubMed Central articles using PubMedBERT embeddings and ChromaDB. Achieved 0.89 Faithfulness (RAGAS) with significant gains in Precision@5 and Recall@5.",
        "technologies": ["Python", "PubMedBERT", "ChromaDB", "LangChain", "RAG", "Flask", "React"]
    },
    {
        "id": 2,
        "title": "Real-Time Predictive Maintenance System",
        "description": "Built a real-time data collection system using ESP32 sensors to monitor vibration and temperature. Designed a Flask-based backend serving LSTM models for multi-step time-series forecasting.",
        "technologies": ["Python", "Flask", "LSTM", "IoT", "ESP32", "Deep Learning", "Time Series"]
    },
    {
        "id": 3,
        "title": "Community Issue Reporting Platform",
        "description": "Developed a full-stack web application for reporting and tracking community issues. Implemented RESTful APIs, role-based access control, and admin management tools.",
        "technologies": ["React", "Flask", "MySQL", "REST APIs", "JWT", "TailwindCSS"]
    },
    {
        "id": 4,
        "title": "Automatic Door Locking System",
        "description": "Built a smartphone-controlled IoT security system using local network communication. Implemented secure device control and real-time status monitoring for enhanced home security.",
        "technologies": ["IoT", "Arduino", "ESP32", "Mobile App", "Embedded Systems"]
    },
    {
        "id": 5,
        "title": "NoCodeML Tool",
        "description": "A user-friendly tool that allows users to upload CSV files, select ML models, and train them without writing code. Supports both regression and classification tasks.",
        "technologies": ["React", "FastAPI", "Python", "Machine Learning"]
    }
];

const contextData = [
    {
        "text": "Tell me about yourself",
        "response": "I'm Naman Bordia, a B.Tech (Hons.) Computer Science student at RV University specializing in AI/ML. I have a strong passion for building intelligent systems, particularly RAG-based applications and deep learning models. I've published research on PhysioRAG and worked as a Frontend Intern at Governaice, a UC Berkeley startup."
    },
    {
        "text": "What are you currently working on?",
        "response": "I'm currently focused on advancing my research in Retrieval-Augmented Generation systems and exploring production-grade full-stack development. I recently completed my work at Governaice (UC Berkeley startup) where I designed scalable frontend architectures using React.js."
    }
];

// Build complete context for Gemini
function buildCompleteContext() {
    let context = "=== PROFILE INFORMATION ===\n";
    profileData.forEach(item => {
        context += `Q: ${item.question}\nA: ${item.answer}\n\n`;
    });
    
    context += "\n=== PROJECTS ===\n";
    projectsData.forEach(project => {
        const techStack = project.technologies.join(", ");
        context += `Project: ${project.title}\nDescription: ${project.description}\nTechnologies: ${techStack}\n\n`;
    });
    
    context += "\n=== ADDITIONAL CONTEXT ===\n";
    contextData.forEach(ctx => {
        context += `Q: ${ctx.text}\nA: ${ctx.response}\n\n`;
    });
    
    return context;
}

// Chat with Groq
async function chatWithGroq(question) {
    try {
        if (!process.env.GROQ_API_KEY) {
            throw new Error("GROQ_API_KEY not configured");
        }

        const fullContext = buildCompleteContext();
        
        const systemPrompt = `You are Naman Bordia's intelligent AI assistant on his portfolio website. You have complete knowledge about Naman's background, experience, skills, projects, and achievements.

COMPLETE INFORMATION ABOUT NAMAN:
${fullContext}

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
- Answer as if YOU are the person being asked about`;
        
        const chatCompletion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: systemPrompt
                },
                {
                    role: "user",
                    content: question
                }
            ],
            model: "llama-3.1-8b-instant",  // Faster, uses fewer tokens
            temperature: 0.7,
            max_tokens: 512,  // Reduced to save tokens
        });
        
        return chatCompletion.choices[0].message.content.trim();
        
    } catch (error) {
        console.error("Error with Groq API:", error);
        // Check if rate limit error
        if (error.message && (error.message.includes('rate_limit') || error.message.includes('429'))) {
            return "I'm taking a quick break! The free API limit has been reached. Please try again in about an hour, or contact Naman directly via the contact form.";
        }
        throw error;
    }
}

// Serverless function handler
module.exports = async (req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    // Handle preflight request
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { question } = req.body;

        if (!question || typeof question !== 'string') {
            return res.status(400).json({ error: 'Question is required and must be a string' });
        }

        const answer = await chatWithGroq(question);
        
        return res.status(200).json({ answer });
        
    } catch (error) {
        console.error('Chat API error:', error);
        return res.status(500).json({ 
            answer: "I'm sorry, I'm having trouble responding right now. Could you please try again?" 
        });
    }
};

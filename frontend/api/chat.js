// Vercel Serverless Function for Chat API
const Groq = require("groq-sdk");

// Groq client initialized lazily at request time
let groq = null;
function getGroqClient() {
  if (!groq) {
    groq = new Groq({ apiKey: process.env.GROQ_API_KEY, timeout: 20000, maxRetries: 0 });
  }
  return groq;
}

// Shared resume data is also used by the portfolio sections.
const profile = require('../src/data/profile.json');
const projectsData = require('../src/data/projects.json');

function buildCompleteContext() {
    return [
        '=== PROFILE, EDUCATION, SKILLS, EXPERIENCE, PUBLICATIONS AND CONTACT ===',
        JSON.stringify(profile, null, 2),
        '=== ALL PORTFOLIO PROJECTS ===',
        JSON.stringify(projectsData, null, 2),
    ].join('\n\n');
}

// Chat with Groq
async function chatWithGroq(question) {
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

    const chatCompletion = await getGroqClient().chat.completions.create({
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
        model: process.env.GROQ_MODEL || "openai/gpt-oss-20b",
        temperature: 0.7,
        max_tokens: 1024,
    });

    const answer = chatCompletion.choices?.[0]?.message?.content?.trim();
    if (!answer) {
        throw new Error('Chat provider returned an empty answer');
    }
    return answer;
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
        let body = req.body;
        if (typeof body === 'string') {
            try {
                body = JSON.parse(body);
            } catch {
                return res.status(400).json({ answer: 'Please send a valid chat message.' });
            }
        }
        const { question } = body || {};

        if (typeof question !== 'string' || !question.trim()) {
            return res.status(400).json({ answer: 'Please enter a question.' });
        }

        const answer = await chatWithGroq(question.trim());

        return res.status(200).json({ answer });

    } catch (error) {
        // Log useful diagnostics without logging the API key or request headers.
        console.error('Chat API error:', {
            status: error.status,
            code: error.error?.error?.code || error.code,
            name: error.name,
        });
        if (error.status === 429) {
            return res.status(429).json({ answer: "I'm receiving too many requests right now. Please try again shortly." });
        }
        if (!process.env.GROQ_API_KEY || error.status === 401 || error.status === 403) {
            return res.status(503).json({ answer: 'My AI service is temporarily unavailable. Please contact Naman using the contact section.' });
        }
        if (error.name === 'APIConnectionTimeoutError') {
            return res.status(504).json({ answer: 'The response took too long. Please try again.' });
        }
        return res.status(502).json({ answer: "I'm having trouble connecting to my AI service. Please try again shortly." });
    }
};

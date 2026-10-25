# Deployment

The portfolio consists of a React frontend and one active Vercel serverless function: `frontend/api/chat.js`.

## Configuration

- Frontend directory: `frontend`
- Build command: `npm run build`
- Build output: `frontend/build` (or `build` when the project root is `frontend`)
- Chat endpoint: `POST /api/chat`
- Required server-side environment variable: `GROQ_API_KEY`
- Optional model override: `GROQ_MODEL` (defaults to `openai/gpt-oss-20b`)

The repository-level `vercel.json` retains the existing build and routing configuration. If the Vercel project uses `frontend` as its root, its `api/chat.js` function is inside that root.

Set `GROQ_API_KEY` in the hosting environment. Do not prefix it with `REACT_APP_` or put it in browser code. The function reads it at request time.

For local development, run `npm start` from `frontend`. The development middleware in `src/setupProxy.js` serves `/api/chat` using the same handler as Vercel. Put `GROQ_API_KEY` in `frontend/.env` and restart the development server after changing environment variables, the API, or the middleware. You can also use the Vercel development runtime.

## Content updates

- Projects: `frontend/src/data/projects.json`
- Education, skills, internships, publications, and assistant profile: `frontend/src/data/profile.json`
- Chatbot implementation: `frontend/api/chat.js`
- About, experience, and contact details: `frontend/src/components/`
- Resume: `frontend/public/assets/resume.pdf`
- Portrait: `frontend/public/assets/myimg2.png`

No Render service, Python dependencies, database, or separate backend process is required.

## Chatbot troubleshooting

The previous `llama-3.1-8b-instant` model is unavailable to the configured key. The chatbot now defaults to `openai/gpt-oss-20b`. If setting `GROQ_MODEL`, select a chat model available to your Groq account. Changes to code or Vercel environment variables require a new deployment.

Verify that `GROQ_API_KEY` is configured for the intended Vercel environment. A frontend production build alone does not verify the live model connection.

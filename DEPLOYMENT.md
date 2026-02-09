# Portfolio - Vercel Hybrid Setup

## Architecture

This portfolio uses a **hybrid approach** with Vercel:

- **Frontend**: React app with hardcoded project data (fast loading, no API calls needed)
- **Serverless Function**: `/api/chat` endpoint for chatbot (protects Gemini API key)

## Structure

```
frontend/
├── src/
│   ├── data/
│   │   ├── projects.js      # All projects data (imported directly)
│   │   └── chatContext.js   # Profile & context data for chatbot
│   ├── pages/
│   │   ├── Projects.js      # Uses local data (no API call)
│   │   ├── Chatbot.js       # Calls /api/chat serverless function
│   │   └── About.js         # Static content
│   └── ...
├── api/
│   └── chat.js              # Vercel serverless function (Node.js)
├── .env                      # API key (GEMINI_API_KEY)
└── package.json
```

## Local Development

1. **Install dependencies:**
   ```bash
   cd frontend
   npm install @google/generative-ai
   ```

2. **Set up environment variable:**
   Create `frontend/.env`:
   ```
   GEMINI_API_KEY=your_key_here
   ```

3. **Run locally:**
   ```bash
   npm start
   ```

4. **Test serverless function locally:**
   Install Vercel CLI:
   ```bash
   npm install -g vercel
   vercel dev
   ```

## Deployment to Vercel

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Migrate to Vercel hybrid setup"
   git push
   ```

2. **Deploy on Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Set root directory to `frontend`
   - Add environment variable: `GEMINI_API_KEY`
   - Deploy!

3. **Set Environment Variable:**
   - Go to Project Settings → Environment Variables
   - Add: `GEMINI_API_KEY` = `your_api_key`
   - Save and redeploy

## Benefits

✅ **Fast Loading**: Projects load instantly (no backend API call)  
✅ **Secure**: API key hidden in serverless function  
✅ **Free Hosting**: Vercel free tier is generous  
✅ **Auto-Scaling**: Serverless functions scale automatically  
✅ **Simple Deployment**: Single platform, one command  

## API Endpoints

- `GET /` - Frontend app
- `POST /api/chat` - Chatbot API (serverless function)

## Notes

- Backend folder is no longer needed for deployment
- Projects data is now in `frontend/src/data/projects.js`
- Chatbot context is in `frontend/src/data/chatContext.js`
- All data updates should be made in these files

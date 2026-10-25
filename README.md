# Naman Bordia - Portfolio

A responsive, single-page portfolio built with React, Tailwind CSS, and Framer Motion.

The compact portfolio opens with professional profiles and career highlights, followed by three featured projects, concise experience and research, expandable certifications, and email contact. All seven projects remain available through "View all projects." The resume overlay and AI assistant remain available.

## Local development

From `frontend`, run:

```sh
npm ci
npm start
```

To create a production build:

```sh
npm run build
```

`npm start` serves both the React app and `/api/chat` through `src/setupProxy.js`. Set `GROQ_API_KEY` in `frontend/.env`; Create React App loads it for the Node development server. Keep the name server-side (without a `REACT_APP_` prefix). Restart `npm start` after changing the API, local middleware, or environment variables.

## Project structure

- `frontend/src/components/`: active portfolio sections, navigation, resume overlay, and chatbot panel.
- `frontend/src/data/projects.json`: project content.
- `frontend/public/assets/`: portrait and resume PDF.
- `frontend/src/data/profile.json`: shared education, skills, experience, publications, and chatbot profile.
- `frontend/api/chat.js`: active serverless chatbot endpoint, using the shared JSON data.
- `vercel.json`: repository-level deployment configuration.

The previous Python backend is unused and has been removed. No Python environment or separate backend server is required.

See [DEPLOYMENT.md](DEPLOYMENT.md) for deployment notes.

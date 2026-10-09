# EduAI — AI for Education Hackathon Project

A full-stack learning assistant built with React + Vite, Node.js + Express, MongoDB, JWT authentication, and the OpenAI API.

## Features

- Real account registration and login (passwords hashed with bcrypt)
- JWT-protected API routes
- AI Tutor: ask educational questions and receive explanations
- Notes Generator: summarize text into study notes
- Quiz Generator: create multiple-choice practice questions
- Learning history saved to MongoDB per user
- Responsive student dashboard
- API keys stay on the backend; never expose `OPENAI_API_KEY` in frontend code

## Requirements

- Node.js 18.18+ (Node.js 20+ recommended)
- npm
- MongoDB local instance or MongoDB Atlas connection string
- OpenAI API key with API access and available billing/credits

## Project structure

```text
EduAI-Hackathon/
├── frontend/              # React + Vite app
├── backend/               # Express API
├── .env.example           # Environment variable template
├── .gitignore
└── README.md
```

## 1. Configure environment variables

From the project root, copy `.env.example` to `backend/.env`:

**Windows PowerShell**
```powershell
Copy-Item .env.example backend/.env
```

**macOS / Linux**
```bash
cp .env.example backend/.env
```

Edit `backend/.env` and set:
- `MONGODB_URI` — your MongoDB connection string
- `JWT_SECRET` — a long random secret (at least 32 characters recommended)
- `OPENAI_API_KEY` — your secret OpenAI API key
- `OPENAI_MODEL` — model available to your account (default is `gpt-4.1-mini`)

Do not commit `backend/.env` or share your API key. If using MongoDB Atlas, allow your current IP in Network Access and create a database user.

## 2. Install dependencies

Open a terminal in the project root.

```bash
cd backend
npm install
cd ../frontend
npm install
```

## 3. Start the backend

From the project root:

```bash
cd backend
npm run dev
```

The API starts at `http://localhost:5000`. Health check: `http://localhost:5000/api/health`.

## 4. Start the frontend

Open a second terminal:

```bash
cd frontend
npm run dev
```

Open the local URL printed by Vite, usually `http://localhost:5173`.

## 5. Demo flow

1. Register an account from the EduAI login screen.
2. Sign in.
3. Open **AI Tutor**, enter a learning question, and submit.
4. Use **Study Notes** to summarize a chapter or pasted notes.
5. Use **Quiz Maker** to generate multiple-choice questions.
6. Return to **Dashboard** to view saved learning activity.

The app requires a working OpenAI API key for AI features. It intentionally does not include a fake AI fallback because this project is configured for real AI only.

## API overview

| Method | Endpoint | Auth | Purpose |
|---|---|---|---|
| GET | `/api/health` | No | Health check |
| POST | `/api/auth/register` | No | Create account |
| POST | `/api/auth/login` | No | Log in |
| GET | `/api/auth/me` | Yes | Current user |
| GET | `/api/learning/history` | Yes | Current user's history |
| POST | `/api/learning/tutor` | Yes | Ask AI Tutor |
| POST | `/api/learning/notes` | Yes | Generate study notes |
| POST | `/api/learning/quiz` | Yes | Generate quiz |

## Security notes

- Passwords are hashed with bcrypt; raw passwords are never stored.
- Protected endpoints require a signed JWT.
- Learning history queries are scoped to the authenticated user.
- OpenAI API key and JWT secret are read only by the backend.
- This is a hackathon starter. Before public production use, add rate limiting, email verification, password reset, stronger abuse monitoring, and a production-grade deployment setup.

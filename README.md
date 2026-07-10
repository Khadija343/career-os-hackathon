# Career OS

> **An AI-powered career development platform that helps students and early professionals prepare for internships and jobs — built for the AMD Hackathon.**

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=nodedotjs&logoColor=white)](https://expressjs.com/)
[![FastAPI](https://img.shields.io/badge/FastAPI-Python-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/atlas)
[![Gemini](https://img.shields.io/badge/Google-Gemini-4285F4?logo=google&logoColor=white)](https://ai.google.dev/)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker&logoColor=white)](https://docs.docker.com/compose/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## Project Overview

**Career OS** brings resume review, GitHub insights, learning roadmaps, interview prep, and an AI career assistant into a single dashboard — so users are not jumping between disconnected tools.

### The problem

Students and early-career developers often struggle with:

- Resumes that are not ATS-friendly
- GitHub profiles that do not reflect their skills
- Unclear learning paths toward a target role
- Scattered interview prep resources
- Generic AI advice with no connection to their actual profile

### Why we built it

Career OS acts as a **personal AI career mentor** — analyzing what the user already has (resume text, GitHub activity) and generating structured, actionable guidance through Google's Gemini models.

### Who it is for

| Audience | Benefit |
|----------|---------|
| University students | Structured roadmap and resume feedback |
| Fresh graduates | Interview prep and profile optimization |
| Internship seekers | GitHub analytics and skill-gap visibility |
| Self-taught developers | Centralized career tooling in one app |

---

## Features

Only **implemented** capabilities are listed below.

| Module | What it does |
|--------|----------------|
| **Authentication** | Register, login, JWT-protected routes, logout |
| **User Profile** | View and update name, career goal, and profile details |
| **Resume Upload** | Upload PDF, DOC, or DOCX; store and parse resume text |
| **Resume Analysis (AI)** | ATS-style scores, strengths, weaknesses, and recommendations |
| **GitHub Profile Integration** | Connect a GitHub username and fetch public profile data |
| **GitHub Repository Sync** | Sync repositories into MongoDB via the GitHub API |
| **GitHub Analytics** | Language distribution, stars, forks, and repo statistics |
| **AI Career Roadmap** | Personalized learning stages, projects, and milestones |
| **AI Interview Preparation** | Technical, behavioral, and coding questions with prep tips |
| **AI Career Assistant** | Single-turn career Q&A powered by Gemini |
| **Dashboard** | Welcome banner, stat cards, and quick navigation |
| **Settings** | Account preferences and application settings |

---

## System Architecture

Career OS uses a **three-tier microservice layout**. The React frontend talks **only** to the Express backend. The backend orchestrates persistence (MongoDB Atlas) and forwards AI requests to the FastAPI service.

```
┌─────────────────────────────────────────────────────────────────┐
│                        Browser (User)                           │
└───────────────────────────────┬─────────────────────────────────┘
                                │ HTTP :5174
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│              Frontend — React + Vite + Tailwind CSS             │
│         Axios → http://localhost:5000/api/v1                    │
└───────────────────────────────┬─────────────────────────────────┘
                                │ REST + JWT
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│           Backend — Node.js + Express + Mongoose              │
│    Auth · Resume · GitHub · Dashboard · AI proxy (:5000)        │
└───────────────┬─────────────────────────────┬───────────────────┘
                │                             │
                │ MongoDB Atlas               │ HTTP (internal)
                ▼                             ▼
┌───────────────────────────┐   ┌───────────────────────────────┐
│      MongoDB Atlas        │   │  AI Service — FastAPI (:8000) │
│  Users · Resumes · GitHub   │   │  Resume · Roadmap · Interview │
└───────────────────────────┘   │           · Chat              │
                                └───────────────┬───────────────┘
                                                │ google-genai SDK
                                                ▼
                                ┌───────────────────────────────┐
                                │      Google Gemini API        │
                                └───────────────────────────────┘
```

> **Important:** The frontend **never** calls FastAPI directly. All AI features go through `POST /api/v1/ai/*` on the Express backend, which proxies to the Python microservice.

---

## Technology Stack

| Layer | Technologies |
|-------|--------------|
| **Frontend** | React 19, Vite 8, React Router 7, Tailwind CSS 4, Axios, Lucide React, Recharts |
| **Backend** | Node.js, Express 5, Mongoose, JWT, bcryptjs, Multer, Zod, pdf-parse, mammoth |
| **Database** | MongoDB Atlas (cloud-hosted) |
| **AI Service** | Python 3.11, FastAPI, Uvicorn, Pydantic, `google-genai` SDK |
| **AI Provider** | Google Gemini (configurable model via `GEMINI_MODEL`) |
| **Authentication** | JWT bearer tokens, client-side storage, protected API routes |
| **Containerization** | Docker, Docker Compose (frontend, backend, ai-service) |

---

## Folder Structure

```
career-os/
├── frontend/                 # React SPA (Vite)
│   ├── src/
│   │   ├── api/              # Axios API clients
│   │   ├── components/       # UI components
│   │   ├── context/          # AuthContext
│   │   ├── layouts/          # Navbar, Sidebar, DashboardLayout
│   │   ├── pages/            # Route pages
│   │   └── routes/           # AppRoutes
│   ├── Dockerfile
│   └── package.json
│
├── backend/                  # Express REST API
│   ├── src/
│   │   ├── config/           # Database connection
│   │   ├── controllers/
│   │   ├── middleware/       # Auth, upload, validation, errors
│   │   ├── models/
│   │   ├── repositories/
│   │   ├── routes/
│   │   ├── services/
│   │   └── validators/
│   ├── uploads/              # Resume file storage
│   ├── Dockerfile
│   └── package.json
│
├── ai-service/               # FastAPI AI microservice
│   ├── app/
│   │   ├── core/             # Settings / config
│   │   ├── routers/          # API endpoints
│   │   ├── schemas/          # Pydantic models
│   │   └── services/         # Gemini integration
│   ├── Dockerfile
│   ├── main.py
│   └── requirements.txt
│
├── docs/                     # Design & architecture documents
├── docker-compose.yml        # Multi-service orchestration
└── README.md
```

---

## AI Workflow

All AI paths follow the same proxy pattern: **Frontend → Express → FastAPI → Gemini**.

### Resume Analysis

```
User uploads resume (PDF/DOC/DOCX)
        │
        ▼
Backend extracts rawText → stores in MongoDB
        │
        ▼
User triggers analysis
        │
        ▼
POST /api/v1/ai/resume/analyze  ──►  POST /analyze-resume  ──►  Gemini
        │
        ▼
Structured JSON: overallScore, atsScore, strengths, weaknesses, recommendations
```

### Career Roadmap

```
User enters target role
        │
        ▼
POST /api/v1/ai/roadmap  ──►  POST /career-roadmap  ──►  Gemini
        │
        ▼
learningStages · projects · certificates · milestones
```

### Interview Preparation

```
User optionally specifies role
        │
        ▼
POST /api/v1/ai/interview  ──►  POST /interview-questions  ──►  Gemini
        │
        ▼
technicalQuestions · behavioralQuestions · codingChallenges · preparationTips
```

### AI Assistant

```
User sends a message
        │
        ▼
POST /api/v1/ai/chat  ──►  POST /chat  ──►  Gemini
        │
        ▼
answer + followUpSuggestions
```

> The career chat is **stateless** (single-turn per request). Conversation history is kept in the browser UI only; it is not sent to the backend.

---

## Installation

### Prerequisites

- **Node.js** 20+
- **Python** 3.11+
- **MongoDB Atlas** cluster ([create free tier](https://www.mongodb.com/atlas))
- **Google Gemini API key** ([Google AI Studio](https://aistudio.google.com/apikey))
- **Docker Desktop** (optional, for containerized run)

---

### 1. Clone the repository

```bash
git clone https://github.com/Khadija343/career-os-hackathon.git
cd career-os
```

---

### 2. Backend setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `backend/.env` with your values (see [Environment Variables](#environment-variables)).

```bash
npm run dev
# Runs on http://localhost:5000
```

---

### 3. AI Service setup

```bash
cd ai-service
python -m venv venv

# Windows
venv\Scripts\activate

# macOS / Linux
source venv/bin/activate

pip install -r requirements.txt
cp .env.example .env
```

Edit `ai-service/.env` with your Gemini API key and model.

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
# Runs on http://localhost:8000
```

---

### 4. Frontend setup

```bash
cd frontend
npm install
```

Create `frontend/.env` (optional — defaults to localhost backend):

```env
VITE_API_URL=http://localhost:5000/api/v1
```

```bash
npm run dev
# Runs on http://localhost:5174
```

---

### 5. Verify locally

| Service | URL | Health check |
|---------|-----|--------------|
| Frontend | http://localhost:5174 | Landing page loads |
| Backend | http://localhost:5000/api/v1/health | `{ "success": true }` |
| AI Service | http://localhost:8000/health | `{ "status": "healthy" }` |

---

## Environment Variables

> Never commit real secrets. Use `.env` files locally (they are gitignored).

### Backend (`backend/.env`)

```env
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:5174

MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<dbname>?retryWrites=true&w=majority
JWT_SECRET=<your-long-random-secret>
JWT_EXPIRES_IN=7d

AI_SERVICE_URL=http://localhost:8000
```

### AI Service (`ai-service/.env`)

```env
APP_NAME="Career OS AI Service"
ENVIRONMENT=development
DEBUG=True
HOST=0.0.0.0
PORT=8000
ALLOWED_ORIGINS=http://localhost:5174,http://localhost:5000

GEMINI_API_KEY=<your-gemini-api-key>
GEMINI_MODEL=gemini-flash-lite-latest
```

### Frontend (`frontend/.env`)

```env
VITE_API_URL=http://localhost:5000/api/v1
```

---

## Docker

Three services are defined in `docker-compose.yml`. **MongoDB Atlas** is used as-is — no MongoDB container is included.

```bash
# From project root
docker compose build
docker compose up
```

| Service | Host port | Notes |
|---------|-----------|-------|
| `frontend` | 5174 | Vite dev server |
| `backend` | 5000 | Loads `backend/.env`; proxies AI to `ai-service` |
| `ai-service` | 8000 | Loads `ai-service/.env` |

Compose overrides networking variables so the backend reaches the AI service at `http://ai-service:8000` inside the Docker network, while the browser still uses `http://localhost:5000` for API calls.

```bash
# Stop containers
docker compose down
```

---

## API Overview

Base URL: `http://localhost:5000/api/v1`

| Group | Prefix | Description |
|-------|--------|-------------|
| **Authentication** | `/auth` | `POST /register`, `POST /login`, `GET/PUT /profile` |
| **Resume** | `/resume` | Upload, list, active resume, get/delete by ID |
| **GitHub** | `/github` | Connect, profile, sync repos, repositories, analytics |
| **AI** | `/ai` | Resume analyze, roadmap, interview, chat (all JWT-protected) |
| **Dashboard** | `/dashboard` | Aggregated user dashboard metrics |
| **Health** | `/health` | Backend liveness check |

FastAPI endpoints (called by backend only):

| Endpoint | Purpose |
|----------|---------|
| `GET /health` | AI service liveness |
| `POST /analyze-resume` | Resume analysis |
| `POST /career-roadmap` | Roadmap generation |
| `POST /interview-questions` | Interview prep |
| `POST /chat` | Career assistant |

---

## Screenshots

> Replace placeholders with actual screenshots before submission.

### Landing Page

![Landing Page](docs/screenshots/landing.png)

### Dashboard

![Dashboard](docs/screenshots/dashboard.png)

### Resume Analysis

![Resume Analysis](docs/screenshots/resume-analysis.png)

### GitHub Analysis

![GitHub Analysis](docs/screenshots/github-analysis.png)

### Career Roadmap

![Career Roadmap](docs/screenshots/roadmap.png)

### Interview Preparation

![Interview Preparation](docs/screenshots/interview.png)

### AI Assistant

![AI Assistant](docs/screenshots/ai-assistant.png)

---

## Team

| Role | Name |
|------|------|
| **Backend Developer** | Khadija |
| **Frontend Developers** | Laiba, Muntaha |
| **AI Integration** | Hafsa |

> Edit names and roles above as needed for your submission.

---

## Future Improvements

These items are **not** implemented yet but represent realistic next steps:

- Resume-aware interview question generation (using parsed resume + analysis context)
- Persistent multi-turn AI conversations with server-side memory
- Advanced dashboard analytics backed by stored AI results
- Personalized learning recommendations from roadmap progress
- Skill gap tracking over time across resume and GitHub data
- Password reset flow (UI shells exist; backend endpoints pending)

---

## License

This project is licensed under the **MIT License**. See [LICENSE](LICENSE) for details.

---

<p align="center">
  Built with care for the <strong>AMD Hackathon</strong> · Career OS © 2026
</p>

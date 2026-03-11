# 🧠 Feedback Intelligence System

A full-stack TypeScript application for intelligent feedback management. Uses **LangChain.js + Google Gemini** to automatically extract category, priority, sentiment, and team routing from user feedback.

## ✨ Features

- **AI-Powered Triage** — Gemini 1.5 Flash auto-classifies every feedback submission
- **Smart Search & Filters** — Filter by category, priority, sentiment, team, and status
- **Real-Time Stats** — Dashboard showing critical issues, open items, and negative sentiment count
- **Email Notifications** — Optional email alerts routed to the correct team
- **Status Management** — Update feedback status (Open → In Progress → Resolved)
- **Premium Dark UI** — Glassmorphism design with smooth animations

## 🧠 How it Works

1. **Submission**: User submits feedback through the React frontend.
2. **Persistence**: The Backend immediately saves the feedback to MongoDB.
3. **AI Enrichment**: The system pipes the feedback into **LangChain + Gemini 1.5 Flash**.
4. **Classification**: Gemini extracts Category, Priority, Sentiment, and a targeted Team.
5. **Notification**: If configured, it triggers a rich HTML email to the relevant team.
6. **Real-time Sync**: The UI highlights the AI analysis results instantly to the user.

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite + TypeScript |
| Backend | Node.js + Express + TypeScript |
| Database | MongoDB + Mongoose |
| LLM | LangChain.js + Google Gemini 1.5 Flash |
| Email | Nodemailer (optional) |
| State | TanStack React Query |

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB running locally (`mongodb://localhost:27017`) or a MongoDB Atlas URI
- Google Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikey) (free)

### Backend Setup

```bash
cd backend

# Copy and fill in your environment variables
cp .env.example .env
# Edit .env:  set GOOGLE_API_KEY to your Gemini key

# Install dependencies (already installed)
npm install

# Start dev server
npm run dev
```

The backend will start at `http://localhost:5000`.

### Frontend Setup

```bash
cd frontend

# Install dependencies (already installed)
npm install

# Start dev server
npm run dev
```

The frontend will open at `http://localhost:5173`.

## ⚙️ Environment Variables

### `backend/.env`

| Variable | Description | Default |
|---|---|---|
| `PORT` | Server port | `5000` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/feedback-intelligence` |
| `GOOGLE_API_KEY` | Gemini API key (**required for LLM**) | — |
| `EMAIL_ENABLED` | Enable email notifications | `false` |
| `SMTP_HOST` | SMTP server host | `smtp.gmail.com` |
| `SMTP_PORT` | SMTP port | `587` |
| `SMTP_USER` | SMTP email address | — |
| `SMTP_PASS` | SMTP app password | — |

### `frontend/.env`

| Variable | Description | Default |
|---|---|---|
| `VITE_API_URL` | Backend API base URL | `http://localhost:5000/api` |

## 📡 API Reference

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/feedbacks` | Create feedback (triggers LLM analysis) |
| `GET` | `/api/feedbacks` | List all feedbacks (supports filters) |
| `GET` | `/api/feedbacks/:id` | Get single feedback |
| `PATCH` | `/api/feedbacks/:id/status` | Update feedback status |

### Query Parameters for `GET /api/feedbacks`

- `search` — text search across title, description, submittedBy
- `category` — Bug, Feature Request, Performance, UX, Security, General
- `priority` — Low, Medium, High, Critical
- `sentiment` — Positive, Neutral, Negative
- `team` — Frontend, Backend, DevOps, Design, Product, Security
- `status` — Open, In Progress, Resolved
- `page`, `limit` — pagination

## 📁 Project Structure

```
Feedback Intelligence System/
├── backend/
│   ├── src/
│   │   ├── controllers/    # Request handlers
│   │   ├── models/         # Mongoose schemas
│   │   ├── routes/         # Express route definitions
│   │   ├── services/       # LLM & email services
│   │   ├── app.ts          # Express app config
│   │   └── server.ts       # Entry point
│   ├── .env.example
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/     # React components
    │   ├── services/       # API layer
    │   ├── types/          # TypeScript interfaces
    │   ├── App.tsx         # Main app
    │   └── main.tsx        # Entry point
    ├── .env
    └── package.json
```

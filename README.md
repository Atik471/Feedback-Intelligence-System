# Feedback Intelligence System

A full-stack TypeScript application for intelligent feedback management. Uses **LangChain.js + Google Gemini 2.5 Flash** to automatically extract category, priority, sentiment, and team routing from user feedback.

## Features

- **AI-Powered Triage** — Gemini 2.5 Flash auto-classifies every feedback submission.
- **Smart Search & Filters** — Real-time partial matching for seamless discovery.
- **Professional UI** — Built with Lucide React icons and a premium glassmorphic dark theme.
- **Email Notifications** — Automated rich HTML alerts routed to relevant teams.
- **Status Management** — Full lifecycle tracking from Open to Resolved.

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19 + Vite + TypeScript + Lucide Icons |
| **Backend** | Node.js + Express + TypeScript |
| **Database** | MongoDB + Mongoose |
| **LLM** | LangChain.js + Google Gemini 2.5 Flash |
| **Email** | Nodemailer + SMTP |

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB URI (Local or Atlas)
- Google Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikey)

---

## Deployment (Vercel)

The system is optimized for one-click deployment on **Vercel**.

### 1. Backend Deployment (Express)
1. Import the repository into Vercel.
2. Select the **`backend`** folder as the root directory.
3. Configure the following **Environment Variables**:
   - `MONGODB_URI`: Your MongoDB Atlas connection string.
   - `GOOGLE_API_KEY`: Your Gemini API key.
   - `EMAIL_ENABLED`: `true` (if using notifications).
4. Vercel will automatically detect the `vercel.json` and deploy it as a Serverless function.

### 2. Frontend Deployment (React)
1. Import the same repository as a *new* project.
2. Select the **`frontend`** folder as the root directory.
3. Add the following **Environment Variable**:
   - `VITE_API_URL`: The URL of your deployed backend (e.g., `https://your-backend.vercel.app/api`).
4. Deployment will complete automatically.

---

## Environment Variables Summary

### `/backend`
- `MONGODB_URI`: MongoDB connection string.
- `GOOGLE_API_KEY`: Gemini API key (**Required**).
- `EMAIL_ENABLED`: `true` (to enable notifications).
- `SMTP_HOST`: `smtp.hostinger.com` (or `smtp.gmail.com`)
- `SMTP_PORT`: `465` (SSL)
- `SMTP_USER`: Your email address.
- `SMTP_PASS`: Your email password (or App Password for Gmail).
- `FROM_EMAIL`: Must be the same as `SMTP_USER`.

### `/frontend`
- `VITE_API_URL`: Backend API base URL.

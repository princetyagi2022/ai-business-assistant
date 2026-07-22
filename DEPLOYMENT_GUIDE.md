# AI Business Assistant: Deployment Guide

## Architecture Overview

```
┌────────────────┐     ┌────────────────────┐     ┌───────────────────┐
│  React + Vite  │────▶│  Spring Boot API   │────▶│  MySQL Database   │
│   (Frontend)   │     │  (Backend :8081)   │     │    (:3306)        │
│   nginx :80    │     └────────────────────┘     └───────────────────┘
└────────────────┘              │
                                ▼
                    ┌────────────────────┐
                    │  FastAPI ML Service │
                    │     (:8000)        │
                    └────────────────────┘
```

---

## 1. Local Development

### Prerequisites
- Java 21 (Eclipse Temurin)
- Node.js 18+
- Python 3.11+
- MySQL 8.0+

### Quick Start (Windows)

Double-click `start-project.bat` to launch all three services:

| Service | URL |
|---------|-----|
| React Frontend | http://localhost:5173 |
| Spring Boot API | http://localhost:8081/api |
| FastAPI ML Service | http://localhost:8000 |

### Manual Start

```bash
# 1. Start MySQL first
# 2. Backend
cd backend
mvn spring-boot:run -Dspring-boot.run.profiles=dev

# 3. ML Service
cd ml-models
pip install -r requirements.txt
uvicorn main:app --reload --port 8000

# 4. Frontend
cd frontend
npm install
npm run dev
```

---

## 2. Local Docker Compose

Run all services (including MySQL) in one command:

```bash
docker-compose up --build
```

| Service | URL |
|---------|-----|
| Frontend (nginx) | http://localhost |
| Backend API | http://localhost:8081/api |
| ML Service | http://localhost:8000 |
| MySQL | localhost:3306 |

Set API keys before running:

```bash
# Edit docker-compose.yml environment section, or use:
OPENAI_API_KEY=sk-xxx docker-compose up --build
```

---

## 3. Cloud Deployment (Free Tier)

### Option A: Frontend on Vercel + Backend on Render

#### Step 1: Deploy FastAPI ML Service to Render

1. Create a Render account at https://render.com
2. Click **New → Web Service**, connect your GitHub repo
3. Configure:

| Setting | Value |
|---------|-------|
| Root Directory | `ml-models` |
| Build Command | `pip install -r requirements.txt` |
| Start Command | `uvicorn main:app --host 0.0.0.0 --port $PORT` |
| Plan | Free |

4. Add environment variables:

| Key | Value |
|-----|-------|
| `OPENAI_API_KEY` | Your OpenAI API key |
| `OPENAI_MODEL` | `gpt-4` |
| `ALLOWED_ORIGINS` | `https://your-app.vercel.app` |

5. Deploy and note your URL: `https://your-ml-service.onrender.com`

#### Step 2: Deploy Spring Boot Backend to Render

1. Click **New → Web Service**, connect your GitHub repo
2. Configure:

| Setting | Value |
|---------|-------|
| Root Directory | `backend` |
| Build Command | `mvn clean package -DskipTests` |
| Start Command | `java -jar target/*.jar` |
| Plan | Free |

3. Add environment variables:

| Key | Value |
|-----|-------|
| `DB_URL` | `jdbc:mysql://your-db-host/ai_business_assistant?...` |
| `DB_USERNAME` | Your DB username |
| `DB_PASSWORD` | Your DB password |
| `JWT_SECRET` | A long random string |
| `FRONTEND_URL` | `https://your-app.vercel.app` |
| `CORS_EXTRA_ORIGINS` | `https://your-app.vercel.app` |
| `ML_API_BASE_URL` | `https://your-ml-service.onrender.com` |
| `OPENAI_API_KEY` | Your OpenAI API key |
| `SPRING_PROFILES_ACTIVE` | `prod` |

4. Deploy and note your URL: `https://your-backend.onrender.com`

#### Step 3: Deploy MySQL Database

**Option 1: Railway (recommended)**
1. Go to https://railway.app → New Project → MySQL
2. Copy the connection details (host, port, user, password, database)
3. Use these in the Render backend env vars

**Option 2: Aiven Free Tier**
1. Go to https://aiven.io → Create Free MySQL service
2. Copy the connection URL
3. Use it as `DB_URL` in Render

**Option 3: PlanetScale**
1. Go to https://planetscale.com → Create database
2. Use the connection string

#### Step 4: Deploy React Frontend to Vercel

1. Go to https://vercel.com → **New Project**, import your GitHub repo
2. Configure:

| Setting | Value |
|---------|-------|
| Root Directory | `frontend` |
| Build Command | `npm run build` |
| Output Directory | `dist` |

3. Add environment variables:

| Key | Value |
|-----|-------|
| `VITE_API_BASE_URL` | `https://your-backend.onrender.com/api` |
| `VITE_ML_API_BASE_URL` | `https://your-ml-service.onrender.com/api` |
| `VITE_APP_NAME` | `AI Business Assistant` |
| `VITE_DEMO_MODE` | `false` |
| `VITE_RAZORPAY_KEY_ID` | Your Razorpay key (optional) |

4. Deploy! Your app is live at: `https://your-app.vercel.app`

---

### Option B: All-in-One Docker on Railway / Fly.io

1. Push the entire project to GitHub
2. On Railway or Fly.io, create a new project from the repo
3. Point to `docker-compose.yml`
4. Set environment variables for API keys and DB credentials
5. Deploy

---

## 4. Environment Variables Reference

### Backend (Spring Boot)

| Variable | Default | Description |
|----------|---------|-------------|
| `SERVER_PORT` | `8081` | Server port |
| `SPRING_PROFILES_ACTIVE` | `dev` | Spring profile (dev/prod) |
| `DB_URL` | `jdbc:mysql://localhost:3306/...` | MySQL connection URL |
| `DB_USERNAME` | `root` | Database username |
| `DB_PASSWORD` | _(empty)_ | Database password |
| `JWT_SECRET` | _(built-in)_ | JWT signing secret |
| `OPENAI_API_KEY` | _(empty)_ | OpenAI API key for GPT-4 |
| `OPENAI_MODEL` | `gpt-4` | OpenAI model name |
| `ML_API_BASE_URL` | `http://localhost:8000` | ML service URL |
| `FRONTEND_URL` | `http://localhost:5173` | Frontend URL (CORS) |
| `CORS_EXTRA_ORIGINS` | _(empty)_ | Extra CORS origins (comma-separated) |
| `RAZORPAY_KEY_ID` | _(empty)_ | Razorpay key ID |
| `RAZORPAY_KEY_SECRET` | _(empty)_ | Razorpay key secret |
| `CSV_DATA_DIR` | `../ml-models/data` | CSV data directory |

### Frontend (React)

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_BASE_URL` | `http://localhost:8081/api` | Backend API URL |
| `VITE_ML_API_BASE_URL` | `http://localhost:8000/api` | ML API URL |
| `VITE_APP_NAME` | `AI Business Assistant` | App display name |
| `VITE_DEMO_MODE` | `false` | Enable demo mode (no auth required) |
| `VITE_RAZORPAY_KEY_ID` | _(empty)_ | Razorpay public key |

### ML Service (FastAPI)

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `8000` | Service port |
| `OPENAI_API_KEY` | _(empty)_ | OpenAI API key |
| `OPENAI_MODEL` | `gpt-4` | OpenAI model name |
| `ALLOWED_ORIGINS` | _(empty)_ | Extra CORS origins (comma-separated) |

---

## 5. Important Notes

- **Free tier cold starts**: Render and Railway free tiers sleep after inactivity. First request may take 30-60 seconds.
- **Database**: MySQL must be accessible from the backend service. Use a cloud database, not localhost.
- **CORS**: Both backend and ML service CORS are configured to accept the production frontend URL via environment variables.
- **CSV Sync**: The backend writes to CSV files in `CSV_DATA_DIR`. In Docker, this is a shared volume between backend and ML service.
- **File Uploads**: Upload directory (`FILE_UPLOAD_DIR`) should be a persistent volume in production.
- **Security**: Never commit API keys to Git. Always use environment variables.

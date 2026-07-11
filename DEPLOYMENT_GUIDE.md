# AI Business Assistant: One-Click Run And Free Hosting

## One-click local run on Windows

Double-click:

```text
start-project.bat
```

It starts:

- FastAPI data/ML service: `http://localhost:8000`
- React frontend: `http://localhost:5173`
- Spring Boot backend: `http://localhost:8080/api`, only when MySQL is already running on port `3306`

To stop local services, double-click:

```text
stop-project.bat
```

## Free public hosting plan

Recommended beginner-friendly split:

1. Host FastAPI backend on Render as a free web service.
2. Host React frontend on Vercel or Netlify as a free static site.
3. Set frontend environment variables to point to the Render backend URL.

### Deploy FastAPI to Render

Create a new Render Web Service from the GitHub repo.

Use these settings:

```text
Root Directory: ml-models
Build Command: pip install -r requirements.txt
Start Command: uvicorn main:app --host 0.0.0.0 --port $PORT
```

After deployment, Render gives a URL like:

```text
https://ai-business-assistant-api.onrender.com
```

Your API base URL will be:

```text
https://ai-business-assistant-api.onrender.com/api
```

### Deploy React frontend to Vercel

Create a Vercel project from the GitHub repo.

Use these settings:

```text
Root Directory: frontend
Build Command: npm run build
Output Directory: dist
```

Add environment variables:

```text
VITE_API_BASE_URL=https://your-render-service.onrender.com/api
VITE_ML_API_BASE_URL=https://your-render-service.onrender.com/api
VITE_APP_NAME=AI Business Assistant
VITE_DEMO_MODE=true
```

Vercel gives a public link like:

```text
https://ai-business-assistant.vercel.app
```

Share that link with others.

### Important

Free hosting services may sleep after inactivity. The first request can be slow while the API wakes up.

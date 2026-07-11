@echo off
setlocal

set "ROOT=%~dp0"
set "ML_DIR=%ROOT%ml-models"
set "FRONTEND_DIR=%ROOT%frontend"
set "BACKEND_DIR=%ROOT%backend"

echo Starting AI Business Assistant...
echo.

where npm >nul 2>nul
if errorlevel 1 (
  echo [ERROR] npm was not found. Install Node.js, then run this file again.
  pause
  exit /b 1
)

where mvn >nul 2>nul
if errorlevel 1 (
  echo [WARN] Maven was not found. Spring Boot backend will be skipped.
) else (
  powershell -NoProfile -Command "if (Get-NetTCPConnection -LocalPort 3306 -State Listen -ErrorAction SilentlyContinue) { exit 0 } else { exit 1 }"
  if errorlevel 1 (
    echo [WARN] MySQL is not listening on port 3306. Spring Boot backend will be skipped.
    echo        Start MySQL first if you want the Java backend too.
  ) else (
    echo [OK] Starting Spring Boot backend on http://localhost:8080/api
    start "AI Business Assistant - Spring Backend" cmd /k "cd /d "%BACKEND_DIR%" && mvn spring-boot:run"
  )
)

if exist "%ML_DIR%\venv\Scripts\python.exe" (
  set "PYTHON_CMD=%ML_DIR%\venv\Scripts\python.exe"
) else (
  set "PYTHON_CMD=python"
)

echo [OK] Starting FastAPI data/ML service on http://localhost:8000
start "AI Business Assistant - FastAPI ML Service" cmd /k "cd /d "%ML_DIR%" && "%PYTHON_CMD%" -m uvicorn main:app --host 127.0.0.1 --port 8000"

echo [OK] Starting React frontend on http://localhost:5173
start "AI Business Assistant - React Frontend" cmd /k "cd /d "%FRONTEND_DIR%" && npm run dev -- --host 127.0.0.1 --port 5173"

echo.
echo Waiting for frontend...
powershell -NoProfile -Command "for ($i = 0; $i -lt 30; $i++) { try { Invoke-WebRequest -UseBasicParsing http://127.0.0.1:5173/dashboard | Out-Null; exit 0 } catch { Start-Sleep -Seconds 1 } }; exit 1"

if errorlevel 1 (
  echo [WARN] Frontend did not respond yet. Check the opened terminal windows.
) else (
  echo [OK] Opening app in browser...
  start "" "http://127.0.0.1:5173/dashboard"
)

echo.
echo Project launcher finished. Keep the opened terminal windows running.
pause

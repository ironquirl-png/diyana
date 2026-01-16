@echo off
echo ========================================
echo Starting ContentAI Application...
echo ========================================
echo.

echo Starting Backend (FastAPI)...
start cmd /k "cd backend && venv\Scripts\activate && uvicorn server:app --host 0.0.0.0 --port 8001 --reload"
timeout /t 3 /nobreak > nul

echo Starting Frontend (React)...
start cmd /k "cd frontend && yarn start"

echo.
echo ========================================
echo ContentAI is starting!
echo ========================================
echo Frontend: http://localhost:3000
echo Backend:  http://localhost:8001
echo API Docs: http://localhost:8001/docs
echo.
echo Close the terminal windows to stop services
echo ========================================
pause
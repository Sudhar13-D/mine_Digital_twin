@echo off
title SubsideAI - Mine Manager Launcher
echo ========================================================
echo   SubsideAI Mine Subsidence Digital Twin Platform
echo ========================================================
echo.

echo [1/2] Starting FastAPI Backend (Port 8000)...
start "SubsideAI Backend" cmd /k "python -m uvicorn app.main:app --app-dir backend --host 0.0.0.0 --port 8000 --reload"

echo [2/2] Starting Vite Frontend...
start "SubsideAI Frontend" cmd /k "npm run dev"

echo.
echo ========================================================
echo   Services are launching in separate terminal windows!
echo   - Frontend:    http://localhost:8443 (or http://localhost:5173)
echo   - Backend API: http://localhost:8000
echo   - API Docs:    http://localhost:8000/docs
echo ========================================================
pause

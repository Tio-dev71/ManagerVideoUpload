@echo off
echo ===================================================
echo   AutoReel Lite - Local Server Startup
echo ===================================================

if not exist ".env" (
    echo [INFO] Creating .env file from .env.example...
    copy .env.example .env
)

echo [INFO] Starting Docker Compose...
docker-compose up -d --build

echo [INFO] Waiting for database to be ready...
timeout /t 10 /nobreak

echo ===================================================
echo   Server is running!
echo   Web App: http://localhost:3000
echo ===================================================
pause

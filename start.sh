#!/bin/bash

echo "==================================================="
echo "  AutoReel Lite - Local Server Startup"
echo "==================================================="

if [ ! -f .env ]; then
    echo "[INFO] Creating .env file from .env.example..."
    cp .env.example .env
fi

echo "[INFO] Starting Docker Compose..."
docker-compose up -d --build

echo "[INFO] Waiting for database to be ready..."
sleep 10

echo "==================================================="
echo "  Server is running!"
echo "  Web App: http://localhost:3000"
echo "==================================================="

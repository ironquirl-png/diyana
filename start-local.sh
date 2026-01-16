#!/bin/bash

echo "🚀 Starting ContentAI Application..."
echo "====================================="
echo ""

# Check if MongoDB is running
echo "📦 Checking MongoDB..."
if ! pgrep -x "mongod" > /dev/null; then
    echo "⚠️  MongoDB is not running. Please start MongoDB first."
    echo "   - Windows: Start MongoDB service"
    echo "   - Mac: brew services start mongodb-community"
    echo "   - Linux: sudo systemctl start mongod"
    echo ""
    exit 1
fi
echo "✅ MongoDB is running"
echo ""

# Start Backend
echo "🔧 Starting Backend (FastAPI)..."
cd backend
if [ ! -d "venv" ]; then
    echo "⚠️  Virtual environment not found. Creating..."
    python -m venv venv
    source venv/bin/activate
    pip install -r requirements.txt
else
    source venv/bin/activate
fi

uvicorn server:app --host 0.0.0.0 --port 8001 --reload &
BACKEND_PID=$!
echo "✅ Backend started (PID: $BACKEND_PID)"
echo "   API: http://localhost:8001/api"
echo ""

# Start Frontend
echo "⚛️  Starting Frontend (React)..."
cd ../frontend
if [ ! -d "node_modules" ]; then
    echo "⚠️  Node modules not found. Installing..."
    yarn install
fi

yarn start &
FRONTEND_PID=$!
echo "✅ Frontend starting (PID: $FRONTEND_PID)"
echo "   App: http://localhost:3000"
echo ""

echo "====================================="
echo "✨ ContentAI is running!"
echo "====================================="
echo "Frontend: http://localhost:3000"
echo "Backend:  http://localhost:8001"
echo "API Docs: http://localhost:8001/docs"
echo ""
echo "Press Ctrl+C to stop all services"
echo ""

# Wait for Ctrl+C
trap "echo '\n🛑 Stopping services...'; kill $BACKEND_PID $FRONTEND_PID; exit" INT
wait
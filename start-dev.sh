#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}🍜 Wok & Roll — Starting Development Servers${NC}\n"

# Check if .env file exists
if [ ! -f "backend/.env" ]; then
    echo -e "${YELLOW}⚠️  backend/.env not found!${NC}"
    echo "Creating from template..."
    cp backend/.env.example backend/.env
    echo -e "${YELLOW}Please edit backend/.env with your MongoDB credentials${NC}\n"
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}Installing dependencies...${NC}"
    npm install
fi

# Kill processes on script exit
trap 'echo -e "\n${YELLOW}Shutting down servers...${NC}"; kill $(jobs -p) 2>/dev/null; exit' EXIT

# Start backend server
echo -e "${GREEN}Starting Backend API (port 4000)...${NC}"
npm run dev:server &
BACKEND_PID=$!

# Wait for backend to start
sleep 2

# Start frontend dev server
echo -e "${GREEN}Starting Frontend (port 5173)...${NC}"
npm run dev &
FRONTEND_PID=$!

# Wait a moment then show status
sleep 3
echo -e "\n${GREEN}✅ Both servers are running!${NC}\n"
echo -e "Frontend:  ${BLUE}http://localhost:5173${NC}"
echo -e "Backend:   ${BLUE}http://localhost:4000${NC}\n"
echo -e "${YELLOW}Press Ctrl+C to stop both servers${NC}\n"

# Keep script running
wait

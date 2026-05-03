# 🚀 Quick Running Guide

**Get the app running in 5 minutes!**

---

## Prerequisites

✅ Node.js installed?
✅ MongoDB installed or Atlas account created?
✅ Already cloned the repo?

If yes, continue below. If no, see `SETUP.md` first.

---

## Option 1: Using the Startup Script (Recommended)

```bash
# Make sure you're in the project directory
cd food-truck-ordering-system

# Configure backend
cp backend/.env.example backend/.env

# Edit the .env file with your MongoDB connection:
# Open backend/.env and update MONGO_URI
# Uncomment one of these:
# - Local: MONGO_URI=mongodb://localhost:27017/food_ordering
# - Cloud: MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/food_ordering

# Seed the database with demo data
npm run seed

# Start both servers with one command
./start-dev.sh
```

**Done!** Visit `http://localhost:5173`

---

## Option 2: Manual Setup (Two Terminals)

**Terminal 1 — Backend:**
```bash
cd food-truck-ordering-system

# First time only:
cp backend/.env.example backend/.env
# Edit backend/.env with your MongoDB credentials

npm run seed    # Initialize database (run once)
npm run dev:server
```

Should show: `API server running on http://localhost:4000`

---

**Terminal 2 — Frontend:**
```bash
cd food-truck-ordering-system

npm run dev
```

Should show: `VITE v8.0.10 ready in XXX ms`

---

## Quick Test Flow

1. **Visit** http://localhost:5173
2. **Browse** menu items (no login needed)
3. **Add** items to cart
4. **Checkout** to place order
5. **Copy** your token number
6. **Track** order using token
7. **Login** as kitchen staff:
   - Email: `kitchen@campus.local`
   - Password: `kitchen123`
8. **Update** order status in dashboard
9. **Refresh** tracking page to see updates

---

## Available Commands

```bash
# Development
npm run dev          # Frontend (Vite)
npm run dev:server   # Backend (Node.js)

# Production
npm run build        # Build frontend
npm run start        # Start backend only

# Utilities
npm run lint         # Check code quality
npm run seed         # Initialize database

# Scripts
./start-dev.sh       # Start both servers at once
```

---

## Useful URLs

| Service    | URL                    |
|------------|------------------------|
| Frontend   | http://localhost:5173  |
| Backend    | http://localhost:4000  |
| API Health | http://localhost:4000/health |
| Menu API   | http://localhost:4000/api/menu |

---

## Demo Credentials

**Admin Panel:**
- Email: `admin@campus.local`
- Password: `admin123`

**Kitchen Dashboard:**
- Email: `kitchen@campus.local`
- Password: `kitchen123`

**Students:** No login needed! Just browse and order.

---

## If Something Goes Wrong

### "Cannot connect to MongoDB"
```bash
# Check MongoDB is running
# macOS: brew services start mongodb-community
# Linux: sudo systemctl start mongod

# Then run seed again
npm run seed
```

### "Port 4000 already in use"
```bash
# Kill the process on port 4000
lsof -i :4000          # Find PID
kill -9 <PID>          # Kill it

# Or use a different port
PORT=4001 npm run dev:server
```

### "Frontend not loading"
```bash
# Clear browser cache
# Press: Ctrl+Shift+Delete (or Cmd+Shift+Delete on Mac)
# Select "All time" and "Clear"

# Check backend is running
curl http://localhost:4000/health
```

---

## Stopping the Servers

**Using start-dev.sh:**
- Press `Ctrl+C`

**Using manual terminals:**
- Press `Ctrl+C` in each terminal

---

## Building for Production

```bash
npm run build
# Creates optimized build in dist/ folder

# Then deploy the dist/ folder to your hosting
```

---

## Need Help?

1. Check `SETUP.md` for detailed setup
2. Read `README.md` for features overview
3. Look at `COMPLETION.md` for full project status

---

**Happy ordering! 🍜✨**

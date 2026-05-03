# 🚀 Setup Guide — Wok & Roll

Complete setup guide to get your development environment ready in 5 minutes.

---

## Step 1: Prerequisites

Make sure you have installed:
- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (local or cloud) - [Local Setup](https://docs.mongodb.com/manual/installation/) or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- **Git** - [Download](https://git-scm.com/)

Verify installation:
```bash
node --version    # Should show v18+
npm --version     # Should show 8+
mongod --version  # Optional, only if using local MongoDB
```

---

## Step 2: Clone & Install Dependencies

```bash
git clone https://github.com/shlokareddy1102/food-truck-ordering-system.git
cd food-truck-ordering-system
npm install
```

---

## Step 3: Configure MongoDB

### Option A: Local MongoDB
```bash
# macOS (using Homebrew)
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community

# Linux (Ubuntu/Debian)
sudo apt-get install mongodb

# Windows
# Download from: https://www.mongodb.com/try/download/community
```

### Option B: MongoDB Atlas (Cloud)
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster (M0 tier is free)
4. Get connection string: `mongodb+srv://username:password@cluster.mongodb.net/food_ordering`

---

## Step 4: Setup Environment Variables

```bash
cp backend/.env.example backend/.env
```

Edit `backend/.env`:

```env
# For MongoDB Atlas:
MONGO_URI=mongodb+srv://your-username:your-password@cluster-name.mongodb.net/food_ordering?retryWrites=true&w=majority

# For Local MongoDB:
MONGO_URI=mongodb://localhost:27017/food_ordering

# Generate a secure JWT secret (min 32 chars):
JWT_SECRET=change_this_to_a_super_secret_random_string_at_least_32_chars_long

# Port (optional, defaults to 4000)
PORT=4000
```

**Tip**: Generate a random secret:
```bash
# macOS/Linux
openssl rand -base64 32

# Windows (using Node.js)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## Step 5: Seed Demo Data

Populate the database with demo menu items and test users:

```bash
npm run seed
```

**Output should show:**
```
✅ Connected to MongoDB
🗑️  Cleared existing data
✅ Added 8 menu items
✅ Added 2 demo users

📋 Demo Users:
  - admin@campus.local / admin123 (role: admin)
  - kitchen@campus.local / kitchen123 (role: kitchen)
```

---

## Step 6: Start Development Servers

**Terminal 1** — Backend API:
```bash
npm run dev:server
```
Should show: `API server running on http://localhost:4000`

**Terminal 2** — Frontend:
```bash
npm run dev
```
Should show: `VITE v8.0.10 ready in XXX ms` with local URL

---

## Step 7: Test the App

1. Open browser to `http://localhost:5173`
2. Browse the menu (no login needed)
3. Add items to cart
4. Click "Checkout" to place an order
5. Get token number and track your order
6. Login as kitchen staff to manage orders:
   - Email: `kitchen@campus.local`
   - Password: `kitchen123`
7. Update order statuses in the kitchen dashboard

---

## Troubleshooting

### MongoDB Connection Error
**Problem**: `MongoNetworkError: getaddrinfo ENOTFOUND localhost`

**Solution**:
- Ensure MongoDB is running: `brew services start mongodb-community` (macOS)
- Check MongoDB Atlas credentials in `.env`
- Verify firewall allows MongoDB connection

### Port Already in Use
**Problem**: `EADDRINUSE: address already in use :::4000`

**Solution**:
```bash
# Find process using port 4000
lsof -i :4000

# Kill the process (macOS/Linux)
kill -9 <PID>

# Or use a different port in .env:
PORT=4001
```

### Seed Script Fails
**Problem**: `Error: MONGO_URI is not set`

**Solution**:
- Make sure `.env` file exists in `backend/` directory
- Restart the seed command: `npm run seed`

### Frontend Not Loading
**Problem**: `Cannot GET /` or blank page

**Solution**:
- Ensure backend is running: `npm run dev:server`
- Clear browser cache: Ctrl+Shift+Del
- Check console for errors: F12 → Console tab

---

## Building for Production

```bash
# Build frontend (creates dist/ folder)
npm run build

# Start backend on production (use NODE_ENV=production)
NODE_ENV=production npm start
```

---

## Next Steps

- 📖 Read [README.md](./README.md) for feature documentation
- 🔌 Explore API endpoints in README
- 💾 Backup your MongoDB data regularly
- 🔐 Change demo credentials before deploying
- 📱 Optimize for mobile devices (CSS media queries)

---

## Need Help?

1. Check MongoDB connection: `mongo mongodb://localhost:27017/food_ordering`
2. Verify Node.js version: `node --version`
3. Check API logs: Look at terminal running `npm run dev:server`
4. Inspect browser console: F12 → Console & Network tabs
5. Open an issue on GitHub with error details

---

**Ready to order? Happy coding!** 🍜✨

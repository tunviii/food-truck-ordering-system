# 🍜 Wok & Roll — Campus Food Ordering System

A full-stack **campus food ordering platform** designed to eliminate long queues by enabling students to **pre-order food** while allowing kitchen staff to **manage orders in real time**. Features role-based authentication, live order tracking, and a responsive web interface.

---

## 🚀 Features

### 👤 Student Features
- 🍜 Browse categorized menu with descriptions, prices & prep times
- ➕ Add/remove items to cart with quantity control
- 🔐 Secure checkout with JWT authentication
- 🎫 Get unique token number after order placement
- 📍 Track order status in real-time by token number
- ⏱️ See estimated preparation time

### 🍳 Kitchen Staff Features
- 📋 Live order dashboard with real-time polling
- 🔄 Update order status: Placed → Accepted → Cooking → Ready
- 🎯 Filter orders by status
- ⌚ Monitor preparation times

### 👨‍💼 Admin Features
- ➕ Add/edit/delete menu items
- 🏷️ Manage categories, prices, prep times
- ✅ Mark items as vegetarian or spicy
- 🔒 Secure admin panel with role-based access

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19 with Vite
- **Routing**: React Router 7
- **Styling**: CSS Modules
- **State**: Context API + localStorage for cart
- **HTTP**: Fetch API with custom wrapper

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Auth**: JWT (7-day expiry) with bcryptjs password hashing
- **Deployment**: Supports env-based configuration

### Database Models
- **Menu**: Items with category, pricing, dietary info, prep time
- **Order**: Nested items, token number, status tracking, timestamps
- **User**: Admin/Kitchen staff with encrypted passwords

---

## 📋 Prerequisites

- Node.js (v18+) and npm
- MongoDB (local or MongoDB Atlas cloud instance)
- Git

---

## ⚡ Quick Start

### 1️⃣ Clone & Install

```bash
git clone https://github.com/shlokareddy1102/food-truck-ordering-system.git
cd food-truck-ordering-system
npm install
```

### 2️⃣ Configure Backend

Create a `.env` file in the `backend/` directory:

```bash
cp backend/.env.example backend/.env
```

Edit `backend/.env` with your settings:

```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/food_ordering?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_change_in_production
PORT=4000
```

**Quick MongoDB Setup (Local)**:
```bash
# Install MongoDB Community Edition (macOS)
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB
brew services start mongodb-community

# Connection string: mongodb://localhost:27017/food_ordering
```

### 3️⃣ Start Frontend & Backend

**Terminal 1** — Backend API server:
```bash
npm run dev:server
# Server runs on http://localhost:4000
```

**Terminal 2** — Frontend dev server:
```bash
npm run dev
# Opens http://localhost:5173
```

---

## 🧭 User Roles & Access

### Student (No Login Required)
- Browse menu
- Add to cart
- Checkout (creates order)
- Track order by token number

### Kitchen Staff (Login Required)
- **Email**: kitchen@campus.local
- **Password**: kitchen123
- View live order dashboard
- Update order statuses

### Admin (Login Required)
- **Email**: admin@campus.local
- **Password**: admin123
- Manage menu items (CRUD)
- View all orders

**Note**: Demo credentials are for development only. Change in production!

---

## 📁 Project Structure

```
food-truck-ordering-system/
├── backend/
│   ├── src/
│   │   ├── server.js           # Entry point
│   │   ├── app.js              # Express app setup
│   │   ├── config/
│   │   │   └── db.js           # MongoDB connection
│   │   ├── models/
│   │   │   ├── MenuItem.js     # Menu schema
│   │   │   ├── Order.js        # Order schema
│   │   │   └── User.js         # User schema
│   │   ├── routes/
│   │   │   ├── authRoutes.js   # Login/Register endpoints
│   │   │   ├── menuRoutes.js   # Menu CRUD endpoints
│   │   │   └── orderRoutes.js  # Order endpoints
│   │   ├── middleware/
│   │   │   └── auth.js         # JWT verification
│   │   └── seeds/
│   │       └── seedDB.js       # Demo data
│   └── .env.example
├── src/
│   ├── pages/
│   │   ├── Landing.jsx         # Menu browsing
│   │   ├── Admin.jsx           # Menu management
│   │   ├── Kitchen.jsx         # Order dashboard
│   │   ├── Cart.jsx            # Checkout
│   │   └── OrderTracking.jsx   # Token lookup
│   ├── lib/
│   │   ├── api.js              # HTTP client + converters
│   │   ├── cart-store.js       # Cart state management
│   │   ├── menuStore.js        # Menu fetching with cache
│   │   └── types.js            # Type definitions
│   └── App.jsx                 # Routes & auth
├── package.json
├── vite.config.js
└── README.md
```

---

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` — Create new user
- `POST /api/auth/login` — Login and get JWT token

### Menu (All public)
- `GET /api/menu` — List all menu items
- `POST /api/menu` — Add item (admin only)
- `PATCH /api/menu/:id` — Update item (admin only)
- `DELETE /api/menu/:id` — Delete item (admin only)

### Orders
- `GET /api/orders` — List all orders (auth required)
- `POST /api/orders` — Create new order (public)
- `GET /api/orders/token/:tokenNumber` — Lookup by token (public)
- `PATCH /api/orders/:id/status` — Update status (kitchen/admin only)

---

## 🎯 Development Workflow

### Add a New Menu Item
1. Go to **Admin** page (requires login)
2. Fill out the form (name, description, price, category, etc.)
3. Click "Add Item"
4. Item appears on menu immediately

### Place an Order
1. Browse menu on **Landing** page
2. Click menu items to add to cart
3. Adjust quantities
4. Click "Checkout"
5. Get token number and see success screen

### Track Order
1. Click "Track Order" link (in navbar or after checkout)
2. Enter token number
3. See status timeline and estimated time

### Update Order Status (Kitchen)
1. Login as kitchen staff
2. View **Kitchen Dashboard**
3. See orders in status columns
4. Click "Accept" → "Cooking" → "Ready" as you prepare

---

## ⚙️ Production Deployment

### Environment Variables (Production)
```env
MONGO_URI=mongodb+srv://prod-user:prod-pass@prod-cluster.mongodb.net/food_ordering
JWT_SECRET=generate-a-strong-random-secret-key-here
PORT=4000
NODE_ENV=production
```

### Build for Production
```bash
npm run build
# Creates optimized build in dist/
```

### Start Production Server
```bash
# Frontend (already built)
npm run start
```

---

## 🧪 Testing the App

### End-to-End Flow
1. **Terminal 1**: `npm run dev:server` (backend)
2. **Terminal 2**: `npm run dev` (frontend)
3. Visit `http://localhost:5173`
4. Browse menu, add items, checkout
5. Receive token number
6. Track order in real-time
7. Login as kitchen staff to update status

### API Testing
```bash
# Get all menu items
curl http://localhost:4000/api/menu

# Create an order
curl -X POST http://localhost:4000/api/orders \
  -H "Content-Type: application/json" \
  -d '{"items":[{"id":"123","quantity":2}],"total_amount":500}'

# Get order by token
curl http://localhost:4000/api/orders/token/42
```

---

## 🔒 Security Notes

- Passwords are hashed with bcryptjs (10 salt rounds)
- JWT tokens expire after 7 days
- Sensitive routes protected with role-based middleware
- Environment variables keep secrets out of version control
- Change demo credentials before production deployment

---

## 🔄 Real-Time Updates

- **Kitchen Dashboard**: Polls `/api/orders` every 1 second
- **Order Tracking**: Auto-refreshes every 2 seconds
- **Menu**: Cached on first load, can be refreshed

---

## 🚀 Future Enhancements

- 📡 WebSocket integration for real-time updates (replace polling)
- 💳 Payment gateway integration
- 📊 Analytics dashboard
- 📱 Mobile-optimized UI
- 🔔 Push notifications
- 🗣️ Staff communication/notes system
- 📈 Order history and reports

---

## 📞 Support

For issues or questions, open an issue on GitHub or contact the development team.

---

## 📄 License

MIT License — See LICENSE file for details.

---

**Made with ❤️ for faster campus lunches**

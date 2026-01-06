# Employee HR Dashboard

**MERN stack** app for employee management with JWT auth, CRUD, and printing. Responsive Tailwind UI. [web:52]

## ✨ Features
- Secure login/register (JWT)
- Employee CRUD operations
- Responsive sidebar + mobile toggle
- Print employee lists/profiles
- Protected dashboard routes

## 🛠️ Tech Stack



## 🚀 Quick Setup

```bash
git clone https://github.com/yourusername/mern-hr-dashboard.git
cd mern-hr-dashboard

# Backend
cd backend && npm i && node server.js # port 8009

# Frontend (new tab)
cd mern && npm i && npm run dev  # port 5173

📱 Routes
/ - Login

/register - Register

/dashboard - Dashboard (protected)

/employees - Employee management (protected)


frontend/src/pages/
├── Login/
├── Register/
├── Dashboard/     # + Sidebar
└── Employee form/
frontend/src/context/authContext.jsx


# Employee HR Dashboard

## Project Overview
Full-stack MERN application for HR teams to manage employee records. Features secure JWT authentication, responsive Tailwind UI, employee CRUD operations, and professional print functionality for individual/bulk employee lists.

## Tech Stack Used
Frontend: React 18 + Vite + Tailwind CSS + React Router v6
Backend: Node.js + Express.js + MongoDB + JWT Authentication
Utils: Axios, React Context API, React Icons
Database: MongoDB (mern_assignment)

## Project Structure
frontend/src/pages/
├── Login/
├── Register/
├── Dashboard/ # + Sidebar
└── Employee form/
frontend/src/context/authContext.jsx


## Steps to Run Locally

1. **Clone repository**
```bash
git clone https://github.com/Manish123567/mern-employee-dashboard.git
cd mern-employee-dashboard

Backend Setup
cd backend
npm install
# Create .env file:
# PORT=8009
# MONGODB_URI=mongodb://localhost:27017/mern_assignment
# JWT_SECRET=your-super-secret-key
npm run dev

Frontend Setup (new terminal)
cd mern
npm install
npm run dev

Access Application

Frontend: http://localhost:5173

Backend API: http://localhost:8009

Assumptions & Design Decisions
Authentication

JWT tokens stored in localStorage (simple, works for demo)

Protected routes redirect to login automatically

No refresh tokens (single-page app focus)

Database

MongoDB collection: mern_assignment database

No schema validation (flexible employee fields)

Images stored via multer uploads

Routing

/ → Login (public)

/register → Register (public)

/dashboard, /employees → Protected routes

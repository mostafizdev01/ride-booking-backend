# 🚗 Ride Booking System

A full-stack ride-booking platform that connects **riders** with available **drivers**. It supports role-based access (Admin, Rider, Driver), authentication, and ride management functionality.

---

## 📌 Project Overview

**Key Features:**
- 🔐 JWT-based Authentication & Authorization
- 👥 Role-based access: Super Admin, Admin, Driver, Rider
- 🧍 Riders can request and cancel rides
- 🚘 Drivers can accept and complete rides
- 🛑 Admins can manage users and monitor all ride activities
- 📦 Scalable, modular backend using Express.js and MongoDB

---

## ⚙️ Setup & Environment Instructions
src/
│
├── app/
│   ├── store.ts            # Redux store setup
│   ├── hooks.ts            # Typed useAppDispatch/useAppSelector
│
├── features/
│   ├── auth/
│   │   ├── authApi.ts      # RTK Query endpoints for login/register/profile
│   │   ├── authSlice.ts    # Redux state (if needed)
│   │   └── LoginForm.tsx   # Component
│   │
│   ├── ride/
│   │   ├── rideApi.ts      # Ride-related API (book, get rides, etc.)
│   │   ├── RideCard.tsx    # Reusable component
│   │   ├── RideList.tsx    # List of rides
│   │   └── RideForm.tsx    # Booking form
│
├── components/
│   ├── ui/                 # Buttons, Inputs, Modals, etc.
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Modal.tsx
│   │   └── Card.tsx
│   │
│   ├── layout/
│   │   ├── Sidebar.tsx
│   │   ├── Navbar.tsx
│   │   └── DashboardLayout.tsx
│
├── pages/
│   ├── Home.tsx
│   ├── Login.tsx
│   ├── Register.tsx
│   └── dashboard/
│       ├── RiderDashboard.tsx
│       ├── BookRide.tsx
│       ├── RideHistory.tsx
│       └── Profile.tsx
│
├── routes/
│   ├── ProtectedRoute.tsx   # Prevent unauthenticated access
│   ├── RiderRoutes.tsx      # Rider-specific route config
│
├── utils/
│   ├── token.ts             # Cookie or JWT utilities
│   ├── constants.ts         # API URLs, config
│   ├── helpers.ts           # Common helper functions
│
└── index.tsx


### ✅ Prerequisites
- Node.js (v18+)
- MongoDB Atlas or Local MongoDB
- Postman for API Testing

### 📁 Clone and Setup Project

```bash
git clone https://github.com/your-username/ride-booking-system.git
cd ride-booking-system
npm install

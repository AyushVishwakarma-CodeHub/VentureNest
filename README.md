# 🚀 VentureNest (PitchHub)

> **The ultra-premium digital marketplace connecting visionary startup entrepreneurs with global venture capitalists, angel investors, and mentors.**

[![Frontend Deployment](https://img.shields.io/badge/Frontend-Vercel-black?style=for-the-badge&logo=vercel)](https://venturenest.vercel.app)
[![Backend Deployment](https://img.shields.io/badge/Backend-Render-darkviolet?style=for-the-badge&logo=render)](https://venturenest-n7hv.onrender.com)
[![Stack](https://img.shields.io/badge/Stack-MERN-blue?style=for-the-badge)](https://github.com/AyushVishwakarma-CodeHub/VentureNest)

---

## 🔗 Live Application Links

| Platform Component | Deployment Host | URL |
| :--- | :--- | :--- |
| **🌐 Frontend Client** | Vercel | [https://venturenest.vercel.app](https://venturenest.vercel.app) |
| **⚡ Backend API Server** | Render | [https://venturenest-n7hv.onrender.com](https://venturenest-n7hv.onrender.com) |

---

## 🎨 Premium Visual Design System

VentureNest features a customized premium fintech-B2B UI design:
- **Obsidian Dark Mode**: Deep cosmic obsidian background color settings (`#020617` / `--bg-primary`) to provide elite visual depth.
- **Glassmorphism**: Translucent frosted overlay containers configured with heavy `24px` backdrop blurs and top-edge light reflection sheens.
- **Claymorphism**: Tactile 3D rounded button grids, timeline timeline indicators, statistics tiles, and featured pricing tiers featuring custom inset drop-shadow gradients.

---

## ✨ Core Platform Modules

### 1. Dual Role-Based Dashboards
- **Founder Console**: Real-time analytical tracking, funding goals progress calculators, and milestone timelines.
- **Investor Console**: Saved startup distribution breakdowns by sector, funding stage charts, and investment term negotiation summaries.

### 2. Intelligent AI SWOT & Matchmaking
- **Investment Readiness Heuristics**: Automated analysis evaluating company descriptors and milestones to compute a readiness score.
- **Strategic SWOT Matrix**: Synthesized Strengths, Weaknesses, Opportunities, and Threats cards.
- **VC Matchmaking**: Matches startups with venture capital profiles based on industry sectors and investor interests.

### 3. Connection & Deal Flow Tunnels
- **Live Deal Chat**: Instant database room chat tunnels connecting founders and interested VCs.
- **Invest in Startup**: Propose terms (Investment Value, Equity Offered, Cover Message) through an interactive local modal popup.

---

## 🛠️ Technology Stack

### Client-Side (Frontend)
- **Framework**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS (with custom Glass/Clay classes), Lucide Icons
- **Animation**: Framer Motion
- **State Management**: Zustand
- **Caching**: TanStack React Query

### Server-Side (Backend)
- **Runtime**: Node.js, Express, TypeScript
- **Database**: MongoDB & Mongoose
- **Validation**: Zod Schemas
- **Security**: JWT Authentication, Helmet, Rate Limiters
- **Uploads**: Multer (with development fallback to mock assets)

---

## 📁 Repository Structure

```text
VentureNest/
├── client/          # Vite + React TypeScript Frontend App
└── server/          # Express + MongoDB TypeScript Backend API
```

---

## 🚀 Getting Started

### Local Setup Instructions

#### 1. Setup Backend Server Environment
Create a `.env` file inside the `server/` directory:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_ACCESS_SECRET=your_jwt_access_secret_key
JWT_REFRESH_SECRET=your_jwt_refresh_secret_key
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d
CLIENT_URL=http://localhost:3000
```

#### 2. Run the Services

**Start Backend API**:
```bash
cd server
npm install
npm run dev
```

**Start Frontend App**:
```bash
cd client
npm install
npm run dev
```

The client will open automatically at `http://localhost:3000`.

---

## ✒️ Creator
Designed and Developed by **[Ayush Raj Vishwakarma](https://ayushrajvishwakarma.in/)**.

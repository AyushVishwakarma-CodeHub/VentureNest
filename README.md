# VentureNest (PitchHub) 🚀

> **Where Great Ideas Meet Great Investors.**

VentureNest is an ultra-premium, B2B fintech and venture capital digital marketplace that connects startup entrepreneurs with angel investors, mentors, and venture capital partners. The platform facilitates pitching, secure negotiation of investment terms, AI-powered startup evaluation, and real-time deal discussions.

---

## 🎨 Premium Visual Design System

VentureNest features a state-of-the-art modern visual identity built around:
- **Cosmic Obsidian Theme**: A deep, luxurious obsidian dark mode canvas for high visual contrast.
- **Glassmorphism Accents**: Cards and navigation components built with a `24px` backdrop blur, translucent overlays, and light-catching top sheens.
- **Claymorphism Controls**: Soft, volumetric 3D components, candy-like gradients, and responsive hover-scale actions on CTA buttons, statistics panels, and timeline milestones.

---

## ✨ Core Features

### 👤 Dual Role-Based Dashboards
- **Founder Dashboard**: Track profile views, bookmark counts, funding goals progress indicators, and log roadmaps/ traction milestones with interactive **Recharts Area & Radar charts**.
- **Investor Dashboard**: Browse matched VCs, active investment proposals, and saved startups distribution breakdowns by industry sector and funding stage.

### 🔍 Startup Discovery Directory
- Full-text search and filtering of startups by stage (Idea, MVP, Seed, Series A, Series B) and industry sector (SaaS, Fintech, AI/ML, Healthtech, Edtech, etc.).
- Complete company overview profile page with tabs for Pitch Deck presentations, traction metrics, and milestones history.

### 🧠 AI Evaluation & SWOT SWOT Analysis
- Automated evaluation generating investment readiness scores and recommendations.
- SWOt (Strengths, Weaknesses, Opportunities, Threats) strategic matrix report.
- Intelligent Venture Capital Matchmaking matching startups with VCs according to investor sector preferences.

### ✉️ Actionable Deal Discussion Tunnels
- **Invest in Startup**: Submit investment term sheet proposal sheets (Amount, Equity Stake, and Message) directly inside the company profile.
- **Contact VC**: Instantly spawns a live chat database room connecting founders and prospective partners.

---

## 🛠️ Technology Stack

### Frontend Client
- **React 18** with **TypeScript** & **Vite**
- **Tailwind CSS** (Utility-first styling with custom Glassmorphism/Claymorphic rules)
- **Framer Motion** (Micro-animations and layout transitions)
- **Zustand** (Global state store management)
- **TanStack React Query** (Server state caching and asynchronous mutations)
- **Lucide React** (Tactile iconography)

### Backend Server
- **Node.js** with **Express** & **TypeScript**
- **MongoDB** via **Mongoose** (ODM mapping schemas)
- **Zod** (Rigorous validation of request parameters)
- **JWT** (JSON Web Tokens authentication)
- **Multer** (File uploads middleware with automated local fallbacks for development)

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB instance (Local or Atlas connection URL)

### 1. Environment Configurations
Configure the database and auth secrets in your server environment:

**Create `server/.env`**:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/startup-pitch-hub
JWT_ACCESS_SECRET=your-super-secret-access-key
JWT_REFRESH_SECRET=your-super-secret-refresh-key
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d
CLIENT_URL=http://localhost:3000
```

### 2. Install & Start Server
```bash
cd server
npm install
npm run dev
```

### 3. Install & Start Client
```bash
cd client
npm install
npm run dev
```

Open your browser and navigate to `http://localhost:3000`.

---

## ✒️ Creator
Created and maintained by **[Ayush Raj Vishwakarma](https://ayushrajvishwakarma.in/)**.

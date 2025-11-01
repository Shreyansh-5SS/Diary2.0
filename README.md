# Shreyansh Personal Diary

Minimalism + Brutalism design system for personal diary, portfolio, and productivity tracking.

## Tech Stack

### Frontend
- React 18
- Vite
- React Router v6
- Axios
- React Bootstrap
- Framer Motion
- Chart.js / React-Chartjs-2
- React Beautiful DnD

### Backend
- Node.js 20
- Express
- SQLite (via Knex.js)
- Helmet (security)
- CORS

## Development Setup

### Prerequisites
- Node.js 20.x
- npm

### Installation

1. **Install frontend dependencies:**
```bash
cd frontend
npm install
```

2. **Install backend dependencies:**
```bash
cd backend
npm install
```

3. **Setup environment:**
```bash
cd backend
cp .env.example .env
# Edit .env with your configuration
```

### Running the Application

1. **Start backend server:**
```bash
cd backend
npm run dev
# Server runs on http://localhost:4000
```

2. **Start frontend dev server:**
```bash
cd frontend
npm run dev
# Vite runs on http://localhost:5173
```

3. **Health check:**
```bash
curl http://localhost:4000/health
# Should return: {"ok": true}
```

## Project Structure

```
Diary/
├── frontend/
│   ├── public/
│   │   └── assets/          # LOVABLE_UI reference images
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   │   ├── Header.jsx
│   │   │   └── Header.module.css
│   │   ├── pages/           # Route pages
│   │   │   ├── LandingSplit.jsx
│   │   │   ├── HomeSkeleton.jsx
│   │   │   └── WorkSkeleton.jsx
│   │   ├── styles/          # Global styles
│   │   │   └── global.module.css
│   │   ├── App.jsx          # Main app + routing
│   │   └── main.jsx         # Entry point
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── backend/
│   ├── migrations/          # Knex migrations
│   ├── seeds/               # Database seeds
│   ├── index.js             # Express server
│   ├── knexfile.js          # Knex configuration
│   ├── .env                 # Environment variables
│   └── package.json
└── mockups/                 # Design mockups (reference)
```

## Design System

### Color Tokens
- `--bg-light`: #faf7f2 (HOME side)
- `--bg-dark`: #0f172a (WORK side)
- `--text-dark`: #000
- `--text-light`: #fff
- `--accent`: #ff6347

### Typography
- Primary: Space Grotesk
- Secondary: Work Sans
- Body: Inter

### Principles
- Flat design (no shadows, no blur)
- Sharp corners (0px border-radius)
- Bold typography
- High contrast
- Minimal animations (translateY only)

## Features

### Current (v1.0)
- ✅ Split landing page (HOME/WORK)
- ✅ Navigation routing
- ✅ Brutalist design system
- ✅ Accessible interactions
- ✅ Backend health check

### Planned
- Diary CRUD operations
- Anime collection grid
- Wallet tracker
- Portfolio showcase
- WorkDesk (timetable, skills, tasks)

## License

Private project - All rights reserved

# Project Setup Complete - Command Reference

## Files Created

### Frontend Structure
```
frontend/
├── index.html
├── package.json
├── vite.config.js
├── public/
│   └── assets/
│       └── README.md
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── components/
    │   ├── Header.jsx
    │   └── Header.module.css
    ├── pages/
    │   ├── LandingSplit.jsx
    │   ├── LandingSplit.module.css
    │   ├── HomeSkeleton.jsx
    │   ├── HomeSkeleton.module.css
    │   ├── WorkSkeleton.jsx
    │   └── WorkSkeleton.module.css
    └── styles/
        └── global.module.css
```

### Backend Structure
```
backend/
├── index.js
├── package.json
├── knexfile.js
├── .env
├── .env.example
├── migrations/
│   └── README.md
└── seeds/
```

### Root Files
```
.gitignore
README.md
```

---

## Installation Commands

```bash
# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

---

## Run Commands

### Start Backend (Terminal 1)
```bash
cd backend
npm run dev
# Server runs on http://localhost:4000
```

### Start Frontend (Terminal 2)
```bash
cd frontend
npm run dev
# Vite runs on http://localhost:5173
```

---

## Verification Commands

### Backend Health Check
```bash
# PowerShell
Invoke-WebRequest -Uri http://localhost:4000/health | Select-Object -ExpandProperty Content
# Expected: {"ok":true}

# Or use browser
# Navigate to: http://localhost:4000/health
```

### Frontend Check
```
# Open browser to: http://localhost:5173
# Should see: Split landing page with HOME (left, #faf7f2) and WORK (right, #0f172a)
# Click left → navigates to /home skeleton
# Click right → navigates to /work skeleton
```

---

## Git Commit Message

```
feat: scaffold brutalist project + minimal split landing
```

---

## Implementation Details

### Landing Page Features ✓
- Exact vertical 50/50 split layout
- LEFT: #faf7f2 background, "HOME" heading, "Personal • Anime • Wallet" subtext
- RIGHT: #0f172a background, "WORK" heading, "Portfolio • Desk • Skills" subtext
- Center divider: 2px black line with "SHREYANSH PERSONAL DIARY" label
- Click navigation using react-router-dom
- Hover effects: translateY(-3px) for headings, underline animation for subtext
- Accessibility: role="button", tabindex="0", aria-label on each half
- Keyboard support: Enter/Space triggers navigation

### Header Component ✓
- Fixed top position
- Left: "Shreyansh" logo → links to /
- Right: Hamburger menu icon (3 lines)
- Minimal styling with hover effects
- Accessibility: aria-labels, focus states

### Skeleton Pages ✓
- HomeSkeleton.jsx: Uses #faf7f2 background, center heading + description
- WorkSkeleton.jsx: Uses #0f172a background, center heading + description
- Both include back-to-landing link
- Responsive design

### Global Styles ✓
- CSS custom properties (tokens)
- Color system defined
- Typography system (Space Grotesk, Work Sans, Inter)
- Layout classes: .split-container, .half, .divider, .center-label
- Utility classes: .hover-translate, .card-brutalist, .btn-brutalist
- Responsive breakpoints
- Accessibility utilities (.sr-only)

### Backend ✓
- Express server with security (helmet, cors)
- Health check endpoint: GET /health → {ok: true}
- Knex configuration for SQLite (./dev.sqlite)
- Environment variables with .env.example
- Error handling middleware
- 404 handler

---

## Tech Stack Verification

### Frontend Dependencies Installed ✓
- react ^18.3.1
- react-dom ^18.3.1
- react-router-dom ^6.26.2
- axios ^1.7.7
- react-bootstrap ^2.10.4
- bootstrap ^5.3.3
- framer-motion ^11.5.4
- react-chartjs-2 ^5.2.0
- chart.js ^4.4.4
- react-beautiful-dnd ^13.1.1

### Backend Dependencies Installed ✓
- express ^4.19.2
- cors ^2.8.5
- helmet ^7.1.0
- knex ^3.1.0
- sqlite3 ^5.1.7
- dotenv ^16.4.5

---

## Design System Reference

### Color Tokens
```css
--bg-light: #faf7f2;
--bg-dark: #0f172a;
--text-dark: #000;
--text-light: #fff;
--accent: #ff6347;
--border-color: #1a1a1a;
```

### Typography
```css
--font-primary: 'Space Grotesk', sans-serif;
--font-secondary: 'Work Sans', sans-serif;
--font-body: 'Inter', sans-serif;
```

### Design Principles
- ✓ Flat blocks (no shadows)
- ✓ Sharp corners (0px border-radius)
- ✓ Bold typographic hierarchy
- ✓ High contrast
- ✓ No blur effects
- ✓ No soft shadows
- ✓ Minimal animations (translateY only)
- ✓ Brutalism + Minimalism theme

---

## Next Steps

1. Database migrations (when needed)
2. Feature implementation:
   - Diary CRUD
   - Anime collection
   - Wallet tracker
   - Portfolio showcase
   - WorkDesk components

---

## Status: ✅ COMPLETE

Both servers running successfully:
- Frontend: http://localhost:5173 ✓
- Backend: http://localhost:4000 ✓
- Health check: /health → {"ok":true} ✓
- Split landing page: Interactive and accessible ✓
- Navigation: HOME and WORK routes working ✓
- Design system: Brutalist theme implemented ✓

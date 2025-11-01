# Shreyansh Personal Diary - High-Fidelity Mockups

## 📦 Deliverables Overview

This package contains complete design mockups for "Shreyansh Personal Diary" following a **Minimalism + Brutalism** design aesthetic.

---

## 📂 Files Included

### 1. **Design System Documentation** (`design-system-annotations.md`)
Comprehensive design system specifications including:
- Color tokens (off-white `#faf7f2`, deep navy `#0f172a`, accent red `#ef4444`)
- Typography system (Space Grotesk, Work Sans, Inter, Dancing Script)
- Grid specifications (12-column desktop, 4-column mobile)
- Button styles (flat, solid, sharp corners)
- Card specifications (1px borders, no border-radius)
- Micro-interactions (hover translateY only, 150ms timing)
- Spacing system and component specs

### 2. **Desktop Mockup** (`desktop-1440px.html`)
High-fidelity interactive mockup at 1440px width featuring:

**Landing Page:**
- Exact vertical 50/50 split (720px each side)
- LEFT: Off-white `#faf7f2` background with "HOME" label
- RIGHT: Deep navy `#0f172a` background with "WORK" label
- Center: Thin 1px divider with "SHREYANSH PERSONAL DIARY" label
- Primary/Secondary buttons with hover effects

**HOME Preview Screens:**
- **Diary**: Open-book style with two rectangular pages (400px × 520px each)
- **Anime Grid**: 3-column Pinterest-style masonry grid with varying heights
- **Wallet**: Yellow gradient card with flat progress bars (no shadows)

**WORK Preview Screens:**
- **Portfolio Hero**: Rounded portrait (240px, 16px radius), cursive display name (Dancing Script 64px), professional tagline
- **Projects Grid**: 3-column bold grid with project cards (1px borders, sharp corners)
- **WorkDesk Preview**: Wooden table background (`#8b6f47`) with three slides:
  - Slide 1: Timetable (5-column grid)
  - Slide 2: Skills (tag cloud layout)
  - Slide 3: Tasks (checklist with status indicators)

### 3. **Mobile Mockup** (`mobile-375px.html`)
Responsive mobile version at 375px width featuring:
- Stacked layout (HOME section above WORK section)
- Horizontal divider between sections
- Single-column layouts
- 2-column anime grid
- Condensed spacing (24px padding vs 80px desktop)
- All components optimized for mobile viewing

### 4. **Content Placeholders** (`content-placeholders.md`)
Complete copy and content including:
- Portfolio name: "Shreyansh"
- Tagline: "Full-Stack Developer & Creative Problem Solver"
- 3 project titles with descriptions:
  1. E-Commerce Platform
  2. Task Management App
  3. Portfolio CMS
- Short bio (3 versions: professional, casual, brief)
- Skills list, contact info, diary entries, wallet categories
- WorkDesk content (timetable, tasks, skills)

---

## 🎨 Design Philosophy

### Minimalism + Brutalism
- **Flat Design**: No shadows, minimal gradients
- **Sharp Edges**: All borders 1px solid, no border-radius (except portrait)
- **Strong Typography**: Large, bold headings with Space Grotesk
- **High Contrast**: Deep navy vs off-white for clear separation
- **Minimal Animations**: Only vertical translate on hover (150ms)
- **Content First**: Every element serves a purpose

---

## 🔍 Key Design Decisions

### Typography Hierarchy
```
Display (72px)  → Landing split labels
H1 (48px)       → Section headings
H2 (36px)       → Subsection titles
H3 (24px)       → Card titles
Body (16px)     → Standard content
Label (12px)    → Metadata, tags
```

### Color System
```
Home Side:   #faf7f2 (off-white)
Work Side:   #0f172a (deep navy)
Accent:      #ef4444 (red for CTA)
Highlight:   #fbbf24 (yellow for wallet)
Wood Desk:   #8b6f47 (WorkDesk background)
```

### Spacing
```
Desktop: 80px outer padding, 24px card gaps
Mobile:  24px outer padding, 16px card gaps
```

### Interactive Elements
```
Hover: transform: translateY(-2px to -4px)
Timing: 150ms ease-out
No other effects (no scale, rotation, blur, shadows)
```

---

## 🖥️ How to View the Mockups

### Option 1: Open in Browser
Simply open the HTML files in any modern web browser:
- `desktop-1440px.html` - For desktop view
- `mobile-375px.html` - For mobile view

### Option 2: Use VS Code Live Preview
1. Right-click on an HTML file
2. Select "Open with Live Preview"
3. View with hot-reload capability

### Option 3: Browser Developer Tools
- Open `desktop-1440px.html` in browser
- Press F12 to open DevTools
- Toggle device toolbar (Ctrl+Shift+M / Cmd+Shift+M)
- Test responsive behavior

---

## 📱 Responsive Behavior

### Desktop (1440px)
- Vertical split landing page (exact 50/50)
- Multi-column grids (3 columns for anime/projects)
- Open-book diary with two pages side-by-side
- Horizontal WorkDesk slides

### Mobile (375px)
- Stacked landing sections (HOME → WORK)
- Single-column project cards
- 2-column anime grid
- Single diary pages (scrollable)
- Vertical WorkDesk slides

---

## 🎯 Component Specifications

### Landing Page Divider
- Width: 1px
- Color: #1a1a1a
- Position: Center (50%)
- Label: White pill, 12px uppercase, 2px letter-spacing

### Diary Component
- Layout: Two rectangular pages (open book)
- Dimensions: 400px × 520px per page
- Border: 1px solid #e5e7eb
- Typography: 24px heading, 16px body, 1.6 line-height
- Hover: translateY(-4px)

### Anime Masonry Grid
- Columns: 3 (desktop) / 2 (mobile)
- Gap: 16px
- Variable heights (280px - 380px)
- Border: 1px solid
- Hover: translateY(-4px)

### Wallet Card
- Background: Linear gradient (yellow #fbbf24 → orange #f59e0b)
- Border: 1px solid black
- Progress bars: 8px height, flat design, no border-radius
- Typography: 24px title, 14px labels

### Portfolio Hero
- Portrait: 240px rounded square (16px radius)
- Name: 64px Dancing Script (cursive)
- Tagline: 18px Inter
- Layout: Centered, vertical stack, 24px gaps

### Project Cards
- Background: #1e293b (dark)
- Border: 1px solid #475569
- Title: 24px Space Grotesk Semibold
- Description: 16px Inter Regular
- CTA: Red text link with arrow
- Hover: translateY(-4px)

### WorkDesk
- Background: #8b6f47 (wooden table color)
- Border: 1px solid black
- Three slides: Timetable, Skills, Tasks
- Height: 360px (desktop) / adaptive (mobile)
- Navigation: Dots indicator

---

## 🚀 Implementation Notes

### Fonts Required
```html
<!-- Google Fonts -->
Space Grotesk (weights: 400, 500, 600, 700)
Work Sans (weights: 400, 500, 600, 700)
Inter (weights: 400, 500, 600, 700)
Dancing Script (weights: 400, 700)
```

### Browser Compatibility
- Modern browsers (Chrome, Firefox, Safari, Edge)
- CSS Grid for layouts
- Flexbox for components
- CSS Custom Properties (variables)
- No vendor prefixes needed for evergreen browsers

### Performance Considerations
- Minimal animations (only transform)
- No heavy effects (shadows, blurs)
- Static layout (no reflow triggers)
- System fonts as fallbacks

---

## 📋 Next Steps for Development

1. **Convert to React Components**
   - Create reusable component library
   - Implement state management
   - Add routing (React Router)

2. **Add Functionality**
   - Diary CRUD operations
   - Anime collection management
   - Wallet calculations
   - Project filtering
   - WorkDesk data integration

3. **Backend Integration**
   - REST API or GraphQL
   - Authentication system
   - Database schema (MongoDB/PostgreSQL)
   - File storage (AWS S3)

4. **Enhanced Features**
   - Dark mode toggle
   - Diary search & filter
   - Budget analytics
   - Project case studies
   - WorkDesk calendar sync

---

## 📞 Design Credits

**Project:** Shreyansh Personal Diary v1.0  
**Design System:** Minimalism + Brutalism  
**Created:** November 2025  
**Designer:** AI-Assisted Design  
**Owner:** Shreyansh-5SS  

---

## 📄 License

This design is created for Shreyansh Personal Diary project.
All rights reserved.

---

**Happy Building! 🚀**

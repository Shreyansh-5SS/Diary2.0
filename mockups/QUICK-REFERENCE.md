# 🎨 Quick Reference Card - Shreyansh Personal Diary

## Essential Specs at a Glance

### 🎯 Viewport Sizes
- **Desktop:** 1440px
- **Mobile:** 375px

### 🎨 Primary Colors
```css
--home-bg:    #faf7f2  /* Off-white */
--work-bg:    #0f172a  /* Deep navy */
--accent-red: #ef4444  /* CTA, links */
--accent-yel: #fbbf24  /* Wallet */
--wood-desk:  #8b6f47  /* WorkDesk */
```

### 📝 Fonts
```css
Headings:  'Space Grotesk', sans-serif  (700)
Body:      'Inter', sans-serif          (400)
Display:   'Dancing Script', cursive    (400)
```

### 📏 Font Sizes (Desktop → Mobile)
```
Display:  72px → 48px
H1:       48px → 32px
H2:       36px → 24px
H3:       24px → 20px
Body:     16px → 14px
Label:    12px → 10px
```

### 📐 Spacing
```
Desktop padding: 80px
Mobile padding:  24px
Card gaps:       24px → 16px
```

### 🔘 Buttons
```css
Primary:    solid #ef4444, white text
Secondary:  1px border, transparent
Hover:      translateY(-2px), 150ms
```

### 🃏 Cards
```css
Border:        1px solid
Radius:        0px (sharp corners)
Shadow:        none (flat)
Hover:         translateY(-4px), 150ms
```

### ⚡ Animations
```css
/* ONLY this animation */
hover: transform: translateY(-2px to -4px)
timing: 150ms ease-out

/* NO shadows, blur, scale, rotation */
```

---

## 📦 Component Quick Sizes

### Landing
```
Split: 720px | 1px | 720px (desktop)
Stack: 50vh / 50vh (mobile)
```

### Diary
```
Desktop: 400×520px × 2 pages
Mobile:  full width × auto
```

### Anime Grid
```
Desktop: 3 cols, 280-380px heights
Mobile:  2 cols, 200-260px heights
```

### Wallet
```
Height: 8px progress bars
Gradient: #fbbf24 → #f59e0b
```

### Portfolio
```
Portrait: 240px (desktop) / 160px (mobile)
Radius: 16px (desktop) / 12px (mobile)
Name: 64px (desktop) / 40px (mobile)
```

### Projects
```
Desktop: 3 columns
Mobile:  1 column
Min height: 280px
```

### WorkDesk
```
Background: #8b6f47
Height: 360px (desktop) / auto (mobile)
Slides: 3 (Timetable, Skills, Tasks)
```

---

## 🎯 Design Principles

1. **Sharp Corners** → 0px border-radius (except portrait)
2. **Flat Design** → No shadows, minimal gradients
3. **Heavy Borders** → 1px solid everywhere
4. **Bold Type** → Large, impactful headings
5. **High Contrast** → Strong color separation
6. **Minimal Animation** → Only translateY on hover
7. **Content First** → Remove decoration, keep function

---

## 🚀 Files Overview

| File | Purpose |
|------|---------|
| `desktop-1440px.html` | Desktop mockup |
| `mobile-375px.html` | Mobile mockup |
| `design-system-annotations.md` | Full design system |
| `content-placeholders.md` | All copy/content |
| `README.md` | Project documentation |
| `SUMMARY.md` | Deliverables checklist |
| `VISUAL-GUIDE.md` | Layout diagrams |
| `QUICK-REFERENCE.md` | This file |

---

## ✅ Checklist Before Development

- [ ] Review both mockups in browser
- [ ] Check all hover interactions work
- [ ] Verify colors match exactly
- [ ] Test responsive behavior
- [ ] Replace placeholder content
- [ ] Load required fonts
- [ ] Set up CSS variables
- [ ] Create component structure
- [ ] Plan state management
- [ ] Design database schema

---

## 🔗 Quick Links

**Open Mockups:**
- `file:///c:/dev/Diary/mockups/desktop-1440px.html`
- `file:///c:/dev/Diary/mockups/mobile-375px.html`

**Google Fonts:**
```html
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600;700&family=Dancing+Script:wght@400;700&display=swap" rel="stylesheet">
```

---

## 🎨 Color Palette Visual

```
HOME SIDE          WORK SIDE
█ #faf7f2          █ #0f172a

ACCENTS            NEUTRALS
█ #ef4444          █ #ffffff
█ #fbbf24          █ #1e293b
█ #8b6f47          █ #475569
```

---

## 📋 Content Needed

✓ Name: Shreyansh  
✓ Tagline: Full-Stack Developer & Creative Problem Solver  
✓ 3 Projects: E-Commerce, Task App, Portfolio CMS  
✓ Bio: See content-placeholders.md  
✓ Skills: React, Node.js, TypeScript, etc.  
✓ Diary entries: 3 sample entries provided  
✓ Anime titles: 12 titles provided  
✓ Wallet categories: 8 categories provided  

---

**Print this for quick reference during development! 📄**

# Shreyansh Personal Diary - Design System Annotations
## Minimalism + Brutalism Aesthetic

---

## 🎨 Color Tokens

### Primary Colors
```
--color-home-bg: #faf7f2      /* Off-white (HOME side) */
--color-work-bg: #0f172a      /* Deep navy (WORK side) */
--color-divider: #1a1a1a      /* Center divider line */
--color-text-dark: #0a0a0a    /* Primary text on light */
--color-text-light: #f5f5f5   /* Primary text on dark */
```

### Secondary Colors
```
--color-accent-red: #ef4444       /* Call-to-action, highlights */
--color-accent-yellow: #fbbf24    /* Wallet progress, warnings */
--color-neutral-100: #f9fafb      /* Card backgrounds (light) */
--color-neutral-800: #1e293b      /* Card backgrounds (dark) */
--color-neutral-600: #475569      /* Secondary text */
--color-border: #e5e7eb           /* 1px borders */
--color-wood: #8b6f47             /* WorkDesk wooden table */
```

---

## 📝 Typography

### Font Families
```css
/* Headings & Display */
--font-primary: 'Space Grotesk', sans-serif;
--font-secondary: 'Work Sans', sans-serif;

/* Body & UI */
--font-body: 'Inter', sans-serif;

/* Special: Portfolio Display Name (visual only) */
--font-cursive: 'Dancing Script', cursive; /* or similar cursive font */
```

### Font Sizes & Weights (Desktop 1440px)
```css
/* Headings */
--text-display: 72px / Bold 700      /* Landing split labels */
--text-h1: 48px / Bold 700           /* Section headings */
--text-h2: 36px / Semibold 600       /* Sub-headings */
--text-h3: 24px / Semibold 600       /* Card titles */

/* Body */
--text-body-lg: 18px / Regular 400   /* Main content */
--text-body: 16px / Regular 400      /* Standard text */
--text-body-sm: 14px / Regular 400   /* Captions, metadata */

/* Special */
--text-label: 12px / Medium 500      /* Center label, tags */
--text-cursive-display: 64px / Regular 400  /* Portfolio name */
```

### Font Sizes (Mobile 375px)
```css
--text-display: 48px / Bold 700
--text-h1: 32px / Bold 700
--text-h2: 24px / Semibold 600
--text-h3: 20px / Semibold 600
--text-body-lg: 16px / Regular 400
--text-body: 14px / Regular 400
--text-body-sm: 12px / Regular 400
--text-cursive-display: 40px / Regular 400
```

---

## 📐 Grid Specifications

### Desktop Layout (1440px)
```
Container: 1440px width
Vertical Split: 720px LEFT | 720px RIGHT (exact 50/50)
Divider: 1px solid line, centered
Inner Padding: 80px horizontal, 60px vertical
Grid Columns: 12-column system (60px gutters)
Card Spacing: 24px gaps
```

### Mobile Layout (375px)
```
Container: 375px width (full bleed)
Stacked Layout: HOME section → WORK section
Inner Padding: 24px horizontal, 32px vertical
Grid Columns: 4-column system (16px gutters)
Card Spacing: 16px gaps
```

---

## 🔘 Button Styles

### Primary Button
```css
Background: solid #ef4444 (accent red)
Text: #ffffff, 16px Medium 500
Padding: 14px 32px
Border: none
Border-radius: 0px (sharp corners)
Transition: transform 150ms ease

Hover: transform: translateY(-2px)
Active: transform: translateY(0)
```

### Secondary Button
```css
Background: transparent
Text: #0a0a0a, 16px Medium 500
Padding: 14px 32px
Border: 1px solid #0a0a0a
Border-radius: 0px
Transition: transform 150ms ease

Hover: transform: translateY(-2px), background: #0a0a0a, color: #ffffff
```

### Text Button (minimal)
```css
Background: transparent
Text: #ef4444, 16px Medium 500
Border: none
Underline on hover
```

---

## 🃏 Card Specifications

### Standard Card
```css
Background: #ffffff or #1e293b (context-dependent)
Border: 1px solid #e5e7eb or #475569
Border-radius: 0px (sharp corners, brutalist)
Padding: 24px
Shadow: none (flat design)
Transition: transform 150ms ease

Hover: transform: translateY(-4px)
```

### Image Card (Anime Grid)
```css
Border: 1px solid #e5e7eb
Border-radius: 0px
Overflow: hidden
Aspect-ratio: varies (Pinterest masonry)
Shadow: none

Hover: transform: translateY(-4px)
```

### Wallet Card
```css
Background: gradient (#fbbf24 → #f59e0b)
Border: 1px solid #0a0a0a
Border-radius: 0px
Padding: 32px
Color: #0a0a0a

Progress bars:
- Height: 8px
- Background: rgba(0,0,0,0.1)
- Fill: #0a0a0a
- Border-radius: 0px
```

---

## ⚡ Micro-Interactions

### Hover Animations
```css
/* Cards & Buttons */
transform: translateY(-2px) to translateY(-4px)
transition: transform 150ms ease-out

/* Links */
text-decoration: underline
transition: color 100ms ease
```

### No Other Effects
```
❌ No shadows
❌ No scale transforms
❌ No rotation
❌ No blur effects
✅ Only vertical translate on hover
✅ Instant color changes
```

---

## 📱 Component Specifications

### Landing Page Center Divider
```
Width: 1px
Height: 100vh
Color: #1a1a1a
Position: absolute, left: 50%

Center Label:
- Text: "SHREYANSH PERSONAL DIARY"
- Size: 12px, Letter-spacing: 2px, Uppercase
- Position: centered vertically & horizontally over divider
- Background: white pill shape, padding 8px 16px
```

### Diary Component (Open Book)
```
Layout: Two rectangular pages side-by-side
Background: #ffffff
Border: 1px solid #e5e7eb
Gap: 16px (spine)
Page dimensions: 400px × 520px each (desktop)

Typography:
- Date heading: 24px Bold (Space Grotesk)
- Entry text: 16px Regular (Inter)
- Line-height: 1.6
```

### Anime Masonry Grid
```
Columns: 3 (desktop) / 2 (mobile)
Gap: 16px
Items: varying heights
Border: 1px solid on each card
Hover: translateY(-4px)
```

### Portfolio Hero
```
Portrait: 240px circle → converted to rounded square (16px radius)
Name: 64px Dancing Script (cursive)
Tagline: 18px Inter Regular
Layout: centered, vertical stack
Spacing: 24px gaps
```

### Projects Grid
```
Layout: 3 columns (desktop) / 1 column (mobile)
Card size: equal heights
Border: 1px solid
Title: 24px Space Grotesk Semibold
Description: 16px Inter Regular
CTA: Text button with arrow →
```

### WorkDesk Preview
```
Background: #8b6f47 (wooden table color block)
Three horizontal slides:
1. Timetable: Grid layout, time slots
2. Skills: Tag cloud or progress bars
3. Tasks: Checklist with status indicators

Slide width: full container
Height: 360px
Navigation: Dots indicator at bottom
Border: 1px solid #0a0a0a
```

---

## 📏 Spacing System

```css
--space-xs: 4px
--space-sm: 8px
--space-md: 16px
--space-lg: 24px
--space-xl: 32px
--space-2xl: 48px
--space-3xl: 64px
--space-4xl: 80px
```

---

## 🎯 Key Principles

1. **Brutalist Sharp Edges**: All borders are 1px solid, no border-radius (except portrait)
2. **Flat Design**: No shadows, no gradients (except wallet card accent)
3. **Minimal Animations**: Only translateY on hover, 150ms timing
4. **Strong Typography**: Large, bold headings with ample white space
5. **Vertical Split Symmetry**: Exact 50/50 division on landing page
6. **High Contrast**: Deep navy vs off-white for clear section separation
7. **Information Hierarchy**: Space Grotesk for impact, Inter for readability

---

*Design System v1.0 - November 2025*

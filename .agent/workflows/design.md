---
description: Visual polish, CSS tuning, animation upgrades, and aesthetic improvements without functional changes.
---

# Design Workflow

Use this for "Wow Factor" tuning, visual upgrades, and aesthetic refinements. **NO LOGIC CHANGES.**

---

## Gate: What Can Be Changed?

| ✅ ALLOWED | ❌ NOT ALLOWED |
|------------|----------------|
| CSS variables (colors, spacing, gradients) | Component logic (useEffect, useState) |
| Animation timing, easing, spring configs | Event handlers or data flow |
| Rotation speeds in useFrame | Conditional rendering |
| Hover effects and micro-interactions | Adding external dependencies |
| Glow, shadow, glassmorphism enhancements | Changing navigation patterns |
| Visual depth and layering | Modifying content/text |

---

## Phase 1: Analysis

### 1.1 Scope the Change
- [ ] Clearly state the goal (e.g., "Make neon glow brighter", "Add hover lift to cards").
- [ ] Identify target files: CSS only, or animation values in JSX.

### 1.2 Design Audit (for larger upgrades)
- [ ] Read `design_critique` skill for CSS variable names and criteria.
- [ ] Read `motion_guide` skill for spring configs and scroll-reveal patterns.
- [ ] Evaluate each component against "Wow Factor" — colors, motion, hover, depth.

### 1.3 Prioritize
| Priority | Example |
|----------|---------|
| 🔴 HIGH | Missing hover effect on interactive element |
| 🟡 MEDIUM | Glow too subtle, gradient not rich enough |
| 🟢 LOW | Slightly faster transition, minor polish |

---

## Phase 2: Implementation

### 2.1 CSS Variable Tuning
- [ ] Locate variables in `src/styles/index.css` or component CSS.
- [ ] Use design system variables (`--neon-violet`, `--glass-bg`, etc.) — never hardcode hex.

### 2.2 Animation Tuning
- [ ] Reference `motion_guide` skill for spring configs: `{ stiffness: 100, damping: 30 }`.
- [ ] Tuning guide: `stiffness ↑` = snappier, `damping ↑` = less bounce, `mass ↓` = lighter.

### 2.3 R3F useFrame Adjustments
- [ ] For rotation: adjust `delta * multiplier` in `useFrame`.
- [ ] For oscillation: adjust frequency/amplitude in `Math.sin()`.

### 2.4 Interaction Enhancements
- [ ] Add `whileHover={{ scale: 1.05 }}` and `whileTap={{ scale: 0.95 }}`.
- [ ] Add `data-cursor` attribute for custom cursor interaction.
- [ ] Add glassmorphism overlays using `.glass` or `.glass-strong` classes.

---

## Phase 3: Verification

- [ ] No layout shifts at breakpoints (375px, 768px, 1440px).
- [ ] Animations use `transform`/`opacity` only (no layout thrashing).
- [ ] Run `build_verify` skill: `npm run lint && npm run build`.
- [ ] FPS maintained ≥55fps (Chrome DevTools → Performance tab).

---

## Phase 4: Self-Critique

- [ ] Apply `design_critique` skill checklist: Wow Factor, Smoothness, Cohesion.
- [ ] Compare before/after — if enhancement is underwhelming, iterate with stronger values.
- [ ] Commit with `style:` prefix: `git commit -m "style: enhance [description]"`.

---

## Quick Reference

| Goal | File | Property |
|------|------|----------|
| Brighter glow | CSS | `box-shadow` alpha, `filter: brightness()` |
| Smoother motion | JSX | `damping ↑` in spring config |
| Richer depth | CSS | Multi-layer shadows, glassmorphism |
| More interaction | JSX | `whileHover`, `whileTap` variants |
| Subtler hover | JSX | `whileHover.scale` closer to 1.0 |

---

## ✅ Done When
- Visual change achieves the intended aesthetic improvement
- No functional behavior has changed
- `npm run lint && npm run build` passes

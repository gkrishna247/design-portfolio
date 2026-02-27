# Repository Code Analysis Report

**Project:** Neural Flux Design Portfolio  
**Date:** 2026-02-27  
**Branch:** `update/agent-skills-workflows`  
**Method:** Line-by-line analysis of every file in `src/`, config files, `public/`, and `index.html`

---

## Table of Contents

1. [Project Architecture Overview](#1-project-architecture-overview)
2. [Directory Structure Map](#2-directory-structure-map)
3. [Component Inventory](#3-component-inventory)
4. [Dependency Analysis](#4-dependency-analysis)
5. [Code Style Patterns](#5-code-style-patterns)
6. [Three.js & React Three Fiber Patterns](#6-threejs--react-three-fiber-patterns)
7. [Framer Motion & Animation Patterns](#7-framer-motion--animation-patterns)
8. [Scroll & Navigation Patterns](#8-scroll--navigation-patterns)
9. [Potential Issues & Technical Debt](#9-potential-issues--technical-debt)
10. [Code Quality Observations](#10-code-quality-observations)

---

## 1. Project Architecture Overview

### Technology Stack (Actual, from `package.json`)

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | React | ^18.3.1 |
| Build Tool | Vite | ^5.2.0 |
| 3D Engine | Three.js | ^0.160.0 |
| R3F Bindings | @react-three/fiber | ^8.0.0 |
| R3F Helpers | @react-three/drei | ^9.0.0 |
| Animation | framer-motion | ^11.0.0 |
| Smooth Scroll | lenis | ^1.0.0 |
| Routing | react-router-dom | ^6.20.0 |
| Unit Testing | vitest + @testing-library/react | ^4.0.18 / ^16.3.2 |
| E2E Testing | @playwright/test | ^1.58.0 |
| Linting | eslint + react-hooks + react-refresh | ^8.57.0 |
| Minifier | terser | ^5.46.0 |
| JSDOM | jsdom | ^27.4.0 |

### Architecture Pattern

The app follows a **single-page scrolling portfolio** architecture with 6 full-viewport sections:

```
index.html → main.jsx → App.jsx (orchestrator)
                           ├── MagneticCursor (eagerly loaded, memo'd)
                           ├── OrbitalNavigation (eagerly loaded)
                           ├── HeroPortal (eagerly loaded, memo'd)
                           │   └── ScrambleText (sub-component)
                           ├── ErrorBoundary (wraps all below)
                           ├── NeuralBackground (lazy, R3F Canvas)
                           │   ├── NeuralParticles (R3F sub-component)
                           │   ├── GlowingOrbs (R3F sub-component)
                           │   └── ConnectionLines (R3F sub-component)
                           ├── FloatingIdentity (lazy, about section)
                           ├── ProjectsConstellation (lazy, projects)
                           │   ├── ProjectCard (memo'd sub-component)
                           │   └── ProjectList (memo'd sub-component)
                           ├── SkillsOrbit (lazy, skills section)
                           │   └── SkillOrbitRing (memo'd + forwardRef)
                           ├── ExperienceTimeline (lazy, experience)
                           │   └── TimelineCard (sub-component)
                           └── ContactPortal (lazy, contact section)
```

### Key Architectural Decisions

| Decision | Implementation | Rationale |
|----------|---------------|-----------|
| **Single R3F Canvas** | Only `NeuralBackground` has a Canvas | Avoids multiple WebGL contexts; background reacts to scroll |
| **Lazy loading** | 6 components via `React.lazy()` | Below-fold content deferred for faster initial paint |
| **Ref-based mouse tracking** | `MouseContext` with `mouseRef` + `subscribe` | Avoids re-renders on every mouse move |
| **Lenis smooth scroll** | Initialized in `App.jsx` with RAF loop | Provides smooth scrolling with custom easing |
| **CSS design system** | 938-line `index.css` with 45+ CSS variables | Centralized theming, no CSS-in-JS |
| **Component co-location** | Each component has own folder with JSX + CSS + optional test | Clean separation of concerns |

---

## 2. Directory Structure Map

```
design-portfolio/                          (root)
├── .agent/                                (agent config)
│   ├── skills/                            (6 skills)
│   │   ├── build_verify/SKILL.md          (29 lines)
│   │   ├── code_linter/SKILL.md           (43 lines)
│   │   ├── design_critique/SKILL.md       (36 lines)
│   │   ├── motion_guide/SKILL.md          (89 lines)
│   │   ├── r3f_component_gen/SKILL.md     (89 lines)
│   │   └── state_manager/SKILL.md         (46 lines)
│   └── workflows/                         (10 workflows)
│       ├── accessibility.md               (192 lines)
│       ├── dependency_update.md           (159 lines)
│       ├── design_iteration.md            (136 lines)
│       ├── design_upgrade.md              (268 lines)
│       ├── feature_development.md         (139 lines)
│       ├── git_workflow.md                (186 lines)
│       ├── health_check.md                (61 lines)
│       ├── maintenance.md                 (128 lines)
│       ├── optimization_pass.md           (193 lines)
│       └── refactoring.md                 (200 lines)
├── .github/workflows/
│   └── deploy.yml                         (CI/CD)
├── public/                                (5 files)
│   ├── manifest.json                      (372 bytes)
│   ├── og-preview.png                     (585 KB)
│   ├── robots.txt                         (96 bytes)
│   ├── sitemap.xml                        (226 bytes)
│   └── vite.svg                           (1.5 KB)
├── src/                                   (35+ files)
│   ├── App.jsx                            (184 lines, 6.7 KB)
│   ├── App.css                            (274 lines, 5.5 KB)
│   ├── App.perf.test.jsx                  (101 lines, 3.5 KB)
│   ├── main.jsx                           (14 lines, 352 bytes)
│   ├── assets/
│   │   └── react.svg                      (4.1 KB)
│   ├── contexts/
│   │   └── MouseContext.jsx               (67 lines, 2.1 KB)
│   ├── data/
│   │   └── projects.js                    (52 lines, 2.0 KB)
│   ├── styles/
│   │   └── index.css                      (938 lines, 20.7 KB)
│   └── components/                        (10 component dirs)
│       ├── ContactPortal/                 (3 files: JSX, CSS, test)
│       ├── ErrorBoundary/                 (3 files: JSX, CSS, test)
│       ├── ExperienceTimeline/            (2 files: JSX, CSS)
│       ├── FloatingIdentity/              (2 files: JSX, CSS)
│       ├── HeroPortal/                    (4 files: JSX, CSS, test, ScrambleText.jsx)
│       ├── MagneticCursor/                (3 files: JSX, CSS, test)
│       ├── NeuralBackground/              (3 files: JSX, CSS, test)
│       ├── OrbitalNavigation/             (3 files: JSX, CSS, test)
│       ├── ProjectsConstellation/         (3 files: JSX, CSS, test)
│       └── SkillsOrbit/                   (3 files: JSX, CSS, test)
├── AGENTS.md                              (56 lines)
├── index.html                             (64 lines, 2.7 KB)
├── package.json                           (41 lines, 1.0 KB)
├── vite.config.js                         (34 lines, 928 bytes)
├── eslint.config.js                       (42 lines, 1.1 KB)
├── vitest.config.js                       (13 lines, 337 bytes)
└── playwright.config.js                   (15 lines, 325 bytes)
```

### File Count Summary

| Directory | Files | Lines (approx) |
|-----------|:-----:|:-----:|
| `src/` root | 4 | 573 |
| `src/components/` (JSX) | 11 | 2,180 |
| `src/components/` (CSS) | 10 | ~2,800 |
| `src/components/` (tests) | 7 | 604 |
| `src/contexts/` | 1 | 67 |
| `src/data/` | 1 | 52 |
| `src/styles/` | 1 | 938 |
| Config files | 4 | 104 |
| **Total source** | **39** | **~7,318** |

---

## 3. Component Inventory

### 3.1 Full Component Table

| Component | Lines | Type | Memo'd | Lazy | Test | CSS Lines | Dependencies |
|-----------|:-----:|------|:------:|:----:|:----:|:---------:|-------------|
| `App` | 184 | Functional | ❌ | ❌ | ✅ (perf) | 274 | framer-motion, lenis, all components |
| `MagneticCursor` | 99 | Functional | ✅ | ❌ | ✅ | 85 | MouseContext |
| `OrbitalNavigation` | 178 | Functional | ❌ | ❌ | ✅ | 200 | framer-motion |
| `HeroPortal` | 241 | Functional | ✅ | ❌ | ❌ | 351 | framer-motion, MouseContext, ScrambleText |
| `ScrambleText` | 62 | Functional | ✅ | ❌ | ❌ | — | (none) |
| `NeuralBackground` | 239 | Functional | ✅ (React.memo) | ✅ | ✅ | 124 | R3F, drei, THREE, MouseContext |
| `FloatingIdentity` | 183 | Functional | ✅ | ✅ | ❌ | ~280 | framer-motion |
| `ProjectsConstellation` | 240 | Functional | ✅ | ✅ | ✅ | ~350 | framer-motion, projects data |
| `SkillsOrbit` | 207 | Functional | ✅ | ✅ | ✅ | ~285 | framer-motion |
| `ExperienceTimeline` | 192 | Functional | ✅ | ✅ | ❌ | ~250 | framer-motion |
| `ContactPortal` | 170 | Functional | ✅ | ✅ | ✅ | 285 | framer-motion |
| `ErrorBoundary` | 55 | **Class** | ❌ | ❌ | ✅ | ~40 | react |

### 3.2 Component Patterns Observed

| Pattern | Components Using It | Count |
|---------|-------------------|:-----:|
| `useInView` for scroll-triggered animation | FloatingIdentity, ProjectsConstellation, SkillsOrbit, ExperienceTimeline, ContactPortal | 5/10 |
| `useScroll` + `useTransform` for parallax | App, HeroPortal, FloatingIdentity, ProjectsConstellation, ExperienceTimeline | 5/10 |
| `whileHover` + `whileTap` interactions | HeroPortal, OrbitalNavigation, ProjectsConstellation, SkillsOrbit, ContactPortal, FloatingIdentity | 6/10 |
| `data-cursor` attribute for custom cursor | HeroPortal, OrbitalNavigation, ProjectsConstellation, SkillsOrbit, ContactPortal, FloatingIdentity | 6/10 |
| `AnimatePresence` for enter/exit | App, OrbitalNavigation | 2/10 |
| `memo()` or `React.memo()` | MagneticCursor, HeroPortal, NeuralBackground, FloatingIdentity, ProjectsConstellation, SkillsOrbit, ExperienceTimeline, ContactPortal, ScrambleText | 9/11 |
| `useCallback`/`useMemo` | MagneticCursor, ProjectsConstellation, SkillsOrbit, NeuralBackground, App, MouseContext | 6/11 |
| Inline data arrays (not props) | OrbitalNavigation, FloatingIdentity, SkillsOrbit, ExperienceTimeline, ContactPortal | 5/10 |
| Extracted data file | ProjectsConstellation (uses `projects.js`) | 1/10 |

### 3.3 Sub-Component Composition

| Parent | Sub-Components | Pattern |
|--------|---------------|---------|
| `App` | — | Orchestrator; renders all sections |
| `HeroPortal` | `ScrambleText` | Imported as child; render-prop pattern for text |
| `NeuralBackground` | `NeuralParticles`, `GlowingOrbs`, `ConnectionLines` | All defined in same file; R3F Canvas children |
| `ProjectsConstellation` | `ProjectCard` (memo), `ProjectList` (memo) | Defined in same file; separated for memoization |
| `SkillsOrbit` | `SkillOrbitRing` (memo + forwardRef) | Defined in same file; uses forwardRef for DOM access |
| `ExperienceTimeline` | `TimelineCard` | Defined in same file; simple extract |

---

## 4. Dependency Analysis

### 4.1 Installed vs. Actually Used

| Package | Installed | Actually Imported | Where Used |
|---------|:---------:|:-----------------:|------------|
| `react` | ✅ | ✅ | All components |
| `react-dom` | ✅ | ✅ | `main.jsx` |
| `react-router-dom` | ✅ | ❌ **NOT USED** | Nowhere in src/ |
| `three` | ✅ | ✅ | `NeuralBackground.jsx` |
| `@react-three/fiber` | ✅ | ✅ | `NeuralBackground.jsx` |
| `@react-three/drei` | ✅ | ✅ | `NeuralBackground.jsx` (Points, PointMaterial) |
| `framer-motion` | ✅ | ✅ | 9/10 components + App |
| `lenis` | ✅ | ✅ | `App.jsx` |
| `vitest` | ✅ | ✅ | 7 test files |
| `@testing-library/react` | ✅ | ✅ | 7 test files |
| `@playwright/test` | ✅ | ❌ | Only in `playwright.config.js` (no test files in `benchmarks/`) |
| `terser` | ✅ | ✅ | Via `vite.config.js` build minifier |

> [!WARNING]
> **`react-router-dom` is installed but never imported anywhere.** No routing exists — the app is a single-page scroll experience. This is dead dependency weight (~12KB gzipped).

> [!NOTE]
> **`@playwright/test`** is configured (`playwright.config.js` points to `./benchmarks`) but no benchmark test files were found in the repository.

### 4.2 Import Analysis by File

| File | React Hooks Used | External Libs | Internal Imports |
|------|-----------------|---------------|-----------------|
| `main.jsx` | StrictMode | — | App, index.css, MouseProvider |
| `App.jsx` | useEffect, useRef, useState, lazy, Suspense, useMemo, memo | framer-motion (5), Lenis | All 10 components, App.css, index.css |
| `MouseContext.jsx` | createContext, useContext, useEffect, useRef, useCallback, useMemo | — | — |
| `MagneticCursor.jsx` | useEffect, useState, useRef, useCallback | — | MouseContext, CSS |
| `OrbitalNavigation.jsx` | useState, useEffect, useRef | framer-motion (3) | CSS |
| `HeroPortal.jsx` | useEffect, useRef | framer-motion (5) | MouseContext, ScrambleText, CSS |
| `ScrambleText.jsx` | useState, useEffect, memo | — | — |
| `NeuralBackground.jsx` | useRef, useMemo, useEffect, useState, React.memo | R3F (Canvas, useFrame), drei (Points, PointMaterial), THREE | MouseContext, CSS |
| `FloatingIdentity.jsx` | useRef | framer-motion (4) | CSS |
| `ProjectsConstellation.jsx` | useRef, useState, useMemo, useCallback, memo, useEffect | framer-motion (4) | projects.js, CSS |
| `SkillsOrbit.jsx` | useRef, useState, memo, forwardRef, useEffect, createRef, useMemo | framer-motion (3) | CSS |
| `ExperienceTimeline.jsx` | useRef | framer-motion (4) | CSS |
| `ContactPortal.jsx` | useRef | framer-motion (2) | CSS |
| `ErrorBoundary.jsx` | React (class) | — | CSS |

### 4.3 framer-motion API Surface

| API | Import Count | Usage Pattern |
|-----|:-----------:|---------------|
| `motion` | 9 files | `motion.div`, `motion.button`, `motion.a`, `motion.span`, `motion.footer`, `motion.line` |
| `useInView` | 5 files | Scroll-triggered animations with `once: true` |
| `useScroll` | 5 files | Scroll progress tracking with target ref |
| `useTransform` | 5 files | Value mapping for parallax effects |
| `useSpring` | 2 files | Smooth spring interpolation (App, HeroPortal) |
| `useMotionValue` | 1 file | Manual motion value control (HeroPortal) |
| `AnimatePresence` | 2 files | Enter/exit animations (App, OrbitalNavigation) |

---

## 5. Code Style Patterns

### 5.1 Naming Conventions

| Element | Convention | Example | Consistency |
|---------|-----------|---------|:-----------:|
| Component files | PascalCase.jsx | `HeroPortal.jsx` | ✅ 100% |
| CSS files | PascalCase.css (matching component) | `HeroPortal.css` | ✅ 100% |
| Test files | PascalCase.test.jsx | `ContactPortal.test.jsx` | ✅ 100% |
| Component folders | PascalCase | `HeroPortal/` | ✅ 100% |
| Data files | camelCase.js | `projects.js` | ✅ 100% |
| Config files | kebab-case.config.js | `vite.config.js` | ✅ 100% |
| CSS classes | kebab-case with BEM-like | `.hero-portal`, `.project-card-glow` | ✅ 100% |
| CSS variables | kebab-case with prefix | `--neon-violet`, `--text-primary` | ✅ 100% |
| JS constants | UPPER_SNAKE_CASE | `PARTICLE_COUNT_DESKTOP` | ✅ 100% |
| JS functions | camelCase | `scrollToSection` | ✅ 100% |
| JSX attributes | camelCase | `data-cursor`, `aria-label` | ✅ 100% |

### 5.2 File Structure Conventions

**Consistent pattern across ALL 10 component files:**

```jsx
// 1. React imports
import { useRef } from 'react'
// 2. Third-party imports
import { motion, useInView } from 'framer-motion'
// 3. Internal imports
import { useMouse } from '../../contexts/MouseContext'
// 4. CSS import
import './ComponentName.css'

// 5. Constants/data (inline or imported)
const DATA = [...]

// 6. Sub-components (if any, defined before main)
function SubComponent() { ... }

// 7. Main component (default export)
export default function ComponentName() { ... }
```

**Deviations noted:**
- `ErrorBoundary` uses `class` syntax (necessary — React has no hook equivalent for `componentDidCatch`)
- `NeuralBackground` exports via `React.memo(NeuralBackground)` at the bottom (wrapping pattern)
- `ScrambleText` uses `const ScrambleText = memo(...)` assignment + `displayName` (arrow function with memo)

### 5.3 Export Patterns

| Pattern | Count | Files |
|---------|:-----:|-------|
| `export default function Name()` | 8 | Most components |
| `export default class Name` | 1 | ErrorBoundary |
| `export default React.memo(Name)` | 1 | NeuralBackground |
| `const Name = memo(...); export default Name` | 1 | ScrambleText |
| Named export + default | 1 | MouseContext (`export function MouseProvider` + `export function useMouse`) |

### 5.4 CSS Organization Pattern

All CSS files follow this structure:
```css
/* 1. Comment header with component name */
/* 2. Main container styles */
/* 3. Child element styles */
/* 4. State styles (:hover, .active) */
/* 5. Animations (@keyframes) */
/* 6. Responsive (@media queries) */
/* 7. Reduced motion (@media prefers-reduced-motion) */
```

---

## 6. Three.js & React Three Fiber Patterns

### 6.1 Canvas Configuration

```jsx
// NeuralBackground.jsx - ONLY R3F Canvas in the app
<Canvas
    camera={{ position: [0, 0, 10], fov: 60 }}
    dpr={[1, 1.5]}         // Capped at 1.5x for GPU performance
    gl={{
        antialias: true,
        alpha: true,         // Transparent background (overlays CSS)
        powerPreference: 'high-performance'  // Prefer discrete GPU
    }}
>
```

**Assessment (from Perplexity reason analysis):** Single Canvas is optimal for this use case. Multiple canvases would multiply WebGL context overhead. The `dpr=[1, 1.5]` cap is conservative — could go to `[1.5, 2]` for desktop-heavy audiences.

### 6.2 R3F Sub-Components

| Component | Three.js Primitives | Lines | Pattern |
|-----------|-------------------|:-----:|---------|
| `NeuralParticles` | `Points`, `PointMaterial` (from drei) | 80 | Volumetric sphere distribution, `useFrame` for rotation + mouse react + scroll scale |
| `GlowingOrbs` | `instancedMesh`, `IcosahedronGeometry`, `meshBasicMaterial` | 63 | 5 instances with `setMatrixAt`, `setColorAt`, oscillating Y position |
| `ConnectionLines` | `lineSegments`, `BufferGeometry`, `LineBasicMaterial` | 42 | 20 random line pairs, slow rotation via `useFrame` |

### 6.3 useFrame Usage Analysis

| Component | useFrame Behavior | Anti-Patterns? |
|-----------|------------------|:--------------:|
| `NeuralParticles` | Reads `mouseRef.current` (ref), reads `scrollProgress.get()` (motion value), mutates `ref.current.rotation` and `.scale` directly | ✅ **Clean** — no state updates, uses delta implicitly via `+= delta * rate` |
| `GlowingOrbs` | Uses `state.clock.elapsedTime` for stable Y oscillation, accumulates rotation via `+= delta`, calls `setMatrixAt` + `instanceMatrix.needsUpdate` | ✅ **Clean** — proper instanced mesh pattern |
| `ConnectionLines` | Uses `elapsedTime` for rotation, `Math.sin` for Z oscillation | ✅ **Clean** — minimal computation |

> [!TIP]
> All 3 sub-components correctly avoid React state updates inside `useFrame`. The `mouseRef` is read from context ref (not state), and `scrollProgress.get()` reads the Framer Motion motion value directly without triggering re-renders.

### 6.4 Performance Patterns

| Pattern | Implementation | Status |
|---------|---------------|:------:|
| Responsive particle count | `matchMedia('(max-width: 768px)')` → 500 vs 1500 particles | ✅ |
| Shared geometry (instancedMesh) | `IcosahedronGeometry` created once via `useMemo` | ✅ |
| Frustum culling | `frustumCulled={true}` on Points, `frustumCulled={false}` on instancedMesh | ✅ |
| Additive blending | `blending={THREE.AdditiveBlending}` for particles | ✅ |
| Depth write disabled | `depthWrite={false}` on PointMaterial | ✅ |
| DPR capping | `dpr={[1, 1.5]}` | ✅ |
| No object creation in useFrame | Geometry/material created in useMemo, only transforms in useFrame | ✅ |

---

## 7. Framer Motion & Animation Patterns

### 7.1 Animation Categories

| Category | Pattern | Components | Example |
|----------|---------|-----------|---------|
| **Scroll-triggered reveal** | `useInView` + `initial`/`animate` | 5 components | `initial={{ opacity: 0, y: 50 }}` → `animate={isInView ? { opacity: 1, y: 0 } : {}}` |
| **Parallax** | `useScroll` + `useTransform` + `useSpring` | App, HeroPortal | `useTransform(scrollYProgress, [0, 1], [0, 200])` |
| **Mouse-reactive** | `useMotionValue` + `useTransform` | HeroPortal | Fragment parallax based on mouse position |
| **Hover/Tap** | `whileHover`/`whileTap` | 6 components | `whileHover={{ scale: 1.05 }}` `whileTap={{ scale: 0.95 }}` |
| **Staggered entry** | `delay: index * 0.1` in `transition` | Most components | Cards, stats, links appear sequentially |
| **Enter/Exit** | `AnimatePresence` + `initial`/`animate`/`exit` | OrbitalNavigation | Orbital items fly in/out |
| **Infinite loop** | `repeat: Infinity` | HeroPortal, FloatingIdentity | Floating elements, scroll indicator bounce |
| **Text scramble** | Custom `useScrambleText` hook | ScrambleText | Character-by-character reveal with random chars |

### 7.2 Spring Configuration Audit

| Location | Config | Notes |
|----------|--------|-------|
| `App.jsx` | `{ stiffness: 100, damping: 30, restDelta: 0.001 }` | Normal mode |
| `App.jsx` | `{ stiffness: 300, damping: 50, restDelta: 0.01 }` | Reduced motion mode — faster settling |
| `HeroPortal.jsx` | `{ stiffness: 100, damping: 30 }` | Parallax springs (matches App normal) |
| `motion_guide` skill | `{ stiffness: 120, damping: 14 }` (snappy) | **Different** from actual code |
| `motion_guide` skill | `{ stiffness: 80, damping: 20 }` (smooth) | **Different** from actual code |

> [!WARNING]
> **Spring config mismatch:** The `motion_guide` skill documents spring configs (`stiffness: 120, damping: 14` for snappy; `stiffness: 80, damping: 20` for smooth) that **don't match any values used in actual code**. The real app uses `{ stiffness: 100, damping: 30 }` consistently. Agent instructions should be updated to reflect actual code values.

### 7.3 Reduced Motion Support

| Layer | Implementation | Coverage |
|-------|---------------|:--------:|
| CSS | `@media (prefers-reduced-motion: reduce)` in `index.css` + `App.css` + `MagneticCursor.css` | ✅ Global |
| JS (App) | `window.matchMedia('(prefers-reduced-motion: reduce)')` via `useMemo` | ✅ |
| JS (App) | Different spring config for reduced motion | ✅ |
| JS (App) | Lenis `duration: 0` and `smoothWheel: false` for reduced motion | ✅ |
| JS (ProjectsConstellation) | Conditional rendering of constellation dots based on motion preference | ✅ |
| Missing | Individual components don't check `prefers-reduced-motion` for their own `whileHover`/`animate` | ⚠️ Partial |

---

## 8. Scroll & Navigation Patterns

### 8.1 Lenis Smooth Scroll

```jsx
// App.jsx - Lenis initialization
const lenis = new Lenis({
    duration: prefersReducedMotion ? 0 : 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: !prefersReducedMotion,
})

// RAF loop
function raf(time) {
    lenis.raf(time)
    rafId = requestAnimationFrame(raf)
}
```

**Cleanup:** ✅ `lenis.destroy()`, `cancelAnimationFrame(rafId)`, `clearTimeout(loadTimeout)` in useEffect cleanup.

### 8.2 Section Detection

```jsx
// App.jsx - Threshold-based section detection
scrollYProgress.on("change", (value) => {
    if (value < 0.17) setActiveSection('hero')
    else if (value < 0.33) setActiveSection('about')
    else if (value < 0.50) setActiveSection('projects')
    else if (value < 0.67) setActiveSection('skills')
    else if (value < 0.83) setActiveSection('experience')
    else setActiveSection('contact')
})
```

> [!NOTE]
> Section thresholds are hardcoded percentages (0.17, 0.33, 0.50, 0.67, 0.83) based on 6 equal sections. This breaks if sections have varying heights. The actual section heights vary: Hero=100vh, About=110vh, Projects=140vh, Skills=100vh, Experience=100vh, Contact=85vh — so the equal distribution is **inaccurate**.

### 8.3 Navigation

| Method | Implementation | Location |
|--------|---------------|----------|
| `scrollIntoView({ behavior: 'smooth' })` | Section jump from nav items | OrbitalNavigation, HeroPortal buttons |
| OrbitalNavigation component | Fixed right-side orbital menu with expand/collapse | Always visible |
| Scroll progress bar | `motion.div` with `scaleX: smoothProgress` | App.jsx |
| Skip link | `<a href="#main-content">` hidden until focused | App.jsx |
| Escape key to close nav | `document.addEventListener('keydown')` | OrbitalNavigation |
| Click outside to close nav | `document.addEventListener('click')` | OrbitalNavigation |

---

## 9. Potential Issues & Technical Debt

### 9.1 Critical Issues

| # | Issue | Location | Impact |
|---|-------|----------|--------|
| 1 | **`react-router-dom` installed but unused** | `package.json` | Dead weight (~12KB gzipped) |
| 2 | **Section detection thresholds hardcoded to equal splits** despite variable section heights | `App.jsx:93-98` | Active section indicator may not match visual section |
| 3 | **`console.error` in ErrorBoundary** | `ErrorBoundary.jsx:20` | Will be stripped by terser `drop_console` but only `console.log/info/debug` — `console.error` is NOT stripped |
| 4 | **Font import via CSS `@import url()`** | `index.css:7` | Render-blocking; should use `<link>` preload in HTML (already preconnected but not preloaded) |

### 9.2 Performance Concerns

| # | Concern | Location | Recommendation |
|---|---------|----------|----------------|
| 1 | **1500 particles + instancedMesh + lineSegments** in single Canvas | NeuralBackground | Currently well-optimized but monitor on low-end devices |
| 2 | **No `will-change` cleanup** | CSS | `will-change: transform` on `.cursor-arrow` persists indefinitely |
| 3 | **Multiple `document.addEventListener` on mount** | OrbitalNavigation, MagneticCursor | Consider event delegation pattern |
| 4 | **Lenis + Framer Motion dual scroll handling** | App.jsx | Both modify scroll behavior; potential conflict on iOS Safari |
| 5 | **No bundle size monitoring** | Build config | `chunkSizeWarningLimit: 1000` is high; Three.js chunk may exceed practical budgets |

### 9.3 Accessibility Concerns

| # | Concern | Location | Impact |
|---|---------|----------|--------|
| 1 | **`cursor: none !important` on ALL elements** | `index.css:191` | System cursor hidden everywhere — poor UX on touch devices with mouse |
| 2 | **Social links use `#` as href** | FloatingIdentity, projects.js | Non-functional placeholder links |
| 3 | **No `alt` text on profile image** (placeholder) | FloatingIdentity | Empty image container has no alt |
| 4 | **Hardcoded color values in some JSX** (not CSS vars) | Projects data (`#10b981`), ExperienceTimeline (`#a855f7`) | Breaks CSS variable theming |

### 9.4 Code Quality Debt

| # | Debt | Impact | Priority |
|---|------|--------|:--------:|
| 1 | **5 components have inline data arrays** (not extracted to data files) | Hard to maintain; inconsistent with `projects.js` extraction | Medium |
| 2 | **3 components have no tests** (HeroPortal, FloatingIdentity, ExperienceTimeline) | ~30% test gap | Medium |
| 3 | **No TypeScript** despite `@types/react` being installed | Type safety missing | Low |
| 4 | **No Prettier config** | Code formatting relies on editor settings | Low |
| 5 | **ESLint `no-unused-vars` in warn mode** only | Unused vars don't break builds | Low |

---

## 10. Code Quality Observations

### 10.1 Strengths

| Strength | Evidence |
|----------|---------|
| **Consistent code style** | 100% naming convention adherence across all files |
| **Performance-conscious** | `memo()` on 9/11 components, `useCallback`/`useMemo` in 6 files, lazy loading, RAF-based cursor, CSS `contain`, responsive particle counts |
| **Accessibility foundations** | Skip link, ARIA labels, focus-visible styles, `prefers-reduced-motion` in CSS+JS, keyboard navigation |
| **Clean separation of concerns** | Co-located component folders, dedicated CSS per component, design system centralized in `index.css` |
| **Stable R3F patterns** | No state updates in `useFrame`, ref-based mouse tracking, shared geometry via `useMemo`, proper instanced mesh usage |
| **Good error handling** | `ErrorBoundary` wrapping lazy-loaded content + R3F Canvas separately with custom messages |
| **Well-documented FOUC prevention** | 14-line JSDoc comment explaining the 100ms delay rationale and alternatives considered |
| **Proper cleanup in effects** | All `useEffect` hooks return cleanup functions (event listeners, RAF, timeouts, Lenis destroy) |
| **Build optimization** | Manual chunks for three-vendor, motion-vendor, scroll-vendor; terser with console stripping |

### 10.2 Weaknesses

| Weakness | Impact |
|----------|--------|
| **No TypeScript** | No compile-time type safety despite types being installed |
| **Inconsistent data management** | 1 file uses extracted data (`projects.js`), 5 components use inline arrays |
| **30% test gap** | HeroPortal (241 lines), FloatingIdentity (183 lines), ExperienceTimeline (192 lines) have no tests |
| **Spring configs don't match agent skill docs** | `motion_guide` skill documents values not found in actual code |
| **react-router-dom dead dependency** | Installed but zero imports across entire codebase |
| **Hardcoded section thresholds** | Don't account for variable section heights |
| **No Prettier config** | Inconsistent formatting possible across editors |
| **No CSS class naming collision protection** | Global CSS classes (e.g., `.glass`, `.mono`) without CSS Modules or scoping |

### 10.3 Test Quality Assessment

| Metric | Value | Assessment |
|--------|:-----:|-----------|
| Components with tests | 7/10 (+ 1 perf test) | 70% coverage |
| Average test file size | 86 lines | Reasonable |
| Mock patterns | framer-motion mocked in all tests; R3F Canvas mocked | Consistent |
| Test types | Render tests, interaction tests, accessibility tests, perf tests | Good variety |
| Missing test types | No E2E tests (Playwright configured but no benchmarks written), no visual regression | Gap |

### 10.4 Build Configuration Assessment

| Aspect | Configuration | Assessment |
|--------|--------------|-----------|
| Target | `es2020` | ✅ Modern; drops IE/old Edge |
| Minifier | terser with `drop_console` | ✅ Good; but `console.error`/`console.warn` preserved |
| Code splitting | 3 manual chunks (three, motion, scroll) + 6 lazy component chunks | ✅ Well-structured |
| Base path | `/design-portfolio/` | ✅ Correct for GitHub Pages |
| Chunk size limit | 1000KB | ⚠️ High; Three.js may produce chunks near this limit |
| Legal comments | `none` | ✅ Removes license headers for smaller bundle |
| ESLint | Flat config, react-hooks recommended, `no-unused-vars` warn | ✅ Standard setup |

### 10.5 SEO & Web Standards

| Feature | Status | Details |
|---------|:------:|---------|
| `<title>` tag | ✅ | "ALEX.DEV \| AI Engineer Portfolio - Neural Flux" |
| Meta description | ✅ | 156 characters, keyword-rich |
| Open Graph tags | ✅ | og:title, og:description, og:image with GitHub Pages URL |
| Twitter Card | ✅ | summary_large_image with same image |
| Canonical URL | ✅ | Points to GitHub Pages |
| Web App Manifest | ✅ | `manifest.json` in public/ |
| robots.txt | ✅ | Standard allow-all |
| sitemap.xml | ✅ | Single-page sitemap |
| Noscript fallback | ✅ | Clean fallback message with dark styling |
| Font preconnect | ✅ | `preconnect` + `dns-prefetch` for Google Fonts |
| Theme color | ✅ | `#030308` (matches `--color-void`) |
| `lang` attribute | ✅ | `<html lang="en">` |

---

*Report generated from line-by-line analysis of 40+ files on branch `update/agent-skills-workflows`. No files were modified.*

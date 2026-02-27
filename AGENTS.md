# Portfolio Governance & Agent Roles

## Project Context: "Neural Flux"
This repository hosts a high-end, award-winning caliber portfolio. The core design philosophy is **"Neural Flux"**: a blend of surreal 3D interactions, deconstructed layouts, and magnetic physics.

> **CRITICAL DESIGN CONSTRAINT**: "Standard" is fail. Every interaction must have a "Wow Factor". If a UI element feels static or generic, it must be rejected.

## 🛠️ Operational Stack
- **Build**: Vite (Fast HMR, optimized production builds)
- **Framework**: React 18 + Hooks
- **Language**: JavaScript (ESNext)
- **Linting**: ESLint (Strict accessibility & unused var checks)

## 🎨 Creative Stack
- **3D Engine**: `@react-three/fiber` (R3F) & `@react-three/drei` — used ONLY in `NeuralBackground`
- **Animation**: `framer-motion` (DOM/UI) & `lenis` (Smooth Scroll)
- **Styling**: Vanilla CSS with CSS Variables (No Tailwind, No CSS Modules)

---

## ⚡ Commands
```bash
npm run dev          # Start dev server (Vite, port 5173)
npm run build        # Production build (terser minification)
npm run lint         # ESLint check
npx vitest           # Unit tests (watch mode)
npx vitest run       # Unit tests (CI mode, single run)
```
> **Note**: `terser` strips `console.log/info/debug` but **preserves** `console.error` and `console.warn`. Don't use `console.error` for non-error logging.

## 📁 Project Structure
```
src/
├── App.jsx / App.css              # Orchestrator: Lenis scroll, lazy loading, section detection
├── main.jsx                       # Entry point: StrictMode + MouseProvider
├── contexts/MouseContext.jsx      # Ref-based mouse tracking (subscribe pattern)
├── data/projects.js               # Static project data
├── styles/index.css               # Design system: 45+ CSS variables, typography, effects
└── components/                    # 10 component folders (co-located pattern)
    ├── ComponentName/
    │   ├── ComponentName.jsx      # Component code
    │   ├── ComponentName.css      # Component styles
    │   └── ComponentName.test.jsx # Unit test (optional)
    ├── HeroPortal/                # Hero section + ScrambleText sub-component
    ├── NeuralBackground/          # R3F Canvas (ONLY 3D component)
    ├── MagneticCursor/            # Custom cursor (RAF-based, no springs)
    ├── OrbitalNavigation/         # Fixed orbital nav menu
    ├── FloatingIdentity/          # About section
    ├── ProjectsConstellation/     # Projects section (memo'd cards)
    ├── SkillsOrbit/               # Skills section (forwardRef rings)
    ├── ExperienceTimeline/        # Timeline section
    ├── ContactPortal/             # Contact section + footer
    └── ErrorBoundary/             # Error handler (ONLY class component)
```

## ✅ Code Style — Do / Don't

**Import order** (100% consistent across all components):
```jsx
import { useRef } from 'react'              // 1. React hooks
import { motion, useInView } from 'framer-motion'  // 2. Third-party
import { useMouse } from '../../contexts/MouseContext'  // 3. Internal
import './ComponentName.css'                 // 4. CSS (always last)
```

| ✅ Do | ❌ Don't |
|-------|---------|
| Use functional components + `export default function` | Add class components (only `ErrorBoundary` is allowed) |
| Wrap components in `memo()` | Skip memoization on lazy-loaded components |
| Use CSS variables from `index.css` (`--neon-violet`, `--glass-bg`) | Hardcode hex colors in JSX or data arrays |
| Use `useRef` + subscribe for mouse/scroll (see `state_manager`) | Use `useState` for high-frequency updates |
| Add `data-cursor` attribute on all interactive elements | Forget cursor interaction on buttons/links/cards |
| Keep data in `src/data/` files like `projects.js` | Define large data arrays inline in components |
| Create one `<Canvas>` only in `NeuralBackground` | Add new R3F Canvas instances anywhere |
| Use `useFrame` + direct mutation for 3D animations | Use Framer Motion (`motion.mesh`) inside R3F Canvas |

## 🧪 Testing
- **Runner**: `npx vitest` (Vitest + @testing-library/react, jsdom environment)
- **Mock pattern**: Tests mock `framer-motion` and `@react-three/fiber` Canvas
- **Expectation**: New components should include a `.test.jsx` file in their folder

## 🔒 Safety
- **Don't** push to `main` directly — use feature branches
- **Don't** add CDN scripts or new dependencies without asking
- **Don't** modify config files (`vite.config.js`, `eslint.config.js`) without asking

---

## 🤖 Agent Roles

### 🏛️ Architecture Agent (The Planner)
**Focus**: High-level design, system architecture, complex refactoring.
- Defining "Implementation Plans" for new features.
- Researching R3F techniques or shader optimizations.
- Ensuring the "Neural Flux" aesthetic is preserved across modules.
- **Tools**: `implementation_plan.md`, `design_critique`, `state_manager`.

### 🔨 Execution Agent (The Builder)
**Focus**: Implementation, bug fixing, maintenance.
- Writing code strictly according to plans.
- Running `npm run lint && npm run build` before every commit.
- Using `r3f_component_gen` for 3D code, `motion_guide` for animation constants.
- **Constraints**: NEVER break the build. NEVER regress animation smoothness.

### 🛡️ Quality Assurance Agent (The Gatekeeper)
**Focus**: Performance, stability, code quality.
- Enforcing ESLint rules (no unused vars, no `any`).
- Checking bundle sizes via `npm run build` output.
- Verifying design cohesion (colors, typography from `design_critique`).
- **Tools**: `build_verify`, `code_linter`, `design_critique`.

## 🛑 Global Rules
1. **Zero Console Errors**: Console must be clean in dev and prod.
2. **Performance**: ≥55fps sustained. Chunk size ≤1000KB. 3D scenes use `dpr={[1, 1.5]}`.
3. **Responsive**: "Wow Factor" must scale from mobile to desktop.
4. **Lint Clean**: Zero ESLint warnings. Run `npm run lint` before commits.
5. **When Stuck**: Ask a clarifying question. Don't push speculative changes.

> **Known Issue**: `react-router-dom` is installed but unused — do NOT import it. No routing exists in this app.

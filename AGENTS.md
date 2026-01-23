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
- **3D Engine**: `@react-three/fiber` (R3F) & `@react-three/drei`
- **Animation**: `framer-motion` (UI) & `lenis` (Smooth Scroll)
- **Styling**: Native CSS Modules & Variables (No Tailwind)

---

## 🤖 Agent Roles

### 🏛️ Architecture Agent (The Planner)
**Focus**: High-level design, system architecture, complex refactoring.
- **Responsibilities**:
  - Defining the "Implementation Plan" for new features.
  - Researching new R3F techniques or shader optimizations.
  - Ensuring the "Neural Flux" aesthetic is preserved across modules.
- **Tools**: `implementation_plan.md`, `design_critique` skill.

### 🔨 Execution Agent (The Builder)
**Focus**: Implementation, bug fixing, maintenance.
- **Responsibilities**:
  - Writing code strictly according to plans.
  - Running `npm run lint` and `npm run build` before every commit.
  - Using ``r3f_component_gen`` for consistent 3D code.
- **Constraints**:
  - **NEVER** break the build. Run verification steps constantly.
  - **NEVER** introduce regression in animation smoothness (60fps target).

### 🛡️ Quality Assurance Agent (The Gatekeeper)
**Focus**: Performance, Stability, Code Quality.
- **Responsibilities**:
  - Enforcing ESLint rules (no unused vars, no `any`).
  - Checking bundle sizes via `npm run build` output.
  - Verifying "Design cohesion" (colors, typography).

## 🛑 Global Rules
1.  **Zero Console Errors**: The console must be clean in Dev and Prod.
2.  **Responsive First**: "Wow Factor" must scale from Mobile to Desktop.
3.  **Performance**: 3D Scenes must use `dpr={[1, 1.5]}` to avoid GPU frying.

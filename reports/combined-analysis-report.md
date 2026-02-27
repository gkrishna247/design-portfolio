# Combined Cross-Analysis Report

**Project:** Neural Flux Design Portfolio  
**Date:** 2026-02-27  
**Branch:** `update/agent-skills-workflows`  
**Input Reports:**
- `agent-standards-quality-analysis-report.md` (Report 1 — 18 gaps, 40.75% quality score)
- `repo-code-analysis-report.md` (Report 2 — 39 source files, 40+ files analyzed)

---

## Table of Contents

1. [Cross-Reference Matrix: 18 Gaps vs Code Evidence](#1-cross-reference-matrix-18-gaps-vs-code-evidence)
2. [Agent Config vs Code Reality Mismatches](#2-agent-config-vs-code-reality-mismatches)
3. [Undocumented Code Patterns Needing Agent Coverage](#3-undocumented-code-patterns-needing-agent-coverage)
4. [Filtered Recommendations](#4-filtered-recommendations)
5. [Final Prioritized Action Plan](#5-final-prioritized-action-plan)
6. [Research References](#6-research-references)

---

## 1. Cross-Reference Matrix: 18 Gaps vs Code Evidence

### Legend

| Symbol | Meaning |
|:------:|---------|
| ✅ KEEP | Gap is validated by code evidence — action needed |
| 🔄 MODIFY | Gap is partially valid — adjust scope/priority |
| ❌ REMOVE | Gap is over-engineering for this project scope |

---

### 1.1 Critical Gaps (G1–G6)

| Gap ID | Gap Description | Report 1 Priority | Code Evidence from Report 2 | Adjusted Verdict | Adjusted Priority |
|:------:|----------------|:-----------------:|---------------------------|:----------------:|:-----------------:|
| **G1** | No executable commands in AGENTS.md | Critical | Report 2 confirms 4 config files exist: `vite.config.js` (build), `eslint.config.js` (lint), `vitest.config.js` (test), `playwright.config.js` (e2e). Commands are `npm run dev`, `npm run build`, `npm run lint`, `npx vitest`. Zero ambiguity — just undocumented. | ✅ KEEP | **High** (was Critical) |
| **G2** | No safety & permissions boundaries | Critical | Code reality: project is a portfolio deployed via GitHub Pages, single developer. Report 2 found `drop_console: true` in terser config and `base: '/design-portfolio/'` in vite — both indicate deployment to static hosting with minimal risk surface. | 🔄 MODIFY | **Medium** (was Critical) |
| **G3** | No testing instructions | Critical | Report 2 found 7 test files using Vitest + @testing-library/react (70% coverage). Tests mock `framer-motion` and `@react-three/fiber` Canvas consistently. Playwright configured but NO benchmark tests exist. The testing infrastructure IS there but undocumented. | 🔄 MODIFY | **High** (was Critical) |
| **G4** | No project structure documentation | Critical | Report 2 mapped entire directory: 10 component folders with co-located JSX+CSS+test pattern, `contexts/`, `data/`, `styles/` directories. 100% consistent naming. This is the highest-value gap — documenting actual structure prevents wrong file placement. | ✅ KEEP | **Critical** (unchanged) |
| **G5** | No "When Stuck" escape hatch | Critical | Report 2 shows a clean, well-organized codebase with consistent patterns. For a 10-component portfolio, a brief "when stuck" section is helpful but not critical — the codebase is small enough to be fully understood by reading it. | 🔄 MODIFY | **Low** (was Critical) |
| **G6** | No autonomy level definitions | Critical | Single-developer portfolio project. No team coordination needed. Report 2 confirmed no API calls, no database, no secrets, no environment variables. Formal autonomy matrices are enterprise overhead. | ❌ REMOVE | **N/A** (was Critical) |

**Rationale for G6 removal:** Perplexity ask research confirms that autonomy levels are enterprise patterns — "skip CI/CD, security audits, or monorepo configs for portfolio scale." A single-developer portfolio has inherent full autonomy; codifying levels adds process without value.

---

### 1.2 Important Gaps (G7–G12)

| Gap ID | Gap Description | Report 1 Priority | Code Evidence from Report 2 | Adjusted Verdict | Adjusted Priority |
|:------:|----------------|:-----------------:|---------------------------|:----------------:|:-----------------:|
| **G7** | No code style dos/don'ts | Important | Report 2 found **100% naming consistency** across all files: PascalCase folders/files, kebab-case CSS, camelCase JS, UPPER_SNAKE_CASE constants. Import order pattern is 100% consistent (React → third-party → internal → CSS). BUT: Report 2 also found **inconsistencies** — 5 components use inline data arrays while 1 uses extracted `projects.js`; hardcoded color values in JSX instead of CSS variables; `ErrorBoundary` is class-based while all others are functional. These ARE the dos/don'ts that should be documented. | ✅ KEEP | **Critical** (upgraded from Important) |
| **G8** | Only 2/10 workflows have rollback | Important | Report 2 found project is on a feature branch (`update/agent-skills-workflows`) with clean git status. For a portfolio project, a simple `git stash` or `git checkout .` is sufficient rollback. Formal rollback procedures across all 10 workflows is over-engineering. | ❌ REMOVE | **N/A** (was Important) |
| **G9** | No test-first workflow | Important | Report 2 found 7 test files already exist. Tests are standard render+assertion style, not TDD. Perplexity ask confirms: "Skip agent testing workflows — portfolio needs smoke tests only." A test-first workflow adds process overhead without ROI for a visual portfolio. | ❌ REMOVE | **N/A** (was Important) |
| **G10** | No measurable quality metrics | Important | Report 2 found concrete existing metrics: `chunkSizeWarningLimit: 1000` in vite config, 60fps target in global rules, zero console errors. These exist but aren't consolidated in AGENTS.md. Adding a small metrics section is reasonable. | 🔄 MODIFY | **Low** (was Important) |
| **G11** | No environment setup instructions | Important | Report 2 found `package.json` has standard dependencies. No `.env` file, no environment variables, no secrets. Setup is just `npm install && npm run dev`. Minimal — document briefly but don't create a separate skill for it. | 🔄 MODIFY | **Low** (was Important) |
| **G12** | Skills are static-only (no scripts) | Important | Report 2 confirmed the 6 skills are documentation files (29–89 lines). Perplexity search confirms: for small projects, "AGENTS.md outperforms skills in our agent evals" (Vercel research). Static documentation skills are adequate for a portfolio — executable scripts are enterprise overhead. | ❌ REMOVE | **N/A** (was Important) |

**Rationale for G7 upgrade to Critical:** Report 2 found specific inconsistencies that agents will replicate unless explicitly guided: inline data arrays vs extracted files, hardcoded hex colors vs CSS variables, class vs functional components. These are the exact "dos/don'ts" that prevent code drift.

---

### 1.3 Nice-to-Have Gaps (G13–G18)

| Gap ID | Gap Description | Report 1 Priority | Code Evidence from Report 2 | Adjusted Verdict | Adjusted Priority |
|:------:|----------------|:-----------------:|---------------------------|:----------------:|:-----------------:|
| **G13** | No cross-tool compatibility | Nice-to-have | No evidence in Report 2 that multiple AI tools are used. Single-tool development. | ❌ REMOVE | **N/A** |
| **G14** | No hierarchical AGENTS.md | Nice-to-have | Report 2 found 10 component folders with consistent patterns. A single AGENTS.md is sufficient for a 10-component project — hierarchical configs add navigation overhead without benefit at this scale. | ❌ REMOVE | **N/A** |
| **G15** | No CODEOWNERS for AGENTS.md | Nice-to-have | Single developer project. CODEOWNERS requires team review processes that don't exist here. | ❌ REMOVE | **N/A** |
| **G16** | No update cadence | Nice-to-have | Small project scope — agent config changes are driven by actual code changes, not calendar. | ❌ REMOVE | **N/A** |
| **G17** | No onboarding/setup workflow | Nice-to-have | Setup is `npm install && npm run dev`. Report 2 confirmed no `.env`, no secrets, no special setup. A workflow is overkill — a 2-line section in AGENTS.md suffices. | ❌ REMOVE | **N/A** |
| **G18** | No deployment verification workflow | Nice-to-have | Report 2 found `.github/workflows/deploy.yml` exists for GitHub Pages deployment. Deployment is automated via CI — no manual verification workflow needed. | ❌ REMOVE | **N/A** |

---

### 1.4 Cross-Reference Summary

| Original Category | Total Gaps | ✅ KEEP | 🔄 MODIFY | ❌ REMOVE |
|-------------------|:---------:|:------:|:--------:|:--------:|
| Critical (G1–G6) | 6 | 2 | 3 | 1 |
| Important (G7–G12) | 6 | 1 | 2 | 3 |
| Nice-to-Have (G13–G18) | 6 | 0 | 0 | 6 |
| **Total** | **18** | **3** | **5** | **10** |

> [!IMPORTANT]
> **10 of 18 gaps (56%) are over-engineering for this portfolio project.** The original report scored at enterprise scale. After filtering through actual code reality, only 8 gaps warrant action, and of those, only 3 need significant work.

---

## 2. Agent Config vs Code Reality Mismatches

### 2.1 Direct Contradictions

| # | What Agent Config Says | What Code Actually Does | Affected File(s) | Severity |
|---|----------------------|------------------------|------------------|:--------:|
| **M1** | `motion_guide` skill: snappy spring = `{ stiffness: 120, damping: 14 }`, smooth spring = `{ stiffness: 80, damping: 20 }` | Actual code uses `{ stiffness: 100, damping: 30 }` in `App.jsx` and `HeroPortal.jsx`. Reduced-motion mode uses `{ stiffness: 300, damping: 50, restDelta: 0.01 }` in `App.jsx`. **Neither matches the skill values.** | `.agent/skills/motion_guide/SKILL.md` vs `src/App.jsx:38-39`, `src/components/HeroPortal/HeroPortal.jsx:25` | 🔴 High |
| **M2** | `state_manager` skill references Zustand: "store selectors for targeted re-renders" | **No Zustand** in the project. State management is React `useState` + `useRef` + custom `MouseContext` with ref-based subscribe pattern. `package.json` has no `zustand` dependency. | `.agent/skills/state_manager/SKILL.md` vs `package.json`, `src/contexts/MouseContext.jsx` | 🔴 High |
| **M3** | `r3f_component_gen` skill shows template with `useRef` + `useFrame` + `<mesh>` | Actual R3F code uses `<Points>` + `<PointMaterial>` from drei, `<instancedMesh>`, and `<lineSegments>` — none of which match the skill template | `.agent/skills/r3f_component_gen/SKILL.md` vs `src/components/NeuralBackground/NeuralBackground.jsx` | 🟡 Medium |
| **M4** | AGENTS.md lists "Styling Engine: Vanilla CSS + CSS Variables" | Correct for global styles, BUT 5 components use inline data arrays with **hardcoded hex colors** in JSX (e.g., `color: '#a855f7'` in `SkillsOrbit`, `ExperienceTimeline`, `ContactPortal`, `projects.js`), bypassing the CSS variable system | `AGENTS.md` vs `src/components/SkillsOrbit/SkillsOrbit.jsx:8`, `src/data/projects.js` | 🟡 Medium |
| **M5** | AGENTS.md Global Rule: "Responsive First" | Report 2 found section detection thresholds are **hardcoded to equal percentage splits** (0.17, 0.33, ...) despite actual sections having **variable heights** (100vh–140vh). This is NOT responsive behavior. | `AGENTS.md:52` vs `src/App.jsx:93-98` | 🟡 Medium |

### 2.2 Partial Mismatches (Config exists but is incomplete)

| # | What Agent Config Says | What Code Shows | Gap |
|---|----------------------|----------------|-----|
| **M6** | `design_critique` skill lists criteria: "Animation Timing," "Color Cohesion," "Typography Consistency" | Report 2 found 45+ CSS variables with comprehensive design system including fluid typography (`clamp()`), color palette, spatial system, and glow effects. The skill doesn't reference ANY of these actual variable names. | Skill should reference `--neon-violet`, `--glass-bg`, `--text-primary` etc. |
| **M7** | AGENTS.md: "3D Engine: Three.js / R3F" | Only 1 of 10 components uses R3F (`NeuralBackground`). The remaining 9 are pure DOM with Framer Motion. Agent config treats this as a "Three.js project" when it's really a "Framer Motion project with one R3F background." | AGENTS.md overemphasizes R3F relative to its actual usage |
| **M8** | `build_verify` skill: "run `npm run lint && npm run build`" | Report 2 found `terser` configured with `pure_funcs: ['console.log', 'console.info', 'console.debug']` — but NOT `console.error` or `console.warn`. The `ErrorBoundary.jsx` has a `console.error` call that survives production builds. | Skill should note that `console.error`/`console.warn` persist in production |
| **M9** | Workflows reference "lenis" scroll handling generically | Report 2 found specific `Lenis` initialization with custom easing function `(t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))` and `prefersReducedMotion`-aware config (`duration: 0`, `smoothWheel: false`). No skill documents this actual pattern. | No skill covers the actual Lenis integration pattern |
| **M10** | `dependency_update` workflow: "Core Libraries: React, Three.js, Framer Motion" | Report 2 found `react-router-dom` installed as a dependency but **never imported anywhere**. This dead dependency would be included in any `npm update` pass but serves no purpose. | Workflow doesn't account for dead dependency detection/removal |

---

## 3. Undocumented Code Patterns Needing Agent Coverage

These are patterns discovered in Report 2 that are consistently used in the actual codebase but have **zero corresponding documentation** in AGENTS.md, skills, or workflows.

### 3.1 High Priority — Should Be Documented

| # | Pattern | Evidence | Where to Document | Why It Matters |
|---|---------|---------|-------------------|----------------|
| **P1** | **Import order convention** | 100% consistent across all 11 component files: `React hooks → third-party libs → internal modules → CSS` | AGENTS.md (Code Style section) | Agents introducing wrong import order will create inconsistency across the entire codebase |
| **P2** | **Component file structure** | 100% consistent: constants/data → sub-components → main export. `export default function` used in 8/10 components. | AGENTS.md (Code Style section) | Without this guide, agents may put sub-components after the main export or use named exports inconsistently |
| **P3** | **Ref-based MouseContext pattern** | `MouseContext.jsx` uses `useRef` + `subscribe` callbacks instead of state to avoid re-renders. 3 components consume it (`MagneticCursor`, `HeroPortal`, `NeuralBackground`). This is a performance-critical architectural decision. | `state_manager` skill (replace Zustand references) | If an agent replaces `mouseRef` with `useState`, cursor latency and R3F frame drops will result |
| **P4** | **Single-Canvas R3F architecture** | Only `NeuralBackground` has a `<Canvas>`. All other 9 components are pure DOM + Framer Motion. This is an intentional design: R3F handles background effects only. | `r3f_component_gen` skill or AGENTS.md | Agent might create additional Canvases for new features, multiplying WebGL contexts |
| **P5** | **`data-cursor` attribute protocol** | 6 components use `data-cursor` attribute to trigger custom cursor hover effects. `MagneticCursor` reads these via `document.addEventListener('mouseover')` delegation on `[data-cursor]` elements. | AGENTS.md (Code Style section) | Missing `data-cursor` on new interactive elements means broken cursor behavior |
| **P6** | **`useInView` + conditional `animate` pattern** | 5 components use identical pattern: `const isInView = useInView(ref, { once: true, margin: "-100px" })` then `animate={isInView ? { opacity: 1, y: 0 } : {}}`. This is the standard scroll-reveal pattern. | `motion_guide` skill | Agents must follow this exact pattern for scroll-triggered animations, not alternative approaches |

### 3.2 Medium Priority — Useful to Document

| # | Pattern | Evidence | Where to Document |
|---|---------|---------|-------------------|
| **P7** | **Section header component pattern** | All 5 section components (FloatingIdentity, ProjectsConstellation, SkillsOrbit, ExperienceTimeline, ContactPortal) use identical section header structure: `<span className="section-number mono">` + `<h2 className="section-title">` + gradient text + `<p className="section-subtitle mono">` | `motion_guide` or new section-standard skill |
| **P8** | **CSS variable design system** (45+ variables) | `index.css` defines `--neon-violet`, `--glass-bg`, `--text-primary`, etc. All components use these for colors, spacing, and typography. But 5 components also hardcode hex values (`#a855f7`, `#3b82f6`) in inline data arrays. | `design_critique` skill + AGENTS.md |
| **P9** | **`memo()` wrapping conventions** | 9/11 components use `memo()` or `React.memo()`. Three different patterns are used: `memo(function)` inline, `React.memo(Component)` at export, `const X = memo(() => ...)` with `displayName`. No standard is picked. | AGENTS.md (Code Style section) |
| **P10** | **Reduced motion handling pattern** | `App.jsx` checks `prefers-reduced-motion` and adjusts Lenis config + spring values. `index.css` and 2 component CSS files have `@media (prefers-reduced-motion: reduce)`. `ProjectsConstellation` conditionally disables background dots. | `motion_guide` skill |
| **P11** | **Lazy loading selection criteria** | 6 components are lazy-loaded via `React.lazy()`, 2 are eagerly loaded (`MagneticCursor`, `OrbitalNavigation`). Selection criteria: the 2 eager components are **always visible** (cursor + nav). The 6 lazy components are **below-fold sections**. | AGENTS.md |

### 3.3 Low Priority — Optional

| # | Pattern | Evidence |
|---|---------|---------|
| **P12** | `ErrorBoundary` is the only class component; all others are functional | Convention: never add new class components |
| **P13** | All `useEffect` hooks return cleanup functions | 100% consistency — cleanup for event listeners, RAF, timeouts, Lenis |
| **P14** | Static data approach: no API calls, all data in `projects.js` or inline arrays | No fetch/axios/API layer exists |

---

## 4. Filtered Recommendations

### 4.1 Report 1 Section 7 Recommendations — Kept, Modified, or Removed

#### 7.1 AGENTS.md Restructure (was "Priority 1 — Critical")

| Proposed Section | Verdict | Justification |
|-----------------|:-------:|---------------|
| 1. Project Overview | ✅ **KEEP** (exists) | Already present and well-written. No changes needed. |
| 2. Commands | ✅ **KEEP** | Report 2 confirms 4 runnable commands exist but are undocumented. High-value, low-effort: add 4 lines. |
| 3. Project Structure | ✅ **KEEP** | Report 2's directory map proves this is the #1 most impactful addition. Prevents wrong file placement. |
| 4. Code Style — Dos/Don'ts | ✅ **KEEP** | Report 2 found 6+ concrete dos/don'ts from actual code patterns (import order, naming, CSS vars vs hardcoded, functional-only). |
| 5. Testing | 🔄 **MODIFY → Reduce** | Report 2 found 7 tests already exist with consistent mocking patterns. Don't create a testing strategy document — just add 2 lines: `vitest` for unit, mock patterns for framer-motion/R3F. |
| 6. Safety & Permissions | 🔄 **MODIFY → Minimize** | Single-developer portfolio. Reduce to 3 bullet points: "don't push to main," "don't add CDN scripts," "don't modify config files without asking." No formal matrix needed. |
| 7. Agent Roles | ✅ **KEEP** (exists) | Already present. Can be refined but works as-is. |
| 8. Git Workflow | ❌ **REMOVE** from AGENTS.md | Already exists as `git_workflow.md` workflow (186 lines). Duplicating in AGENTS.md adds maintenance burden. |
| 9. Good/Bad Examples | 🔄 **MODIFY → Merge into Code Style** | Don't create separate section. Embed 2–3 concrete do/don't examples directly in the Code Style section. |
| 10. When Stuck | 🔄 **MODIFY → One line** | Reduce to: "When uncertain, ask a clarifying question instead of guessing." No elaborate protocol needed. |
| 11. Global Rules | ✅ **KEEP** (exists) | Add specific numbers: FPS target, bundle budget, accessibility standard. Currently too vague. |

**Net result:** AGENTS.md grows from 56 lines to ~100–110 lines. Stays well within 150-line limit.

---

#### 7.2 Skills Enhancement (was "Priority 2")

| Proposed Action | Verdict | Justification |
|----------------|:-------:|---------------|
| **Create** `testing_guide` skill | ❌ **REMOVE** | Perplexity ask: "Skip agent testing workflows — portfolio needs smoke tests only." 7 tests already follow consistent patterns. A 2-line mention in AGENTS.md suffices. |
| **Create** `environment_setup` skill | ❌ **REMOVE** | Setup is `npm install && npm run dev`. No `.env`, no secrets. Perplexity ask: "Environment setup skills: redundant with Vite." |
| **Enhance** `design_critique` | 🔄 **MODIFY** | Don't add "concrete CSS code examples" as recommended — instead, add references to actual CSS variable names from `index.css` (`--neon-violet`, `--glass-bg`, etc.) |
| **Enhance** all skills with `scripts/` | ❌ **REMOVE** | Perplexity research: "AGENTS.md outperforms skills in agent evals" (Vercel). Static documentation is adequate for 6 skills in a 10-component project. |
| **Enhance** `build_verify` with budgets | 🔄 **MODIFY** | Add one line noting `chunkSizeWarningLimit: 1000` from actual `vite.config.js` and that `console.error`/`console.warn` are NOT stripped by terser. |
| **Fix** `motion_guide` spring values | ✅ **KEEP** (new) | Replace `{120, 14}` and `{80, 20}` with actual values: `{100, 30}` (normal) and `{300, 50}` (reduced motion). This is a direct contradiction from Report 2. |
| **Fix** `state_manager` Zustand refs | ✅ **KEEP** (new) | Remove all Zustand references. Document the actual ref-based MouseContext pattern used in the project. |
| **Fix** `r3f_component_gen` templates | 🔄 **MODIFY** | Keep existing mesh template but add actual patterns: `<Points>` + `<PointMaterial>`, `<instancedMesh>` with `setMatrixAt`, `<lineSegments>`. These are the 3 patterns actually used. |

---

#### 7.3 Workflow Improvements (was "Priority 3")

| Proposed Action | Verdict | Justification |
|----------------|:-------:|---------------|
| **Create** `testing.md` workflow | ❌ **REMOVE** | Over-engineering. See skills section above. |
| **Create** `onboarding.md` workflow | ❌ **REMOVE** | Setup is 2 commands. No workflow needed. |
| **Update** all workflows with rollback | ❌ **REMOVE** | Portfolio project; `git checkout .` or `git stash` is sufficient. |
| **Update** `accessibility` with `// turbo` | ✅ **KEEP** | Low-effort improvement: adding `// turbo` to safe automated steps (Lighthouse, aXe). |
| **Update** all workflows with success criteria | 🔄 **MODIFY** | Add only to the 4 most-used workflows: `health_check`, `maintenance`, `feature_development`, `design_iteration`. Not all 10. |

---

#### 7.4 Quality Metrics Framework (was "Priority 4")

| Verdict | Justification |
|:-------:|---------------|
| 🔄 **MODIFY → Minimal** | Don't create a metrics framework. Instead, add 4 concrete thresholds to AGENTS.md Global Rules: FPS ≥ 55, chunk size ≤ 1000KB, lint warnings = 0, console errors = 0. These already exist scattered across configs — just consolidate. |

---

#### 7.5 Cross-Tool & Governance (was "Priority 5")

| Proposed Action | Verdict | Justification |
|----------------|:-------:|---------------|
| Add `CODEOWNERS` | ❌ **REMOVE** | Single developer. No review process. |
| Create `.cursorrules` symlink | ❌ **REMOVE** | No evidence of multi-tool usage. |
| Quarterly review | ❌ **REMOVE** | Over-engineering for a portfolio. |
| Version AGENTS.md | ❌ **REMOVE** | Git history provides versioning naturally. |

---

### 4.2 Recommendation Filtering Summary

| Report 1 Category | Original Items | ✅ KEEP | 🔄 MODIFY | ❌ REMOVE |
|-------------------|:--------------:|:------:|:--------:|:--------:|
| AGENTS.md Restructure | 11 sections | 5 | 4 | 2 |
| Skills Enhancement | 8 actions | 2 | 3 | 3 |
| Workflow Improvements | 5 actions | 1 | 1 | 3 |
| Quality Metrics | 1 framework | 0 | 1 | 0 |
| Cross-Tool & Governance | 4 actions | 0 | 0 | 4 |
| **Total** | **29** | **8** | **9** | **12** |

> [!TIP]
> **41% of original recommendations should be removed** — they were scaled for enterprise projects, not a 10-component portfolio. The 17 remaining actions (8 keep + 9 modify) represent the right-sized improvement set.

---

## 5. Final Prioritized Action Plan

All actions affect only `.agent/` files and `AGENTS.md`. No existing project code is modified.

### Tier 1 — Do First (Critical Impact, Low Effort)

| # | Action | File(s) to Change | What Specifically Changes | Cross-Reference |
|---|--------|-------------------|--------------------------|----------------|
| **A1** | **Fix `motion_guide` spring value contradiction** | `.agent/skills/motion_guide/SKILL.md` | Replace `{ stiffness: 120, damping: 14 }` → `{ stiffness: 100, damping: 30 }` (normal mode). Replace `{ stiffness: 80, damping: 20 }` → `{ stiffness: 300, damping: 50, restDelta: 0.01 }` (reduced motion). Add actual motion value pattern from `HeroPortal.jsx`. | Mismatch M1, Pattern P6 |
| **A2** | **Fix `state_manager` Zustand contradiction** | `.agent/skills/state_manager/SKILL.md` | Remove all Zustand references. Replace with actual ref-based `MouseContext` pattern: `useRef` for high-frequency values, `subscribe` callback for consumers, never `useState` for mouse/scroll. Add `useMotionValue` as alternative for Framer Motion contexts. | Mismatch M2, Pattern P3 |
| **A3** | **Add Commands section to AGENTS.md** | `AGENTS.md` | Add section after Project Overview: `npm run dev` (dev server), `npm run build` (production build with terser), `npm run lint` (ESLint), `npx vitest` (unit tests), `npx vitest run` (CI mode). Note: `console.error`/`console.warn` are NOT stripped by terser. | Gap G1, Mismatch M8 |
| **A4** | **Add Project Structure to AGENTS.md** | `AGENTS.md` | Add directory tree showing `src/components/` (10 folders), `src/contexts/`, `src/data/`, `src/styles/`, `public/`. Note co-located pattern: each component folder contains `Name.jsx` + `Name.css` + optional `Name.test.jsx`. | Gap G4, Pattern P2 |

### Tier 2 — Do Next (High Value, Medium Effort)

| # | Action | File(s) to Change | What Specifically Changes | Cross-Reference |
|---|--------|-------------------|--------------------------|----------------|
| **A5** | **Add Code Style Dos/Don'ts to AGENTS.md** | `AGENTS.md` | Add section with: DO use functional components (never class except ErrorBoundary), DO follow import order (React → third-party → internal → CSS), DO wrap components in `memo()`, DO use CSS variables from `index.css`, DON'T hardcode hex colors in JSX, DON'T create new R3F Canvases, DON'T use `useState` for high-frequency updates (mouse, scroll), DO add `data-cursor` attribute on interactive elements. | Gap G7, Patterns P1–P5, Mismatch M4 |
| **A6** | **Update `r3f_component_gen` to match actual code** | `.agent/skills/r3f_component_gen/SKILL.md` | Keep existing mesh template. Add 3 actual patterns used: (1) `<Points>` + `<PointMaterial>` for particle systems, (2) `<instancedMesh>` with `setMatrixAt`/`setColorAt` for multiple objects, (3) `<lineSegments>` with `BufferGeometry` for connection lines. Add single-Canvas policy note. | Mismatch M3, Pattern P4 |
| **A7** | **Update `design_critique` with actual CSS variable names** | `.agent/skills/design_critique/SKILL.md` | Add reference to actual design system variables: color palette (`--neon-violet`, `--neon-cyan`, `--glass-bg`), typography (`--text-sm`, `--font-mono`), glassmorphism classes (`.glass`, `.glass-strong`). Note which variables are used for glow effects (`--blur-md`). | Mismatch M6, Pattern P8 |
| **A8** | **Add `motion_guide` scroll-reveal and Lenis patterns** | `.agent/skills/motion_guide/SKILL.md` | Add actual `useInView` pattern: `useInView(ref, { once: true, margin: "-100px" })` + `animate={isInView ? { ... } : {}}`. Add Lenis integration pattern with `prefersReducedMotion` awareness. Add `AnimatePresence` usage for mount/unmount. | Pattern P6, P10, Mismatch M9 |

### Tier 3 — Do Last (Nice-to-Have Improvements)

| # | Action | File(s) to Change | What Specifically Changes | Cross-Reference |
|---|--------|-------------------|--------------------------|----------------|
| **A9** | **Add minimal Safety section to AGENTS.md** | `AGENTS.md` | 3 bullet points: "Don't push to main directly," "Don't add CDN scripts or external dependencies without asking," "Don't modify vite.config.js or eslint.config.js without asking." | Gap G2 (modified) |
| **A10** | **Add minimal Testing mention to AGENTS.md** | `AGENTS.md` | 2 lines: "Unit tests: `npx vitest`. Tests mock `framer-motion` and `@react-three/fiber` Canvas. New components should include `.test.jsx` files." | Gap G3 (modified) |
| **A11** | **Expand AGENTS.md Global Rules with numbers** | `AGENTS.md` | Change "60fps" to "≥ 55fps sustained." Add "chunk size ≤ 1000KB" (from `vite.config.js`). Add "lint warnings = 0." Note `react-router-dom` is a known dead dependency. | Gap G10 (modified), Report 2 dependency finding |
| **A12** | **Add `// turbo` to `accessibility` workflow safe steps** | `.agent/workflows/accessibility.md` | Add `// turbo` annotations to automated audit steps (Lighthouse, aXe commands). | Gap G8 actionable fragment |
| **A13** | **Add "When stuck" one-liner to AGENTS.md** | `AGENTS.md` | Add: "When uncertain about an approach, ask a clarifying question. Don't push speculative changes." | Gap G5 (modified) |
| **A14** | **Add success criteria to top 4 workflows** | `.agent/workflows/health_check.md`, `maintenance.md`, `feature_development.md`, `design_iteration.md` | Add a "Done when:" section at the end with 2–3 concrete criteria. | Report 1 rec 7.3 (modified) |
| **A15** | **Update `build_verify` with console.error note** | `.agent/skills/build_verify/SKILL.md` | Add note: "`terser` strips `console.log/info/debug` but preserves `console.error/warn`. Don't use `console.error` for non-error logging." | Mismatch M8 |
| **A16** | **Add `data-cursor` protocol to AGENTS.md** | `AGENTS.md` | Add under Code Style: "All interactive elements (buttons, links, cards) MUST have `data-cursor` attribute for custom cursor interaction." | Pattern P5 |
| **A17** | **Note dead dependency in AGENTS.md** | `AGENTS.md` | Under Global Rules or a new "Known Issues" note: "`react-router-dom` is installed but unused — do not import it. No routing exists in this app." | Report 2 dependency analysis |

### Action Plan Summary

| Tier | Actions | Files Affected | Estimated Effort |
|:----:|:-------:|:--------------:|:----------------:|
| **Tier 1** (Critical) | A1–A4 | 3 files | ~1 hour |
| **Tier 2** (High) | A5–A8 | 4 files | ~1.5 hours |
| **Tier 3** (Nice) | A9–A17 | 5 files | ~1 hour |
| **Total** | **17 actions** | **7 unique files** | **~3.5 hours** |

### Files That Will Be Modified

| File | Actions Targeting It | Total Changes |
|------|---------------------|:------------:|
| `AGENTS.md` | A3, A4, A5, A9, A10, A11, A13, A16, A17 | 9 |
| `.agent/skills/motion_guide/SKILL.md` | A1, A8 | 2 |
| `.agent/skills/state_manager/SKILL.md` | A2 | 1 |
| `.agent/skills/r3f_component_gen/SKILL.md` | A6 | 1 |
| `.agent/skills/design_critique/SKILL.md` | A7 | 1 |
| `.agent/skills/build_verify/SKILL.md` | A15 | 1 |
| `.agent/workflows/accessibility.md` | A12 | 1 |
| `.agent/workflows/` (4 files) | A14 | 4 |

---

## 6. Research References

### Perplexity Search — Right-Sizing Agent Configuration
- Vercel research: "AGENTS.md outperforms skills in agent evals" — for small projects, invest in AGENTS.md over skills
- Block.xyz 3 principles for agent skills: diagnostic, scope-aware, composable
- Industry guidance: "Score configs by repo size — suggest slim AGENTS.md first"

### Perplexity Ask — Most Impactful Standards for R3F Portfolios
- Critical sections: Performance & Re-renders, useFrame & Animation, Canvas & Setup, Component Patterns
- Essential skills: `r3f_component_gen`, `state_manager`, `motion_guide`
- Nice-to-have skills: `design_critique`, `code_linter`, `build_verify`
- Skip for portfolio: testing workflows, environment setup skills, E2E automation, autonomy matrices

### Perplexity Reason — Cross-Reference Analysis
- Confirmed: single-Canvas architecture is correct for this project
- Confirmed: `motion_guide` spring config contradiction is highest-priority fix
- Confirmed: Zustand references in `state_manager` are incorrect for this codebase
- Confirmed: 10 of 18 gaps are enterprise-scale recommendations not suitable for 10-component portfolio

---

*Report generated from cross-analysis of two prior reports. No existing files were modified. All 17 actions target only `.agent/` files and `AGENTS.md`.*

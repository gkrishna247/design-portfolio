---
description: Health checks, bug fixes, dependency updates, and general project maintenance.
---

# Maintenance Workflow

Use this for health checks, bug fixes, dependency updates, and routine upkeep.

---

## Phase 1: Health Check (< 2 minutes)

// turbo
### 1.1 Quick Status
```bash
npm run lint
npm run build
npm run dev
```

### 1.2 Health Indicators

| Indicator | ✅ Healthy | ⚠️ Warning | ❌ Critical |
|-----------|-----------|------------|------------|
| npm lint | 0 errors | < 5 warnings | Errors |
| npm build | Success | Size warnings | Fails |
| Console | Clean | Warnings | Errors |
| FPS | ≥55fps | 50-55fps | < 50fps |

---

## Phase 2: Bug Fix (if needed)

### 2.1 Severity Classification

| Level | Description | Response |
|-------|-------------|----------|
| 🔴 Critical | Build broken, white screen, crash | Immediate |
| 🟠 High | Feature broken, console errors | Same session |
| 🟡 Medium | Visual glitch, minor regression | Next session |
| 🟢 Low | Typo, style inconsistency | When convenient |

### 2.2 Reproduce & Fix
// turbo
- [ ] Start dev server: `npm run dev`
- [ ] Identify the bug: "X happens when Y".
- [ ] Isolate to specific component(s).
- [ ] Apply minimal fix — avoid scope creep.
- [ ] For animation fixes → verify `motion_guide` compliance.

### 2.3 Quick Debugging Reference

| Symptom | Likely Cause | Quick Fix |
|---------|--------------|-----------|
| White screen | JS error, import cycle | Check console, fix import |
| Layout broken | CSS specificity issue | Check CSS cascade |
| Animation jank | Layout thrashing | Use `transform` only |
| 3D not rendering | WebGL context, asset path | Check console, verify paths |
| Console warnings | Deprecated API | Update dependency |
| Performance drop | Excessive re-renders | Add memoization |

---

## Phase 3: Dependency Update (when needed)

### 3.1 Risk Assessment

| Package Family | Risk | Notes |
|----------------|------|-------|
| `three`, `@react-three/*` | 🔴 Critical | API changes common — update LAST |
| `react`, `react-dom` | 🟠 High | May affect all components |
| `framer-motion` | 🟠 High | Animation API changes |
| `lenis` | 🟡 Medium | Scroll behavior |
| `vite`, `eslint` | 🟢 Low | Build tooling, usually safe |

### 3.2 Update Procedure
// turbo
- [ ] Check outdated: `npm outdated`
- [ ] **Rule**: Update one family at a time, in order: build tools → UI libs → React → 3D (last).
- [ ] For major versions → read migration guide first.
- [ ] After each update: `npm run lint && npm run build`.

### 3.3 Rollback Protocol
If update breaks the build:
```bash
git checkout HEAD -- package.json package-lock.json
npm install
```
Then investigate, pin to working version, or wait for patch.

---

## Phase 4: Verify & Commit

// turbo
- [ ] Run `build_verify` skill: `npm run lint && npm run build`.
- [ ] No new console errors.
- [ ] Commit with appropriate prefix:
  - Bug fix: `fix: resolve [description]`
  - Dependency: `chore(deps): update [package] to v[version]`
  - Health: `chore: routine health check — all green`

### Escalation
If fix takes > 30 minutes: **stop**, document findings, reassess approach.

---

## ✅ Done When
- All health indicators show green (lint clean, build passes, no console errors)
- Bug is fixed and verified, or dependencies are updated and tested
- No regressions introduced

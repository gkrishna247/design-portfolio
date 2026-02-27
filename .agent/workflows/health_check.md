---
description: Quick project status check and health assessment.
---

# Health Check Workflow

Use this for a quick project health assessment before starting work.

---

## Quick Check (< 2 minutes)

### 1. Dependencies
// turbo
- [ ] Verify node_modules is current:
  ```bash
  npm install
  ```

### 2. Lint Status
// turbo
- [ ] Check for lint errors:
  ```bash
  npm run lint
  ```

### 3. Build Status
// turbo
- [ ] Verify build passes:
  ```bash
  npm run build
  ```

### 4. Dev Server
// turbo
- [ ] Start dev server:
  ```bash
  npm run dev
  ```

---

## Health Indicators

| Indicator | ✅ Healthy | ⚠️ Warning | ❌ Critical |
|-----------|-----------|------------|------------|
| npm install | Clean | Warnings | Errors |
| npm lint | 0 errors | < 5 warnings | Errors |
| npm build | Success | Size warnings | Fails |
| Console | Clean | Warnings | Errors |
| FPS | 60fps | 50-60fps | < 50fps |

---

## If Issues Found

1. **Lint errors** → Run `/maintenance` workflow.
2. **Build fails** → Run `/maintenance` workflow.
3. **Performance issues** → Run `/optimization_pass` workflow.
4. **Outdated deps** → Run `/dependency_update` workflow.

---

## ✅ Done When
- `npm run lint` exits with 0 warnings
- `npm run build` exits with code 0 and no chunk warnings
- Dev server loads without console errors

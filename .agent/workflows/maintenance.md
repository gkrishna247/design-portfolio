---
description: Fast-track workflow for bug fixes, glitches, and minor tweaks.
---

# Maintenance Workflow

Use this for bugs, glitches, console errors, or minor fixes.

---

## Severity Classification

| Level | Description | Response Time |
|-------|-------------|---------------|
| 🔴 **Critical** | Build broken, white screen, crash | Immediate |
| 🟠 **High** | Feature broken, console errors | Same session |
| 🟡 **Medium** | Visual glitch, minor regression | Next session |
| 🟢 **Low** | Typo, style inconsistency | When convenient |

---

## Phase 1: Reproduction

### 1.1 Identify the Issue
- [ ] Describe the bug clearly: "X happens when Y".
- [ ] Identify severity level (see table above).

### 1.2 Reproduce
// turbo
- [ ] Start dev server:
  ```bash
  npm run dev
  ```
- [ ] Follow exact steps to reproduce.
- [ ] Check browser console for errors.
- [ ] For 3D issues → Check for Three.js warnings.

### 1.3 Isolate
- [ ] Identify the affected component(s).
- [ ] Create minimal reproduction if complex.

---

## Phase 2: Fix Implementation

### 2.1 Apply the Fix
- [ ] **Constraint**: Minimal code changes preferred.
- [ ] **Constraint**: Do NOT introduce new dependencies without approval.
- [ ] Fix only the identified issue—avoid scope creep.

### 2.2 Performance Check
- [ ] For animation fixes → Verify `motion_guide` compliance:
  - Only animate `transform` and `opacity`.
  - Use standard spring constants.
- [ ] For 3D fixes → Verify no new draw calls added.

---

## Phase 3: Verification

### 3.1 Code Quality
// turbo
- [ ] Run linter:
  ```bash
  npm run lint
  ```

### 3.2 Build Verification
// turbo
- [ ] Verify build passes:
  ```bash
  npm run build
  ```

### 3.3 Regression Check
- [ ] Verify the fix works.
- [ ] Verify no NEW issues introduced.
- [ ] Check console is clean (no errors or warnings).
- [ ] For 3D components → Verify smooth 60fps maintained.

### 3.4 Browser Testing
- [ ] Test in primary browser (Chrome).
- [ ] Quick check in secondary browser (Firefox or Safari).

---

## Phase 4: Deployment

### 4.1 Commit with Conventional Message
- [ ] Use `fix:` prefix:
  ```bash
  git add .
  git commit -m "fix: resolve [issue description]"
  ```

### 4.2 For Critical Fixes
- [ ] Consider hotfix branch if on main:
  ```bash
  git checkout -b hotfix/[issue-name]
  # ... make fix ...
  git checkout main
  git merge hotfix/[issue-name]
  ```

---

## Quick Debugging Checklist

| Symptom | Likely Cause | Quick Fix |
|---------|--------------|-----------|
| White screen | JS error, import cycle | Check console, fix import |
| Layout broken | CSS specificity, missing styles | Check CSS cascade |
| Animation jank | Layout thrashing | Use transform only |
| 3D not rendering | WebGL context, asset path | Check console, verify paths |
| Console warnings | Deprecated API, missing deps | Update dependency |
| Performance drop | Too many re-renders | Add memoization |

---

## Escalation Protocol

If fix is taking > 30 minutes:

1. **Stop** and reassess approach.
2. **Document** findings so far.
3. **Consider** if this needs `/refactoring` workflow instead.
4. **Ask** for second opinion if complex.

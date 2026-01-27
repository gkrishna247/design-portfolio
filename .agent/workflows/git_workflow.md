---
description: Complete git workflow for branching, committing, and deploying changes.
---

# Git Workflow

Use this for proper version control practices and deployment.

---

## Branch Naming Convention

| Type | Format | Example |
|------|--------|---------|
| Feature | `feature/[name]` | `feature/hero-parallax` |
| Bug fix | `fix/[issue]` | `fix/cursor-jank` |
| Refactor | `refactor/[name]` | `refactor/extract-hooks` |
| Hotfix | `hotfix/[issue]` | `hotfix/build-error` |
| Experiment | `experiment/[name]` | `experiment/new-shader` |

---

## Commit Message Convention

### Format
```
<type>(<scope>): <subject>

[optional body]
[optional footer]
```

### Types
| Type | Use For |
|------|---------|
| `feat` | New feature |
| `fix` | Bug fix |
| `style` | Visual/CSS changes |
| `perf` | Performance improvement |
| `refactor` | Code restructure |
| `docs` | Documentation |
| `chore` | Maintenance tasks |
| `test` | Adding tests |

### Examples
```bash
feat(hero): add parallax floating orbs
fix(cursor): resolve jank on scroll
style(theme): increase neon glow intensity
perf(3d): reduce draw calls by 40%
refactor(hooks): extract useMousePosition
chore(deps): update framer-motion to v11
```

---

## Phase 1: Feature Development

### 1.1 Start New Feature
- [ ] Create feature branch:
  ```bash
  git checkout -b feature/[name]
  ```

### 1.2 During Development
- [ ] Commit frequently (small, atomic commits).
- [ ] Keep commits focused on single purpose.

### 1.3 Ready to Merge
- [ ] Ensure all verification passes:
  ```bash
  npm run lint
  npm run build
  ```

---

## Phase 2: Code Review (Self)

### 2.1 Review Changes
- [ ] Review diff:
  ```bash
  git diff main
  ```
- [ ] Check for:
  - [ ] console.log statements removed
  - [ ] No hardcoded values
  - [ ] Proper comments on complex code
  - [ ] Consistent naming

### 2.2 Squash if Needed
- [ ] For messy commit history:
  ```bash
  git rebase -i main
  ```

---

## Phase 3: Merge & Push

### 3.1 Merge to Main
- [ ] Switch to main:
  ```bash
  git checkout main
  ```
- [ ] Pull latest:
  ```bash
  git pull origin main
  ```
- [ ] Merge feature:
  ```bash
  git merge feature/[name]
  ```

### 3.2 Push
- [ ] Push to remote:
  ```bash
  git push origin main
  ```

### 3.3 Cleanup
- [ ] Delete feature branch:
  ```bash
  git branch -d feature/[name]
  ```
- [ ] Delete remote branch (if pushed):
  ```bash
  git push origin --delete feature/[name]
  ```

---

## Phase 4: Deployment

### 4.1 Verify GitHub Actions
- [ ] Check `.github/workflows/deploy.yml` status.
- [ ] Verify deployment succeeded.

### 4.2 Post-Deployment Check
- [ ] Visit live site.
- [ ] Verify changes are live.
- [ ] Check console for errors.

---

## Hotfix Protocol

For urgent production fixes:

### 1. Create Hotfix
```bash
git checkout main
git checkout -b hotfix/[issue]
```

### 2. Fix & Test
- [ ] Apply minimal fix.
// turbo
- [ ] Verify:
  ```bash
  npm run lint && npm run build
  ```

### 3. Merge & Deploy
```bash
git checkout main
git merge hotfix/[issue]
git push origin main
git branch -d hotfix/[issue]
```

---

## Useful Commands

| Task | Command |
|------|---------|
| See status | `git status` |
| See log | `git log --oneline -10` |
| Undo last commit | `git reset --soft HEAD~1` |
| Discard changes | `git checkout -- .` |
| Stash changes | `git stash` |
| Apply stash | `git stash pop` |
| See branches | `git branch -a` |
| Clean branches | `git remote prune origin` |

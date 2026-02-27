---
description: Complete git workflow for branching, committing, and deploying changes.
---

# Git Workflow

Use this for proper version control practices and deployment.

---

## Branch Naming

| Type | Format | Example |
|------|--------|---------|
| Feature | `feature/[name]` | `feature/hero-parallax` |
| Bug fix | `fix/[issue]` | `fix/cursor-jank` |
| Refactor | `refactor/[name]` | `refactor/extract-hooks` |
| Hotfix | `hotfix/[issue]` | `hotfix/build-error` |
| Design | `upgrade/[name]` | `upgrade/design-enhancements` |

---

## Commit Messages

### Format
```
<type>(<scope>): <subject>
```

### Types
| Type | Use For | Example |
|------|---------|---------|
| `feat` | New feature | `feat(hero): add parallax orbs` |
| `fix` | Bug fix | `fix(cursor): resolve jank on scroll` |
| `style` | Visual/CSS | `style(theme): increase neon glow` |
| `perf` | Performance | `perf(3d): reduce draw calls by 40%` |
| `refactor` | Code restructure | `refactor(hooks): extract useMousePosition` |
| `chore` | Maintenance | `chore(deps): update framer-motion to v11` |

---

## Feature Branch Flow

### 1. Start
```bash
git checkout -b feature/[name]
```

### 2. During Development
- Commit frequently (small, atomic commits).

### 3. Ready to Merge
- [ ] Run `build_verify` skill: `npm run lint && npm run build`
- [ ] Review diff: `git diff main`
- [ ] Check: no console.log, no hardcoded values, consistent naming.

### 4. Merge & Push
```bash
git checkout main
git pull origin main
git merge feature/[name]
git push origin main
git branch -d feature/[name]
```

### 5. Verify Deployment
- [ ] Check `.github/workflows/deploy.yml` status.
- [ ] Visit live site and verify changes.

---

## Hotfix Protocol

// turbo
```bash
git checkout main
git checkout -b hotfix/[issue]
# Apply minimal fix
npm run lint && npm run build
git checkout main && git merge hotfix/[issue]
git push origin main && git branch -d hotfix/[issue]
```

---

## Useful Commands

| Task | Command |
|------|---------|
| See status | `git status` |
| See log | `git log --oneline -10` |
| Undo last commit | `git reset --soft HEAD~1` |
| Discard changes | `git checkout -- .` |
| Stash / Apply | `git stash` / `git stash pop` |

---

## ✅ Done When
- All changes are committed with conventional commit messages
- `npm run lint && npm run build` passes on merged branch
- Deployment succeeds (GitHub Actions green)

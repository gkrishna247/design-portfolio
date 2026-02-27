---
description: Performance optimization, code cleanup, refactoring, and structural improvements.
---

# Code Improvement Workflow

Use this for performance optimization, refactoring, code cleanup, or structural changes.

---

## Phase 1: Identify the Goal

### 1.1 Improvement Type

| Type | Examples | Risk |
|------|----------|------|
| **Performance** | FPS drops, bundle too large, slow load | 🟡 Medium |
| **Extract** | Extract component or hook | 🟢 Low |
| **Rename/Move** | Rename file, move to folder | 🟢 Low |
| **Consolidate** | Merge duplicate code | 🟡 Medium |
| **Restructure** | Change component hierarchy | 🔴 High |

### 1.2 Define Success Criteria
- [ ] Before/after metrics (e.g., "Bundle: 500KB → 300KB", "FPS: 45 → 60").
- [ ] For refactors > 50 lines → create `implementation_plan.md`.

---

## Phase 2: Diagnosis (for performance issues)

### 2.1 Performance Targets

| Metric | Target | Critical |
|--------|--------|----------|
| FPS | ≥55fps | < 50fps |
| LCP | < 2.5s | > 4s |
| Chunk Size | < 500kB each | > 1MB |

### 2.2 Analysis Steps
// turbo
- [ ] Run build and check chunk sizes: `npm run build`
- [ ] Chrome DevTools → Performance tab → record 5s interaction.
- [ ] React DevTools → Profile component renders → find wasted renders.

### 2.3 Three.js/R3F Checks
- [ ] Monitor draw calls: `gl.info.render.calls` — problematic if > 100.
- [ ] Check triangle count: > 100k is heavy.
- [ ] Verify `dpr={[1, 1.5]}` is set on Canvas.
- [ ] Verify `useFrame` uses `delta` for frame-rate independence.

---

## Phase 3: Implementation

### 3.1 Performance Fixes
- [ ] **Lazy loading**: Wrap heavy below-fold components with `React.lazy()`.
- [ ] **Memoization**: Add `memo()`, `useMemo()`, `useCallback()` per `state_manager` skill.
- [ ] **Animation**: Follow `motion_guide` — animate only `transform`/`opacity`.
- [ ] **R3F**: Lower DPR on mobile, reduce geometry, dispose unused textures.

### 3.2 Refactoring Steps
- [ ] One component/file at a time — verify after each change.
- [ ] Extract: create new file → add exports → update imports → verify.
- [ ] Rename: rename file → update ALL imports → search for old name.
- [ ] Move: new location → move file → update ALL import paths.
- [ ] Commit frequently (small, atomic commits).

### 3.3 Cleanup
- [ ] Remove unused imports and variables.
- [ ] Remove `console.log` statements.
- [ ] Move hardcoded hex colors to CSS variables.

---

## Phase 4: Verification

// turbo
- [ ] Run `build_verify` skill: `npm run lint && npm run build`.
- [ ] Compare metrics to Phase 2 baseline.
- [ ] Visual click-through of affected areas — no regressions.
- [ ] Animations still smooth (≥55fps).
- [ ] Commit with appropriate prefix:
  - Performance: `perf: reduce bundle size by X%`
  - Refactor: `refactor: extract [component] for modularity`

---

## Quick Fixes Reference

| Issue | Quick Fix |
|-------|-----------|
| Large bundle | Code split with `lazy()` |
| Jank during scroll | Use `transform` instead of `top/left` |
| High memory | Dispose unused textures, remove event listeners |
| Many re-renders | Add `memo()` and `useMemo()` |
| Slow 3D | Lower DPR, reduce geometry, fewer particles |
| Prop drilling | Use Context or composition |
| Duplicate code | Extract to shared hook or component |

---

## ✅ Done When
- Performance metrics meet targets or refactoring goal achieved
- `npm run lint && npm run build` passes
- No visual regressions — animations and layout unchanged

---
description: Performance optimization focused on 60FPS targets, bundle size reduction, and asset optimization.
---

# Optimization Pass Workflow

Use this when performance drops below 60fps or bundle size exceeds limits.

---

## Performance Targets

| Metric | Target | Critical Threshold |
|--------|--------|-------------------|
| FPS | 60fps | < 55fps |
| LCP | < 2.5s | > 4s |
| Bundle Size | < 500kB per chunk | > 1MB |
| Initial Load | < 3s | > 5s |
| 3D Scene Init | < 2s | > 4s |

---

## Phase 1: Diagnosis

### 1.1 Bundle Analysis
// turbo
- [ ] Run build and analyze output:
  ```bash
  npm run build
  ```
- [ ] Check for chunk size warnings.
- [ ] Identify large chunks.

### 1.2 Runtime Performance
- [ ] Open Chrome DevTools → Performance tab.
- [ ] Record a 5-second interaction session.
- [ ] Look for:
  - [ ] Long tasks (> 50ms)
  - [ ] Layout thrashing
  - [ ] Excessive re-renders

### 1.3 React Profiler
- [ ] Install React DevTools extension.
- [ ] Profile component renders.
- [ ] Identify wasted renders (components re-rendering without prop changes).

### 1.4 Three.js Analysis
- [ ] Add performance logging:
  ```javascript
  useFrame(({ gl }) => {
    console.log('Draw calls:', gl.info.render.calls);
  });
  ```
- [ ] Check for:
  - [ ] Draw calls > 100 (problematic)
  - [ ] Triangles > 100k (heavy)
  - [ ] Textures > 50MB (memory hog)

---

## Phase 2: Asset Optimization

### 2.1 Texture Optimization
- [ ] Convert images to `.webp` format.
- [ ] For 3D textures → Use `.ktx2` (GPU-compressed).
- [ ] Resize textures to power-of-2 dimensions.
- [ ] Target maximum 2048x2048 for hero images.

### 2.2 3D Model Optimization
- [ ] Draco compress `.glb` models:
  ```bash
  npx gltf-pipeline -i model.glb -o model-draco.glb -d
  ```
- [ ] Reduce polygon count if > 50k triangles.
- [ ] Merge meshes where possible.

### 2.3 Font Optimization
- [ ] Use `woff2` format only.
- [ ] Subset fonts to used characters.
- [ ] Consider variable fonts.

---

## Phase 3: Code Optimization

### 3.1 Lazy Loading
- [ ] Wrap heavy components:
  ```javascript
  const HeavyComponent = lazy(() => import('./HeavyComponent'));

  // Usage
  <Suspense fallback={<Loader />}>
    <HeavyComponent />
  </Suspense>
  ```

### 3.2 Memoization
- [ ] Memoize expensive computations:
  ```javascript
  const expensiveValue = useMemo(() => compute(data), [data]);
  ```
- [ ] Memoize callbacks passed to children:
  ```javascript
  const handleClick = useCallback(() => action(), []);
  ```
- [ ] Use `React.memo` for pure components.

### 3.3 Animation Optimization
- [ ] Follow `motion_guide` performance rules:
  - Animate only `transform` and `opacity`.
  - Avoid animating `layout` properties.
- [ ] Add `will-change` for heavy elements:
  ```css
  .heavy-element { will-change: transform; }
  ```

### 3.4 R3F Optimization
- [ ] Use proper DPR settings:
  ```jsx
  <Canvas dpr={[1, 1.5]} />
  ```
- [ ] Implement level-of-detail (LOD) for complex scenes.
- [ ] Use `useFrame` with `delta` for frame-independent animation.
- [ ] Disable expensive effects on mobile.

---

## Phase 4: Code Splitting

### 4.1 Route-Based Splitting
- [ ] Lazy load route components:
  ```javascript
  const AboutPage = lazy(() => import('./pages/About'));
  ```

### 4.2 Component-Based Splitting
- [ ] Identify heavy dependencies:
  - 3D components using Three.js
  - Components with heavy animations
  - Components with large data visualizations
- [ ] Wrap with lazy loading.

---

## Phase 5: Verification

### 5.1 Build Check
// turbo
- [ ] Re-run build:
  ```bash
  npm run build
  ```
- [ ] Compare chunk sizes to before optimization.

### 5.2 Runtime Check
- [ ] Record new FPS graph.
- [ ] Compare to Phase 1 baseline.
- [ ] **Target**: All metrics meet targets in table above.

### 5.3 Visual Fidelity Check
- [ ] **Constraint**: No visual degradation allowed.
- [ ] Verify:
  - [ ] No texture quality loss visible.
  - [ ] No animation popping.
  - [ ] No layout shifts during lazy load.

---

## Phase 6: Documentation

### 6.1 Record Improvements
- [ ] Document before/after metrics.
- [ ] Note optimizations applied.

### 6.2 Commit
- [ ] Commit with perf prefix:
  ```bash
  git commit -m "perf: reduce bundle size by X% and improve LCP"
  ```

---

## Quick Wins Reference

| Issue | Quick Fix |
|-------|-----------|
| Large bundle | Code split with `lazy()` |
| Slow initial load | Add loading skeleton |
| Jank during scroll | Use `transform` instead of `top` |
| High memory | Dispose unused textures |
| Many re-renders | Add `memo()` and `useMemo()` |
| Slow 3D | Lower DPR, reduce geometry |

---
description: Focused on 60FPS targets, bundle size reduction, and asset optimization.
---

# Optimization Pass Workflow

Use this when performance drops below 60fps or bundle size exceeds limits.

1.  **Diagnosis**
    *   [ ] Run `build_verify` to see chunk sizes.
    *   [ ] Use React DevTools Profiler to find wasted renders.
    *   [ ] Use Three.js Inspector (or `gl={{ powerPreference: "high-performance" }}`) to check draw calls.

2.  **Asset Optimization**
    *   [ ] Compress textures (Use `.webp` or `.ktx2`).
    *   [ ] Draco compress `.glb` models (`gltf-pipeline`).
    *   [ ] Lazy load heavy assets with `React.lazy` and `<Suspense>`.

3.  **Code Splitting**
    *   [ ] Identify heavy functional components.
    *   [ ] Wrap routes in `lazy()`.

4.  **Verification**
    *   [ ] Re-run `build_verify`.
    *   [ ] Record FPS graph in Chrome DevTools.
    *   [ ] **Constraint**: Must maintain visual fidelity (no popping).

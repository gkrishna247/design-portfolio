---
description: Pure aesthetic refinement loop for colors, timings, and animation curves without functional changes.
---

# Design Iteration Workflow

Use this for "Wow Factor" tuning and visual polish. **NO LOGIC CHANGES ALLOWED.**

---

## Gate: What Can Be Changed?

| ✅ ALLOWED | ❌ NOT ALLOWED |
|------------|----------------|
| CSS Variables (colors, spacing) | Component logic (useEffect, useState) |
| Animation timing/easing | Event handlers |
| Spring configurations | Data flow |
| Rotation speeds in useFrame | API calls |
| Gradients and shadows | Conditional rendering |

---

## Phase 1: Define Target

### 1.1 Scope the Change
- [ ] Clearly state the goal:
  - Example: "Make the cursor trail smoother"
  - Example: "Make the neon glow brighter"
  - Example: "Adjust parallax speed for hero section"

### 1.2 Identify Files to Modify
- [ ] CSS files only: `*.css`
- [ ] Animation values only in `*.jsx` (spring configs, rotation math)

---

## Phase 2: Tuning Loop

### 2.1 CSS Variable Adjustments
- [ ] Locate variables in `src/index.css` or component CSS.
- [ ] Common tuning targets:
  ```css
  --glow-intensity: 0.8;      /* Increase for brighter neon */
  --animation-speed: 0.3s;    /* Decrease for snappier feel */
  --parallax-factor: 0.15;    /* Adjust depth effect */
  ```

### 2.2 Framer Motion Spring Tuning
- [ ] Reference `motion_guide` skill for standard values.
- [ ] Tuning parameters:
  | Parameter | Effect |
  |-----------|--------|
  | `stiffness` ↑ | Faster, snappier |
  | `damping` ↑ | Less oscillation |
  | `mass` ↓ | Lighter, quicker response |

### 2.3 R3F useFrame Adjustments
- [ ] For rotation/movement speeds:
  ```javascript
  useFrame((state, delta) => {
    mesh.rotation.y += delta * 0.5; // Adjust multiplier
  });
  ```
- [ ] For oscillation effects:
  ```javascript
  const t = state.clock.elapsedTime;
  mesh.position.y = Math.sin(t * 0.5) * 0.2; // Adjust frequency & amplitude
  ```

---

## Phase 3: Self-Critique

### 3.1 Design Critique Check
- [ ] Read `design_critique` skill:
  ```
  view_file .agent/skills/design_critique/SKILL.md
  ```
- [ ] Ask yourself:
  - [ ] Does it feel more premium now?
  - [ ] Does the timing feel natural?
  - [ ] Is there enough visual feedback?

### 3.2 A/B Comparison
- [ ] Take mental note of "before" state.
- [ ] Compare after changes.
- [ ] If unsure → revert and try different values.

---

## Phase 4: Verification

### 4.1 Layout Check
- [ ] Verify no layout shifts or breaks.
- [ ] Check at all breakpoints (375px, 768px, 1440px).

### 4.2 Performance Check
// turbo
- [ ] Verify FPS maintained:
  ```bash
  npm run dev
  ```
- [ ] Open Chrome DevTools → Performance tab → Record interaction.
- [ ] **Target**: Maintain 60fps (no drops below 55fps).

### 4.3 Motion Guide Compliance
- [ ] Verify changes follow `motion_guide` rules:
  - [ ] Only animating `transform` and `opacity`.
  - [ ] No layout-triggering properties (`top`, `left`, `width`, `height`).

---

## Phase 5: Commit

### 5.1 Descriptive Commit
- [ ] Use appropriate prefix:
  ```bash
  git commit -m "style: enhance neon glow intensity and cursor smoothness"
  ```
  or
  ```bash
  git commit -m "perf: optimize parallax animation for smoother 60fps"
  ```

---

## Quick Reference: Common Tweaks

| Goal | File | Property |
|------|------|----------|
| Brighter glow | CSS | `box-shadow` alpha, `filter: brightness()` |
| Smoother cursor | JSX | `SPRING_MAGNETIC.damping` ↑ |
| Faster transitions | CSS | `--transition-duration` ↓ |
| Deeper parallax | JSX | Scroll multiplier ↑ |
| Subtler hover | JSX | `whileHover.scale` closer to 1.0 |

---

## ✅ Done When
- Visual change achieves the intended aesthetic improvement
- No functional behavior has changed
- `npm run build` passes without errors

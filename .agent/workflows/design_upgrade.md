---
description: Autonomous design analysis and upgrade workflow for improving graphics and animations without user input.
---

# Autonomous Design Upgrade Workflow

Use this for **agent-driven** design improvements. The agent analyzes the current design, identifies areas for enhancement, and implements upgrades automatically.

---

## Gate: Scope of Autonomous Changes

| ✅ ALLOWED | ❌ NOT ALLOWED |
|------------|----------------|
| Enhanced gradients & color vibrancy | Breaking existing functionality |
| More dynamic animations | Removing user-requested features |
| Improved hover/interaction effects | Changing core layout structure |
| Smoother motion curves | Altering navigation patterns |
| Richer visual depth & layering | Modifying API or data logic |
| Micro-interaction additions | Changing content/text |
| Glow/shadow enhancements | Introducing external dependencies |

---

## Phase 0: Git Branch Creation (REQUIRED FIRST STEP)

### 0.1 Create Feature Branch
// turbo
- [ ] Create a dedicated upgrade branch:
  ```bash
  git checkout -b upgrade/design-enhancements
  ```

### 0.2 Verify Clean State
// turbo
- [ ] Ensure working directory is clean:
  ```bash
  git status
  ```
- [ ] If uncommitted changes exist, stash them:
  ```bash
  git stash
  ```

---

## Phase 1: Design Analysis

### 1.1 Read Design System Skills
- [ ] Load the design critique skill:
  ```
  view_file .agent/skills/design_critique/SKILL.md
  ```
- [ ] Load the motion guide skill:
  ```
  view_file .agent/skills/motion_guide/SKILL.md
  ```

### 1.2 Audit Current Design
- [ ] Identify all component CSS files:
  ```
  find_by_name src --pattern "*.css"
  ```
- [ ] Identify all animation-related JSX:
  ```
  grep_search "motion\." --includes "*.jsx"
  grep_search "useFrame" --includes "*.jsx"
  grep_search "spring" --includes "*.jsx"
  ```

### 1.3 Generate Improvement Candidates
For each component, evaluate:
- [ ] **Color Vibrancy**: Are gradients rich enough? Are neon effects impactful?
- [ ] **Animation Smoothness**: Are springs properly configured? Is motion fluid?
- [ ] **Hover States**: Does every interactive element have a compelling hover effect?
- [ ] **Visual Depth**: Is there enough layering, shadows, and glassmorphism?
- [ ] **Micro-interactions**: Are there subtle animations on state changes?

---

## Phase 2: Prioritize Enhancements

### 2.1 Impact Matrix
Rank improvements by impact:

| Priority | Type | Example |
|----------|------|---------|
| 🔴 HIGH | Missing core interaction | No hover effect on buttons |
| 🟡 MEDIUM | Weak visual presence | Glow too subtle |
| 🟢 LOW | Polish detail | Slightly faster transition |

### 2.2 Create Enhancement List
Document planned changes:
- [ ] List all enhancements with file targets.
- [ ] Estimate effort (S/M/L) for each.
- [ ] Focus on HIGH and MEDIUM priority items.

---

## Phase 3: Implement Enhancements

### 3.1 CSS Variable Upgrades
Common enhancements to apply:

```css
/* Enhanced Glow Effects */
--glow-primary: 0 0 30px rgba(168, 85, 247, 0.6),
                0 0 60px rgba(168, 85, 247, 0.3),
                0 0 100px rgba(168, 85, 247, 0.1);

/* Richer Gradients */
--gradient-premium: linear-gradient(
  135deg,
  rgba(168, 85, 247, 0.15) 0%,
  rgba(34, 211, 238, 0.1) 50%,
  rgba(168, 85, 247, 0.15) 100%
);

/* Enhanced Shadows */
--shadow-elevated: 0 10px 40px rgba(0, 0, 0, 0.5),
                   0 0 80px rgba(168, 85, 247, 0.2);
```

### 3.2 Animation Upgrades
Apply motion guide standards:

```javascript
// Upgrade static elements to animated
const enhancedSpring = {
  type: "spring",
  stiffness: 200,
  damping: 20,
  mass: 0.8
};

// Add micro-interactions
whileHover={{
  scale: 1.05,
  boxShadow: "0 0 40px rgba(168, 85, 247, 0.5)"
}}
```

### 3.3 Visual Depth Additions
- [ ] Add layered backgrounds with subtle animations.
- [ ] Implement glassmorphism overlays where appropriate.
- [ ] Add floating particles or orbs for ambient motion.

### 3.4 Hover & Interaction Enhancements
- [ ] Ensure all buttons have 3D lift effect.
- [ ] Add magnetic pull to key interactive elements.
- [ ] Implement color shift on hover for accents.

---

## Phase 4: Quality Verification

### 4.1 Motion Guide Compliance
- [ ] Verify only `transform` and `opacity` are animated.
- [ ] Check spring configurations match standards.
- [ ] Ensure no layout-triggering animations.

### 4.2 Performance Check
// turbo
- [ ] Run dev server and verify FPS:
  ```bash
  npm run dev
  ```
- [ ] **Target**: 60fps stable, no drops below 55fps.

### 4.3 Build Verification
// turbo
- [ ] Ensure build succeeds:
  ```bash
  npm run build
  ```
- [ ] Check for size warnings or errors.

### 4.4 Visual Regression Check
- [ ] Use browser_subagent to capture screenshots.
- [ ] Compare key views at breakpoints (375px, 768px, 1440px).
- [ ] Verify no layout breaks or visual glitches.

---

## Phase 5: Self-Critique

### 5.1 Apply Design Critique Checklist
For each enhanced component:
- [ ] **Wow Factor**: Does it entrance or just exist?
- [ ] **Smoothness**: Are animations buttery smooth?
- [ ] **Cohesion**: Does it match the Neural Flux aesthetic?

### 5.2 Before/After Comparison
- [ ] Document what changed and why.
- [ ] Ensure improvements are clearly visible.
- [ ] If enhancement is underwhelming → iterate with stronger values.

---

## Phase 6: Commit & Document

### 6.1 Stage Changes
// turbo
- [ ] Stage all enhanced files:
  ```bash
  git add .
  ```

### 6.2 Commit with Descriptive Message
- [ ] Use semantic commit format:
  ```bash
  git commit -m "style(design): autonomous enhancement pass - improved gradients, animations, and micro-interactions"
  ```

### 6.3 Document Changes
- [ ] Update relevant documentation if needed.
- [ ] List all enhancements applied in commit body.

---

## Phase 7: Merge (Optional)

### 7.1 Merge to Main (if approved)
- [ ] Switch to main:
  ```bash
  git checkout main
  ```
- [ ] Pull latest:
  ```bash
  git pull origin main
  ```
- [ ] Merge upgrade branch:
  ```bash
  git merge upgrade/design-enhancements
  ```

### 7.2 Cleanup
- [ ] Delete upgrade branch:
  ```bash
  git branch -d upgrade/design-enhancements
  ```

---

## Quick Reference: Common Upgrade Patterns

| Goal | Target | Enhancement |
|------|--------|-------------|
| Brighter neon | CSS | Increase glow alpha & spread |
| Smoother motion | JSX | Lower spring stiffness, increase damping |
| Richer depth | CSS | Add multi-layer shadows |
| More interaction | JSX | Add `whileHover`, `whileTap` variants |
| Ambient movement | JSX | Add subtle `useFrame` oscillations |
| Premium feel | CSS | Add glassmorphism overlays |

---

## Autonomous Enhancement Targets

When running autonomously, focus on these high-impact areas:

1. **Hero Section**: Maximum visual impact, parallax, floating elements.
2. **Navigation**: Smooth transitions, magnetic effects.
3. **Buttons/CTAs**: 3D effects, glow enhancements.
4. **Cards/Containers**: Glassmorphism, hover lifts.
5. **Cursor**: Trail effects, magnetic interactions.
6. **3D Elements**: Improved lighting, rotation animations.

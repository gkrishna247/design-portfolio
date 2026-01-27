---
description: Complete workflow for implementing new UI features with design review, testing, and deployment.
---

# Feature Development Workflow

Use this workflow for ANY new visual component, section, or interactive element.

---

## Phase 1: Concept & Planning

### 1.1 Define Feature Scope
- [ ] Describe the feature clearly (e.g., "Hero section with parallax orbs").
- [ ] Identify target location in codebase (`src/components/`, `src/sections/`).
- [ ] **Constraint**: Must align with "Neural Flux" aesthetic (surreal, magnetic, deconstructed).

### 1.2 Design Review
- [ ] Read the design critique skill:
  ```
  view_file .agent/skills/design_critique/SKILL.md
  ```
- [ ] Self-critique the concept using the skill's criteria.
- [ ] **Gate**: If it fails the "Wow Factor" check → RETHINK before proceeding.

### 1.3 Technical Planning
- [ ] For 3D elements → Read `r3f_component_gen` skill first.
- [ ] For animations → Consult `motion_guide` for spring constants.
- [ ] For complex features → Create `implementation_plan.md` artifact.

---

## Phase 2: Implementation

### 2.1 Setup Development Environment
// turbo
- [ ] Start dev server:
  ```bash
  npm run dev
  ```

### 2.2 Create Component Structure
- [ ] Create component folder: `src/components/[FeatureName]/`
- [ ] Create files:
  - `[FeatureName].jsx` - Main component
  - `[FeatureName].css` - Styles (CSS Modules)
  - `index.js` - Export barrel

### 2.3 Implementation Guidelines
- [ ] Use Framer Motion for entrance/exit animations.
  ```javascript
  import { motion } from 'framer-motion';
  // Use SPRING_HEAVY from motion_guide for structural elements
  ```
- [ ] Implement interactive cursors with `data-cursor-text` attributes.
- [ ] Use `state_manager` principles (no useState in loops, proper memoization).
- [ ] For scrolling elements → Integrate with Lenis.
- [ ] For 3D elements → Use R3F with `dpr={[1, 1.5]}`.

### 2.4 Accessibility
- [ ] Add proper ARIA labels and roles.
- [ ] Ensure keyboard navigation works.
- [ ] Test color contrast (WCAG AA minimum).

---

## Phase 3: Quality Assurance

### 3.1 Code Quality
// turbo
- [ ] Run linter:
  ```bash
  npm run lint
  ```
- [ ] Fix all warnings and errors.

### 3.2 Performance Verification
// turbo
- [ ] Build and check bundle size:
  ```bash
  npm run build
  ```
- [ ] Check for:
  - [ ] No chunk > 500kB warning
  - [ ] Console clean of Three.js warnings
  - [ ] 60fps maintained (use Chrome DevTools Performance tab)

### 3.3 Motion Guide Compliance
- [ ] Verify animations use standard springs from `motion_guide`:
  - `SPRING_HEAVY` for modals/page transitions
  - `SPRING_LIGHT` for hover effects
  - `SPRING_MAGNETIC` for cursor/floating elements
- [ ] Confirm only `transform` and `opacity` are animated (no layout thrashing).

### 3.4 Visual Verification
- [ ] Check responsive design at breakpoints:
  - Mobile: 375px
  - Tablet: 768px
  - Desktop: 1440px
- [ ] Verify smooth scroll integration works.
- [ ] Test "Magnetic" feel on interactive elements.

---

## Phase 4: Finalization

### 4.1 Cleanup
- [ ] Remove all `console.log` statements.
- [ ] Remove unused imports and variables.
- [ ] Ensure CSS variables are used (not hardcoded colors).

### 4.2 Documentation
- [ ] Add JSDoc comments for complex functions.
- [ ] Update component's PropTypes if applicable.

### 4.3 Git Commit
- [ ] Stage changes:
  ```bash
  git add .
  ```
- [ ] Commit with conventional commit message:
  ```bash
  git commit -m "feat: add [FeatureName] component with [key interaction]"
  ```

---

## Rollback Protocol

If the feature breaks the build or causes visual regression:

1. Revert changes:
   ```bash
   git checkout -- .
   ```
2. Identify the breaking change.
3. Re-implement with fixes.
4. Re-run full QA cycle.

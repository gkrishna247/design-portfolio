---
description: Complete workflow for implementing new UI features with design review, testing, and deployment.
---

# Feature Development Workflow

Use this for ANY new visual component, section, or interactive element.

---

## Phase 1: Planning

### 1.1 Define Feature
- [ ] Describe the feature (e.g., "Hero section with parallax orbs").
- [ ] Identify target location: `src/components/[FeatureName]/`.
- [ ] **Gate**: Must align with "Neural Flux" aesthetic — read `design_critique` skill.

### 1.2 Technical Planning
- [ ] For 3D elements → read `r3f_component_gen` skill.
- [ ] For animations → consult `motion_guide` for spring configs.
- [ ] For complex features → create `implementation_plan.md` artifact.

---

## Phase 2: Implementation

### 2.1 Create Component Structure
// turbo
- [ ] Start dev server: `npm run dev`
- [ ] Create folder: `src/components/[FeatureName]/`
- [ ] Create files: `[FeatureName].jsx`, `[FeatureName].css`, `[FeatureName].test.jsx`

### 2.2 Coding Guidelines
Follow AGENTS.md Code Style section:
- [ ] Import order: React → third-party → internal → CSS.
- [ ] Use `export default function [Name]()` + wrap in `memo()`.
- [ ] Use CSS variables from `index.css` — never hardcode hex colors.
- [ ] Add `data-cursor` attribute on interactive elements.
- [ ] Use `state_manager` skill patterns (ref-based for high-frequency updates).

### 2.3 Animation
- [ ] Use `motion_guide` scroll-reveal pattern: `useInView` + conditional `animate`.
- [ ] Use springs: `{ stiffness: 100, damping: 30 }`.
- [ ] Add `whileHover={{ scale: 1.05 }}` on interactive elements.

### 2.4 Accessibility
- [ ] Add ARIA labels and roles.
- [ ] Ensure keyboard navigation works.

---

## Phase 3: Quality Assurance

// turbo
- [ ] Run `build_verify` skill: `npm run lint && npm run build`.
- [ ] Verify responsive at 375px, 768px, 1440px.
- [ ] FPS maintained ≥55fps.
- [ ] Console clean of errors/warnings.

---

## Phase 4: Commit

- [ ] Remove `console.log` statements and unused imports.
- [ ] Commit: `git commit -m "feat: add [FeatureName] with [key interaction]"`

### Rollback
If feature breaks the build: `git checkout -- .` → identify breaking change → re-implement.

---

## ✅ Done When
- Feature works as specified in the implementation plan
- `npm run lint && npm run build` passes
- Component includes `.test.jsx` file with passing tests

---
description: Workflow for implementing new UI features with design review.
---

# Feature Development Workflow

Use this workflow for ANY new visual component or section.

1.  **Concept & Design Check** (Manual)
    *   [ ] Does this match "Neural Flux" aesthetic?
    *   [ ] Run `design_critique` skill on the proposed concept.
    *   [ ] **Constraint**: If it lacks "Wow Factor", REJECT IT.

2.  **Implementation**
    *   [ ] Use `r3f_component_gen` skill for 3D elements.
    *   [ ] Use State Manager principles (no `useState` in loops).
    *   [ ] Implement interactive cursors (`data-cursor-text`).

3.  **Refinement Loop**
    *   [ ] Check animation smoothness (60fps).
    *   [ ] Verify "Magnetic" feel.
    *   [ ] Run `code_linter` skill (fix warnings).

4.  **Verification**
    *   [ ] Run `build_verify` skill (must pass build).
    *   [ ] Manual check: Resize window (Responsive?).
    *   [ ] Manual check: Smooth scroll functioning?

5.   **Final Polish**
    *   [ ] Remove console logs.
    *   [ ] Commit.

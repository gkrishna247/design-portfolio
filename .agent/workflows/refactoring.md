---
description: Structured approach to code cleanup and structural changes.
---

# Refactoring Workflow

Use this for code cleanup, performance tuning, or modularization.

1.  **Analysis Phase**
    *   [ ] Identify the "Smell" (e.g., Prop drilling, Duplicate shaders, Low FPS).
    *   [ ] Run `code_linter` to see existing debt.

2.  **Planning**
    *   [ ] create `implementation_plan.md` (Required for refactors > 50 lines).
    *   [ ] Define "before/after" metrics (e.g., Bundle size: 5MB -> 3MB).

3.  **Execution**
    *   [ ] Isolate changes to one component at a time.
    *   [ ] Use `state_manager` skill guidance to optimize hooks.
    *   [ ] Verify no functionality is lost.

4.  **Regression Testing**
    *   [ ] Run `build_verify` skill.
    *   [ ] Manual "Visual Click-through" of affecting areas.

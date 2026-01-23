---
description: Fast-track workflow for bug fixes and dependency updates.
---

# Maintenance Workflow

Use this for bugs, glitches, or minor tweaks.

1.  **Reproduction**
    *   [ ] Identify the exact steps to reproduce the bug.
    *   [ ] Create a minimal reproduction case if complex.

2.  **Fix Implementation**
    *   [ ] Apply the fix.
    *   [ ] **Constraint**: Minimal code changes preferred.
    *   [ ] **Constraint**: Do not introduce new libraries without approval.

3.  **Verification (The Safety Net)**
    *   [ ] Run `code_linter` skill.
    *   [ ] Run `build_verify` skill.
    *   [ ] **IMPORTANT**: Verify the fix didn't break 3D performance (check console for `Three.js` warnings).

4.  **Deployment**
    *   [ ] Commit with `fix: ` prefix.

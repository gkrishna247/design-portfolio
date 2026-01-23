---
description: Safe protocol for upgrading core libraries (React, Three.js).
---

# Dependency Update Workflow

Use this to keep the stack fresh without breaking the build.

1.  **Preparation**
    *   [ ] Run `npm outdated`.
    *   [ ] **Constraint**: Do not update `three` major versions without reading migration guides.
    *   [ ] Backup `package.json` and `package-lock.json`.

2.  **Update Execution**
    *   [ ] Update one library family at a time (e.g., just `react` deps, then `three` deps).
    *   [ ] Run `npm install`.

3.  **Regression Testing**
    *   [ ] Run `code_linter` (Updates often deprecate rules).
    *   [ ] Run `build_verify`.
    *   [ ] Manual Check: Are 3D interactions still working? (Events often change in R3F updates).

4.  **Lock & Commit**
    *   [ ] Commit `package-lock.json` changes.

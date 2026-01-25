---
description: Pure aesthetic refinement loop (colors, timings, curves) without functional changes.
---

# Design Iteration Workflow

Use this for "Wow Factor" tuning. NO LOGIC CHANGES ALLOWED.

1.  **Scope Definition**
    *   [ ] target: "Make the cursor trail smoother" or "Make the neon glow brighter".
    *   [ ] **Constraint**: Do not touch `useEffect` logic. Only CSS/Animation values.

2.  **Tuning Loop**
    *   [ ] Adjust CSS Variables (colors, spacing).
    *   [ ] Adjust Framer Motion `spring` configs (Reference `motion_guide` constants).
    *   [ ] Adjust R3F `useFrame` math (rotation speeds).

3.  **Critique (Self-Check)**
    *   [ ] Run `design_critique` skill.
    *   [ ] Does it look better?

4.  **Verification**
    *   [ ] Did you break the layout?
    *   [ ] Did you kill the FPS?

5.  **Commit**
    *   [ ] Prefix commit with `style: ` or `perf: `.

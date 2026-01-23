---
name: design_critique
description: Evaluate UI/UX against the "Neural Flux" design system and "Wow Factor" requirements.
---

# Design Critique Skill

Use this skill to validate every UI component before implementation.

## 🌌 The "Neural Flux" Aesthetic
- **Colors**: Deep Void Black (`#030014`), Neon Violet (`#a855f7`), Electric Cyan (`#22d3ee`).
- **Typography**: `Space Grotesk` (Headers), `JetBrains Mono` (Data/Code).
- **Layouts**: Asymmetrical, overlapping, "Deconstructed" grids.
- **Glassmorphism**: High blur, low opacity borders (`rgba(255,255,255,0.1)`).

## 🕵️ Evaluation Criteria

### 1. The "Wow Factor" Check
- [ ] Does this element do something when I hover over it?
- [ ] Does it entrance the user or just sit there?
- [ ] Is the animation curve "springy" (good) or linear (bad)?

### 2. Smoothness Check
- [ ] No layout shifts.
- [ ] Animations must run at 60fps.
- [ ] Use `transform: translate3d` instead of `top/left`.

### 3. Cohesion Check
- [ ] Are we introducing a new color? **STOP**. Use the existing palette.
- [ ] Are we using a new font? **STOP**. Use `Space Grotesk` or `JetBrains Mono`.

## 🔄 Critique Workflow
1.  **Observe**: Look at the proposed design/code.
2.  **Compare**: Check against the 3 criteria above.
3.  **Refine**: If it fails "Wow Factor", suggest a stronger interaction (e.g., "Add a magnetic pull effect").

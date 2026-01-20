---
description: Workflow for implementing new UI features with design review.
---

# New Feature Implementation Workflow

## 1. Concept Phase
- Describe the feature (e.g. "Navigation").
- **Constraint**: Must use a "Deconstructed" or "Surreal" approach.
- Consult `AGENTS.md` for current trends.

## 2. Design Review (Critical Step)
// turbo
- Use the `view_file` tool to read `.agent/skills/design_critique/SKILL.md`.
- Self-critique the concept using the skill's criteria.
- If it fails the "Wow Factor" check, RETHINK it.

## 3. Technical Implementation
- Create/Update components in `src/components/`.
- Use **Framer Motion** for entrance/exit.
- Use **Lenis** if scrolling is involved.
- Use **R3F** if 3D is needed.

## 4. Optimization
- Lazy load if heavy.
- Check accessibility (ARIA).

## 5. Verification
- Verify responsiveness.
- Verify 60fps performance.

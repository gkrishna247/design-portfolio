---
name: design_critique
description: Evaluate UI/UX against the "Neural Flux" design system and "Wow Factor" requirements.
---

# Design Critique Skill

Use this skill to validate every UI component before implementation.

## 🌌 The "Neural Flux" Design System

### Color Palette (CSS Variables from `index.css`)
| Variable | Value | Usage |
|----------|-------|-------|
| `--neon-violet` | `#a855f7` | Primary accent, glows, gradients |
| `--neon-cyan` | `#22d3ee` | Secondary accent, highlights |
| `--neon-blue` | `#3b82f6` | Links, interactive elements |
| `--neon-pink` | `#ec4899` | Tertiary accent |
| `--neon-green` | `#10b981` | Success states |
| `--color-void` | `#030308` | Background base |
| `--text-primary` | `#f0f0f5` | Main text |
| `--text-secondary` | `#9ca3af` | Subdued text |
| `--text-muted` | `#4b5563` | Dimmed labels |
| `--glass-bg` | `rgba(255,255,255,0.03)` | Glass card backgrounds |
| `--glass-border` | `rgba(255,255,255,0.08)` | Glass borders |

> ❌ **NEVER hardcode hex values** in JSX data arrays. Use CSS variables via `style={{ '--project-color': color }}` and reference in CSS as `var(--project-color)`.

### Typography
- **Headers**: `Space Grotesk` (`--font-primary`)
- **Code/Data**: `JetBrains Mono` (`--font-mono`)
- **Fluid scaling**: All sizes use `clamp()` — e.g., `--text-4xl: clamp(2rem, 5vw, 3.5rem)`

### Visual Effects
| Class | Effect |
|-------|--------|
| `.glass` | Glassmorphism: `backdrop-filter: blur(var(--blur-md))` + glass border |
| `.glass-strong` | Heavier glass: `blur(var(--blur-lg))` + stronger border |
| `.gradient-text` | Violet gradient on text via `background-clip: text` |
| `.gradient-text-aurora` | Multi-color aurora gradient text |
| `.mono` | Applies `--font-mono` for data/code feel |

### Layouts
- Asymmetrical, overlapping, "Deconstructed" grids.
- Sections use `min-height: 100vh` with responsive padding.

## 🕵️ Evaluation Criteria

### 1. The "Wow Factor" Check
- [ ] Does this element do something when I hover over it?
- [ ] Does it entrance the user or just sit there?
- [ ] Is the animation curve "springy" (see `motion_guide` for configs)?
- [ ] Does it use `data-cursor` for custom cursor interaction?

### 2. Smoothness Check
- [ ] No layout shifts.
- [ ] Animations run at ≥55fps.
- [ ] Uses `transform`/`opacity` only (no `top/left/width/height`).

### 3. Cohesion Check
- [ ] Are we introducing a new color? **STOP**. Use existing CSS variables.
- [ ] Are we using a new font? **STOP**. Use `--font-primary` or `--font-mono`.
- [ ] Do new components follow the section header pattern? (section-number → section-title → section-subtitle)

## 🔄 Critique Workflow
1. **Observe**: Look at the proposed design/code.
2. **Compare**: Check against the 3 criteria above and actual CSS variables.
3. **Refine**: If it fails "Wow Factor", suggest a stronger interaction (e.g., "Add glow on hover using `--neon-violet`").

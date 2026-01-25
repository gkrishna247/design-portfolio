---
name: motion_guide
description: Definitive source for "Neural Flux" motion standards, Framer Motion patterns, and performance rules.
---

# Motion Guide & Standards

Use this skill to ensure all animations align with the "Neural Flux" aesthetic: fluid, magnetic, and 60fps stable.

## 1. Standardized Constants

Copy these directly into your components to maintain consistency.

### Spring Configurations (Framer Motion)
```javascript
// For heavy/structural elements (Modals, Page Transitions)
const SPRING_HEAVY = {
  type: "spring",
  stiffness: 300,
  damping: 30,
  mass: 1
};

// For lightweight interactions (Hover effects, Micro-interactions)
const SPRING_LIGHT = {
  type: "spring",
  stiffness: 400,
  damping: 10,
  mass: 0.5
};

// For "Magnetic" feels (Cursor, Floating elements)
const SPRING_MAGNETIC = {
  type: "spring",
  stiffness: 150,
  damping: 15,
  mass: 0.1
};
```

### Easings (CSS / Lenis)
```javascript
// Sharp, modern feel
const EASE_EXPO = [0.19, 1, 0.22, 1]; 
```

## 2. Performance Rules (CRITICAL)

- **Transform-Only**: Animate `transform` and `opacity` ONLY.
  - ❌ Avoid: `top`, `left`, `width`, `height`, `margin` (Causes Layout Thrashing).
  - ✅ Use: `x`, `y`, `scale`.
- **Will-Change**: Use sparingly for complex elements.
  - `.heavy-element { will-change: transform; }`
- **R3F Optimization**:
  - Always use `dpr={[1, 1.5]}` on Canvas.
  - Disable heavy post-processing on mobile.

## 3. Interaction Patterns

### The "Magnetic" Effect
Elements should gently resist and then snap towards the cursor.
- **Trigger**: Mouse proximity (< 100px).
- **Behavior**: Element moves 20% of cursor distance (`x = cursorDelta * 0.2`).

### Parallax
- **Depth**: Background layers move at 10-20% speed of scroll.
- **Interpolation**: Always `lerp` scroll values (don't map 1:1).

## 4. Reusable Variants

```javascript
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: SPRING_HEAVY
  }
};

const staggerContainer = {
  visible: {
    transition: {
      staggerChildren: 0.1
    }
  }
};
```

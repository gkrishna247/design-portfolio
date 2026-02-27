---
name: motion_guide
description: Definitive source for "Neural Flux" motion standards, Framer Motion patterns, and performance rules.
---

# Motion Guide & Standards

Use this skill to ensure all animations align with the "Neural Flux" aesthetic: fluid, magnetic, and 60fps stable.

## 1. Standardized Spring Configs

These are the **actual values used in the codebase**. Copy these directly.

### Normal Mode (App.jsx, HeroPortal.jsx)
```javascript
const springConfig = { stiffness: 100, damping: 30, restDelta: 0.001 }
```

### Reduced Motion Mode (App.jsx — prefers-reduced-motion)
```javascript
const springConfig = { stiffness: 300, damping: 50, restDelta: 0.01 }
```

### CSS Easing (Lenis integration)
```javascript
// Lenis smooth scroll easing — initialized in App.jsx
const lenis = new Lenis({
  duration: prefersReducedMotion ? 0 : 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: !prefersReducedMotion,
})
```

## 2. Scroll-Reveal Pattern (useInView)

All 5 section components use this **exact** pattern for scroll-triggered animations:

```jsx
const containerRef = useRef(null)
const isInView = useInView(containerRef, { once: true, margin: "-100px" })

// Section header animation
<motion.div
  initial={{ opacity: 0, y: 50 }}
  animate={isInView ? { opacity: 1, y: 0 } : {}}
  transition={{ duration: 0.8 }}
>
```

- **Always** use `once: true` (animate only once as user scrolls down)
- **Always** use `margin: "-100px"` (trigger 100px before element enters viewport)
- **Never** use `whileInView` — use `animate={isInView ? ... : {}}` conditional pattern

## 3. AnimatePresence (Mount/Unmount)

Used in `App.jsx` and `OrbitalNavigation.jsx` for components that enter/exit:
```jsx
<AnimatePresence>
  {isExpanded && (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0 }}
    />
  )}
</AnimatePresence>
```

## 4. Performance Rules (CRITICAL)

- **Transform-Only**: Animate `transform` and `opacity` ONLY.
  - ❌ Avoid: `top`, `left`, `width`, `height`, `margin` (Layout Thrashing).
  - ✅ Use: `x`, `y`, `scale`, `rotate`, `opacity`.
- **Will-Change**: Use sparingly. Only `.cursor-arrow` uses `will-change: transform`.
- **R3F Canvas**: Always use `dpr={[1, 1.5]}`. Disable heavy post-processing on mobile.
- **No Framer Motion in R3F**: Use `useFrame` with direct property mutation for 3D objects. Framer Motion is for DOM/CSS animations only.

## 5. Interaction Patterns

### Hover/Tap (All interactive elements)
```jsx
whileHover={{ scale: 1.05 }}
whileTap={{ scale: 0.95 }}
```

### Staggered Entry (Cards, lists)
```jsx
transition={{ duration: 0.5, delay: index * 0.1 }}
```

### Parallax (HeroPortal)
```jsx
const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end start"] })
const titleY = useTransform(scrollYProgress, [0, 1], [0, 200])
const titleYSpring = useSpring(titleY, springConfig)
```

### The "Magnetic" Cursor Effect
Elements use `data-cursor` attribute. `MagneticCursor` reads via event delegation. Element moves 20% of cursor distance.

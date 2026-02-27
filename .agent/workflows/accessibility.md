---
description: Accessibility audit and compliance workflow for WCAG standards.
---

# Accessibility Audit Workflow

Use this to ensure the portfolio meets accessibility standards.

---

## Compliance Targets

| Level | Standard | Target |
|-------|----------|--------|
| 🟢 Minimum | WCAG 2.1 AA | All pages |
| 🟡 Recommended | WCAG 2.1 AAA | Key interactions |
| 🔵 Premium | Reduced motion support | Animations |

---

## Phase 1: Automated Audit

// turbo
### 1.1 Run Lighthouse
- [ ] Chrome DevTools → Lighthouse tab → run accessibility audit.
- [ ] Target: score > 90.

// turbo
### 1.2 Check aXe DevTools
- [ ] Install aXe browser extension → run full page scan.
- [ ] Address all critical issues.

---

## Phase 2: Manual Checks

### 2.1 Keyboard Navigation
- [ ] Tab through entire page — verify focus visible, logical order, no traps.
- [ ] Escape closes orbital nav menu.

### 2.2 Screen Reader
- [ ] Test with NVDA (Windows) or VoiceOver (Mac).
- [ ] Verify: content announced, images have alt text, buttons labeled, landmarks defined.

### 2.3 Color Contrast
- [ ] Normal text: 4.5:1 ratio minimum.
- [ ] Large text and UI components: 3:1 ratio minimum.

---

## Phase 3: Motion Accessibility

### 3.1 Reduced Motion
This project already implements `prefers-reduced-motion` in CSS (`index.css`, `App.css`) and JS (`App.jsx` adjusts Lenis and spring configs). Verify:
- [ ] CSS animations disabled/shortened when reduced motion is preferred.
- [ ] Framer Motion springs use faster settling config: `{ stiffness: 300, damping: 50 }`.
- [ ] Lenis uses `duration: 0` and `smoothWheel: false`.
- [ ] Particle effects reduced or disabled.

---

## Phase 4: ARIA & Focus

### 4.1 Landmarks
```html
<header role="banner"> <nav role="navigation"> <main role="main"> <footer role="contentinfo">
```

### 4.2 Interactive Elements
```jsx
<button aria-label="Close menu" aria-expanded={isOpen}>
```

### 4.3 Skip Link
Already implemented: `<a href="#main-content">` in `App.jsx`. Verify it works.

### 4.4 Focus Styles
```css
:focus-visible { outline: 2px solid var(--color-primary); outline-offset: 2px; }
```

---

## Quick Checklist

| Category | Check |
|----------|-------|
| **Perceivable** | Alt text ☐ · Contrast ☐ · Resizable text ☐ |
| **Operable** | Keyboard ☐ · No traps ☐ · Skip link ☐ · Focus visible ☐ |
| **Understandable** | Language declared ☐ · Consistent nav ☐ |
| **Robust** | Valid HTML ☐ · ARIA correct ☐ · Assistive tech ☐ |

---

## Common Fixes

| Issue | Solution |
|-------|----------|
| Missing alt text | Add descriptive `alt` attribute |
| Low contrast | Use CSS variables with sufficient contrast |
| No focus style | Add `:focus-visible` CSS |
| Keyboard trap | Add Escape handling |
| Motion sickness | Check `prefers-reduced-motion` in JS and CSS |

---

## ✅ Done When
- Lighthouse accessibility score ≥ 90
- All keyboard navigation works without traps
- Reduced motion support verified in CSS and JS

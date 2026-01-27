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

### 1.1 Run Lighthouse
- [ ] In Chrome DevTools → Lighthouse tab.
- [ ] Run accessibility audit.
- [ ] Note score (target: > 90).

### 1.2 Check aXe DevTools
- [ ] Install aXe browser extension.
- [ ] Run full page scan.
- [ ] Address all critical issues.

---

## Phase 2: Manual Checks

### 2.1 Keyboard Navigation
- [ ] Tab through entire page.
- [ ] Verify:
  - [ ] Focus visible on all interactive elements.
  - [ ] Logical tab order.
  - [ ] No keyboard traps.
  - [ ] Escape closes modals.

### 2.2 Screen Reader
- [ ] Test with NVDA (Windows) or VoiceOver (Mac).
- [ ] Verify:
  - [ ] All content announced.
  - [ ] Images have alt text.
  - [ ] Buttons have labels.
  - [ ] Landmarks defined.

### 2.3 Color Contrast
- [ ] Use contrast checker tool.
- [ ] Verify:
  - [ ] Normal text: 4.5:1 ratio minimum.
  - [ ] Large text: 3:1 ratio minimum.
  - [ ] UI components: 3:1 ratio minimum.

---

## Phase 3: Motion Accessibility

### 3.1 Reduced Motion Support
- [ ] Add CSS for reduced motion preference:
  ```css
  @media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
      animation-duration: 0.01ms !important;
      transition-duration: 0.01ms !important;
    }
  }
  ```

### 3.2 Framer Motion Integration
- [ ] Use `useReducedMotion` hook:
  ```javascript
  import { useReducedMotion } from 'framer-motion';

  const prefersReducedMotion = useReducedMotion();
  
  const variants = prefersReducedMotion ? {} : animatedVariants;
  ```

### 3.3 3D Scene Fallback
- [ ] For users with motion sensitivity:
  - Reduce or disable particle effects.
  - Slow down rotation speeds.
  - Provide static fallback.

---

## Phase 4: ARIA Implementation

### 4.1 Landmarks
- [ ] Define page regions:
  ```html
  <header role="banner">
  <nav role="navigation">
  <main role="main">
  <footer role="contentinfo">
  ```

### 4.2 Interactive Elements
- [ ] Buttons and links:
  ```jsx
  <button aria-label="Close menu" aria-expanded={isOpen}>
  ```

### 4.3 Live Regions
- [ ] For dynamic content:
  ```jsx
  <div aria-live="polite" aria-atomic="true">
    {statusMessage}
  </div>
  ```

---

## Phase 5: Focus Management

### 5.1 Skip Links
- [ ] Add skip to main content:
  ```html
  <a href="#main" class="skip-link">Skip to main content</a>
  ```
  ```css
  .skip-link {
    position: absolute;
    left: -9999px;
  }
  .skip-link:focus {
    left: 10px;
    top: 10px;
  }
  ```

### 5.2 Focus Styles
- [ ] Visible focus indicators:
  ```css
  :focus-visible {
    outline: 2px solid var(--color-primary);
    outline-offset: 2px;
  }
  ```

### 5.3 Modal Focus Trap
- [ ] When modal opens:
  - Focus moves to modal.
  - Tab cycles within modal.
  - Escape closes modal.
  - Focus returns to trigger on close.

---

## Accessibility Checklist

| Category | Check | Status |
|----------|-------|--------|
| **Perceivable** | | |
| | Alt text on images | ☐ |
| | Color contrast passes | ☐ |
| | Text resizable to 200% | ☐ |
| **Operable** | | |
| | Keyboard accessible | ☐ |
| | No keyboard traps | ☐ |
| | Skip link present | ☐ |
| | Focus visible | ☐ |
| **Understandable** | | |
| | Language declared | ☐ |
| | Error messages clear | ☐ |
| | Consistent navigation | ☐ |
| **Robust** | | |
| | Valid HTML | ☐ |
| | ARIA used correctly | ☐ |
| | Works with assistive tech | ☐ |

---

## Common Fixes

| Issue | Solution |
|-------|----------|
| Missing alt text | Add descriptive alt attribute |
| Low contrast | Increase color difference |
| No focus style | Add `:focus-visible` CSS |
| Keyboard trap | Add escape handling |
| Missing labels | Add aria-label or visible label |
| Motion sickness | Implement prefers-reduced-motion |

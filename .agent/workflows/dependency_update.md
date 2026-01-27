---
description: Safe protocol for upgrading core libraries (React, Three.js, Framer Motion).
---

# Dependency Update Workflow

Use this to keep the stack fresh without breaking the build.

---

## Risk Assessment

| Package Family | Risk Level | Notes |
|----------------|------------|-------|
| `react`, `react-dom` | 🟠 High | May affect all components |
| `three`, `@react-three/*` | 🔴 Critical | API changes common, verify 3D |
| `framer-motion` | 🟠 High | Animation API changes |
| `lenis` | 🟡 Medium | Scroll behavior changes |
| `vite`, `eslint` | 🟢 Low | Build tooling, usually safe |

---

## Phase 1: Preparation

### 1.1 Audit Current State
// turbo
- [ ] Check outdated packages:
  ```bash
  npm outdated
  ```

### 1.2 Backup
- [ ] Create backup branch:
  ```bash
  git checkout -b backup/pre-update
  git checkout -
  ```

### 1.3 Read Changelogs
- [ ] For major version updates → Read migration guides:
  - [React Changelog](https://github.com/facebook/react/blob/main/CHANGELOG.md)
  - [Three.js Releases](https://github.com/mrdoob/three.js/releases)
  - [R3F Changelog](https://github.com/pmndrs/react-three-fiber/releases)
  - [Framer Motion](https://www.framer.com/motion/guide-upgrade/)

### 1.4 Plan Update Order
- [ ] **Rule**: Update one library family at a time.
- [ ] Recommended order:
  1. Build tools (`vite`, `eslint`)
  2. UI libs (`framer-motion`, `lenis`)
  3. React (`react`, `react-dom`)
  4. 3D stack (`three`, `@react-three/*`) — LAST

---

## Phase 2: Update Execution

### 2.1 Update Build Tools First
// turbo
- [ ] Update and verify:
  ```bash
  npm update vite eslint
  npm run lint
  npm run build
  ```

### 2.2 Update UI Libraries
- [ ] Update Framer Motion:
  ```bash
  npm update framer-motion
  ```
- [ ] Verify animations work.

### 2.3 Update React (if needed)
- [ ] Update React:
  ```bash
  npm update react react-dom
  ```
- [ ] Verify HMR works.

### 2.4 Update 3D Stack (CAREFUL)
- [ ] **Constraint**: Do NOT update `three` major versions without reading migration guide.
- [ ] Update packages:
  ```bash
  npm update three @react-three/fiber @react-three/drei
  ```
- [ ] Immediately test all 3D interactions.

---

## Phase 3: Regression Testing

### 3.1 Linting
// turbo
- [ ] Run linter (updates often deprecate rules):
  ```bash
  npm run lint
  ```

### 3.2 Build Verification
// turbo
- [ ] Verify production build:
  ```bash
  npm run build
  ```

### 3.3 Manual Verification Checklist
- [ ] 3D scene loads correctly.
- [ ] All animations play smoothly.
- [ ] Smooth scroll works.
- [ ] Hover interactions functional.
- [ ] No console errors or warnings.
- [ ] Performance maintained (60fps).

### 3.4 R3F-Specific Checks
- [ ] Canvas renders without errors.
- [ ] Pointer events work (onClick, onPointerOver).
- [ ] Drei helpers function (`useGLTF`, `Environment`, etc.).
- [ ] Shaders compile without warnings.

---

## Phase 4: Lock & Commit

### 4.1 Lock Dependencies
- [ ] Verify `package-lock.json` is updated.

### 4.2 Commit
- [ ] Commit with clear message:
  ```bash
  git add package.json package-lock.json
  git commit -m "chore(deps): update [package-family] to v[version]"
  ```

### 4.3 Cleanup
- [ ] Delete backup branch if successful:
  ```bash
  git branch -d backup/pre-update
  ```

---

## Rollback Protocol

If update breaks the build:

1. **Immediate rollback**:
   ```bash
   git checkout backup/pre-update -- package.json package-lock.json
   npm install
   ```

2. **Investigate** what broke.

3. **Options**:
   - Pin to previous working version.
   - Wait for patch release.
   - Open issue on library repo.

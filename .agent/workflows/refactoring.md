---
description: Structured approach to code cleanup, modularization, and architectural improvements.
---

# Refactoring Workflow

Use this for code cleanup, modularization, or significant structural changes.

---

## Refactor Types

| Type | Examples | Risk |
|------|----------|------|
| **Extract** | Extract component, extract hook | 🟢 Low |
| **Rename** | Rename file, rename function | 🟢 Low |
| **Move** | Move to different folder | 🟡 Medium |
| **Consolidate** | Merge duplicate code | 🟡 Medium |
| **Restructure** | Change component hierarchy | 🔴 High |
| **Migrate** | Change library or pattern | 🔴 High |

---

## Phase 1: Analysis

### 1.1 Identify the "Smell"
- [ ] Document what needs improvement:
  - Prop drilling (too many props passed down)
  - Duplicate code (same logic in multiple places)
  - Large files (> 300 lines)
  - Tangled logic (mixing concerns)
  - Performance issues (unnecessary re-renders)

### 1.2 Assess Current State
// turbo
- [ ] Run linter to see existing debt:
  ```bash
  npm run lint
  ```
- [ ] Note current metrics (file sizes, bundle size).

### 1.3 Define Success Criteria
- [ ] Before/after metrics (e.g., "Bundle: 5MB → 3MB").
- [ ] Specific improvements expected.

---

## Phase 2: Planning

### 2.1 Create Implementation Plan
- [ ] For refactors > 50 lines changed → Create `implementation_plan.md`:
  ```markdown
  # Refactor: [Name]

  ## Goal
  [What we're achieving]

  ## Changes
  1. [Step 1]
  2. [Step 2]
  ...

  ## Risks
  - [Risk and mitigation]

  ## Rollback
  [How to undo if needed]
  ```

### 2.2 Identify Dependencies
- [ ] List all files that will be affected.
- [ ] Identify potential breaking changes.
- [ ] Plan order of changes.

### 2.3 Create Safety Net
- [ ] Create backup branch:
  ```bash
  git checkout -b refactor/[name]
  ```

---

## Phase 3: Execution

### 3.1 Extraction Refactors
For extracting components or hooks:

- [ ] Create new file with extracted code.
- [ ] Add exports.
- [ ] Update imports in original file.
- [ ] Verify functionality.

### 3.2 Rename Refactors
For renaming files or functions:

- [ ] Rename file/function.
- [ ] Update all imports/usages.
- [ ] Search codebase for old name.

### 3.3 Move Refactors
For moving files:

- [ ] Create new location.
- [ ] Move file.
- [ ] Update all import paths.
- [ ] Update barrel exports (`index.js`).

### 3.4 Incremental Approach
- [ ] **Rule**: One component/file at a time.
- [ ] **Rule**: Verify after each change.
- [ ] **Rule**: Commit frequently (small, atomic commits).

---

## Phase 4: Optimization (Optional)

### 4.1 Hook Optimization
- [ ] Use `state_manager` skill guidance:
  ```
  view_file .agent/skills/state_manager/SKILL.md
  ```
- [ ] Apply patterns:
  - Replace prop drilling with Context.
  - Use `useMemo` for expensive computations.
  - Use `useCallback` for callback props.

### 4.2 Component Optimization
- [ ] Apply `React.memo` to pure components.
- [ ] Split large components into smaller ones.
- [ ] Co-locate related code.

---

## Phase 5: Verification

### 5.1 Linting
// turbo
- [ ] Run linter:
  ```bash
  npm run lint
  ```

### 5.2 Build Verification
// turbo
- [ ] Verify build passes:
  ```bash
  npm run build
  ```

### 5.3 Manual Testing
- [ ] Visual click-through of affected areas.
- [ ] Verify all interactions work.
- [ ] Check no console errors.
- [ ] Verify animations still smooth (60fps).

### 5.4 Metrics Comparison
- [ ] Compare to original metrics.
- [ ] Document improvements.

---

## Phase 6: Completion

### 6.1 Cleanup
- [ ] Remove any unused imports.
- [ ] Remove commented-out code.
- [ ] Update any stale comments.

### 6.2 Documentation
- [ ] Update JSDoc if function signatures changed.
- [ ] Update component docs if props changed.

### 6.3 Commit & Merge
- [ ] Commit with refactor prefix:
  ```bash
  git commit -m "refactor: extract [component] for better modularity"
  ```
- [ ] Merge to main:
  ```bash
  git checkout main
  git merge refactor/[name]
  ```
- [ ] Delete feature branch:
  ```bash
  git branch -d refactor/[name]
  ```

---

## Common Refactoring Patterns

| Smell | Pattern | Solution |
|-------|---------|----------|
| Prop drilling | Context | Create provider with useContext |
| Duplicate code | Extract | Create shared hook or component |
| Large component | Split | Break into container + presentation |
| Complex state | Reducer | Replace useState with useReducer |
| Side effects | Custom Hook | Extract useEffect into named hook |
| Magic values | Constants | Extract to named constants file |

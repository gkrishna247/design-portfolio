---
name: code_linter
description: Enforce code quality standards using ESLint and Prettier for the React/Vite ecosystem.
---

# Code Linter Skill

This skill ensures all code meets the project's strict quality standards before it is committed.

## 🛠️ Tools
- **ESLint**: configured in `.eslintrc.cjs` (or `eslint.config.js`)
- **Command**: `npm run lint`

## 📋 usage
ALWAYS run this skill:
1.  After modifying any `.jsx` or `.js` file.
2.  Before submitting a task for review.

## 🚨 Common Fixes

### 1. `no-unused-vars`
**Error**: `warning 'X' is defined but never used`
**Fix**:
- If truly unused: **DELETE IT**.
- If needed for future (rare): Prefix with `_`, e.g., `_props`. `eslint` config allows `_` prefix.

### 2. `react-hooks/exhaustive-deps`
**Error**: `React Hook useEffect has a missing dependency`
**Fix**:
- **Do NOT disable the rule**.
- Add the dependency to the array.
- If adding the dependency causes a loop, use `useRef` or `useCallback` to stabilize the value.

### 3. Console Logs
**Error**: `no-console` or manual observation of noise.
**Fix**: Remove all `console.log` statements. Use `console.error` only for genuine try/catch blocks.

## 🚀 Execution Steps
1.  Run `npm run lint`.
2.  If errors exist, fix them.
3.  If warnings exist (like unused vars), fix them. **Zero warnings policy**.
4.  Re-run `npm run lint` to verify.

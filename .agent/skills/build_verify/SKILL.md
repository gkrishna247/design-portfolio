---
name: build_verify
description: Automates npm run build and check for size warnings.
---

# Build Verification Skill

Your last line of defense before committing code.

## 🔍 The Check
**Command**: `npm run build`

## 📉 Success Criteria
1.  **Exit Code 0**: Build completes without error.
2.  **No "Large Chunk" Warnings**:
    - Vite warns if chunks > 500kb.
    - If you see this, identify the heavy import (usually a 3D model or texture not lazy-loaded) and **Lazy Load It**.

## 🛠️ Debugging Build Failures
1.  **Import Errors**: Did you delete a file but forget to remove the import?
2.  **TypeScript/Lint Errors**: Did you ignore `npm run lint`?
3.  **Memory**: If heap OOM, ensure you aren't bundling massive `.glb` files directly. Move them to `public/` and `useGLTF('/path.glb')`.

## 🤖 Automatable Step
```bash
npm run lint && npm run build
```
Run this exact string. If it fails, **do not commit**.

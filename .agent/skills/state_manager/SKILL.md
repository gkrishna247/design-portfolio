---
name: state_manager
description: Best practices for React hooks and context in this project.
---

# State Manager Skill

Manage state safely in a high-performance 3D/React environment.

## 🧠 Core Principles

### 1. The Rendering Loop vs. The Component Tree
**Rule**: NEVER update React state (`useState`) inside a `useFrame` loop.
- **Bad**:
    ```jsx
    useFrame(() => setRate(rate + 1)) // 💥 Infinite Re-renders
    ```
- **Good**:
    ```jsx
    const rate = useRef(0)
    useFrame(() => { rate.current += 1 }) // ✅ Manipulate refs directly
    ```

### 2. Context Usage
- **Navigation State**: managed globally.
- **Cursor State**: managed globally.
- **Rule**: If a component needs to talk to the Cursor (e.g., "magnetic pull"), use specific data attributes (`data-cursor-text`) rather than complex context drilling where possible.

### 3. Memoization
- **Rule**: Always clean up 3D geometry/materials.
- **Pattern**:
    ```jsx
    const geometry = useMemo(() => new THREE.BoxGeometry(), [])
    ```
- **Pattern**:
    ```jsx
    useEffect(() => {
      const sub = globalState.subscribe(...)
      return () => sub.unsubscribe() // ✅ ALWAYS Clean up
    }, [])
    ```

## ⚠️ Anti-Patterns
1.  **Prop Drilling**: >2 levels deep? Use Composition or Context.
2.  **Object Creation in Render**: `const vec = new THREE.Vector3()` in the component body. **Stop**. Move it outside or use `useMemo`.

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

### 2. High-Frequency Updates: Ref-Based Pattern

This project does **NOT use Zustand**. State management is React hooks + custom Context.

For high-frequency values (mouse position, scroll), use the **ref-based subscribe pattern** from `MouseContext.jsx`:

- **Bad** — causes re-renders on every mouse move:
    ```jsx
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
    useEffect(() => {
      window.addEventListener('mousemove', (e) => setMousePos({ x: e.clientX, y: e.clientY }))
    }, [])
    ```

- **Good** — ref-based, zero re-renders:
    ```jsx
    // MouseContext provides: mouseRef (useRef), subscribe (useCallback)
    const { mouseRef, subscribe } = useMouse()

    useEffect(() => {
      const unsubscribe = subscribe((e) => {
        // Read from mouseRef.current — never triggers re-render
        const { x, y } = mouseRef.current
        // Direct DOM manipulation or RAF update
      })
      return () => unsubscribe()  // ✅ ALWAYS clean up
    }, [subscribe])
    ```

- **Alternative** — for Framer Motion contexts, use `useMotionValue`:
    ```jsx
    const mouseX = useMotionValue(0.5)
    // Set directly — no re-render
    mouseX.set(normalizedX)
    // Derive transforms reactively
    const parallaxX = useTransform(mouseX, [0, 1], [-15, 15])
    ```

### 3. Context Usage
- **Mouse tracking**: `MouseContext` with ref-based subscribe (global).
- **Cursor interaction**: Use `data-cursor` data attributes on interactive elements rather than context drilling.
- **Scroll state**: Framer Motion `useScroll` + `useTransform` (per-component).

### 4. Memoization
- **Rule**: Always clean up 3D geometry/materials.
- **Pattern**:
    ```jsx
    const geometry = useMemo(() => new THREE.IcosahedronGeometry(1, 1), [])
    ```
- **Pattern** — stable refs for forwarded components:
    ```jsx
    const ringRefs = useMemo(() => categories.map(() => createRef()), [])
    ```

## ⚠️ Anti-Patterns
1.  **`useState` for mouse/scroll**: Use `useRef` + subscribe or `useMotionValue` instead.
2.  **Prop Drilling**: >2 levels deep? Use Composition or Context.
3.  **Object Creation in Render**: `const vec = new THREE.Vector3()` in component body. Move outside or use `useMemo`.
4.  **Stale Closures**: Subscribe callbacks must access refs, not component state. State captured in closures goes stale.

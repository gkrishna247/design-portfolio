---
name: r3f_component_gen
description: Templates and standards for creating high-performance 3D components using React Three Fiber.
---

# R3F Component Generator Skill

This skill provides the blueprint for "Neural Flux" 3D components.

## 🎨 Scene Standards
- **Performance**: Always limit pixel ratio.
  ```jsx
  <Canvas dpr={[1, 1.5]} gl={{ antialias: true }}>
  ```
- **Responsiveness**: Use `useThree()` viewport for sizing, not CSS pixels.

## 🧩 Templates

### 1. Standard Mesh Component
```jsx
// src/components/My3DObject/My3DObject.jsx
import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function My3DObject({ position = [0, 0, 0] }) {
  const meshRef = useRef()
  
  // Memoize geometry/materials if static
  const geometry = useMemo(() => new THREE.IcosahedronGeometry(1, 0), [])
  
  useFrame((state, delta) => {
    // Rotation animation
    meshRef.current.rotation.y += delta * 0.5
    // Hover/Float effect
    meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime) * 0.1
  })

  return (
    <mesh 
      ref={meshRef} 
      position={position}
      geometry={geometry}
    >
      <meshStandardMaterial 
        color="#a855f7" 
        roughness={0.2}
        metalness={0.8}
      />
    </mesh>
  )
}
```

### 2. Particle System (Instanced)
For >100 objects, use `InstancedMesh`.

```jsx
import { useRef, useLayoutEffect } from 'react'
import * as THREE from 'three'

export default function ParticleField({ count = 100 }) {
  const meshRef = useRef()
  const tempObject = new THREE.Object3D()

  useLayoutEffect(() => {
    for (let i = 0; i < count; i++) {
      tempObject.position.set(Math.random() * 10, Math.random() * 10, 0)
      tempObject.scale.setScalar(Math.random())
      tempObject.updateMatrix()
      meshRef.current.setMatrixAt(i, tempObject.matrix)
    }
    meshRef.current.instanceMatrix.needsUpdate = true
  }, [count])

  return (
    <instancedMesh ref={meshRef} args={[null, null, count]}>
      <sphereGeometry args={[0.1]} />
      <meshBasicMaterial color="cyan" />
    </instancedMesh>
  )
}
```

## ⚠️ "Wow Factor" Checklist
1.  **Motion**: Is it moving? Static 3D is boring. Add `useFrame` rotation or floating.
2.  **Interaction**: Does it react to the mouse? Use `useThree` mouse vector.
3.  **Material**: Avoid default white. Use Neon/Cyberpunk palette (`#a855f7`, `#3b82f6`, `cyan`).

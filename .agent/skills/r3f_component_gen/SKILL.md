---
name: r3f_component_gen
description: Templates and standards for creating high-performance 3D components using React Three Fiber.
---

# R3F Component Generator Skill

This skill provides the blueprint for "Neural Flux" 3D components.

> **IMPORTANT**: This project uses a **single-Canvas architecture**. Only `NeuralBackground.jsx` has a `<Canvas>`. Do NOT create additional Canvas instances.

## 🎨 Scene Standards
- **Performance**: Always limit pixel ratio.
  ```jsx
  <Canvas
    dpr={[1, 1.5]}
    gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
    camera={{ position: [0, 0, 10], fov: 60 }}
  >
  ```
- **Responsiveness**: Adjust particle counts based on viewport:
  ```jsx
  const PARTICLE_COUNT_DESKTOP = 1500
  const PARTICLE_COUNT_MOBILE = 500
  // Use window.matchMedia('(max-width: 768px)') to switch
  ```

## 🧩 Templates

### 1. Particle System (Points + PointMaterial from drei)
Used in `NeuralParticles` — the primary particle visualization:
```jsx
import { Points, PointMaterial } from '@react-three/drei'
import * as THREE from 'three'

function NeuralParticles({ particleCount }) {
  const ref = useRef()
  const [positions] = useMemo(() => {
    const pos = new Float32Array(particleCount * 3)
    for (let i = 0; i < particleCount; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos((Math.random() * 2) - 1)
      const radius = 3 + Math.random() * 8
      pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
      pos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
      pos[i * 3 + 2] = radius * Math.cos(phi)
    }
    return [pos]
  }, [particleCount])

  useFrame((state, delta) => {
    ref.current.rotation.y += delta * 0.05  // Use delta for frame-rate independence
  })

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={true}>
      <PointMaterial transparent size={0.015} sizeAttenuation depthWrite={false}
        blending={THREE.AdditiveBlending} opacity={0.8} />
    </Points>
  )
}
```

### 2. Instanced Mesh (for multiple objects)
Used in `GlowingOrbs` — efficient rendering of 5 colored wireframe orbs:
```jsx
function GlowingOrbs() {
  const meshRef = useRef()
  const geometry = useMemo(() => new THREE.IcosahedronGeometry(1, 1), [])
  const dummy = useMemo(() => new THREE.Object3D(), [])

  useEffect(() => {
    orbs.forEach((orb, i) => {
      meshRef.current.setColorAt(i, new THREE.Color(orb.color))
    })
    meshRef.current.instanceColor.needsUpdate = true
  }, [orbs])

  useFrame((state, delta) => {
    orbs.forEach((orb, i) => {
      dummy.position.set(orb.x, orb.y + Math.sin(state.clock.elapsedTime + orb.phase) * 0.5, orb.z)
      dummy.updateMatrix()
      meshRef.current.setMatrixAt(i, dummy.matrix)
    })
    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[geometry, null, orbs.length]} frustumCulled={false}>
      <meshBasicMaterial transparent opacity={0.3} wireframe vertexColors />
    </instancedMesh>
  )
}
```

### 3. Line Segments (connection lines)
Used in `ConnectionLines` — decorative lines between points:
```jsx
function ConnectionLines() {
  const geometry = useMemo(() => {
    const points = []
    for (let i = 0; i < 20; i++) {
      // Push start and end positions as flat arrays
      points.push(x1, y1, z1, x2, y2, z2)
    }
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.Float32BufferAttribute(points, 3))
    return geo
  }, [])

  return (
    <lineSegments geometry={geometry}>
      <lineBasicMaterial color="#6366f1" transparent opacity={0.15} />
    </lineSegments>
  )
}
```

## ⚠️ "Wow Factor" Checklist
1. **Motion**: Is it moving? Static 3D is boring. Add `useFrame` rotation or floating.
2. **Interaction**: Does it react to the mouse? Use `mouseRef` from `MouseContext` (NOT `useState`).
3. **Material**: Use Neon/Cyberpunk palette from CSS vars (`--neon-violet`, `--neon-cyan`).
4. **Performance**: Use `delta` parameter in `useFrame` for frame-rate independence.
5. **Cleanup**: Memoize geometry/materials with `useMemo` — never create in render body.

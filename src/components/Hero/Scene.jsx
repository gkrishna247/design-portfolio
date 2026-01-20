import { Canvas, useFrame } from '@react-three/fiber'
import { useRef, useMemo } from 'react'
import * as THREE from 'three'

// Simple Fluid Distortion Shader
const fragmentShader = `
uniform float uTime;
uniform vec2 uMouse;
uniform vec2 uResolution;
varying vec2 vUv;

void main() {
  vec2 st = gl_FragCoord.xy / uResolution.xy;
  
  // Distance from mouse
  float dist = distance(st, uMouse);
  
  // Ripple effect
  float ripple = sin(dist * 20.0 - uTime * 2.0) * 0.05;
  
  // Color mixing
  vec3 colorA = vec3(0.96, 0.95, 0.94); // Light bg match
  vec3 colorB = vec3(0.9, 0.9, 0.9);   // Slightly darker
  
  // Vignette-ish
  float alpha = 1.0 - smoothstep(0.0, 0.5, dist);
  
  vec3 finalColor = mix(colorA, colorB, ripple + alpha * 0.2);
  
  gl_FragColor = vec4(finalColor, 1.0);
}
`

const vertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

function FluidPlane() {
    const mesh = useRef()
    const mouse = useRef(new THREE.Vector2(0.5, 0.5))

    const uniforms = useMemo(
        () => ({
            uTime: { value: 0 },
            uMouse: { value: new THREE.Vector2(0.5, 0.5) },
            uResolution: { value: new THREE.Vector2(1, 1) }
        }),
        []
    )

    useFrame((state) => {
        const { clock, pointer } = state
        mesh.current.material.uniforms.uTime.value = clock.getElapsedTime()

        // Smooth mouse lerp
        mouse.current.x = THREE.MathUtils.lerp(mouse.current.x, (pointer.x + 1) / 2, 0.1)
        mouse.current.y = THREE.MathUtils.lerp(mouse.current.y, (pointer.y + 1) / 2, 0.1)
        mesh.current.material.uniforms.uMouse.value.copy(mouse.current)
    })

    return (
        <mesh ref={mesh} scale={[10, 10, 1]}>
            <planeGeometry args={[2, 2, 32, 32]} />
            <shaderMaterial
                fragmentShader={fragmentShader}
                vertexShader={vertexShader}
                uniforms={uniforms}
            />
        </mesh>
    )
}

export default function Scene() {
    return (
        <Canvas
            camera={{ position: [0, 0, 1] }}
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
            dpr={[1, 2]} // Performance optimization
        >
            <FluidPlane />
        </Canvas>
    )
}

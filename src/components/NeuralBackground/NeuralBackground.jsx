import React, { useRef, useMemo, useEffect, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Points, PointMaterial } from '@react-three/drei'
import * as THREE from 'three'
import './NeuralBackground.css'

// Particle counts - responsive for mobile performance
const PARTICLE_COUNT_DESKTOP = 1500
const PARTICLE_COUNT_MOBILE = 500

// Particle system that reacts to scroll
function NeuralParticles({ scrollProgress, particleCount }) {
    const ref = useRef()
    const mouseRef = useRef({ x: 0, y: 0 })

    // Generate particles in a volumetric space
    const [positions] = useMemo(() => {
        const count = particleCount
        const positions = new Float32Array(count * 3)

        for (let i = 0; i < count; i++) {
            // Distribute in 3D space with varying density
            const theta = Math.random() * Math.PI * 2
            const phi = Math.acos((Math.random() * 2) - 1)
            const radius = 3 + Math.random() * 8

            positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
            positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
            positions[i * 3 + 2] = radius * Math.cos(phi)
        }

        return [positions]
    }, [particleCount])

    useEffect(() => {
        // Direct mouse update - smoothing is handled in useFrame interpolation
        const handleMouseMove = (e) => {
            mouseRef.current = {
                x: (e.clientX / window.innerWidth) * 2 - 1,
                y: -(e.clientY / window.innerHeight) * 2 + 1
            }
        }
        window.addEventListener('mousemove', handleMouseMove, { passive: true })
        return () => window.removeEventListener('mousemove', handleMouseMove)
    }, [])

    useFrame((state, delta) => {
        if (!ref.current) return

        // Base rotation
        ref.current.rotation.y += delta * 0.05
        ref.current.rotation.x += delta * 0.02

        // Mouse influence
        ref.current.rotation.x += (mouseRef.current.y * 0.3 - ref.current.rotation.x) * 0.02
        ref.current.rotation.y += (mouseRef.current.x * 0.3 - ref.current.rotation.y) * 0.02

        // Scroll influence - expand/contract
        const scrollVal = scrollProgress?.get() || 0
        ref.current.scale.setScalar(1 + scrollVal * 0.5)
    })

    return (
        <Points ref={ref} positions={positions} stride={3} frustumCulled={true}>
            <PointMaterial
                transparent
                vertexColors
                size={0.015}
                sizeAttenuation={true}
                depthWrite={false}
                blending={THREE.AdditiveBlending}
                opacity={0.8}
            />
        </Points>
    )
}

// Floating orbs with glow
function GlowingOrbs() {
    const groupRef = useRef()

    // Shared geometry for better performance
    const geometry = useMemo(() => new THREE.IcosahedronGeometry(1, 1), [])

    const orbs = useMemo(() => {
        return Array.from({ length: 5 }, (_, i) => ({
            initialPosition: [
                (Math.random() - 0.5) * 10,
                (Math.random() - 0.5) * 10,
                (Math.random() - 0.5) * 5
            ],
            scale: 0.3 + Math.random() * 0.5,
            color: [`#a855f7`, `#3b82f6`, `#22d3ee`, `#ec4899`, `#10b981`][i],
            phase: Math.random() * Math.PI * 2
        }))
    }, [])

    useFrame((state, delta) => {
        if (!groupRef.current) return
        groupRef.current.children.forEach((orbMesh, i) => {
            const orbData = orbs[i]
            // Optimized: Use absolute time for stable oscillation instead of accumulation
            orbMesh.position.y = orbData.initialPosition[1] + Math.sin(state.clock.elapsedTime + orbData.phase) * 0.5

            orbMesh.rotation.x += delta * 0.2
            orbMesh.rotation.y += delta * 0.3
        })
    })

    return (
        <group ref={groupRef}>
            {orbs.map((orb, i) => (
                <mesh
                    key={i}
                    position={orb.initialPosition}
                    scale={[orb.scale, orb.scale, orb.scale]}
                    geometry={geometry}
                >
                    <meshBasicMaterial
                        color={orb.color}
                        transparent
                        opacity={0.3}
                        wireframe
                    />
                </mesh>
            ))}
        </group>
    )
}

// Connection lines between particles
function ConnectionLines() {
    const linesRef = useRef()

    // Optimized: Use single buffer geometry for all lines
    const geometry = useMemo(() => {
        const points = []
        for (let i = 0; i < 20; i++) {
            const startPos = new THREE.Vector3(
                (Math.random() - 0.5) * 15,
                (Math.random() - 0.5) * 15,
                (Math.random() - 0.5) * 10
            )
            const endPos = new THREE.Vector3(
                startPos.x + (Math.random() - 0.5) * 5,
                startPos.y + (Math.random() - 0.5) * 5,
                startPos.z + (Math.random() - 0.5) * 3
            )
            points.push(startPos.x, startPos.y, startPos.z)
            points.push(endPos.x, endPos.y, endPos.z)
        }

        const geo = new THREE.BufferGeometry()
        geo.setAttribute('position', new THREE.Float32BufferAttribute(points, 3))
        return geo
    }, [])

    useFrame((state) => {
        if (!linesRef.current) return
        linesRef.current.rotation.y = state.clock.elapsedTime * 0.02
        linesRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5) * 0.1
    })

    return (
        <lineSegments ref={linesRef} geometry={geometry}>
            <lineBasicMaterial
                color="#6366f1"
                transparent
                opacity={0.15}
            />
        </lineSegments>
    )
}


function NeuralBackground({ scrollProgress }) {
    // Responsive particle count for mobile performance
    const [particleCount, setParticleCount] = useState(PARTICLE_COUNT_DESKTOP)

    useEffect(() => {
        const mobileQuery = window.matchMedia('(max-width: 768px)')
        const handleChange = (e) => setParticleCount(e.matches ? PARTICLE_COUNT_MOBILE : PARTICLE_COUNT_DESKTOP)
        handleChange(mobileQuery)
        mobileQuery.addEventListener('change', handleChange)
        return () => mobileQuery.removeEventListener('change', handleChange)
    }, [])

    return (
        <div className="neural-background">
            <Canvas
                camera={{ position: [0, 0, 10], fov: 60 }}
                dpr={[1, 1.5]} // Optimized: reduced max DPR for better GPU performance
                gl={{
                    antialias: true,
                    alpha: true,
                    powerPreference: 'high-performance' // Prefer discrete GPU
                }}
            >
                <ambientLight intensity={0.5} />
                <NeuralParticles scrollProgress={scrollProgress} particleCount={particleCount} />
                <GlowingOrbs />
                <ConnectionLines />
            </Canvas>

            {/* CSS gradient overlays */}
            <div className="gradient-overlay gradient-overlay--top" />
            <div className="gradient-overlay gradient-overlay--bottom" />
            <div className="ambient-orb ambient-orb--1" />
            <div className="ambient-orb ambient-orb--2" />
            <div className="ambient-orb ambient-orb--3" />
        </div>
    )
}

// Optimized: prevent re-renders on parent updates
export default React.memo(NeuralBackground)

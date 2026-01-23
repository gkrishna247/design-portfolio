import { useRef, useMemo, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Points, PointMaterial } from '@react-three/drei'
import * as THREE from 'three'
import './NeuralBackground.css'

// Particle system that reacts to scroll
function NeuralParticles({ scrollProgress }) {
    const ref = useRef()
    const mouseRef = useRef({ x: 0, y: 0 })

    // Generate particles in a volumetric space
    // Optimized: reduced from 3000 to 1500 particles for better performance
    // Generate particles in a volumetric space
    // Optimized: reduced from 3000 to 1500 particles for better performance
    const [positions] = useMemo(() => {
        const particleCount = 1500
        const positions = new Float32Array(particleCount * 3)

        for (let i = 0; i < particleCount; i++) {
            // Distribute in 3D space with varying density
            const theta = Math.random() * Math.PI * 2
            const phi = Math.acos((Math.random() * 2) - 1)
            const radius = 3 + Math.random() * 8

            positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
            positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
            positions[i * 3 + 2] = radius * Math.cos(phi)
        }

        return [positions]
    }, [])

    useEffect(() => {
        const handleMouseMove = (e) => {
            mouseRef.current = {
                x: (e.clientX / window.innerWidth) * 2 - 1,
                y: -(e.clientY / window.innerHeight) * 2 + 1
            }
        }
        window.addEventListener('mousemove', handleMouseMove)
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

    const orbs = useMemo(() => {
        return Array.from({ length: 5 }, (_, i) => ({
            position: [
                (Math.random() - 0.5) * 10,
                (Math.random() - 0.5) * 10,
                (Math.random() - 0.5) * 5
            ],
            scale: 0.3 + Math.random() * 0.5,
            color: [`#a855f7`, `#3b82f6`, `#22d3ee`, `#ec4899`, `#10b981`][i]
        }))
    }, [])

    useFrame((state, delta) => {
        if (!groupRef.current) return
        groupRef.current.children.forEach((orb, i) => {
            orb.position.y += Math.sin(state.clock.elapsedTime + i) * 0.003
            orb.rotation.x += delta * 0.2
            orb.rotation.y += delta * 0.3
        })
    })

    return (
        <group ref={groupRef}>
            {orbs.map((orb, i) => (
                <mesh key={i} position={orb.position}>
                    <icosahedronGeometry args={[orb.scale, 1]} />
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

    const linePoints = useMemo(() => {
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
            points.push(startPos, endPos)
        }
        return points
    }, [])

    useFrame((state) => {
        if (!linesRef.current) return
        linesRef.current.rotation.y = state.clock.elapsedTime * 0.02
        linesRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5) * 0.1
    })

    return (
        <group ref={linesRef}>
            {linePoints.map((_, i) => {
                if (i % 2 !== 0) return null
                return (
                    <line key={i}>
                        <bufferGeometry>
                            <bufferAttribute
                                attach="attributes-position"
                                count={2}
                                array={new Float32Array([
                                    linePoints[i].x, linePoints[i].y, linePoints[i].z,
                                    linePoints[i + 1].x, linePoints[i + 1].y, linePoints[i + 1].z
                                ])}
                                itemSize={3}
                            />
                        </bufferGeometry>
                        <lineBasicMaterial
                            color="#6366f1"
                            transparent
                            opacity={0.15}
                        />
                    </line>
                )
            })}
        </group>
    )
}

export default function NeuralBackground({ scrollProgress }) {
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
                <NeuralParticles scrollProgress={scrollProgress} />
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

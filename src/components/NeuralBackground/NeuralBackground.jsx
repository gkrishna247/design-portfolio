import React, { useRef, useMemo, useEffect, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Points, PointMaterial } from '@react-three/drei'
import * as THREE from 'three'
import { useMouse } from '../../contexts/MouseContext'
import './NeuralBackground.css'

// Particle counts - responsive for mobile performance
const PARTICLE_COUNT_DESKTOP = 1500
const PARTICLE_COUNT_MOBILE = 500

// Particle system that reacts to scroll
function NeuralParticles({ scrollProgress, particleCount, mouseRef, isInitialized }) {
    const ref = useRef()

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

    useFrame((state, delta) => {
        if (!ref.current) return

        // Compute normalized mouse position from shared ref
        let mouseX = 0
        let mouseY = 0

        if (mouseRef && mouseRef.current && isInitialized && isInitialized.current) {
            const { clientX, clientY } = mouseRef.current
            mouseX = (clientX / window.innerWidth) * 2 - 1
            mouseY = -(clientY / window.innerHeight) * 2 + 1
        }

        // Base rotation
        let rx = ref.current.rotation.x
        let ry = ref.current.rotation.y

        ry += delta * 0.05
        rx += delta * 0.02

        // Mouse influence
        rx += (mouseY * 0.3 - rx) * 0.02
        ry += (mouseX * 0.3 - ry) * 0.02

        ref.current.rotation.x = rx
        ref.current.rotation.y = ry

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
    const meshRef = useRef()

    // Shared geometry for better performance
    const geometry = useMemo(() => new THREE.IcosahedronGeometry(1, 1), [])
    const dummy = useMemo(() => new THREE.Object3D(), [])

    const orbs = useMemo(() => {
        return Array.from({ length: 5 }, (_, i) => ({
            initialPosition: [
                (Math.random() - 0.5) * 10,
                (Math.random() - 0.5) * 10,
                (Math.random() - 0.5) * 5
            ],
            scale: 0.3 + Math.random() * 0.5,
            color: [`#a855f7`, `#3b82f6`, `#22d3ee`, `#ec4899`, `#10b981`][i],
            phase: Math.random() * Math.PI * 2,
            rotation: { x: 0, y: 0 }
        }))
    }, [])

    useEffect(() => {
        if (meshRef.current) {
            orbs.forEach((orb, i) => {
                const color = new THREE.Color(orb.color)
                meshRef.current.setColorAt(i, color)
            })
            meshRef.current.instanceColor.needsUpdate = true
        }
    }, [orbs])

    useFrame((state, delta) => {
        if (!meshRef.current) return

        orbs.forEach((orbData, i) => {
            // Optimized: Use absolute time for stable oscillation instead of accumulation
            const y = orbData.initialPosition[1] + Math.sin(state.clock.elapsedTime + orbData.phase) * 0.5

            // Accumulate rotation
            orbData.rotation.x += delta * 0.2
            orbData.rotation.y += delta * 0.3

            dummy.position.set(orbData.initialPosition[0], y, orbData.initialPosition[2])
            dummy.rotation.set(orbData.rotation.x, orbData.rotation.y, 0)
            dummy.scale.setScalar(orbData.scale)

            dummy.updateMatrix()
            meshRef.current.setMatrixAt(i, dummy.matrix)
        })
        meshRef.current.instanceMatrix.needsUpdate = true
    })

    return (
        <instancedMesh ref={meshRef} args={[geometry, null, orbs.length]} frustumCulled={false}>
            <meshBasicMaterial
                transparent
                opacity={0.3}
                wireframe
                vertexColors
            />
        </instancedMesh>
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
    const { mouseRef, isInitialized } = useMouse()

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
                <NeuralParticles
                    scrollProgress={scrollProgress}
                    particleCount={particleCount}
                    mouseRef={mouseRef}
                    isInitialized={isInitialized}
                />
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

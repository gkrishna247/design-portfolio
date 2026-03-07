import React, { useRef, useMemo, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Points, PointMaterial } from '@react-three/drei'
// Perf: Selective imports for tree-shaking — avoids bundling entire Three.js
import { AdditiveBlending } from 'three/src/constants.js'
import { IcosahedronGeometry } from 'three/src/geometries/IcosahedronGeometry.js'
import { Object3D } from 'three/src/core/Object3D.js'
import { Color } from 'three/src/math/Color.js'
import { BufferGeometry } from 'three/src/core/BufferGeometry.js'
import { Float32BufferAttribute } from 'three/src/core/BufferAttribute.js'
import { useMouse } from '../../contexts/MouseContext'
import './NeuralBackground.css'

// Perf: Device-tier detection at module level (runs once)
const isMobile = typeof window !== 'undefined' && typeof window.matchMedia === 'function' && window.matchMedia('(max-width: 768px)').matches
const isLowEnd = typeof navigator !== 'undefined' && (navigator.hardwareConcurrency || 4) <= 4
const isSlowNetwork = typeof navigator !== 'undefined' && navigator.connection?.effectiveType === '2g'

// Perf: Particle counts based on device capability
const PARTICLE_COUNT = isLowEnd ? 300 : isMobile ? 500 : 1500

// Particle system that reacts to scroll
function NeuralParticles({ scrollProgress, mouseRef, isInitialized }) {
    const ref = useRef()

    // Generate particles in a volumetric space
    const positions = useMemo(() => {
        const pos = new Float32Array(PARTICLE_COUNT * 3)
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            const theta = Math.random() * Math.PI * 2
            const phi = Math.acos((Math.random() * 2) - 1)
            const radius = 3 + Math.random() * 8
            pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
            pos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
            pos[i * 3 + 2] = radius * Math.cos(phi)
        }
        return pos
    }, [])

    useFrame((state, delta) => {
        if (!ref.current) return

        // Perf: Read mouse from ref (no React state, no re-render)
        let mouseX = 0
        let mouseY = 0
        if (mouseRef?.current && isInitialized?.current) {
            const { clientX, clientY } = mouseRef.current
            mouseX = (clientX / window.innerWidth) * 2 - 1
            mouseY = -(clientY / window.innerHeight) * 2 + 1
        }

        // Base rotation with mouse influence
        const rot = ref.current.rotation
        rot.y += delta * 0.05 + (mouseX * 0.3 - rot.y) * 0.02
        rot.x += delta * 0.02 + (mouseY * 0.3 - rot.x) * 0.02

        // Scroll influence - expand/contract
        const scrollVal = scrollProgress?.get() || 0
        ref.current.scale.setScalar(1 + scrollVal * 0.5)
    })

    return (
        <Points ref={ref} positions={positions} stride={3} frustumCulled>
            <PointMaterial
                transparent
                size={0.015}
                sizeAttenuation
                depthWrite={false}
                blending={AdditiveBlending}
                opacity={0.8}
                color="#a78bfa"
            />
        </Points>
    )
}

// Floating orbs with glow — uses InstancedMesh for 5 orbs
function GlowingOrbs() {
    const meshRef = useRef()

    // Perf: Create reusable objects once, dispose on unmount
    const geometry = useMemo(() => new IcosahedronGeometry(1, 1), [])
    const dummy = useMemo(() => new Object3D(), [])
    const color = useMemo(() => new Color(), [])

    const orbs = useMemo(() =>
        Array.from({ length: 5 }, (_, i) => ({
            initialPosition: [
                (Math.random() - 0.5) * 10,
                (Math.random() - 0.5) * 10,
                (Math.random() - 0.5) * 5
            ],
            scale: 0.3 + Math.random() * 0.5,
            color: ['#a855f7', '#3b82f6', '#22d3ee', '#ec4899', '#10b981'][i],
            phase: Math.random() * Math.PI * 2,
            rotation: { x: 0, y: 0 }
        }))
        , [])

    useEffect(() => {
        if (meshRef.current) {
            orbs.forEach((orb, i) => {
                color.set(orb.color)
                meshRef.current.setColorAt(i, color)
            })
            meshRef.current.instanceColor.needsUpdate = true
        }
    }, [orbs, color])

    // Perf: Dispose GPU resources on unmount
    useEffect(() => {
        return () => geometry.dispose()
    }, [geometry])

    useFrame((state, delta) => {
        if (!meshRef.current) return

        orbs.forEach((orbData, i) => {
            const y = orbData.initialPosition[1] + Math.sin(state.clock.elapsedTime + orbData.phase) * 0.5
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
            <meshBasicMaterial transparent opacity={0.3} wireframe vertexColors />
        </instancedMesh>
    )
}

// Connection lines between particles
function ConnectionLines() {
    const linesRef = useRef()

    const geometry = useMemo(() => {
        const points = []
        for (let i = 0; i < 20; i++) {
            const sx = (Math.random() - 0.5) * 15
            const sy = (Math.random() - 0.5) * 15
            const sz = (Math.random() - 0.5) * 10
            points.push(sx, sy, sz)
            points.push(sx + (Math.random() - 0.5) * 5, sy + (Math.random() - 0.5) * 5, sz + (Math.random() - 0.5) * 3)
        }
        const geo = new BufferGeometry()
        geo.setAttribute('position', new Float32BufferAttribute(points, 3))
        return geo
    }, [])

    // Perf: Dispose GPU resources on unmount
    useEffect(() => {
        return () => geometry.dispose()
    }, [geometry])

    useFrame((state) => {
        if (!linesRef.current) return
        linesRef.current.rotation.y = state.clock.elapsedTime * 0.02
        linesRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5) * 0.1
    })

    return (
        <lineSegments ref={linesRef} geometry={geometry}>
            <lineBasicMaterial color="#6366f1" transparent opacity={0.15} />
        </lineSegments>
    )
}


function NeuralBackground({ scrollProgress }) {
    const { mouseRef, isInitialized } = useMouse()

    // Perf: Skip 3D entirely on very slow networks
    if (isSlowNetwork) {
        return (
            <div className="neural-background">
                <div className="sr-only">Neural network background (disabled on slow connection)</div>
                <div className="ambient-orb ambient-orb--1" />
                <div className="ambient-orb ambient-orb--2" />
                <div className="ambient-orb ambient-orb--3" />
            </div>
        )
    }

    return (
        <div className="neural-background">
            <div className="sr-only">
                A dynamic, interactive 3D particle background representing a neural network.
            </div>
            <Canvas
                aria-hidden="true"
                camera={{ position: [0, 0, 10], fov: 60 }}
                dpr={isMobile ? [1, 1] : [1, 1.5]}
                gl={{
                    antialias: !isMobile, // Perf: disable antialias on mobile (~2× fill rate savings)
                    alpha: true,
                    powerPreference: 'high-performance'
                }}
            >
                <ambientLight intensity={0.5} />
                <NeuralParticles
                    scrollProgress={scrollProgress}
                    mouseRef={mouseRef}
                    isInitialized={isInitialized}
                />
                {/* Perf: Skip orbs and lines on low-end devices */}
                {!isLowEnd && <GlowingOrbs />}
                {!isLowEnd && <ConnectionLines />}
            </Canvas>
            <div className="gradient-overlay gradient-overlay--top" />
            <div className="gradient-overlay gradient-overlay--bottom" />
            <div className="ambient-orb ambient-orb--1" />
            <div className="ambient-orb ambient-orb--2" />
            <div className="ambient-orb ambient-orb--3" />
        </div>
    )
}

export default React.memo(NeuralBackground)

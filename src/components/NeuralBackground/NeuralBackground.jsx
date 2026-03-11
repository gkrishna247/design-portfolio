import React, { useRef, useMemo, useEffect, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useMouse } from '../../contexts/MouseContext'
import { useReducedMotion } from '../../contexts/ReducedMotionContext'
import './NeuralBackground.css'

// Configuration for performance
const CONFIG_DESKTOP = { terrainSegments: 60, particleCount: 1500 }
const CONFIG_MOBILE = { terrainSegments: 25, particleCount: 500 }

function FloatingDust({ particleCount, scrollProgress, mouseRef, isInitialized }) {
    const pointsRef = useRef()
    const { prefersReducedMotion } = useReducedMotion()

    // Create a smooth circular gradient texture for particles
    const particleTexture = useMemo(() => {
        const canvas = document.createElement('canvas')
        canvas.width = 32
        canvas.height = 32
        const ctx = canvas.getContext('2d')
        const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16)
        gradient.addColorStop(0, 'rgba(255,255,255,1)')
        gradient.addColorStop(0.2, 'rgba(168, 85, 247, 0.8)') // neon violet glow
        gradient.addColorStop(1, 'rgba(0,0,0,0)')
        ctx.fillStyle = gradient
        ctx.fillRect(0, 0, 32, 32)
        return new THREE.CanvasTexture(canvas)
    }, [])

    const [positions, phases] = useMemo(() => {
        const pos = new Float32Array(particleCount * 3)
        const pha = new Float32Array(particleCount)
        
        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3
            
            // Distribute in a spherical volume
            const r = 2 + Math.random() * 20
            const theta = Math.random() * Math.PI * 2
            const phi = Math.acos((Math.random() * 2) - 1)
            
            pos[i3] = r * Math.sin(phi) * Math.cos(theta)
            pos[i3 + 1] = (r * Math.sin(phi) * Math.sin(theta)) * 0.5 // flattened
            pos[i3 + 2] = r * Math.cos(phi)

            pha[i] = Math.random() * Math.PI * 2
        }
        return [pos, pha]
    }, [particleCount])

    useFrame((state, delta) => {
        if (!pointsRef.current) return
        if (prefersReducedMotion) return
        
        // Base extremely slow orbit
        pointsRef.current.rotation.y -= delta * 0.02
        
        // Tilt via mouse
        if (mouseRef?.current && isInitialized?.current) {
            const mouseX = (mouseRef.current.clientX / window.innerWidth) * 2 - 1
            const mouseY = -(mouseRef.current.clientY / window.innerHeight) * 2 + 1
            pointsRef.current.rotation.x += (mouseY * 0.1 - pointsRef.current.rotation.x) * 0.02
            pointsRef.current.rotation.z += (mouseX * 0.1 - pointsRef.current.rotation.z) * 0.02
        }

        // Scroll influence (pushes particles physically closer)
        const scrollVal = scrollProgress?.get() || 0
        pointsRef.current.position.z = scrollVal * 3
    })

    return (
        <points ref={pointsRef}>
            <bufferGeometry>
                <bufferAttribute attach="attributes-position" count={particleCount} array={positions} itemSize={3} />
            </bufferGeometry>
            <pointsMaterial 
                size={0.4}
                map={particleTexture}
                transparent={true}
                depthWrite={false}
                blending={THREE.AdditiveBlending}
                opacity={0.6}
                color="#ffffff"
            />
        </points>
    )
}

function FluidTerrain({ segments, speedScale, wireColor, yOffset, zPhase }) {
    const meshRef = useRef()
    const { prefersReducedMotion } = useReducedMotion()
    
    // We recreate the geometry only when segment count changes
    const geometry = useMemo(() => new THREE.PlaneGeometry(60, 60, segments, segments), [segments])
    
    // Cache original X,Y to compute wave Z efficiently
    const basePositions = useMemo(() => {
        const arr = geometry.attributes.position.array
        const output = new Float32Array(arr.length)
        for (let i = 0; i < arr.length; i++) output[i] = arr[i]
        return output
    }, [geometry])

    useFrame((state) => {
        if (!meshRef.current) return
        if (prefersReducedMotion) return
        
        const time = state.clock.elapsedTime * speedScale
        const positions = meshRef.current.geometry.attributes.position.array
        
        // Modify Z to create organic rolling cyber waves
        for (let i = 0; i < positions.length; i += 3) {
            const x = basePositions[i]
            const y = basePositions[i + 1]
            // Sum of overlapping waves for complexity
            const z = Math.sin(x * 0.2 + time) * 1.5 
                    + Math.cos(y * 0.15 + time * 1.2) * 1.5
                    + Math.sin((x + y) * 0.1 - time * zPhase) * 1.0
            
            positions[i + 2] = z
        }
        
        meshRef.current.geometry.attributes.position.needsUpdate = true
    })

    return (
        <mesh ref={meshRef} position={[0, yOffset, -5]} rotation={[-Math.PI / 2 + 0.3, 0, 0]}>
            <primitive object={geometry} attach="geometry" />
            <meshBasicMaterial 
                color={wireColor} 
                wireframe 
                transparent 
                opacity={0.15} 
                blending={THREE.AdditiveBlending}
            />
        </mesh>
    )
}

function EnergyCore({ scrollProgress }) {
    const coreRef = useRef()
    const innerRingRef = useRef()
    const outerRingRef = useRef()
    const { prefersReducedMotion } = useReducedMotion()

    useFrame((state, delta) => {
        if (!coreRef.current || prefersReducedMotion) return
        
        const time = state.clock.elapsedTime
        
        // Spin and levitate
        coreRef.current.rotation.y += delta * 0.2
        coreRef.current.rotation.x += delta * 0.1
        coreRef.current.position.y = Math.sin(time) * 0.5
        
        // Scale with scroll
        const scrollVal = scrollProgress?.get() || 0
        const scale = 1 + scrollVal * 0.5
        coreRef.current.scale.setScalar(scale)

        if (innerRingRef.current) {
            innerRingRef.current.rotation.z -= delta * 0.5
            innerRingRef.current.rotation.x = Math.PI / 2 + Math.sin(time * 0.5) * 0.2
            innerRingRef.current.position.y = coreRef.current.position.y
            innerRingRef.current.scale.setScalar(scale * (1 + Math.sin(time * 2) * 0.05))
        }

        if (outerRingRef.current) {
            outerRingRef.current.rotation.y += delta * 0.3
            outerRingRef.current.rotation.x = Math.PI / 2 + Math.cos(time * 0.4) * 0.3
            outerRingRef.current.position.y = coreRef.current.position.y
            outerRingRef.current.scale.setScalar(scale * (1 + Math.cos(time * 1.5) * 0.02))
        }
    })

    return (
        <group position={[0, 0, 0]}>
            {/* Inner crystalline core */}
            <mesh ref={coreRef}>
                <icosahedronGeometry args={[1.2, 1]} />
                <meshStandardMaterial 
                    color="#22d3ee" 
                    emissive="#106b79" 
                    emissiveIntensity={0.5} 
                    wireframe 
                    transparent 
                    opacity={0.8}
                />
            </mesh>
            
            {/* Outer high-energy accretion ring */}
            <mesh ref={innerRingRef}>
                <torusGeometry args={[2.5, 0.02, 16, 100]} />
                <meshBasicMaterial 
                    color="#ec4899" 
                    transparent 
                    opacity={0.6} 
                    blending={THREE.AdditiveBlending}
                />
            </mesh>
            
            <mesh ref={outerRingRef}>  {/* secondary ghost ring */}
                <torusGeometry args={[3.2, 0.05, 16, 64]} />
                <meshBasicMaterial 
                    color="#a855f7" 
                    wireframe
                    transparent 
                    opacity={0.3} 
                    blending={THREE.AdditiveBlending}
                />
            </mesh>
            
            {/* Ambient inner glow */}
            <pointLight distance={10} intensity={2} color="#3b82f6" />
        </group>
    )
}

function NeuralBackground({ scrollProgress }) {
    const [config, setConfig] = useState(CONFIG_DESKTOP)
    const { mouseRef, isInitialized } = useMouse()

    useEffect(() => {
        const mobileQuery = window.matchMedia('(max-width: 768px)')
        const handleChange = (e) => setConfig(e.matches ? CONFIG_MOBILE : CONFIG_DESKTOP)
        handleChange(mobileQuery)
        mobileQuery.addEventListener('change', handleChange)
        return () => mobileQuery.removeEventListener('change', handleChange)
    }, [])

    return (
        <div className="neural-background">
            <div className="sr-only">
                A high-graphics interactive 3D scene featuring a cyber-fluid terrain matrix and a levitating energy core.
            </div>
            <Canvas
                aria-hidden="true"
                camera={{ position: [0, 0, 10], fov: 60 }}
                dpr={[1, 1.5]}
                gl={{
                    antialias: true,
                    alpha: true,
                    powerPreference: 'high-performance'
                }}
            >
                <ambientLight intensity={0.2} />
                
                <EnergyCore scrollProgress={scrollProgress} />
                
                {/* Two layered shifting terrains */}
                <FluidTerrain 
                    segments={config.terrainSegments}
                    speedScale={0.3}
                    wireColor="#3b82f6"
                    yOffset={-5}
                    zPhase={0.5}
                />
                <FluidTerrain 
                    segments={config.terrainSegments}
                    speedScale={0.25}
                    wireColor="#a855f7"
                    yOffset={-6}
                    zPhase={0.8}
                />

                <FloatingDust 
                    particleCount={config.particleCount}
                    scrollProgress={scrollProgress}
                    mouseRef={mouseRef}
                    isInitialized={isInitialized}
                />
            </Canvas>

            {/* Ambient CSS Orbs for depth & color mixing without post-processing */}
            <div className="gradient-overlay gradient-overlay--top" />
            <div className="gradient-overlay gradient-overlay--bottom" />
            <div className="ambient-orb ambient-orb--1" />
            <div className="ambient-orb ambient-orb--2" />
            <div className="ambient-orb ambient-orb--3" />
        </div>
    )
}

export default React.memo(NeuralBackground)

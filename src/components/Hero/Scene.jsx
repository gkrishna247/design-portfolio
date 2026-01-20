import { Canvas, useFrame } from '@react-three/fiber'
import { Points, PointMaterial, Line } from '@react-three/drei'
import { useRef, useState, useMemo } from 'react'
import * as THREE from 'three'

function NetworkData() {
    const ref = useRef()

    // Generate random points on a sphere
    const sphere = useMemo(() => {
        const temp = []
        for (let i = 0; i < 50; i++) {
            const theta = Math.random() * Math.PI * 2
            const phi = Math.acos((Math.random() * 2) - 1)
            const x = 3 * Math.sin(phi) * Math.cos(theta)
            const y = 3 * Math.sin(phi) * Math.sin(theta)
            const z = 3 * Math.cos(phi)
            temp.push(x, y, z)
        }
        return new Float32Array(temp)
    }, [])

    useFrame((state, delta) => {
        ref.current.rotation.x -= delta / 10
        ref.current.rotation.y -= delta / 15
    })

    return (
        <group rotation={[0, 0, Math.PI / 4]}>
            <Points ref={ref} positions={sphere} stride={3} frustumCulled={false}>
                <PointMaterial
                    transparent
                    color="#00f3ff"
                    size={0.05}
                    sizeAttenuation={true}
                    depthWrite={false}
                />
            </Points>
            {/* Visual Lines connecting center to some points */}
            <Line
                points={[[0, 0, 0], [1, 1, 1], [-1, -1, -1], [2, -2, 0]]}
                color="#00f3ff"
                opacity={0.2}
                transparent
                lineWidth={1}
            />
        </group>
    )
}

export default function Scene() {
    return (
        <Canvas
            camera={{ position: [0, 0, 5], fov: 75 }}
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
            dpr={[1, 2]}
        >
            <NetworkData />
        </Canvas>
    )
}

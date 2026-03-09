import { useEffect, useRef, memo } from 'react'
import { useMouse } from '../../contexts/MouseContext'
import { createMat4, perspective, lookAt, multiply } from './mathUtils'
import { particleVertexShader, particleFragmentShader, lineVertexShader, lineFragmentShader } from './shaders'
import './NeuralBackground.css'

// Configuration (must match old Three.js settings exactly for parity)
const CONFIG = {
    PARTICLE_COUNT: 150,
    CONNECTION_DISTANCE: 4.5,
    AMBIENT_ORBS: [
        { color: [168 / 255, 85 / 255, 247 / 255], position: [-10, 5, -10], size: 4.0 }, // Neon Violet
        { color: [34 / 255, 211 / 255, 238 / 255], position: [10, -5, -5], size: 3.5 }, // Neon Cyan
        { color: [236 / 255, 72 / 255, 153 / 255], position: [0, 8, -15], size: 4.5 }   // Neon Pink
    ]
}

// WebGL Helper: Compile Shader
function compileShader(gl, type, source) {
    const shader = gl.createShader(type)
    const cleanSource = source.trimStart()
    gl.shaderSource(shader, cleanSource)
    gl.compileShader(shader)
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Shader compile error:', gl.getShaderInfoLog(shader))
        gl.deleteShader(shader)
        return null
    }
    return shader
}

// WebGL Helper: Create Program
function createProgram(gl, vsSource, fsSource) {
    const vertexShader = compileShader(gl, gl.VERTEX_SHADER, vsSource)
    const fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, fsSource)
    
    if (!vertexShader || !fragmentShader) {
        console.warn('Bailing out: compileShader returned null for vs or fs.')
        return null;
    }

    const program = gl.createProgram()
    gl.attachShader(program, vertexShader)
    gl.attachShader(program, fragmentShader)
    gl.linkProgram(program)
    
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error('Program link error:', gl.getProgramInfoLog(program))
        return null
    }
    return program
}

export default memo(function NeuralBackground() {
    const canvasRef = useRef(null)
    const { subscribe } = useMouse()
    const mousePosRef = useRef({ x: 0, y: 0 })

    useEffect(() => {
        // --- 1. Network & Device Tier Checks ---
        // Network-aware: Skip heavy 3D on 2g connections
        if ('connection' in navigator) {
            const conn = navigator.connection
            if (conn.effectiveType === '2g' || conn.saveData) {
                return // Fallback to CSS background only
            }
        }

        // --- 2. Initialize WebGL2 ---
        const canvas = canvasRef.current
        if (!canvas) return

        // High-performance context without native AA (we control DPI scaling)
        const gl = canvas.getContext('webgl2', {
            alpha: true,
            antialias: false,
            powerPreference: 'high-performance',
            premultipliedAlpha: false
        })

        if (!gl) {
            console.warn('WebGL2 not supported, skipping 3D background')
            return
        }

        // --- 3. Shaders & Programs ---
        const particleProgram = createProgram(gl, particleVertexShader, particleFragmentShader)
        const lineProgram = createProgram(gl, lineVertexShader, lineFragmentShader)

        if (!particleProgram || !lineProgram) {
            console.warn('WebGL programs failed to compile, skipping 3D rendering.')
            return
        }

        // --- 4. Buffer Setup (Data Oriented Design) ---
        // Particle Buffer: [x, y, z, size, r, g, b, alpha]
        const particleFloat32Stride = 8
        const particleData = new Float32Array(CONFIG.PARTICLE_COUNT * particleFloat32Stride)
        const particleBuffer = gl.createBuffer()

        // Generate Random Particles
        for (let i = 0; i < CONFIG.PARTICLE_COUNT; i++) {
            const idx = i * particleFloat32Stride
            // Position (Matches old Random spreading)
            particleData[idx] = (Math.random() - 0.5) * 35
            particleData[idx + 1] = (Math.random() - 0.5) * 35
            particleData[idx + 2] = (Math.random() - 0.5) * 35

            // Size
            particleData[idx + 3] = Math.random() * 0.4 + 0.1

            // Color (Mix between Violet, Cyan, Pink based on position/random)
            const colorChoice = Math.random()
            if (colorChoice < 0.33) {
                particleData[idx + 4] = 168 / 255; particleData[idx + 5] = 85 / 255; particleData[idx + 6] = 247 / 255
            } else if (colorChoice < 0.66) {
                particleData[idx + 4] = 34 / 255; particleData[idx + 5] = 211 / 255; particleData[idx + 6] = 238 / 255
            } else {
                particleData[idx + 4] = 236 / 255; particleData[idx + 5] = 72 / 255; particleData[idx + 6] = 153 / 255
            }

            // Alpha
            particleData[idx + 7] = Math.random() * 0.5 + 0.3
        }

        // Upload Particle Static Data
        gl.bindBuffer(gl.ARRAY_BUFFER, particleBuffer)
        gl.bufferData(gl.ARRAY_BUFFER, particleData, gl.STATIC_DRAW)

        // Line Buffer: [x, y, z, alpha] (Dynamic)
        // Max edges = (N * (N-1)) / 2, but usually much less. Cap at 5000 lines (10000 vertices).
        const MAX_LINES = 5000
        const lineFloat32Stride = 4
        const lineData = new Float32Array(MAX_LINES * 2 * lineFloat32Stride)
        const lineBuffer = gl.createBuffer()
        
        gl.bindBuffer(gl.ARRAY_BUFFER, lineBuffer)
        gl.bufferData(gl.ARRAY_BUFFER, lineData.byteLength, gl.DYNAMIC_DRAW)

        // VAO Setup for Particles
        const particleVAO = gl.createVertexArray()
        gl.bindVertexArray(particleVAO)
        gl.bindBuffer(gl.ARRAY_BUFFER, particleBuffer)
        
        const floatBytes = 4
        const strideBytes = particleFloat32Stride * floatBytes
        
        // a_position
        gl.enableVertexAttribArray(0)
        gl.vertexAttribPointer(0, 3, gl.FLOAT, false, strideBytes, 0)
        // a_size
        gl.enableVertexAttribArray(1)
        gl.vertexAttribPointer(1, 1, gl.FLOAT, false, strideBytes, 3 * floatBytes)
        // a_color
        gl.enableVertexAttribArray(2)
        gl.vertexAttribPointer(2, 3, gl.FLOAT, false, strideBytes, 4 * floatBytes)
        // a_alpha
        gl.enableVertexAttribArray(3)
        gl.vertexAttribPointer(3, 1, gl.FLOAT, false, strideBytes, 7 * floatBytes)

        // VAO Setup for Lines
        const lineVAO = gl.createVertexArray()
        gl.bindVertexArray(lineVAO)
        gl.bindBuffer(gl.ARRAY_BUFFER, lineBuffer)
        // a_position
        gl.enableVertexAttribArray(0)
        gl.vertexAttribPointer(0, 3, gl.FLOAT, false, lineFloat32Stride * floatBytes, 0)
        // a_alpha
        gl.enableVertexAttribArray(1)
        gl.vertexAttribPointer(1, 1, gl.FLOAT, false, lineFloat32Stride * floatBytes, 3 * floatBytes)

        // --- 5. Mouse Subscription (100% decouple from React render) ---
        const unsubscribe = subscribe((e) => {
            // Map screen coords to -1 to 1 NDC
            mousePosRef.current.x = (e.clientX / window.innerWidth) * 2 - 1
            mousePosRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1
        })

        // --- 6. Matrices & Uniforms ---
        const projMatrix = createMat4()
        const viewMatrix = createMat4()
        const vpMatrix = createMat4()
        const eye = new Float32Array([0, 0, 15]) // Camera position
        const center = new Float32Array([0, 0, 0])
        const up = new Float32Array([0, 1, 0])

        // Uniform locations
        gl.useProgram(particleProgram)
        const uMatrixParticle = gl.getUniformLocation(particleProgram, 'u_matrix')
        const uTimeParticle = gl.getUniformLocation(particleProgram, 'u_time')
        const uPixelRatioParticle = gl.getUniformLocation(particleProgram, 'u_pixelRatio')

        gl.useProgram(lineProgram)
        const uMatrixLine = gl.getUniformLocation(lineProgram, 'u_matrix')
        const uTimeLine = gl.getUniformLocation(lineProgram, 'u_time')

        // Enable Additive Blending for the glow effect
        gl.enable(gl.BLEND)
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE)
        gl.disable(gl.DEPTH_TEST) // Not needed for glowing particles

        // --- 7. Resize Handler ---
        let pixelRatio = 1
        let width = window.innerWidth
        let height = window.innerHeight

        const handleResize = () => {
            width = window.innerWidth
            height = window.innerHeight
            
            // Limit DPR for performance, identical to old logic
            const isMobile = width <= 768
            pixelRatio = Math.min(window.devicePixelRatio, isMobile ? 1 : 1.5)
            
            canvas.width = width * pixelRatio
            canvas.height = height * pixelRatio
            gl.viewport(0, 0, canvas.width, canvas.height)

            // Update projection matrix
            perspective(projMatrix, Math.PI / 4, canvas.width / canvas.height, 0.1, 1000)
        }

        window.addEventListener('resize', handleResize)
        handleResize() // Initial call

        // --- 8. Main Render Loop ---
        let rafId
        let startTime = performance.now()

        const drawLoop = (currentTime) => {
            rafId = requestAnimationFrame(drawLoop)

            // Clear frame
            gl.clearColor(0.0, 0.0, 0.0, 0.0) // Transparent to show CSS background
            gl.clear(gl.COLOR_BUFFER_BIT)

            const elapsedTime = (currentTime - startTime) * 0.001

            // Mouse parallax effect (Camera Pan)
            // Interpolate towards mouse position
            const targetX = mousePosRef.current.x * 2.5
            const targetY = mousePosRef.current.y * 2.5
            
            eye[0] += (targetX - eye[0]) * 0.05
            eye[1] += (targetY - eye[1]) * 0.05
            
            lookAt(viewMatrix, eye, center, up)
            multiply(vpMatrix, projMatrix, viewMatrix)

            // --- A. Compute Connections (CPU side optimization) ---
            let lineCount = 0
            
            for (let i = 0; i < CONFIG.PARTICLE_COUNT; i++) {
                const iIdx = i * particleFloat32Stride
                const ix = particleData[iIdx]
                const iy = particleData[iIdx + 1]
                const iz = particleData[iIdx + 2]

                for (let j = i + 1; j < CONFIG.PARTICLE_COUNT; j++) {
                    const jIdx = j * particleFloat32Stride
                    const jx = particleData[jIdx]
                    const jy = particleData[jIdx + 1]
                    const jz = particleData[jIdx + 2]

                    const dx = ix - jx
                    const dy = iy - jy
                    const dz = iz - jz
                    const distSq = dx*dx + dy*dy + dz*dz

                    if (distSq < CONFIG.CONNECTION_DISTANCE * CONFIG.CONNECTION_DISTANCE) {
                        if (lineCount >= MAX_LINES) break

                        const alpha = 1.0 - (Math.sqrt(distSq) / CONFIG.CONNECTION_DISTANCE)
                        
                        const lIdx = lineCount * 2 * lineFloat32Stride
                        
                        // Vertex 1
                        lineData[lIdx] = ix
                        lineData[lIdx + 1] = iy
                        lineData[lIdx + 2] = iz
                        lineData[lIdx + 3] = alpha * 0.5 // Fade lines slightly
                        
                        // Vertex 2
                        lineData[lIdx + 4] = jx
                        lineData[lIdx + 5] = jy
                        lineData[lIdx + 6] = jz
                        lineData[lIdx + 7] = alpha * 0.5

                        lineCount++
                    }
                }
            }

            // Upload dynamic line data
            gl.bindBuffer(gl.ARRAY_BUFFER, lineBuffer)
            gl.bufferSubData(gl.ARRAY_BUFFER, 0, lineData, 0, lineCount * 2 * lineFloat32Stride)

            // --- B. Draw Particles ---
            gl.useProgram(particleProgram)
            gl.uniformMatrix4fv(uMatrixParticle, false, vpMatrix)
            gl.uniform1f(uTimeParticle, elapsedTime)
            gl.uniform1f(uPixelRatioParticle, pixelRatio)

            gl.bindVertexArray(particleVAO)
            gl.drawArrays(gl.POINTS, 0, CONFIG.PARTICLE_COUNT)

            // --- C. Draw Lines ---
            if (lineCount > 0) {
                gl.useProgram(lineProgram)
                gl.uniformMatrix4fv(uMatrixLine, false, vpMatrix)
                gl.uniform1f(uTimeLine, elapsedTime)

                gl.bindVertexArray(lineVAO)
                gl.drawArrays(gl.LINES, 0, lineCount * 2)
            }
        }

        rafId = requestAnimationFrame(drawLoop)

        // --- 9. Cleanup ---
        return () => {
            cancelAnimationFrame(rafId)
            unsubscribe()
            window.removeEventListener('resize', handleResize)
            
            // Hard delete WebGL resources
            gl.deleteBuffer(particleBuffer)
            gl.deleteBuffer(lineBuffer)
            gl.deleteProgram(particleProgram)
            gl.deleteProgram(lineProgram)
            gl.deleteVertexArray(particleVAO)
            gl.deleteVertexArray(lineVAO)
            
            // Force context loss to prevent massive memory leaks
            const ext = gl.getExtension('WEBGL_lose_context')
            if (ext) ext.loseContext()
        }
    }, [subscribe])

    return (
        <div className="neural-background">
            <div className="neural-gradient-overlay" />
            <canvas 
                ref={canvasRef} 
                className="neural-canvas"
                style={{ 
                    position: 'absolute', 
                    top: 0, left: 0, 
                    width: '100%', height: '100%', 
                    pointerEvents: 'none' 
                }}
            />

            {/* Ambient CSS Orbs for Depth (Unchanged) */}
            <div className="ambient-orbs">
                {CONFIG.AMBIENT_ORBS.map((orb, index) => (
                    <div
                        key={index}
                        className={`ambient-glow ambient-glow--${index + 1}`}
                        style={{
                            '--glow-color': `rgb(${orb.color[0] * 255}, ${orb.color[1] * 255}, ${orb.color[2] * 255})`,
                            left: `${(orb.position[0] / 20 + 0.5) * 100}%`,
                            top: `${(orb.position[1] / 20 + 0.5) * 100}%`,
                        }}
                    />
                ))}
            </div>
        </div>
    )
})

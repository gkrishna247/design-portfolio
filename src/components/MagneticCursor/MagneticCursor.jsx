import { useEffect, useState, useRef, useCallback, useMemo } from 'react'
import { motion, useSpring, useMotionValue } from 'framer-motion'
import './MagneticCursor.css'

export default function MagneticCursor() {
    // Use refs for hover/click state to avoid re-renders
    const arrowRef = useRef(null)
    const trailRef = useRef(null)
    const rafIdRef = useRef(null)

    const cursorX = useMotionValue(0)
    const cursorY = useMotionValue(0)

    // Optimized spring config per motion_guide - MAGNETIC preset
    const springConfig = useMemo(() => ({
        damping: 15,
        stiffness: 150,
        mass: 0.1,
        restDelta: 0.001
    }), [])

    const cursorXSpring = useSpring(cursorX, springConfig)
    const cursorYSpring = useSpring(cursorY, springConfig)

    // Lighter trail config - faster response
    const trailConfig = useMemo(() => ({
        damping: 25,
        stiffness: 80,
        mass: 0.3,
        restDelta: 0.001
    }), [])

    const trailX = useSpring(cursorX, trailConfig)
    const trailY = useSpring(cursorY, trailConfig)

    // Scale spring for click squish effect
    const scale = useMotionValue(1)
    const scaleSpring = useSpring(scale, { damping: 20, stiffness: 400 })

    // Memoized cursor move handler using refs to avoid re-renders
    const moveCursor = useCallback((e) => {
        if (rafIdRef.current) return
        rafIdRef.current = requestAnimationFrame(() => {
            cursorX.set(e.clientX)
            cursorY.set(e.clientY)
            rafIdRef.current = null
        })
    }, [cursorX, cursorY])

    // Handle hover/click via class manipulation (no re-renders)
    const handleMouseDown = useCallback(() => {
        scale.set(0.8)
        arrowRef.current?.classList.add('clicking')
    }, [scale])

    const handleMouseUp = useCallback(() => {
        scale.set(1)
        arrowRef.current?.classList.remove('clicking')
    }, [scale])

    const handleMouseOver = useCallback((e) => {
        const target = e.target.closest('[data-cursor]')
        if (target) {
            arrowRef.current?.classList.add('hovering')
            trailRef.current?.classList.add('hovering')
        }
    }, [])

    const handleMouseOut = useCallback((e) => {
        const target = e.target.closest('[data-cursor]')
        if (target) {
            arrowRef.current?.classList.remove('hovering')
            trailRef.current?.classList.remove('hovering')
        }
    }, [])

    useEffect(() => {
        window.addEventListener('mousemove', moveCursor, { passive: true })
        window.addEventListener('mousedown', handleMouseDown, { passive: true })
        window.addEventListener('mouseup', handleMouseUp, { passive: true })
        document.addEventListener('mouseover', handleMouseOver, { passive: true })
        document.addEventListener('mouseout', handleMouseOut, { passive: true })

        return () => {
            window.removeEventListener('mousemove', moveCursor)
            window.removeEventListener('mousedown', handleMouseDown)
            window.removeEventListener('mouseup', handleMouseUp)
            document.removeEventListener('mouseover', handleMouseOver)
            document.removeEventListener('mouseout', handleMouseOut)
            if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current)
        }
    }, [moveCursor, handleMouseDown, handleMouseUp, handleMouseOver, handleMouseOut])

    // Hide on touch devices
    const [isTouchDevice, setIsTouchDevice] = useState(false)
    useEffect(() => {
        setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0)
    }, [])

    if (isTouchDevice) return null

    return (
        <>
            {/* Main Arrow Cursor */}
            <motion.div
                ref={arrowRef}
                className="cursor-arrow"
                style={{
                    x: cursorXSpring,
                    y: cursorYSpring,
                    scale: scaleSpring
                }}
            >
                {/* Arrow SVG */}
                <svg
                    className="arrow-icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M4 2L20 12L12 14L8 22L4 2Z"
                        className="arrow-main"
                    />
                </svg>

                {/* Glow effect */}
                <div className="arrow-glow" />
            </motion.div>

            {/* Trail Arrow (follows with delay) */}
            <motion.div
                ref={trailRef}
                className="cursor-arrow-trail"
                style={{
                    x: trailX,
                    y: trailY,
                }}
            >
                <svg
                    className="arrow-icon-trail"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M4 2L20 12L12 14L8 22L4 2Z"
                        className="arrow-trail-path"
                    />
                </svg>
            </motion.div>
        </>
    )
}

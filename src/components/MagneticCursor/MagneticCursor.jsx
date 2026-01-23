import { useEffect, useState, useRef } from 'react'
import { motion, useSpring, useMotionValue } from 'framer-motion'
import './MagneticCursor.css'

export default function MagneticCursor() {
    const [isHovering, setIsHovering] = useState(false)
    const [hoverText, setHoverText] = useState('')
    const [isClicking, setIsClicking] = useState(false)

    const cursorX = useMotionValue(0)
    const cursorY = useMotionValue(0)

    // Spring config for smooth movement
    const springConfig = { damping: 25, stiffness: 400, mass: 0.5 }
    const cursorXSpring = useSpring(cursorX, springConfig)
    const cursorYSpring = useSpring(cursorY, springConfig)

    // Slower spring for the trail arrow
    const trailConfig = { damping: 30, stiffness: 150, mass: 1 }
    const trailX = useSpring(cursorX, trailConfig)
    const trailY = useSpring(cursorY, trailConfig)

    useEffect(() => {
        let rafId = null

        const moveCursor = (e) => {
            if (rafId) return
            rafId = requestAnimationFrame(() => {
                cursorX.set(e.clientX)
                cursorY.set(e.clientY)
                rafId = null
            })
        }

        const handleMouseDown = () => setIsClicking(true)
        const handleMouseUp = () => setIsClicking(false)

        const handleMouseOver = (e) => {
            const target = e.target.closest('[data-cursor]')
            if (target) {
                setIsHovering(true)
                setHoverText(target.dataset.cursorText || '')
            }
        }

        const handleMouseOut = (e) => {
            const target = e.target.closest('[data-cursor]')
            if (target) {
                setIsHovering(false)
                setHoverText('')
            }
        }

        window.addEventListener('mousemove', moveCursor, { passive: true })
        window.addEventListener('mousedown', handleMouseDown)
        window.addEventListener('mouseup', handleMouseUp)
        document.addEventListener('mouseover', handleMouseOver)
        document.addEventListener('mouseout', handleMouseOut)

        return () => {
            window.removeEventListener('mousemove', moveCursor)
            window.removeEventListener('mousedown', handleMouseDown)
            window.removeEventListener('mouseup', handleMouseUp)
            document.removeEventListener('mouseover', handleMouseOver)
            document.removeEventListener('mouseout', handleMouseOut)
            if (rafId) cancelAnimationFrame(rafId)
        }
    }, [cursorX, cursorY])

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
                className={`cursor-arrow ${isHovering ? 'hovering' : ''} ${isClicking ? 'clicking' : ''}`}
                style={{
                    x: cursorXSpring,
                    y: cursorYSpring,
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
                        d="M5.5 3.21V20.8C5.5 21.86 6.72 22.46 7.55 21.79L12.32 17.95L18.16 21.17C18.88 21.56 19.77 21.07 19.9 20.25L22.39 4.54C22.55 3.51 21.46 2.73 20.52 3.18L6.56 9.81"
                        className="arrow-fill"
                    />
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
                className={`cursor-arrow-trail ${isHovering ? 'hovering' : ''}`}
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

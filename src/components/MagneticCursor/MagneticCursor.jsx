import { useEffect, useState, useRef, useCallback } from 'react'
import { useAnimationFrame } from 'framer-motion'
import { useMouseMotion } from '../../context/MouseMotionContext'
import './MagneticCursor.css'

/**
 * Instant arrow cursor - no lag, direct DOM transforms.
 */
export default function MagneticCursor() {
    const arrowRef = useRef(null)
    const { mouseX, mouseY } = useMouseMotion()
    const lastPos = useRef({ x: 0, y: 0 })

    // Use animation frame for smooth updates without redundant DOM writes
    useAnimationFrame(() => {
        const x = mouseX.get()
        const y = mouseY.get()

        if (arrowRef.current && (x !== lastPos.current.x || y !== lastPos.current.y)) {
            arrowRef.current.style.transform = `translate(${x}px, ${y}px)`
            lastPos.current = { x, y }
        }
    })

    const handleMouseDown = useCallback(() => {
        arrowRef.current?.classList.add('clicking')
    }, [])

    const handleMouseUp = useCallback(() => {
        arrowRef.current?.classList.remove('clicking')
    }, [])

    const handleMouseOver = useCallback((e) => {
        if (e.target.closest('[data-cursor]')) {
            arrowRef.current?.classList.add('hovering')
        }
    }, [])

    const handleMouseOut = useCallback((e) => {
        if (e.target.closest('[data-cursor]')) {
            arrowRef.current?.classList.remove('hovering')
        }
    }, [])

    useEffect(() => {
        window.addEventListener('mousedown', handleMouseDown, { passive: true })
        window.addEventListener('mouseup', handleMouseUp, { passive: true })
        document.addEventListener('mouseover', handleMouseOver, { passive: true })
        document.addEventListener('mouseout', handleMouseOut, { passive: true })

        return () => {
            window.removeEventListener('mousedown', handleMouseDown)
            window.removeEventListener('mouseup', handleMouseUp)
            document.removeEventListener('mouseover', handleMouseOver)
            document.removeEventListener('mouseout', handleMouseOut)
        }
    }, [handleMouseDown, handleMouseUp, handleMouseOver, handleMouseOut])

    // Hide on touch devices
    const [isTouchDevice, setIsTouchDevice] = useState(false)
    useEffect(() => {
        setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0)
    }, [])

    if (isTouchDevice) return null

    return (
        <div ref={arrowRef} className="cursor-arrow">
            <svg viewBox="0 0 24 24" fill="none" className="arrow-svg">
                <path d="M4 2L20 12L12 14L8 22L4 2Z" className="arrow-path" />
            </svg>
            <div className="arrow-glow" />
        </div>
    )
}

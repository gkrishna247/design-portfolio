import { useEffect, useState, useRef, useCallback } from 'react'
import './MagneticCursor.css'

/**
 * Instant arrow cursor - no lag, direct DOM transforms.
 */
export default function MagneticCursor() {
    const arrowRef = useRef(null)
    const rafId = useRef(null)
    const mousePos = useRef({ x: 0, y: 0 })

    // Direct DOM update - no React, no springs, instant
    const updateCursor = useCallback(() => {
        if (arrowRef.current) {
            arrowRef.current.style.transform = `translate(${mousePos.current.x}px, ${mousePos.current.y}px)`
        }
        rafId.current = null
    }, [])

    const handleMouseMove = useCallback((e) => {
        mousePos.current = { x: e.clientX, y: e.clientY }

        if (!rafId.current) {
            rafId.current = requestAnimationFrame(updateCursor)
        }
    }, [updateCursor])

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
        window.addEventListener('mousemove', handleMouseMove, { passive: true })
        window.addEventListener('mousedown', handleMouseDown, { passive: true })
        window.addEventListener('mouseup', handleMouseUp, { passive: true })
        document.addEventListener('mouseover', handleMouseOver, { passive: true })
        document.addEventListener('mouseout', handleMouseOut, { passive: true })

        return () => {
            window.removeEventListener('mousemove', handleMouseMove)
            window.removeEventListener('mousedown', handleMouseDown)
            window.removeEventListener('mouseup', handleMouseUp)
            document.removeEventListener('mouseover', handleMouseOver)
            document.removeEventListener('mouseout', handleMouseOut)
            if (rafId.current) cancelAnimationFrame(rafId.current)
        }
    }, [handleMouseMove, handleMouseDown, handleMouseUp, handleMouseOver, handleMouseOut])

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

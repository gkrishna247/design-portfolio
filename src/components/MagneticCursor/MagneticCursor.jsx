import { useEffect, useState, useRef, useCallback } from 'react'
import './MagneticCursor.css'

/**
 * Simple, lag-free cursor using direct DOM transforms.
 * No Framer Motion springs = instant response.
 */
export default function MagneticCursor() {
    const cursorRef = useRef(null)
    const dotRef = useRef(null)
    const rafId = useRef(null)
    const mousePos = useRef({ x: 0, y: 0 })

    // Direct DOM update - no React, no springs, instant
    const updateCursor = useCallback(() => {
        if (cursorRef.current) {
            cursorRef.current.style.transform = `translate(${mousePos.current.x}px, ${mousePos.current.y}px)`
        }
        if (dotRef.current) {
            dotRef.current.style.transform = `translate(${mousePos.current.x}px, ${mousePos.current.y}px)`
        }
        rafId.current = null
    }, [])

    const handleMouseMove = useCallback((e) => {
        mousePos.current = { x: e.clientX, y: e.clientY }

        // Schedule update on next frame if not already scheduled
        if (!rafId.current) {
            rafId.current = requestAnimationFrame(updateCursor)
        }
    }, [updateCursor])

    const handleMouseDown = useCallback(() => {
        cursorRef.current?.classList.add('clicking')
    }, [])

    const handleMouseUp = useCallback(() => {
        cursorRef.current?.classList.remove('clicking')
    }, [])

    const handleMouseOver = useCallback((e) => {
        if (e.target.closest('[data-cursor]')) {
            cursorRef.current?.classList.add('hovering')
        }
    }, [])

    const handleMouseOut = useCallback((e) => {
        if (e.target.closest('[data-cursor]')) {
            cursorRef.current?.classList.remove('hovering')
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
        <>
            {/* Center dot - instant */}
            <div ref={dotRef} className="cursor-dot" />

            {/* Ring cursor */}
            <div ref={cursorRef} className="cursor-ring">
                <div className="cursor-ring-inner" />
            </div>
        </>
    )
}


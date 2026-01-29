import { useEffect, useState, useRef, useCallback } from 'react'
import './MagneticCursor.css'

/**
 * MagneticCursor - Enhanced with stickiness & fade on window leave
 * 
 * Features:
 * - Instant tracking (no lag)
 * - Fade opacity on mouseleave
 * - Spring physics for clickable elements
 * - GPU-accelerated transforms
 */
export default function MagneticCursor() {
    const arrowRef = useRef(null)
    const rafId = useRef(null)
    const mousePos = useRef({ x: 0, y: 0 })
    const targetPos = useRef({ x: 0, y: 0 })
    const isHovering = useRef(false)

    // Direct DOM update - no React, no springs, instant
    const updateCursor = useCallback(() => {
        if (!arrowRef.current) return

        // Smooth lerp to target for stickiness effect
        if (isHovering.current) {
            mousePos.current.x += (targetPos.current.x - mousePos.current.x) * 0.15
            mousePos.current.y += (targetPos.current.y - mousePos.current.y) * 0.15
        }

        arrowRef.current.style.transform = `translate(${mousePos.current.x}px, ${mousePos.current.y}px)`
        rafId.current = null
    }, [])

    const handleMouseMove = useCallback((e) => {
        mousePos.current = { x: e.clientX, y: e.clientY }
        targetPos.current = { x: e.clientX, y: e.clientY }

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
        const clickableElement = e.target.closest('[data-cursor], a, button')
        if (clickableElement) {
            arrowRef.current?.classList.add('hovering')
            isHovering.current = true
            // Get element center for stickiness
            const rect = clickableElement.getBoundingClientRect()
            targetPos.current = {
                x: rect.left + rect.width / 2,
                y: rect.top + rect.height / 2
            }
        }
    }, [])

    const handleMouseOut = useCallback((e) => {
        const clickableElement = e.target.closest('[data-cursor], a, button')
        if (clickableElement) {
            arrowRef.current?.classList.remove('hovering')
            isHovering.current = false
        }
    }, [])

    // Fade cursor on window leave
    const handleMouseLeave = useCallback(() => {
        arrowRef.current?.classList.add('hidden')
    }, [])

    // Restore cursor on window enter
    const handleMouseEnter = useCallback(() => {
        arrowRef.current?.classList.remove('hidden')
    }, [])

    useEffect(() => {
        window.addEventListener('mousemove', handleMouseMove, { passive: true })
        window.addEventListener('mousedown', handleMouseDown, { passive: true })
        window.addEventListener('mouseup', handleMouseUp, { passive: true })
        document.addEventListener('mouseover', handleMouseOver, { passive: true })
        document.addEventListener('mouseout', handleMouseOut, { passive: true })
        document.addEventListener('mouseleave', handleMouseLeave, { passive: true })
        document.addEventListener('mouseenter', handleMouseEnter, { passive: true })

        return () => {
            window.removeEventListener('mousemove', handleMouseMove)
            window.removeEventListener('mousedown', handleMouseDown)
            window.removeEventListener('mouseup', handleMouseUp)
            document.removeEventListener('mouseover', handleMouseOver)
            document.removeEventListener('mouseout', handleMouseOut)
            document.removeEventListener('mouseleave', handleMouseLeave)
            document.removeEventListener('mouseenter', handleMouseEnter)
            if (rafId.current) cancelAnimationFrame(rafId.current)
        }
    }, [handleMouseMove, handleMouseDown, handleMouseUp, handleMouseOver, handleMouseOut, handleMouseLeave, handleMouseEnter])

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

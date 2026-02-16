import { useEffect, useState, useRef, useCallback } from 'react'
import { useMouse } from '../../contexts/MouseContext'
import './MagneticCursor.css'

/**
 * Instant arrow cursor - no lag, direct DOM transforms.
 */
export default function MagneticCursor() {
    const { mouseRef, subscribe } = useMouse()
    const arrowRef = useRef(null)
    const rafId = useRef(null)

    // Check touch capability immediately to avoid setting up listeners on mobile
    const [isTouchDevice] = useState(() => {
        if (typeof window === 'undefined') return false
        return 'ontouchstart' in window || navigator.maxTouchPoints > 0
    })

    // Direct DOM update - no React, no springs, instant
    const updateCursor = useCallback(() => {
        if (arrowRef.current && mouseRef.current) {
            const { x, y } = mouseRef.current
            arrowRef.current.style.transform = `translate(${x}px, ${y}px)`
        }
        rafId.current = null
    }, [mouseRef])

    // Subscribe to global mouse moves via context
    useEffect(() => {
        if (isTouchDevice) return

        const unsubscribe = subscribe(() => {
            if (!rafId.current) {
                rafId.current = requestAnimationFrame(updateCursor)
            }
        })

        return () => {
            unsubscribe()
            if (rafId.current) cancelAnimationFrame(rafId.current)
        }
    }, [subscribe, updateCursor, isTouchDevice])

    const handleMouseDown = useCallback(() => {
        arrowRef.current?.classList.add('clicking')
    }, [])

    const handleMouseUp = useCallback(() => {
        arrowRef.current?.classList.remove('clicking')
    }, [])

    useEffect(() => {
        if (isTouchDevice) return

        window.addEventListener('mousedown', handleMouseDown, { passive: true })
        window.addEventListener('mouseup', handleMouseUp, { passive: true })

        const handleMouseEnter = () => arrowRef.current?.classList.add('hovering')
        const handleMouseLeave = () => arrowRef.current?.classList.remove('hovering')

        const attach = (el) => {
            el.addEventListener('mouseenter', handleMouseEnter)
            el.addEventListener('mouseleave', handleMouseLeave)
        }

        const detach = (el) => {
            el.removeEventListener('mouseenter', handleMouseEnter)
            el.removeEventListener('mouseleave', handleMouseLeave)
        }

        // Initial scan
        document.querySelectorAll('[data-cursor]').forEach(attach)

        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === 1) {
                            if (node.matches('[data-cursor]')) attach(node)
                            node.querySelectorAll('[data-cursor]').forEach(attach)
                        }
                    })
                    mutation.removedNodes.forEach((node) => {
                        if (node.nodeType === 1) {
                            if (node.matches('[data-cursor]')) detach(node)
                            node.querySelectorAll('[data-cursor]').forEach(detach)
                        }
                    })
                } else if (mutation.type === 'attributes') {
                    if (mutation.target.hasAttribute('data-cursor')) {
                        attach(mutation.target)
                    } else {
                        detach(mutation.target)
                    }
                }
            })
        })

        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['data-cursor']
        })

        return () => {
            window.removeEventListener('mousedown', handleMouseDown)
            window.removeEventListener('mouseup', handleMouseUp)

            observer.disconnect()
            document.querySelectorAll('[data-cursor]').forEach(detach)

            if (rafId.current) cancelAnimationFrame(rafId.current)
        }
    }, [handleMouseDown, handleMouseUp, isTouchDevice])

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

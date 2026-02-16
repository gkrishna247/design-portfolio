import { createContext, useContext, useEffect, useRef, useCallback, useMemo } from 'react'

const MouseContext = createContext(null)

export function MouseProvider({ children }) {
    // Store mouse position in a ref to avoid re-renders
    const mouseRef = useRef({ x: 0, y: 0, clientX: 0, clientY: 0 })
    const isInitialized = useRef(false)

    // Store subscribers who need to react to every mouse move event
    const subscribers = useRef(new Set())

    // Stable subscribe function
    const subscribe = useCallback((callback) => {
        subscribers.current.add(callback)
        return () => subscribers.current.delete(callback)
    }, [])

    useEffect(() => {
        // Optimization: Don't attach listener on touch devices
        // Matching logic from MagneticCursor to ensure consistency
        const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0
        if (isTouchDevice) return

        const handleMouseMove = (e) => {
            // Update the shared ref
            isInitialized.current = true
            mouseRef.current = {
                x: e.clientX,
                y: e.clientY,
                clientX: e.clientX,
                clientY: e.clientY
            }

            // Notify subscribers
            subscribers.current.forEach(callback => callback(e))
        }

        window.addEventListener('mousemove', handleMouseMove, { passive: true })

        return () => {
            window.removeEventListener('mousemove', handleMouseMove)
        }
    }, [])

    const value = useMemo(() => ({
        mouseRef,
        isInitialized,
        subscribe
    }), [subscribe])

    return (
        <MouseContext.Provider value={value}>
            {children}
        </MouseContext.Provider>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useMouse() {
    const context = useContext(MouseContext)
    if (!context) {
        throw new Error('useMouse must be used within a MouseProvider')
    }
    return context
}

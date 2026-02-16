import { createContext, useContext, useEffect, useMemo } from 'react';
import { useMotionValue } from 'framer-motion';

const MouseMotionContext = createContext(null);

export function MouseMotionProvider({ children }) {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    useEffect(() => {
        const handleMouseMove = (e) => {
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);
        };

        window.addEventListener('mousemove', handleMouseMove, { passive: true });
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [mouseX, mouseY]);

    const value = useMemo(() => ({ mouseX, mouseY }), [mouseX, mouseY]);

    return (
        <MouseMotionContext.Provider value={value}>
            {children}
        </MouseMotionContext.Provider>
    );
}

export function useMouseMotion() {
    const context = useContext(MouseMotionContext);
    if (!context) {
        throw new Error('useMouseMotion must be used within a MouseMotionProvider');
    }
    return context;
}

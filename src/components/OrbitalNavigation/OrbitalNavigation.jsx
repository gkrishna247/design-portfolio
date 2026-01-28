import { useState, useEffect, useRef } from 'react'
import { motion, useTransform, AnimatePresence } from 'framer-motion'
import './OrbitalNavigation.css'

const navItems = [
    { id: 'hero', label: '01', fullLabel: 'NEURAL_CORE', icon: '◉' },
    { id: 'about', label: '02', fullLabel: 'IDENTITY', icon: '◈' },
    { id: 'projects', label: '03', fullLabel: 'PROJECTS', icon: '◇' },
    { id: 'skills', label: '04', fullLabel: 'ARSENAL', icon: '⬡' },
    { id: 'experience', label: '05', fullLabel: 'TIMELINE', icon: '◎' },
    { id: 'contact', label: '06', fullLabel: 'CONNECT', icon: '◉' },
].map((item, index) => {
    const angle = (index * 60) - 90 // Start from top
    const radius = 100 // Distance from center
    const x = Math.cos((angle * Math.PI) / 180) * radius
    const y = Math.sin((angle * Math.PI) / 180) * radius
    return { ...item, x, y }
})

export default function OrbitalNavigation({ activeSection, scrollProgress }) {
    const [isExpanded, setIsExpanded] = useState(false)
    const [hoveredItem, setHoveredItem] = useState(null)
    const navRef = useRef(null)

    const rotation = useTransform(scrollProgress, [0, 1], [0, 360])

    const scrollToSection = (id) => {
        const element = document.getElementById(id)
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' })
        }
        setIsExpanded(false)
    }

    // Close on outside click
    useEffect(() => {
        const handleClick = (e) => {
            if (navRef.current && !navRef.current.contains(e.target)) {
                setIsExpanded(false)
            }
        }
        document.addEventListener('click', handleClick)
        return () => document.removeEventListener('click', handleClick)
    }, [])

    // Close on Escape key press
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && isExpanded) {
                setIsExpanded(false)
            }
        }
        document.addEventListener('keydown', handleKeyDown)
        return () => document.removeEventListener('keydown', handleKeyDown)
    }, [isExpanded])

    return (
        <nav
            ref={navRef}
            className={`orbital-nav ${isExpanded ? 'expanded' : ''}`}
            onMouseEnter={() => setIsExpanded(true)}
            onMouseLeave={() => setIsExpanded(false)}
        >
            {/* Central orb */}
            <motion.button
                className="orbital-core"
                onClick={() => setIsExpanded(!isExpanded)}
                aria-label={isExpanded ? "Close navigation menu" : "Open navigation menu"}
                aria-expanded={isExpanded}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                data-cursor
                data-cursor-text="NAV"
            >
                <motion.div
                    className="orbital-core-inner"
                    style={{ rotate: rotation }}
                >
                    <span className="orbital-core-icon">⬡</span>
                </motion.div>
                <div className="orbital-core-ring" />
                <div className="orbital-core-ring orbital-core-ring--2" />
            </motion.button>

            {/* Orbital items */}
            <AnimatePresence>
                {isExpanded && (
                    <div className="orbital-items">
                        {navItems.map((item, index) => {
                            const isActive = activeSection === item.id

                            return (
                                <motion.button
                                    key={item.id}
                                    className={`orbital-item ${isActive ? 'active' : ''}`}
                                    aria-label={`Navigate to ${item.fullLabel} section`}
                                    aria-current={isActive ? 'page' : undefined}
                                    initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                                    animate={{
                                        opacity: 1,
                                        scale: 1,
                                        x: item.x,
                                        y: item.y,
                                        transition: { delay: index * 0.05, type: 'spring' }
                                    }}
                                    exit={{
                                        opacity: 0,
                                        scale: 0,
                                        x: 0,
                                        y: 0,
                                        transition: { delay: (navItems.length - index) * 0.03 }
                                    }}
                                    onClick={() => scrollToSection(item.id)}
                                    onMouseEnter={() => setHoveredItem(item.id)}
                                    onMouseLeave={() => setHoveredItem(null)}
                                    whileHover={{ scale: 1.2 }}
                                    data-cursor
                                >
                                    <span className="orbital-item-icon">{item.icon}</span>
                                    <span className="orbital-item-label mono">{item.label}</span>
                                </motion.button>
                            )
                        })}
                    </div>
                )}
            </AnimatePresence>

            {/* Tooltip */}
            <AnimatePresence>
                {hoveredItem && (
                    <motion.div
                        className="orbital-tooltip"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                    >
                        <span className="mono">
                            {navItems.find(n => n.id === hoveredItem)?.fullLabel}
                        </span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Connection lines */}
            {isExpanded && (
                <svg className="orbital-lines" width="240" height="240" viewBox="-120 -120 240 240">
                    {navItems.map((item, index) => {
                        return (
                            <motion.line
                                key={item.id}
                                x1="0"
                                y1="0"
                                x2={item.x}
                                y2={item.y}
                                stroke="rgba(168, 85, 247, 0.3)"
                                strokeWidth="1"
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                                transition={{ delay: index * 0.05, duration: 0.3 }}
                            />
                        )
                    })}
                </svg>
            )}
        </nav>
    )
}

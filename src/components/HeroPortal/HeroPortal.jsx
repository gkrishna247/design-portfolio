import { useState, useEffect, useRef } from 'react'
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion'
import { useMouse } from '../../contexts/MouseContext'
import './HeroPortal.css'

// Text scramble effect hook
function useScrambleText(text, isActive) {
    const [displayText, setDisplayText] = useState('')
    const chars = '!<>-_\\/[]{}—=+*^?#_01アイウエオカキクケコ'

    useEffect(() => {
        if (!isActive) {
            setDisplayText('')
            return
        }

        let iteration = 0
        const totalIterations = text.length * 2 // Ensure we complete all characters

        const interval = setInterval(() => {
            setDisplayText(
                text
                    .split('')
                    .map((letter, index) => {
                        if (index < Math.floor(iteration / 2)) {
                            return text[index]
                        }
                        return chars[Math.floor(Math.random() * chars.length)]
                    })
                    .join('')
            )

            iteration++

            if (iteration >= totalIterations) {
                setDisplayText(text) // Ensure final text is correct
                clearInterval(interval)
            }
        }, 50)

        return () => clearInterval(interval)
    }, [text, isActive])

    return displayText || text // Fallback to full text
}

export default function HeroPortal({ isLoaded }) {
    const containerRef = useRef(null)

    // Performance optimization: Use motion values instead of state to prevent re-renders
    const mouseX = useMotionValue(0.5)
    const mouseY = useMotionValue(0.5)

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"]
    })

    // Parallax transforms
    const titleY = useTransform(scrollYProgress, [0, 1], [0, 200])
    const subtitleY = useTransform(scrollYProgress, [0, 1], [0, 100])
    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
    const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8])

    const springConfig = { stiffness: 100, damping: 30 }
    const titleYSpring = useSpring(titleY, springConfig)
    const subtitleYSpring = useSpring(subtitleY, springConfig)

    // Fragment parallax transforms based on mouse motion values
    // Using simple linear mapping: input [0, 1] -> output [min, max]
    const frag1X = useTransform(mouseX, [0, 1], [-15, 15])
    const frag1Y = useTransform(mouseY, [0, 1], [-15, 15])

    const frag2X = useTransform(mouseX, [0, 1], [20, -20])
    const frag2Y = useTransform(mouseY, [0, 1], [20, -20])

    const frag3X = useTransform(mouseX, [0, 1], [-10, 10])
    const frag3Y = useTransform(mouseY, [0, 1], [10, -10])

    const scrambledName = useScrambleText('ALEX.DEV', isLoaded)
    const scrambledTitle = useScrambleText('AI ENGINEER', isLoaded)

    const { subscribe } = useMouse()

    // Optimized: Event listener using motion values directly
    useEffect(() => {
        let rafId = null

        const unsubscribe = subscribe((e) => {
            if (!containerRef.current) return

            if (rafId) return

            const { clientX, clientY } = e

            rafId = requestAnimationFrame(() => {
                if (containerRef.current) {
                    const rect = containerRef.current.getBoundingClientRect()
                    const x = (clientX - rect.left) / rect.width
                    const y = (clientY - rect.top) / rect.height

                    mouseX.set(x)
                    mouseY.set(y)
                }
                rafId = null
            })
        })

        return () => {
            unsubscribe()
            if (rafId) cancelAnimationFrame(rafId)
        }
    }, [subscribe, mouseX, mouseY])

    return (
        <div className="hero-portal" ref={containerRef}>
            {/* Animated grid background */}
            <div className="hero-grid">
                <div className="hero-grid-line hero-grid-line--h" />
                <div className="hero-grid-line hero-grid-line--v" />
            </div>

            {/* Central portal effect */}
            <motion.div
                className="portal-container"
                style={{ opacity, scale }}
            >
                {/* Floating fragments */}
                <motion.div
                    className="portal-fragment portal-fragment--1"
                    style={{ x: frag1X, y: frag1Y }}
                    animate={{
                        rotate: [0, 5, -5, 0],
                    }}
                    transition={{ rotate: { duration: 10, repeat: Infinity } }}
                />
                <motion.div
                    className="portal-fragment portal-fragment--2"
                    style={{ x: frag2X, y: frag2Y }}
                    animate={{
                        rotate: [0, -5, 5, 0],
                    }}
                    transition={{ rotate: { duration: 12, repeat: Infinity } }}
                />
                <motion.div
                    className="portal-fragment portal-fragment--3"
                    style={{ x: frag3X, y: frag3Y }}
                />

                {/* Main content */}
                <motion.div
                    className="hero-content"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 0.5 }}
                >
                    {/* Status indicator */}
                    <motion.div
                        className="hero-status"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 }}
                    >
                        <span className="status-dot" />
                        <span className="mono">AVAILABLE FOR OPPORTUNITIES</span>
                    </motion.div>

                    {/* Name with glitch effect */}
                    <motion.h1
                        className="hero-name glitch"
                        style={{ y: titleYSpring }}
                        data-text={scrambledName}
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.3 }}
                    >
                        <span className="hero-name-text gradient-text-aurora">
                            {scrambledName}
                        </span>
                    </motion.h1>

                    {/* Title */}
                    <motion.div
                        className="hero-title-container"
                        style={{ y: subtitleYSpring }}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.6 }}
                    >
                        <div className="hero-title-line" />
                        <h2 className="hero-title mono">{scrambledTitle}</h2>
                        <div className="hero-title-line" />
                    </motion.div>

                    {/* Description */}
                    <motion.p
                        className="hero-description"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1 }}
                    >
                        Transforming complex data into intelligent solutions.
                        <br />
                        <span className="text-highlight">Computer Vision</span> ·
                        <span className="text-highlight"> NLP</span> ·
                        <span className="text-highlight"> Deep Learning</span>
                    </motion.p>

                    {/* CTA Buttons */}
                    <motion.div
                        className="hero-actions"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.2 }}
                    >
                        <motion.button
                            className="hero-btn hero-btn--primary"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            data-cursor
                            data-cursor-text="VIEW"
                            onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
                        >
                            <span className="hero-btn-text">EXPLORE WORK</span>
                            <span className="hero-btn-icon">→</span>
                        </motion.button>

                        <motion.button
                            className="hero-btn hero-btn--secondary"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            data-cursor
                            data-cursor-text="CONNECT"
                            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                        >
                            <span className="hero-btn-text">GET IN TOUCH</span>
                        </motion.button>
                    </motion.div>
                </motion.div>
            </motion.div>

            {/* Scroll indicator */}
            <motion.div
                className="scroll-indicator"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2 }}
            >
                <motion.div
                    className="scroll-indicator-line"
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                />
                <span className="mono">SCROLL</span>
            </motion.div>

            {/* Corner decorations */}
            <div className="hero-corner hero-corner--tl">
                <span className="mono">NEURAL_FLUX</span>
                <span className="mono dim">v2.0</span>
            </div>
            <div className="hero-corner hero-corner--tr">
                <span className="mono">BANGALORE, IN</span>
                <span className="mono dim">12.9716°N</span>
            </div>
            <div className="hero-corner hero-corner--bl">
                <span className="mono">© 2026</span>
            </div>
            <div className="hero-corner hero-corner--br">
                <span className="mono">PORTFOLIO</span>
            </div>
        </div>
    )
}

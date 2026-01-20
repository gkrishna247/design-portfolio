import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Suspense, lazy } from 'react'
import './Hero.css'

const Scene = lazy(() => import('./Scene'))

export default function Hero() {
    const [text, setText] = useState('')
    const fullText = "Aspiring AI Engineer | Turning Data into Intelligence..."

    useEffect(() => {
        let index = 0
        const timer = setInterval(() => {
            setText(fullText.slice(0, index))
            index++
            if (index > fullText.length) clearInterval(timer)
        }, 50)
        return () => clearInterval(timer)
    }, [])

    return (
        <section className="hero-section" id="hero">
            <div className="hero-content">
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1 }}
                >
                    <h1 className="hero-title">ALEX.DEV</h1>
                    <div className="hero-terminal mono">
                        <span className="prompt">{'>'}</span> {text}
                        <span className="cursor-blink">_</span>
                    </div>
                </motion.div>
            </div>

            <div className="hero-visual">
                <Suspense fallback={null}>
                    <Scene />
                </Suspense>
            </div>
        </section>
    )
}

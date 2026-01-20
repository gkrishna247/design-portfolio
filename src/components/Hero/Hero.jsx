import { Suspense, lazy } from 'react'
import { motion } from 'framer-motion'
import './Hero.css'

const Scene = lazy(() => import('./Scene'))

export default function Hero() {
    return (
        <section className="hero-section">
            <div className="hero-background">
                <Suspense fallback={null}>
                    <Scene />
                </Suspense>
            </div>

            <div className="hero-content">
                <motion.h1
                    className="hero-title"
                    initial={{ opacity: 0, y: 100 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.5, ease: [0.19, 1, 0.22, 1] }}
                >
                    ALEX<br />
                    <span className="outline-text">DEV</span>
                </motion.h1>
                <motion.p
                    className="hero-tagline"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1.5, delay: 0.5, ease: [0.19, 1, 0.22, 1] }}
                >
                    Aspiring AI Engineer | Turning Data into Intelligence
                </motion.p>
            </div>
        </section>
    )
}

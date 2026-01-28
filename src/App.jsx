import { useEffect, useRef, useState, lazy, Suspense, useMemo } from 'react'
import { motion, useScroll, useSpring, AnimatePresence } from 'framer-motion'
import Lenis from 'lenis'

// Eagerly loaded components (above the fold / critical path)
import MagneticCursor from './components/MagneticCursor/MagneticCursor'
import OrbitalNavigation from './components/OrbitalNavigation/OrbitalNavigation'
import HeroPortal from './components/HeroPortal/HeroPortal'
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary'

// Lazy loaded components (deferred loading for better initial performance)
const NeuralBackground = lazy(() => import('./components/NeuralBackground/NeuralBackground'))
const FloatingIdentity = lazy(() => import('./components/FloatingIdentity/FloatingIdentity'))
const ProjectsConstellation = lazy(() => import('./components/ProjectsConstellation/ProjectsConstellation'))
const SkillsOrbit = lazy(() => import('./components/SkillsOrbit/SkillsOrbit'))
const ExperienceTimeline = lazy(() => import('./components/ExperienceTimeline/ExperienceTimeline'))
const ContactPortal = lazy(() => import('./components/ContactPortal/ContactPortal'))

// Styles
import './styles/index.css'
import './App.css'

function App() {
  const containerRef = useRef(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [activeSection, setActiveSection] = useState('hero')

  // Detect reduced motion preference for accessibility
  const prefersReducedMotion = useMemo(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }, [])

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  })

  // Reduce spring intensity for users who prefer reduced motion
  const springConfig = prefersReducedMotion
    ? { stiffness: 300, damping: 50, restDelta: 0.01 }
    : { stiffness: 100, damping: 30, restDelta: 0.001 }

  const smoothProgress = useSpring(scrollYProgress, springConfig)

  useEffect(() => {
    // Lenis smooth scroll initialization
    // Reduce scroll smoothness for accessibility
    const lenis = new Lenis({
      duration: prefersReducedMotion ? 0 : 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: !prefersReducedMotion,
    })

    let rafId

    function raf(time) {
      lenis.raf(time)
      rafId = requestAnimationFrame(raf)
    }

    rafId = requestAnimationFrame(raf)

    /**
     * FOUC Prevention Delay
     * 
     * This 100ms delay is intentional and necessary:
     * 1. Lenis needs time to attach scroll listeners and calculate dimensions
     * 2. React needs to complete hydration before entrance animations
     * 3. Prevents flash of unstyled content during initial render
     * 
     * Alternatives considered:
     * - requestIdleCallback: Not supported in Safari
     * - document.readyState: Fires before layout stabilizes
     * - Removing delay: Causes visible content flash
     */
    setTimeout(() => setIsLoaded(true), 100)

    return () => {
      lenis.destroy()
      cancelAnimationFrame(rafId)
    }
  }, [prefersReducedMotion])

  // Update active section based on scroll
  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (value) => {
      if (value < 0.2) setActiveSection('hero')
      else if (value < 0.4) setActiveSection('about')
      else if (value < 0.6) setActiveSection('projects')
      else if (value < 0.8) setActiveSection('skills')
      else setActiveSection('contact')
    })

    return () => unsubscribe()
  }, [scrollYProgress])

  return (
    <div className="neural-flux-app" ref={containerRef}>
      {/* Noise overlay for texture */}
      <div className="noise-overlay" aria-hidden="true" />

      {/* Custom magnetic cursor */}
      <MagneticCursor />

      {/* Orbital navigation - always visible */}
      <OrbitalNavigation
        activeSection={activeSection}
        scrollProgress={smoothProgress}
      />

      {/* Progress indicator */}
      <motion.div
        className="scroll-progress-bar"
        style={{ scaleX: smoothProgress }}
        role="progressbar"
        aria-label="Page scroll progress"
      />

      {/* Neural background - reactive to scroll (lazy loaded - Three.js heavy) */}
      <ErrorBoundary fallbackMessage="3D background failed to load.">
        <Suspense fallback={null}>
          <NeuralBackground scrollProgress={smoothProgress} />
        </Suspense>
      </ErrorBoundary>

      {/* Main content sections */}
      <AnimatePresence mode="sync">
        <main className="neural-flux-main">
          {/* Hero Portal - The grand entrance (eagerly loaded) */}
          <section id="hero" className="section-hero">
            <HeroPortal isLoaded={isLoaded} />
          </section>

          {/* Below-the-fold sections - lazy loaded for faster initial paint */}
          <ErrorBoundary fallbackMessage="Content failed to load. Please refresh.">
            <Suspense fallback={null}>
              {/* Floating Identity - About section */}
              <section id="about" className="section-about">
                <FloatingIdentity />
              </section>

              {/* Projects Constellation */}
              <section id="projects" className="section-projects">
                <ProjectsConstellation />
              </section>

              {/* Skills Orbit */}
              <section id="skills" className="section-skills">
                <SkillsOrbit />
              </section>

              {/* Experience Timeline */}
              <section id="experience" className="section-experience">
                <ExperienceTimeline />
              </section>

              {/* Contact Portal */}
              <section id="contact" className="section-contact">
                <ContactPortal />
              </section>
            </Suspense>
          </ErrorBoundary>
        </main>
      </AnimatePresence>

    </div>
  )
}

export default App


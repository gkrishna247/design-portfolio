import { useEffect, useRef, useState, lazy, Suspense, useMemo } from 'react'
import { motion, useScroll, useSpring } from 'framer-motion'
import Lenis from 'lenis'

// Eagerly loaded components (above the fold / critical path)
import MagneticCursor from './components/MagneticCursor/MagneticCursor'
import OrbitalNavigation from './components/OrbitalNavigation/OrbitalNavigation'
import HeroPortal from './components/HeroPortal/HeroPortal'
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary'

// Perf: lazy() already returns a stable component — wrapping in memo() is unnecessary
const NeuralBackground = lazy(() => import('./components/NeuralBackground/NeuralBackground'))
const FloatingIdentity = lazy(() => import('./components/FloatingIdentity/FloatingIdentity'))
const ProjectsConstellation = lazy(() => import('./components/ProjectsConstellation/ProjectsConstellation'))
const SkillsOrbit = lazy(() => import('./components/SkillsOrbit/SkillsOrbit'))
const ExperienceTimeline = lazy(() => import('./components/ExperienceTimeline/ExperienceTimeline'))
const ContactPortal = lazy(() => import('./components/ContactPortal/ContactPortal'))

// Perf: removed duplicate index.css import (already in main.jsx)
import './App.css'

function App() {
  const containerRef = useRef(null)
  const [isLoaded, setIsLoaded] = useState(false)

  // Perf: Use ref for activeSection to avoid re-rendering entire App tree on scroll
  const activeSectionRef = useRef('hero')

  const prefersReducedMotion = useMemo(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }, [])

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  })

  const springConfig = useMemo(() => (prefersReducedMotion
    ? { stiffness: 300, damping: 50, restDelta: 0.01 }
    : { stiffness: 100, damping: 30, restDelta: 0.001 }
  ), [prefersReducedMotion])

  const smoothProgress = useSpring(scrollYProgress, springConfig)

  useEffect(() => {
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

    const loadTimeout = setTimeout(() => setIsLoaded(true), 100)

    return () => {
      lenis.destroy()
      cancelAnimationFrame(rafId)
      clearTimeout(loadTimeout)
    }
  }, [prefersReducedMotion])

  // Perf: Update activeSection via ref — no React re-renders on scroll
  // OrbitalNavigation reads from the ref, updated via callback
  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (value) => {
      let section = 'hero'
      if (value >= 0.83) section = 'contact'
      else if (value >= 0.67) section = 'experience'
      else if (value >= 0.50) section = 'skills'
      else if (value >= 0.33) section = 'projects'
      else if (value >= 0.17) section = 'about'

      activeSectionRef.current = section
    })

    return () => unsubscribe()
  }, [scrollYProgress])

  return (
    <div className="neural-flux-app" ref={containerRef}>
      {/* Skip link for keyboard users - WCAG 2.4.1 */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      {/* Noise overlay for texture */}
      <div className="noise-overlay" aria-hidden="true" />

      {/* Custom magnetic cursor */}
      <MagneticCursor />

      {/* Orbital navigation - always visible */}
      <OrbitalNavigation
        activeSectionRef={activeSectionRef}
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
        <Suspense fallback={<div className="sr-only" aria-live="polite">Loading interactive 3D background...</div>}>
          <NeuralBackground scrollProgress={smoothProgress} />
        </Suspense>
      </ErrorBoundary>

      {/* Main content sections */}
      <main id="main-content" className="neural-flux-main" tabIndex={-1}>
        {/* Hero Portal - The grand entrance (eagerly loaded) */}
        <section id="hero" className="section-hero">
          <HeroPortal isLoaded={isLoaded} />
        </section>

        {/* Below-the-fold sections - lazy loaded for faster initial paint */}
        <ErrorBoundary fallbackMessage="About section failed to load.">
          <Suspense fallback={<div className="section-skeleton" aria-live="polite">Loading...</div>}>
            <section id="about" className="section-about" aria-label="About Me">
              <FloatingIdentity />
            </section>
          </Suspense>
        </ErrorBoundary>

        <ErrorBoundary fallbackMessage="Projects section failed to load.">
          <Suspense fallback={<div className="section-skeleton" aria-live="polite">Loading...</div>}>
            <section id="projects" className="section-projects" aria-label="Projects Portfolio">
              <ProjectsConstellation />
            </section>
          </Suspense>
        </ErrorBoundary>

        <ErrorBoundary fallbackMessage="Skills section failed to load.">
          <Suspense fallback={<div className="section-skeleton" aria-live="polite">Loading...</div>}>
            <section id="skills" className="section-skills" aria-label="Technical Skills">
              <SkillsOrbit />
            </section>
          </Suspense>
        </ErrorBoundary>

        <ErrorBoundary fallbackMessage="Experience section failed to load.">
          <Suspense fallback={<div className="section-skeleton" aria-live="polite">Loading...</div>}>
            <section id="experience" className="section-experience" aria-label="Work Experience">
              <ExperienceTimeline />
            </section>
          </Suspense>
        </ErrorBoundary>

        <ErrorBoundary fallbackMessage="Contact section failed to load.">
          <Suspense fallback={<div className="section-skeleton" aria-live="polite">Loading...</div>}>
            <section id="contact" className="section-contact" aria-label="Contact Information">
              <ContactPortal />
            </section>
          </Suspense>
        </ErrorBoundary>
      </main>
    </div>
  )
}

export default App


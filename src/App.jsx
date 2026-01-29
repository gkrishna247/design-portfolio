import { useEffect, useRef, useState, lazy, Suspense, useMemo } from 'react'
import { Helmet } from 'react-helmet-async'
import { LazyMotion, m, useScroll, useSpring, AnimatePresence, domAnimation } from 'framer-motion'
import { useProgress } from '@react-three/drei'
import Lenis from 'lenis'

// Eagerly loaded components (above the fold / critical path)
import MagneticCursor from './components/MagneticCursor/MagneticCursor'
import OrbitalNavigation from './components/OrbitalNavigation/OrbitalNavigation'
import HeroPortal from './components/HeroPortal/HeroPortal'
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary'
import NeuralLoader from './components/NeuralLoader/NeuralLoader'

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
  const [isLenisReady, setIsLenisReady] = useState(false)
  const [activeSection, setActiveSection] = useState('hero')
  const { progress } = useProgress()

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

  // Initialize Lenis and mark it as ready
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
     * ROBUST LOADING LOGIC - Phase 3 Optimization
     * 
     * Lenis is ready after initialization and frame calculations.
     * Signal this to the loading state machine.
     */
    setTimeout(() => setIsLenisReady(true), 150)

    return () => {
      lenis.destroy()
      cancelAnimationFrame(rafId)
    }
  }, [prefersReducedMotion])

  // State machine: Load complete only when BOTH conditions are met
  // 1. 3D assets loaded (useProgress from @react-three/drei)
  // 2. Lenis scroll instance is ready
  useEffect(() => {
    if (progress === 100 && isLenisReady) {
      setIsLoaded(true)
    }
  }, [progress, isLenisReady])

  // Update active section based on scroll (6 sections)
  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (value) => {
      if (value < 0.17) setActiveSection('hero')
      else if (value < 0.33) setActiveSection('about')
      else if (value < 0.50) setActiveSection('projects')
      else if (value < 0.67) setActiveSection('skills')
      else if (value < 0.83) setActiveSection('experience')
      else setActiveSection('contact')
    })

    return () => unsubscribe()
  }, [scrollYProgress])

  // Dynamic SEO titles based on active section (Phase 4 enhancement)
  const titleMap = {
    hero: 'Alex Dev | Creative Frontend Engineer',
    about: 'Alex Dev | About',
    projects: 'Alex Dev | Projects',
    skills: 'Alex Dev | Skills',
    experience: 'Alex Dev | Experience',
    contact: 'Alex Dev | Contact'
  }

  return (
    <div className="neural-flux-app" ref={containerRef}>
      {/* Dynamic document title for SEO */}
      <Helmet>
        <title>{titleMap[activeSection]}</title>
        <meta name="description" content="Award-winning portfolio featuring immersive 3D interactions, deconstructed design, and neural flux aesthetics." />
      </Helmet>

      {/* Loading state - NeuralLoader shown while assets load */}
      {!isLoaded && <NeuralLoader />}

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
        activeSection={activeSection}
        scrollProgress={smoothProgress}
      />

      {/* Progress indicator - LazyMotion wrapper for animation features */}
      <LazyMotion features={domAnimation}>
        <m.div
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
      </LazyMotion>

      {/* Main content sections */}
      <AnimatePresence mode="sync">
        <main id="main-content" className="neural-flux-main" tabIndex={-1}>
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


import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useSpring, AnimatePresence } from 'framer-motion'
import Lenis from 'lenis'

// Components
import NeuralBackground from './components/NeuralBackground/NeuralBackground'
import MagneticCursor from './components/MagneticCursor/MagneticCursor'
import OrbitalNavigation from './components/OrbitalNavigation/OrbitalNavigation'
import HeroPortal from './components/HeroPortal/HeroPortal'
import FloatingIdentity from './components/FloatingIdentity/FloatingIdentity'
import ProjectsConstellation from './components/ProjectsConstellation/ProjectsConstellation'
import SkillsOrbit from './components/SkillsOrbit/SkillsOrbit'
import ExperienceTimeline from './components/ExperienceTimeline/ExperienceTimeline'
import ContactPortal from './components/ContactPortal/ContactPortal'

// Styles
import './styles/index.css'
import './App.css'

function App() {
  const containerRef = useRef(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [activeSection, setActiveSection] = useState('hero')

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  })

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })

  useEffect(() => {
    // Lenis smooth scroll initialization
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })

    function raf(time) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    // Set loaded state after a brief delay for entrance animation
    setTimeout(() => setIsLoaded(true), 100)

    return () => {
      lenis.destroy()
    }
  }, [])

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
      />

      {/* Neural background - reactive to scroll */}
      <NeuralBackground scrollProgress={smoothProgress} />

      {/* Main content sections */}
      <AnimatePresence mode="sync">
        <main className="neural-flux-main">
          {/* Hero Portal - The grand entrance */}
          <section id="hero" className="section-hero">
            <HeroPortal isLoaded={isLoaded} />
          </section>

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
        </main>
      </AnimatePresence>

      {/* Ambient sound toggle (future feature) */}
      {/* <AmbientControl /> */}
    </div>
  )
}

export default App

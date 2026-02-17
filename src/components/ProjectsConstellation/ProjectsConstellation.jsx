import { useRef, useState, useMemo, useCallback, memo, useEffect } from 'react'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import { projects } from '../../data/projects'
import './ProjectsConstellation.css'

// Default dot counts - responsive
const DOT_COUNT_DESKTOP = 20
const DOT_COUNT_MOBILE = 8

// Animation constants to avoid re-creation on every render
const DOT_ANIMATION = {
    opacity: [0.2, 0.8, 0.2],
    scale: [1, 1.5, 1],
}

const ProjectCard = memo(function ProjectCard({ project, index, isActive, onToggle }) {
    const cardRef = useRef(null)
    const isInView = useInView(cardRef, { once: true, margin: "-50px" })

    // Optimization: Memoize style object to prevent re-renders
    const style = useMemo(() => ({ '--project-color': project.color }), [project.color])

    // Optimization: Stable callback for click handler
    const handleClick = useCallback(() => onToggle(project.id), [onToggle, project.id])

    return (
        <motion.div
            ref={cardRef}
            className={`project-card ${isActive ? 'active' : ''}`}
            role="article"
            aria-label={`Project: ${project.title} - ${project.category}`}
            initial={{ opacity: 0, y: 100, rotateX: 20 }}
            animate={isInView ? {
                opacity: 1,
                y: 0,
                rotateX: 0,
                transition: { duration: 0.8, delay: index * 0.15 }
            } : {}}
            whileHover={{
                y: -10,
                transition: { duration: 0.3 }
            }}
            onClick={handleClick}
            style={style}
            data-cursor
            data-cursor-text="VIEW"
        >
            {/* Card glow */}
            <div className="project-card-glow" />

            {/* Index number */}
            <div className="project-index mono">
                0{project.id}
            </div>

            {/* Tag */}
            <div className="project-tag-container">
                <span className="project-tag mono">{project.tag}</span>
            </div>

            {/* Content */}
            <div className="project-content">
                <span className="project-category mono">{project.category}</span>
                <h3 className="project-title">{project.title}</h3>
                <p className="project-description">{project.description}</p>
            </div>

            {/* Tech stack */}
            <div className="project-tech">
                {project.tech.map((tech, i) => (
                    <span key={i} className="tech-tag mono">{tech}</span>
                ))}
            </div>

            {/* Stats */}
            <div className="project-stats">
                {Object.entries(project.stats).map(([key, value]) => (
                    <div key={key} className="project-stat">
                        <span className="stat-value">{value}</span>
                        <span className="stat-key mono">{key.toUpperCase()}</span>
                    </div>
                ))}
            </div>

            {/* Arrow */}
            <motion.div
                className="project-arrow"
                initial={{ opacity: 0, x: -10 }}
                whileHover={{ opacity: 1, x: 0 }}
            >
                →
            </motion.div>

            {/* Connector line */}
            <div className="project-connector" />
        </motion.div>
    )
})

export default function ProjectsConstellation() {
    const containerRef = useRef(null)
    const [activeProject, setActiveProject] = useState(null)
    const isInView = useInView(containerRef, { once: true, margin: "-100px" })

    // Responsive DOT_COUNT for mobile performance
    const [dotCount, setDotCount] = useState(DOT_COUNT_DESKTOP)

    // Detect reduced motion preference
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

    useEffect(() => {
        // Check for mobile viewport
        const mobileQuery = window.matchMedia('(max-width: 768px)')
        const handleMobileChange = (e) => setDotCount(e.matches ? DOT_COUNT_MOBILE : DOT_COUNT_DESKTOP)
        handleMobileChange(mobileQuery)
        mobileQuery.addEventListener('change', handleMobileChange)

        // Check for reduced motion preference
        const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
        const handleMotionChange = (e) => setPrefersReducedMotion(e.matches)
        handleMotionChange(motionQuery)
        motionQuery.addEventListener('change', handleMotionChange)

        return () => {
            mobileQuery.removeEventListener('change', handleMobileChange)
            motionQuery.removeEventListener('change', handleMotionChange)
        }
    }, [])

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    })

    const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"])

    const dots = useMemo(() => {
        return Array.from({ length: dotCount }).map((_, i) => ({
            id: i,
            left: Math.random() * 100,
            top: Math.random() * 100,
            duration: 3 + Math.random() * 2,
            delay: Math.random() * 2,
        }))
    }, [dotCount])

    const handleProjectToggle = useCallback((id) => {
        setActiveProject(prev => prev === id ? null : id)
    }, [])

    return (
        <div className="projects-constellation" ref={containerRef}>
            {/* Section header */}
            <motion.div
                className="section-header"
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8 }}
            >
                <span className="section-number mono">02</span>
                <h2 className="section-title">
                    <span className="section-title-line" />
                    <span className="gradient-text">PROJECTS</span>
                    <span className="section-title-line" />
                </h2>
                <p className="section-subtitle mono">SELECTED_WORKS</p>
            </motion.div>

            {/* Central timeline line */}
            <div className="constellation-line">
                <motion.div
                    className="constellation-line-fill"
                    style={{ height: lineHeight }}
                />
            </div>

            {/* Project cards - alternating layout */}
            <div className="projects-grid">
                {projects.map((project, index) => (
                    <ProjectCard
                        key={project.id}
                        project={project}
                        index={index}
                        isActive={activeProject === project.id}
                        onToggle={handleProjectToggle}
                    />
                ))}
            </div>

            {/* Background constellation dots - disabled for reduced motion */}
            {!prefersReducedMotion && (
                <div className="constellation-dots" aria-hidden="true">
                    {dots.map((dot) => (
                        <motion.div
                            key={dot.id}
                            className="constellation-dot"
                            style={{
                                left: `${dot.left}%`,
                                top: `${dot.top}%`,
                            }}
                            animate={DOT_ANIMATION}
                            transition={{
                                duration: dot.duration,
                                repeat: Infinity,
                                delay: dot.delay,
                            }}
                        />
                    ))}
                </div>
            )}

            {/* View all CTA */}
            <motion.div
                className="projects-cta"
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ delay: 1 }}
            >
                <motion.a
                    href="#"
                    className="cta-button"
                    whileHover={{ scale: 1.05, x: 10 }}
                    data-cursor
                    data-cursor-text="ALL"
                    aria-label="View all projects"
                >
                    <span className="mono">VIEW_ALL_PROJECTS</span>
                    <span className="cta-arrow">→</span>
                </motion.a>
            </motion.div>
        </div>
    )
}

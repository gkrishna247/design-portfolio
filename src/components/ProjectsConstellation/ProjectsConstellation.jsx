import { useRef, useState, useMemo, useCallback, memo } from 'react'
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion'
import './ProjectsConstellation.css'

const DOT_COUNT = 20

const projects = [
    {
        id: 1,
        title: 'AGROSCAN',
        category: 'COMPUTER VISION',
        tag: 'CV',
        description: 'AI-powered plant disease detection system achieving 96% accuracy. Uses convolutional neural networks to analyze leaf images and identify crop diseases in real-time.',
        tech: ['TensorFlow', 'OpenCV', 'Python', 'Flask'],
        color: '#10b981',
        stats: { accuracy: '96%', images: '50K+' },
        link: '#'
    },
    {
        id: 2,
        title: 'SENTIMENTX',
        category: 'NATURAL LANGUAGE PROCESSING',
        tag: 'NLP',
        description: 'Real-time sentiment analysis engine for social media. Processes thousands of tweets to extract customer insights and emotional trends using transformer models.',
        tech: ['PyTorch', 'Transformers', 'Pandas', 'Streamlit'],
        color: '#3b82f6',
        stats: { tweets: '100K+', models: '3' },
        link: '#'
    },
    {
        id: 3,
        title: 'PRICE ENGINE',
        category: 'MACHINE LEARNING',
        tag: 'ML',
        description: 'Advanced housing price prediction model using ensemble learning. Incorporates geographical, temporal, and market factors for accurate property valuations.',
        tech: ['Scikit-learn', 'XGBoost', 'SQL', 'API'],
        color: '#f59e0b',
        stats: { features: '50+', error: '±5%' },
        link: '#'
    },
    {
        id: 4,
        title: 'TRAFFIC_AI',
        category: 'IOT & AI',
        tag: 'IOT',
        description: 'Smart traffic management system integrating computer vision with IoT sensors. Optimizes traffic flow and reduces congestion by 30% in pilot areas.',
        tech: ['YOLO', 'IoT', 'Edge AI', 'MQTT'],
        color: '#ec4899',
        stats: { reduction: '30%', devices: '20+' },
        link: '#'
    },
]

const ProjectCard = memo(function ProjectCard({ project, index, isActive, onClick }) {
    const cardRef = useRef(null)
    const isInView = useInView(cardRef, { once: true, margin: "-50px" })

    return (
        <motion.div
            ref={cardRef}
            className={`project-card ${isActive ? 'active' : ''}`}
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
            onClick={() => onClick(project.id)}
            style={{ '--project-color': project.color }}
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

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    })

    const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"])

    const dots = useMemo(() => {
        return Array.from({ length: DOT_COUNT }).map((_, i) => ({
            id: i,
            left: Math.random() * 100,
            top: Math.random() * 100,
            duration: 3 + Math.random() * 2,
            delay: Math.random() * 2,
        }))
    }, [])

    const handleProjectClick = useCallback((id) => {
        setActiveProject(prevId => (prevId === id ? null : id))
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
                        onClick={handleProjectClick}
                    />
                ))}
            </div>

            {/* Background constellation dots */}
            <div className="constellation-dots">
                {dots.map((dot) => (
                    <motion.div
                        key={dot.id}
                        className="constellation-dot"
                        style={{
                            left: `${dot.left}%`,
                            top: `${dot.top}%`,
                        }}
                        animate={{
                            opacity: [0.2, 0.8, 0.2],
                            scale: [1, 1.5, 1],
                        }}
                        transition={{
                            duration: dot.duration,
                            repeat: Infinity,
                            delay: dot.delay,
                        }}
                    />
                ))}
            </div>

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
                >
                    <span className="mono">VIEW_ALL_PROJECTS</span>
                    <span className="cta-arrow">→</span>
                </motion.a>
            </motion.div>
        </div>
    )
}

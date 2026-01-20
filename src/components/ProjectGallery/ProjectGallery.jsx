import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useCursor } from '../../context/CursorContext'
import './ProjectGallery.css'

const projects = [
    { id: 1, title: 'AGROSCAN', category: 'Computer Vision', color: '#4CAF50', description: 'Plant Disease Detection using CNN (96% Acc)' },
    { id: 2, title: 'SENTIMENTX', category: 'NLP', color: '#2196F3', description: 'Customer Feedback Analysis with LSTM' },
    { id: 3, title: 'PRICE ENG.', category: 'Predictive Modeling', color: '#FF9800', description: 'House Price Prediction with XGBoost' },
]

export default function ProjectGallery() {
    const containerRef = useRef(null)

    return (
        <section className="gallery-section" ref={containerRef}>
            <div className="gallery-header">
                <h2>SELECTED<br />WORKS</h2>
            </div>

            <div className="gallery-container">
                {projects.map((project, index) => (
                    <ProjectCard key={project.id} project={project} index={index} />
                ))}
            </div>
        </section>
    )
}

function ProjectCard({ project, index }) {
    const ref = useRef(null)
    const { textEnter, textLeave } = useCursor() // Suggestion: Import this hook at top level

    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"]
    })

    // Parallax based on index (odd/even move differently)
    const y = useTransform(scrollYProgress, [0, 1], [0, index % 2 === 0 ? -100 : 100])
    const rotate = useTransform(scrollYProgress, [0, 1], [0, index % 2 === 0 ? 5 : -5])

    return (
        <motion.div
            ref={ref}
            style={{ y, rotate }}
            className={`project-card project-card-${index}`}
            onMouseEnter={() => textEnter('VIEW')}
            onMouseLeave={textLeave}
        >
            <div className="project-media">
                <div className="placeholder-image" style={{ backgroundColor: project.color }} />
            </div>
            <div className="project-info">
                <h3>{project.title}</h3>
                <span>{project.category}</span>
            </div>
        </motion.div>
    )
}

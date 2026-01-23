import { useRef } from 'react'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import './ExperienceTimeline.css'

const experiences = [
    {
        id: 1,
        year: '2025',
        role: 'AI Engineering Intern',
        company: 'TechSolutions Inc.',
        duration: 'May - Aug 2025',
        description: 'Optimized image classification pipelines achieving 15% faster inference. Cleaned and preprocessed 50K+ data samples for model training.',
        achievements: [
            'Improved model inference speed by 15%',
            'Processed 50K+ training samples',
            'Deployed 2 production models'
        ],
        tech: ['TensorFlow', 'Docker', 'AWS'],
        color: '#a855f7'
    },
    {
        id: 2,
        year: '2024',
        role: 'Runner-up',
        company: 'CodeSprint Hackathon',
        duration: 'Oct 2024',
        description: 'Led a team of 4 to develop TRAFFIC_AI, a smart traffic management solution using computer vision and IoT sensors.',
        achievements: [
            'Led team of 4 developers',
            'Built solution in 36 hours',
            'Secured 2nd place among 50+ teams'
        ],
        tech: ['YOLOv8', 'IoT', 'Python'],
        color: '#3b82f6'
    },
    {
        id: 3,
        year: '2024',
        role: 'ML Research Lead',
        company: 'University AI Club',
        duration: '2023 - Present',
        description: 'Leading research initiatives in computer vision and NLP. Mentoring junior members and organizing workshops on AI/ML topics.',
        achievements: [
            'Mentored 15+ students',
            'Organized 5 workshops',
            'Published 2 research papers'
        ],
        tech: ['PyTorch', 'Research', 'Teaching'],
        color: '#22d3ee'
    }
]

function TimelineCard({ experience, index }) {
    const cardRef = useRef(null)
    const isInView = useInView(cardRef, { once: true, margin: "-50px" })

    const isEven = index % 2 === 0

    return (
        <motion.div
            ref={cardRef}
            className={`timeline-card ${isEven ? 'left' : 'right'}`}
            style={{ '--exp-color': experience.color }}
            initial={{ opacity: 0, x: isEven ? -100 : 100 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
        >
            {/* Year badge */}
            <motion.div
                className="timeline-year"
                initial={{ scale: 0 }}
                animate={isInView ? { scale: 1 } : {}}
                transition={{ delay: 0.4, type: 'spring' }}
            >
                <span className="mono">{experience.year}</span>
            </motion.div>

            {/* Card content */}
            <div className="timeline-card-content glass">
                {/* Glow effect */}
                <div className="timeline-card-glow" />

                {/* Header */}
                <div className="timeline-header">
                    <h3 className="timeline-role">{experience.role}</h3>
                    <div className="timeline-company">
                        <span className="company-name">{experience.company}</span>
                        <span className="company-duration mono">{experience.duration}</span>
                    </div>
                </div>

                {/* Description */}
                <p className="timeline-description">{experience.description}</p>

                {/* Achievements */}
                <div className="timeline-achievements">
                    {experience.achievements.map((achievement, i) => (
                        <motion.div
                            key={i}
                            className="achievement-item"
                            initial={{ opacity: 0, x: -10 }}
                            animate={isInView ? { opacity: 1, x: 0 } : {}}
                            transition={{ delay: 0.5 + i * 0.1 }}
                        >
                            <span className="achievement-icon">◆</span>
                            <span>{achievement}</span>
                        </motion.div>
                    ))}
                </div>

                {/* Tech tags */}
                <div className="timeline-tech">
                    {experience.tech.map((tech, i) => (
                        <span key={i} className="tech-tag mono">{tech}</span>
                    ))}
                </div>
            </div>

            {/* Connector to timeline */}
            <div className="timeline-connector">
                <div className="connector-line" />
                <div className="connector-dot" />
            </div>
        </motion.div>
    )
}

export default function ExperienceTimeline() {
    const containerRef = useRef(null)
    const isInView = useInView(containerRef, { once: true, margin: "-100px" })

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    })

    const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"])

    return (
        <div className="experience-timeline" ref={containerRef}>
            {/* Section header */}
            <motion.div
                className="section-header"
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8 }}
            >
                <span className="section-number mono">04</span>
                <h2 className="section-title">
                    <span className="section-title-line" />
                    <span className="gradient-text">TIMELINE</span>
                    <span className="section-title-line" />
                </h2>
                <p className="section-subtitle mono">EXPERIENCE_LOG</p>
            </motion.div>

            {/* Timeline container */}
            <div className="timeline-container">
                {/* Central line */}
                <div className="timeline-line">
                    <motion.div
                        className="timeline-line-fill"
                        style={{ height: lineHeight }}
                    />
                </div>

                {/* Timeline cards */}
                <div className="timeline-cards">
                    {experiences.map((exp, index) => (
                        <TimelineCard
                            key={exp.id}
                            experience={exp}
                            index={index}
                        />
                    ))}
                </div>
            </div>

            {/* Bottom indicator */}
            <motion.div
                className="timeline-end"
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ delay: 1.5 }}
            >
                <div className="timeline-end-dot" />
                <span className="mono">PRESENT</span>
            </motion.div>
        </div>
    )
}

import { useRef, useState } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import './SkillsOrbit.css'

const skillCategories = [
    {
        name: 'LANGUAGES',
        color: '#a855f7',
        skills: ['Python', 'JavaScript', 'SQL', 'R', 'Java']
    },
    {
        name: 'ML/DL',
        color: '#3b82f6',
        skills: ['TensorFlow', 'PyTorch', 'Scikit-learn', 'Keras', 'XGBoost']
    },
    {
        name: 'VISION',
        color: '#22d3ee',
        skills: ['OpenCV', 'YOLO', 'MediaPipe', 'PIL', 'Detectron2']
    },
    {
        name: 'NLP',
        color: '#10b981',
        skills: ['Transformers', 'spaCy', 'NLTK', 'Hugging Face', 'LangChain']
    },
    {
        name: 'TOOLS',
        color: '#f59e0b',
        skills: ['Docker', 'Git', 'AWS', 'MLflow', 'Weights & Biases']
    },
    {
        name: 'DATA',
        color: '#ec4899',
        skills: ['Pandas', 'NumPy', 'Matplotlib', 'Seaborn', 'Plotly']
    }
]

function SkillOrbitRing({ category, index, total, isActive, onHover }) {
    const angle = (index / total) * 360
    const radius = 200 + index * 30

    return (
        <motion.div
            className={`orbit-ring ${isActive ? 'active' : ''}`}
            style={{
                '--ring-color': category.color,
                '--rotation': `${angle}deg`,
                width: radius * 2,
                height: radius * 2,
            }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: index * 0.1 }}
        >
            {/* Ring circle */}
            <div className="orbit-ring-circle" />

            {/* Category label */}
            <motion.div
                className="orbit-category"
                style={{
                    transform: `rotate(${angle}deg) translateX(${radius}px) rotate(${-angle}deg)`
                }}
                onMouseEnter={() => onHover(category.name)}
                onMouseLeave={() => onHover(null)}
                whileHover={{ scale: 1.2 }}
                data-cursor
                data-cursor-text={category.name}
            >
                <span className="orbit-category-icon">⬡</span>
                <span className="orbit-category-label mono">{category.name}</span>
            </motion.div>

            {/* Skills on the ring */}
            {category.skills.map((skill, skillIndex) => {
                const skillAngle = angle + (skillIndex - 2) * 15
                return (
                    <motion.div
                        key={skill}
                        className="orbit-skill"
                        style={{
                            transform: `rotate(${skillAngle}deg) translateX(${radius}px) rotate(${-skillAngle}deg)`
                        }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: isActive ? 1 : 0.3 }}
                        whileHover={{ scale: 1.1 }}
                        transition={{ delay: skillIndex * 0.05 }}
                    >
                        <span className="mono">{skill}</span>
                    </motion.div>
                )
            })}
        </motion.div>
    )
}

export default function SkillsOrbit() {
    const containerRef = useRef(null)
    const [activeCategory, setActiveCategory] = useState(null)
    const isInView = useInView(containerRef, { once: true, margin: "-100px" })

    return (
        <div className="skills-orbit" ref={containerRef}>
            {/* Section header */}
            <motion.div
                className="section-header"
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8 }}
            >
                <span className="section-number mono">03</span>
                <h2 className="section-title">
                    <span className="section-title-line" />
                    <span className="gradient-text">ARSENAL</span>
                    <span className="section-title-line" />
                </h2>
                <p className="section-subtitle mono">TECH_STACK</p>
            </motion.div>

            {/* Orbit visualization */}
            <div className="orbit-container">
                {/* Central core */}
                <motion.div
                    className="orbit-core"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.8, type: 'spring' }}
                >
                    <div className="orbit-core-inner">
                        <span className="orbit-core-icon">◉</span>
                        <span className="orbit-core-text mono">AI</span>
                    </div>
                    <div className="orbit-core-ring" />
                    <div className="orbit-core-ring orbit-core-ring--2" />
                </motion.div>

                {/* Orbit rings */}
                {skillCategories.map((category, index) => (
                    <SkillOrbitRing
                        key={category.name}
                        category={category}
                        index={index}
                        total={skillCategories.length}
                        isActive={activeCategory === null || activeCategory === category.name}
                        onHover={setActiveCategory}
                    />
                ))}
            </div>

            {/* Skills list - alternative view */}
            <motion.div
                className="skills-list"
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ delay: 0.5 }}
            >
                {skillCategories.map((category, index) => (
                    <motion.div
                        key={category.name}
                        className="skills-list-category"
                        style={{ '--category-color': category.color }}
                        initial={{ opacity: 0, x: -30 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ delay: 0.6 + index * 0.1 }}
                        onMouseEnter={() => setActiveCategory(category.name)}
                        onMouseLeave={() => setActiveCategory(null)}
                    >
                        <div className="category-header">
                            <span className="category-indicator" />
                            <h4 className="mono">{category.name}</h4>
                        </div>
                        <div className="category-skills">
                            {category.skills.map((skill) => (
                                <motion.span
                                    key={skill}
                                    className="skill-pill"
                                    whileHover={{ scale: 1.05, y: -2 }}
                                >
                                    {skill}
                                </motion.span>
                            ))}
                        </div>
                    </motion.div>
                ))}
            </motion.div>
        </div>
    )
}

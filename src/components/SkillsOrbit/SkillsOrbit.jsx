import { createContext, useContext, useRef, useState, memo } from 'react'
import { motion, useInView } from 'framer-motion'
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

const SkillsOrbitContext = createContext(null)

function useSkillsOrbit() {
    const context = useContext(SkillsOrbitContext)
    if (!context) {
        throw new Error('SkillsOrbit components must be rendered within a SkillsOrbit root')
    }
    return context
}

function SkillsOrbitRoot({ children }) {
    const containerRef = useRef(null)
    const [activeCategory, setActiveCategory] = useState(null)
    const isInView = useInView(containerRef, { once: true, margin: "-100px" })

    return (
        <SkillsOrbitContext.Provider value={{ activeCategory, setActiveCategory, isInView }}>
            <div className={`skills-orbit ${activeCategory ? 'has-active' : ''}`} ref={containerRef}>
                {children}
            </div>
        </SkillsOrbitContext.Provider>
    )
}

function SkillsOrbitHeader() {
    const { isInView } = useSkillsOrbit()
    return (
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
    )
}

function SkillsMatrix({ children }) {
    return (
        <div className="skills-matrix-container">
            {children}
        </div>
    )
}

const CategoryContext = createContext(null)

const SkillsOrbitCategory = memo(function SkillsOrbitCategory({ name, color, index, children }) {
    const { activeCategory, setActiveCategory } = useSkillsOrbit()
    const isActive = activeCategory === null || activeCategory === name

    return (
        <CategoryContext.Provider value={{ color, isActive }}>
            <motion.div
                className={`bento-card`}
                style={{
                    '--category-color': color,
                }}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1, type: 'spring', stiffness: 100 }}
                onMouseEnter={() => setActiveCategory(name)}
                onMouseLeave={() => setActiveCategory(null)}
                data-active={isActive ? 'true' : 'false'}
                data-cursor
                data-cursor-text={name}
            >
                <div className="bento-card-glow" />
                <div className="bento-card-inner">
                    <div className="bento-header">
                        <span className="bento-icon" style={{ color: color }}>⬡</span>
                        <h3 className="bento-title mono">{name}</h3>
                    </div>
                    <div className="bento-content">
                        {children}
                    </div>
                </div>
            </motion.div>
        </CategoryContext.Provider>
    )
})

function SkillsOrbitItem({ index, children }) {

    return (
        <motion.span
            className="bento-skill-pill mono"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 + 0.2 }}
            whileHover={{ scale: 1.05, y: -2 }}
        >
            {children}
        </motion.span>
    )
}

function SkillsOrbitList({ children }) {
    const { isInView } = useSkillsOrbit()
    return (
        <motion.div
            className="skills-list"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.5 }}
        >
            {children}
        </motion.div>
    )
}

function SkillsOrbitListCategory({ name, color, index, children }) {
    const { activeCategory, setActiveCategory, isInView } = useSkillsOrbit()
    const isActive = activeCategory === null || activeCategory === name

    return (
        <motion.div
            className="skills-list-category"
            style={{ '--category-color': color }}
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.6 + index * 0.1 }}
            onMouseEnter={() => setActiveCategory(name)}
            onMouseLeave={() => setActiveCategory(null)}
            data-active={isActive ? 'true' : 'false'}
        >
            <div className="category-header">
                <span className="category-indicator" />
                <h4 className="mono">{name}</h4>
            </div>
            <div className="category-skills">
                {children}
            </div>
        </motion.div>
    )
}

function SkillsOrbitListItem({ children }) {
    return (
        <motion.span
            className="skill-pill"
            whileHover={{ scale: 1.05, y: -2 }}
        >
            {children}
        </motion.span>
    )
}

// Assemble Compound Component
export const SkillsOrbit = Object.assign(SkillsOrbitRoot, {
    Header: SkillsOrbitHeader,
    Matrix: SkillsMatrix,
    Category: SkillsOrbitCategory,
    Item: SkillsOrbitItem,
})

export default function SkillsOrbitSection() {
    return (
        <SkillsOrbit>
            <SkillsOrbit.Header />
            <SkillsOrbit.Matrix>
                {skillCategories.map((category, index) => (
                    <SkillsOrbit.Category
                        key={category.name}
                        name={category.name}
                        color={category.color}
                        index={index}
                        total={skillCategories.length}
                    >
                        {category.skills.map((skill, skillIndex) => (
                            <SkillsOrbit.Item key={skill} index={skillIndex}>
                                {skill}
                            </SkillsOrbit.Item>
                        ))}
                    </SkillsOrbit.Category>
                ))}
            </SkillsOrbit.Matrix>
        </SkillsOrbit>
    )
}

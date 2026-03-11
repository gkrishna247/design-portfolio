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

function SkillsOrbitOrbit({ children }) {
    const { isInView } = useSkillsOrbit()
    return (
        <div className="orbit-container">
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
            {children}
        </div>
    )
}

const CategoryContext = createContext(null)

const SkillsOrbitCategory = memo(function SkillsOrbitCategory({ name, color, index, total, children }) {
    const { activeCategory, setActiveCategory } = useSkillsOrbit()
    const isActive = activeCategory === null || activeCategory === name
    
    // Determine rotation direction based on index (even = 1, odd = -1)
    const direction = index % 2 === 0 ? 1 : -1;
    // Base duration, varying slightly by ring to create parallax/depth
    const duration = 40 + (index * 5); 

    const angle = (index / total) * 360
    // Increased base radius and step to prevent rings overlapping
    const radius = 220 + index * 50

    return (
        <CategoryContext.Provider value={{ angle, radius, color, isActive, direction, duration }}>
            <motion.div
                className={`orbit-ring ${activeCategory === name ? 'is-hovered' : ''}`}
                style={{
                    '--ring-color': color,
                    '--radius': `${radius}px`,
                    width: radius * 2,
                    height: radius * 2,
                }}
                initial={{ opacity: 0, scale: 0.5, rotate: angle }}
                animate={{ 
                    opacity: 1, 
                    scale: 1,
                    rotate: angle + (360 * direction)
                }}
                transition={{ 
                    opacity: { duration: 0.8, delay: index * 0.1 },
                    scale: { duration: 0.8, delay: index * 0.1 },
                    rotate: { 
                        repeat: Infinity, 
                        duration: duration, 
                        ease: "linear" 
                    }
                }}
                data-active={isActive ? 'true' : 'false'}
            >
                <div className="orbit-ring-circle" />

                <motion.div
                    className="orbit-category-container"
                    style={{
                        position: 'absolute',
                        left: '50%',
                        top: '50%',
                        width: '100%',
                        height: '100%',
                        marginTop: -radius,
                        marginLeft: -radius
                    }}
                >
                    <motion.div
                        className="orbit-category"
                        style={{
                            transform: `translateX(${radius}px)`
                        }}
                        animate={{ rotate: -(angle + (360 * direction)) }}
                        transition={{ 
                            rotate: { 
                                repeat: Infinity, 
                                duration: duration, 
                                ease: "linear" 
                            }
                        }}
                        onMouseEnter={() => setActiveCategory(name)}
                        onMouseLeave={() => setActiveCategory(null)}
                        whileHover={{ scale: 1.2 }}
                        data-cursor
                        data-cursor-text={name}
                    >
                        <span className="orbit-category-icon">⬡</span>
                        <span className="orbit-category-label mono">{name}</span>
                    </motion.div>
                </motion.div>

                {children}
            </motion.div>
        </CategoryContext.Provider>
    )
})

function SkillsOrbitItem({ index, children }) {
    const { angle, radius, direction, duration } = useContext(CategoryContext)
    
    // Spread items further apart based on how large the ring is
    // Larger rings can afford a smaller angular spread or the same angular spread means more pixels.
    // 15 degrees at r=300 is ~78px. Maybe 20 degrees for safety. 
    const skillAngleOffset = (index - 2) * 22;
    
    // We position the items relative to the ring center, rotated by the skillAngleOffset
    // The items must counter-rotate the *ring's continuous rotation* PLUS the static skillAngleOffset to stay upright.

    return (
        <motion.div
            className="orbit-skill-container"
            style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                width: '100%',
                height: '100%',
                marginTop: -radius,
                marginLeft: -radius,
                transform: `rotate(${skillAngleOffset}deg)`
            }}
        >
            <motion.div
                className="orbit-skill"
                style={{
                    transform: `translateX(${radius}px)`
                }}
                initial={{ opacity: 0 }}
                animate={{ 
                    opacity: 'var(--skill-opacity, 1)',
                    rotate: -(angle + skillAngleOffset + (360 * direction)) 
                }}
                whileHover={{ scale: 1.1 }}
                transition={{ 
                    opacity: { delay: index * 0.05 },
                    scale: { duration: 0.2 },
                    rotate: { 
                        repeat: Infinity, 
                        duration: duration, 
                        ease: "linear" 
                    }
                }}
            >
                <span className="mono">{children}</span>
            </motion.div>
        </motion.div>
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
    Orbit: SkillsOrbitOrbit,
    Category: SkillsOrbitCategory,
    Item: SkillsOrbitItem,
    List: SkillsOrbitList,
    ListCategory: SkillsOrbitListCategory,
    ListItem: SkillsOrbitListItem
})

export default function SkillsOrbitSection() {
    return (
        <SkillsOrbit>
            <SkillsOrbit.Header />
            <SkillsOrbit.Orbit>
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
            </SkillsOrbit.Orbit>

            <SkillsOrbit.List>
                {skillCategories.map((category, index) => (
                    <SkillsOrbit.ListCategory
                        key={category.name}
                        name={category.name}
                        color={category.color}
                        index={index}
                    >
                        {category.skills.map((skill) => (
                            <SkillsOrbit.ListItem key={skill}>
                                {skill}
                            </SkillsOrbit.ListItem>
                        ))}
                    </SkillsOrbit.ListCategory>
                ))}
            </SkillsOrbit.List>
        </SkillsOrbit>
    )
}

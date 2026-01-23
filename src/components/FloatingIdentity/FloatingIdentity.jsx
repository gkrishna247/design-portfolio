import { useRef } from 'react'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import './FloatingIdentity.css'

const stats = [
    { value: '8.5', label: 'CGPA', suffix: '' },
    { value: '2026', label: 'GRADUATION', suffix: '' },
    { value: '96', label: 'MODEL ACC.', suffix: '%' },
    { value: '50', label: 'DATA POINTS', suffix: 'K+' },
]

const socialLinks = [
    { name: 'LINKEDIN', icon: 'LN', url: '#' },
    { name: 'GITHUB', icon: 'GH', url: '#' },
    { name: 'EMAIL', icon: 'ML', url: '#' },
    { name: 'TWITTER', icon: 'X', url: '#' },
]

export default function FloatingIdentity() {
    const containerRef = useRef(null)
    const isInView = useInView(containerRef, { once: true, margin: "-100px" })

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    })

    const cardRotateX = useTransform(scrollYProgress, [0, 0.5, 1], [10, 0, -10])
    const cardRotateY = useTransform(scrollYProgress, [0, 0.5, 1], [-5, 0, 5])
    const cardScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.9, 1, 0.95])

    return (
        <div className="floating-identity" ref={containerRef}>
            {/* Section header */}
            <motion.div
                className="section-header"
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8 }}
            >
                <span className="section-number mono">01</span>
                <h2 className="section-title">
                    <span className="section-title-line" />
                    <span className="gradient-text">IDENTITY</span>
                    <span className="section-title-line" />
                </h2>
                <p className="section-subtitle mono">WHO_AM_I</p>
            </motion.div>

            {/* Floating identity card - 3D effect */}
            <motion.div
                className="identity-card-container"
                style={{
                    rotateX: cardRotateX,
                    rotateY: cardRotateY,
                    scale: cardScale,
                    perspective: 1000
                }}
            >
                <motion.div
                    className="identity-card glass-strong"
                    initial={{ opacity: 0, y: 100 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 1, delay: 0.2 }}
                >
                    {/* Card glow effect */}
                    <div className="identity-card-glow" />

                    {/* Profile section */}
                    <div className="identity-profile">
                        <motion.div
                            className="profile-image-container"
                            whileHover={{ scale: 1.05 }}
                        >
                            <div className="profile-image">
                                <div className="profile-image-placeholder">
                                    <span className="mono">A</span>
                                </div>
                                <div className="profile-image-ring" />
                                <div className="profile-image-ring profile-image-ring--2" />
                            </div>
                            <div className="profile-status">
                                <span className="status-indicator" />
                            </div>
                        </motion.div>

                        <div className="profile-info">
                            <h3 className="profile-name">ALEX DEV</h3>
                            <p className="profile-role mono">
                                <span className="text-accent">@</span>AI_ENGINEER
                            </p>
                            <p className="profile-location">
                                <span className="location-icon">◎</span>
                                Bangalore, India
                            </p>
                        </div>
                    </div>

                    {/* Bio section */}
                    <div className="identity-bio">
                        <p>
                            Final year <span className="highlight">B.E. student</span> specializing in
                            Artificial Intelligence and Machine Learning. Passionate about building
                            <span className="highlight"> scalable solutions</span> that transform complex
                            data into actionable intelligence.
                        </p>
                        <p>
                            Focused on <span className="text-violet">Computer Vision</span>,
                            <span className="text-cyan"> Natural Language Processing</span>, and
                            <span className="text-pink"> Deep Learning</span> systems.
                        </p>
                    </div>

                    {/* Stats grid */}
                    <div className="identity-stats">
                        {stats.map((stat, index) => (
                            <motion.div
                                key={stat.label}
                                className="stat-card"
                                initial={{ opacity: 0, y: 20 }}
                                animate={isInView ? { opacity: 1, y: 0 } : {}}
                                transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                                whileHover={{ scale: 1.05, y: -5 }}
                            >
                                <span className="stat-value">
                                    {stat.value}
                                    <span className="stat-suffix">{stat.suffix}</span>
                                </span>
                                <span className="stat-label mono">{stat.label}</span>
                            </motion.div>
                        ))}
                    </div>

                    {/* Social links */}
                    <div className="identity-social">
                        {socialLinks.map((link, index) => (
                            <motion.a
                                key={link.name}
                                href={link.url}
                                className="social-link"
                                initial={{ opacity: 0, scale: 0 }}
                                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                                transition={{ duration: 0.3, delay: 0.8 + index * 0.1 }}
                                whileHover={{ scale: 1.2, y: -3 }}
                                data-cursor
                                data-cursor-text={link.name}
                            >
                                <span className="mono">{link.icon}</span>
                            </motion.a>
                        ))}
                    </div>

                    {/* Corner tags */}
                    <div className="card-tag card-tag--tl mono">PROFILE_V2</div>
                    <div className="card-tag card-tag--br mono">2026.01</div>
                </motion.div>
            </motion.div>

            {/* Floating elements */}
            <motion.div
                className="floating-element floating-element--1"
                animate={{
                    y: [0, -20, 0],
                    rotate: [0, 5, 0]
                }}
                transition={{ duration: 6, repeat: Infinity }}
            >
                <span className="mono dim">{'<ai>'}</span>
            </motion.div>
            <motion.div
                className="floating-element floating-element--2"
                animate={{
                    y: [0, 20, 0],
                    rotate: [0, -5, 0]
                }}
                transition={{ duration: 8, repeat: Infinity }}
            >
                <span className="mono dim">{'</ml>'}</span>
            </motion.div>
        </div>
    )
}

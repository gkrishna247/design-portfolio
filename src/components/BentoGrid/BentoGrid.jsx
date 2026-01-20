import { motion } from 'framer-motion'
import { useState } from 'react'
import './BentoGrid.css'

const projects = [
    { id: 1, title: 'AGROSCAN', tag: 'CV', color: '#4CAF50', desc: 'Disease detection in plants (96% Acc)' },
    { id: 2, title: 'SENTIMENTX', tag: 'NLP', color: '#2196F3', desc: 'Customer sentiment analysis on X' },
    { id: 3, title: 'PRICE ENG.', tag: 'ML', color: '#FF9800', desc: 'Housing price prediction engine' },
    { id: 4, title: 'TRAFFIC_AI', tag: 'IoT', color: '#E91E63', desc: 'Smart traffic management system' },
]

const skills = ["Python", "TensorFlow", "PyTorch", "OpenCV", "NLP", "SQL", "Docker", "AWS", "Git"]

export default function BentoGrid() {
    return (
        <section className="bento-section" id="about">
            <div className="bento-grid">

                {/* Profile Card (2x2) */}
                <div className="bento-card profile-card">
                    <div className="profile-header">
                        <div className="avatar-placeholder" />
                        <div>
                            <h2 className="mono accent">ALEX DEV</h2>
                            <span className="dim">Bangalore, IN</span>
                            <div className="social-links mono">
                                <span>LN</span> <span>GH</span> <span> MAIL</span>
                            </div>
                        </div>
                    </div>
                    <p className="bio-text">
                        Final year B.E. student specializing in <span className="highlight">AI & ML</span>.
                        Building scalable solutions for Computer Vision and NLP.
                        Turning data into actionable intelligence.
                    </p>
                </div>

                {/* Stats Card (1x1) */}
                <div className="bento-card stat-card">
                    <h3 className="mono dim">CGPA</h3>
                    <div className="stat-value">8.5</div>
                </div>

                {/* Grad Year Card (1x1) */}
                <div className="bento-card stat-card">
                    <h3 className="mono dim">CLASS OF</h3>
                    <div className="stat-value">2026</div>
                </div>

                {/* Tech Stack (2x1) */}
                <div className="bento-card skills-card">
                    <h3 className="mono dim mb-2">TECH STACK_</h3>
                    <div className="skills-cloud">
                        {skills.map(s => <span key={s} className="skill-tag mono">{s}</span>)}
                    </div>
                </div>

                {/* Experience (1x2) */}
                <div className="bento-card experience-card">
                    <h3 className="mono dim mb-2">EXP_LOG</h3>
                    <div className="timeline">
                        <div className="timeline-item">
                            <span className="mono accent">2025</span>
                            <h4>AI Intern @ TechSolutions</h4>
                            <p className="dim small">Optimized Image Classifiers (15% faster). Data cleanup (50k+).</p>
                        </div>
                        <div className="timeline-item">
                            <span className="mono accent">2024</span>
                            <h4>Runner-up @ CodeSprint</h4>
                            <p className="dim small">Smart Traffic Management Project.</p>
                        </div>
                    </div>
                </div>

                {/* Projects (Each 1x1 or 2x1) */}
                <div className="bento-card project-header-card">
                    <h2 className="section-title">SELECTED WORKS_</h2>
                </div>

                {projects.map(p => (
                    <div key={p.id} className="bento-card project-card" style={{ '--hover-color': p.color }}>
                        <div className="project-top">
                            <span className="mono project-tag">{p.tag}</span>
                            <div className="arrow-icon">↗</div>
                        </div>
                        <div className="project-content">
                            <h3>{p.title}</h3>
                            <p className="project-desc">{p.desc}</p>
                        </div>
                    </div>
                ))}

                {/* Certifications (2x1) */}
                <div className="bento-card cert-card">
                    <h3 className="mono dim mb-2">CERTS_</h3>
                    <ul className="cert-list">
                        <li>TensorFlow Developer (Google)</li>
                        <li>Machine Learning (Andrew Ng)</li>
                    </ul>
                </div>

            </div>
        </section>
    )
}

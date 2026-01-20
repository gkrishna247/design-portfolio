import { motion } from 'framer-motion'
import './About.css'

export default function About() {
    return (
        <div className="about-container">
            {/* About Section */}
            <section className="about-section">
                <motion.h1
                    className="about-title"
                    initial={{ x: -100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 1 }}
                >
                    ABOUT
                </motion.h1>
                <div className="about-content">
                    <p>
                        Final year B.E. student specializing in <strong>AI & ML</strong>.
                        Passionate about solving real-world problems through deep learning and predictive modeling.
                        Proficient in Python and data structures, with hands-on experience in <strong>Computer Vision</strong> and <strong>NLP</strong>.
                    </p>
                    <div className="contact-info">
                        <p><strong>Email:</strong> alex.dev@example.com</p>
                        <p><strong>Phone:</strong> +91 98765 43210</p>
                        <p><strong>Loc:</strong> Bangalore, India</p>
                        <div className="socials">
                            <span>LinkedIn</span> / <span>GitHub</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Education & Experience Split */}
            <section className="info-grid">
                <div className="info-block">
                    <h2>EDUCATION</h2>
                    <div className="info-item">
                        <h3>B.E. in Artificial Intelligence & Machine Learning</h3>
                        <h4>City Institute of Technology | 2022 - 2026</h4>
                        <p>CGPA: 8.5/10.0</p>
                        <p className="dim">Neural Networks, Deep Learning, DSA, Big Data</p>
                    </div>
                </div>

                <div className="info-block">
                    <h2>EXPERIENCE</h2>
                    <div className="info-item">
                        <h3>AI Intern</h3>
                        <h4>TechSolutions Pvt Ltd. | June - Aug 2025</h4>
                        <ul>
                            <li>Preprocessed 50k+ records dataset.</li>
                            <li>Optimized image classification model (15% faster).</li>
                            <li>Integrated ML model into Flask API.</li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* Skills Marquee or Cloud */}
            <section className="skills-section">
                <h2>SKILLS</h2>
                <div className="skills-list">
                    <span>Python</span><span>TensorFlow</span><span>PyTorch</span><span>OpenCV</span>
                    <span>NLP</span><span>C++</span><span>SQL</span><span>Docker</span>
                    <span>AWS</span><span>Git</span><span>Pandas</span>
                </div>
            </section>

            <section className="certifications-section">
                <h2>ACHIEVEMENTS</h2>
                <ul className="cert-list">
                    <li>TensorFlow Developer Certificate (Google)</li>
                    <li>Machine Learning by Andrew Ng</li>
                    <li>Runner-up at CodeSprint 2024</li>
                    <li>Paper: "Lightweight CNNs for Edge Devices"</li>
                </ul>
            </section>
        </div>
    )
}

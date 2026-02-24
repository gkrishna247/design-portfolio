import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import './ContactPortal.css'

const contactLinks = [
    {
        name: 'LinkedIn',
        handle: '@alexdev',
        url: 'https://linkedin.com',
        icon: 'LN',
        color: '#0077b5'
    },
    {
        name: 'GitHub',
        handle: '@alexdev',
        url: 'https://github.com',
        icon: 'GH',
        color: '#6e5494'
    },
    {
        name: 'Email',
        handle: 'alex@dev.com',
        url: 'mailto:alex@dev.com',
        icon: 'ML',
        color: '#ea4335'
    },
    {
        name: 'Twitter',
        handle: '@alexdev',
        url: 'https://twitter.com',
        icon: 'X',
        color: '#1da1f2'
    },
]

export default function ContactPortal() {
    const containerRef = useRef(null)
    const isInView = useInView(containerRef, { once: true, margin: "-100px" })

    return (
        <div className="contact-portal" ref={containerRef}>
            {/* Background gradient */}
            <div className="contact-bg-gradient" />

            {/* Section header */}
            <motion.div
                className="section-header"
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8 }}
            >
                <span className="section-number mono">05</span>
                <h2 className="section-title">
                    <span className="section-title-line" />
                    <span className="gradient-text">CONNECT</span>
                    <span className="section-title-line" />
                </h2>
                <p className="section-subtitle mono">LET'S_BUILD_TOGETHER</p>
            </motion.div>

            {/* Main contact content */}
            <motion.div
                className="contact-content"
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ delay: 0.3 }}
            >
                {/* Big text */}
                <div className="contact-big-text">
                    <motion.span
                        className="big-text-line"
                        initial={{ opacity: 0, x: -50 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ delay: 0.4 }}
                    >
                        HAVE A PROJECT
                    </motion.span>
                    <motion.span
                        className="big-text-line gradient-text-aurora"
                        initial={{ opacity: 0, x: 50 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ delay: 0.5 }}
                    >
                        IN MIND?
                    </motion.span>
                </div>

                {/* CTA button */}
                <motion.a
                    href="mailto:alex@dev.com"
                    className="contact-cta"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ delay: 0.6, type: 'spring' }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    data-cursor
                    data-cursor-text="SEND"
                >
                    <span className="cta-text">START A CONVERSATION</span>
                    <span className="cta-icon">→</span>
                </motion.a>

                {/* Social links */}
                <motion.div
                    className="contact-links"
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : {}}
                    transition={{ delay: 0.8 }}
                >
                    {contactLinks.map((link, index) => (
                        <motion.a
                            key={link.name}
                            href={link.url}
                            target={link.url.startsWith('http') ? '_blank' : undefined}
                            rel={link.url.startsWith('http') ? 'noopener noreferrer' : undefined}
                            className="contact-link"
                            style={{ '--link-color': link.color }}
                            initial={{ opacity: 0, y: 20 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ delay: 0.9 + index * 0.1 }}
                            whileHover={{ y: -5 }}
                            data-cursor
                            data-cursor-text={link.name.toUpperCase()}
                        >
                            <div className="link-icon-container">
                                <span className="link-icon mono">{link.icon}</span>
                            </div>
                            <div className="link-info">
                                <span className="link-name">{link.name}</span>
                                <span className="link-handle mono">{link.handle}</span>
                            </div>
                            <span className="link-arrow">↗</span>
                        </motion.a>
                    ))}
                </motion.div>
            </motion.div>

            {/* Footer */}
            <motion.footer
                className="contact-footer"
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ delay: 1.2 }}
            >
                <div className="footer-left">
                    <span className="mono">NEURAL_FLUX</span>
                    <span className="dim">PORTFOLIO v2.0</span>
                </div>
                <div className="footer-center">
                    <span className="mono dim">DESIGNED & BUILT BY</span>
                    <span className="gradient-text">ALEX.DEV</span>
                </div>
                <div className="footer-right">
                    <span className="mono">© 2026</span>
                    <span className="dim">ALL RIGHTS RESERVED</span>
                </div>
            </motion.footer>

            {/* Decorative elements */}
            <div className="contact-decoration contact-decoration--1">
                <span className="mono dim">{'<connect>'}</span>
            </div>
            <div className="contact-decoration contact-decoration--2">
                <span className="mono dim">{'</connect>'}</span>
            </div>
        </div>
    )
}

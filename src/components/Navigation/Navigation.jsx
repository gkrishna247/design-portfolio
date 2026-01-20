import { motion } from 'framer-motion'
import './Navigation.css'

export default function Navigation() {
    const scrollToSection = (id) => {
        const element = document.getElementById(id)
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' })
        }
    }

    return (
        <nav className="minimal-sidebar">
            <div className="sidebar-logo">
                <span className="mono">ALEX.DEV</span>
            </div>

            <div className="sidebar-links">
                {['HERO', 'ABOUT', 'PROJECTS'].map((item, i) => (
                    <div
                        key={item}
                        className="sidebar-link-container"
                        onClick={() => scrollToSection(item.toLowerCase())}
                    >
                        <span className="sidebar-link-text mono">{item}</span>
                        <div className="sidebar-line" />
                    </div>
                ))}
            </div>

            <div className="sidebar-footer">
                <span className="mono dim">2026</span>
            </div>
        </nav>
    )
}

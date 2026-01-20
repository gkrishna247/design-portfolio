import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useCursor } from '../../context/CursorContext'
import './Cursor.css'

export default function Cursor() {
    const { cursorVariant, cursorText } = useCursor()
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

    useEffect(() => {
        const mouseMove = (e) => {
            setMousePosition({ x: e.clientX, y: e.clientY })
        }
        window.addEventListener('mousemove', mouseMove)
        return () => window.removeEventListener('mousemove', mouseMove)
    }, [])

    const variants = {
        default: {
            x: mousePosition.x - 10,
            y: mousePosition.y - 10,
            height: 20,
            width: 20,
            backgroundColor: 'var(--color-text)',
            mixBlendMode: 'difference'
        },
        hover: {
            x: mousePosition.x - 30,
            y: mousePosition.y - 30,
            height: 60,
            width: 60,
            backgroundColor: 'var(--color-accent)',
            mixBlendMode: 'difference'
        },
        text: {
            x: mousePosition.x - 50,
            y: mousePosition.y - 50,
            height: 100,
            width: 100,
            backgroundColor: 'white',
            mixBlendMode: 'difference',
            color: 'black'
        }
    }

    return (
        <motion.div
            className="cursor"
            variants={variants}
            animate={cursorVariant}
            transition={{ type: 'spring', mass: 0.1 }} // Lag optimization
            style={{ position: 'fixed', top: 0, left: 0, pointerEvents: 'none', zIndex: 9999, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
            {cursorVariant === 'text' && (
                <span style={{ fontSize: '1rem', fontWeight: 'bold' }}>{cursorText}</span>
            )}
        </motion.div>
    )
}

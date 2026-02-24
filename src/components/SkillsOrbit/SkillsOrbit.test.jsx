import { render, screen, fireEvent, act } from '@testing-library/react'
import { vi, describe, it, expect } from 'vitest'
import SkillsOrbit from './SkillsOrbit'

// Mock Framer Motion
vi.mock('framer-motion', async () => {
    const actual = await vi.importActual('framer-motion')
    const React = await vi.importActual('react')
    return {
        ...actual,
        motion: {
            div: React.forwardRef(({ children, whileHover: _w, animate: _a, initial: _i, transition: _t, ...props }, ref) => {
                // Remove special props to avoid React warnings, but keep data-* and className
                return <div ref={ref} {...props}>{children}</div>
            }),
            span: React.forwardRef(({ children, whileHover: _w, animate: _a, initial: _i, transition: _t, ...props }, ref) => <span ref={ref} {...props}>{children}</span>),
        },
        useInView: () => true,
        AnimatePresence: ({ children }) => <>{children}</>,
    }
})

describe('SkillsOrbit Functionality', () => {
    it('should render initial items correctly', () => {
        render(<SkillsOrbit />)
        const rings = screen.getAllByText(/LANGUAGES|ML\/DL|VISION|NLP|TOOLS|DATA/)
        expect(rings).toHaveLength(12) // 6 in orbit + 6 in list
    })

    it('should update active state on hover via DOM attributes', async () => {
        render(<SkillsOrbit />)

        // Hover
        const trigger = screen.getAllByText('LANGUAGES')[0].closest('.orbit-category')

        // Trigger hover
        await act(async () => {
            fireEvent.mouseEnter(trigger)
        })

        // Verify that the data-active attribute is correctly updated
        // Initially activeCategory is null, so all should be 'true'
        // After hover, languages (hovered) should be 'true', others 'false'

        const languagesRing = screen.getAllByText('LANGUAGES')[0].closest('.orbit-ring')
        const mlRing = screen.getAllByText('ML/DL')[0].closest('.orbit-ring')

        expect(languagesRing.getAttribute('data-active')).toBe('true')
        expect(mlRing.getAttribute('data-active')).toBe('false')
    })
})

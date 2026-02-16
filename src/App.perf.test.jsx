import { render, act } from '@testing-library/react'
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'
import App from './App'
import { useSpring } from 'framer-motion'

// Mock dependencies
vi.mock('framer-motion', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    useSpring: vi.fn((source, config) => {
        // Return a dummy motion value to satisfy usage
        return { get: () => 0, onChange: () => {} }
    }),
    useScroll: () => ({
      scrollYProgress: {
        on: vi.fn(() => vi.fn()),
        get: () => 0,
        onChange: () => {}
      }
    }),
    AnimatePresence: ({ children }) => <>{children}</>,
    motion: {
      div: ({ children, ...props }) => <div {...props}>{children}</div>,
    }
  }
})

vi.mock('lenis', () => {
  return {
    default: class Lenis {
      constructor() {}
      raf() {}
      destroy() {}
    }
  }
})

// Mock heavy components
vi.mock('./components/MagneticCursor/MagneticCursor', () => ({ default: () => <div data-testid="cursor" /> }))
vi.mock('./components/OrbitalNavigation/OrbitalNavigation', () => ({ default: () => <div data-testid="nav" /> }))
vi.mock('./components/HeroPortal/HeroPortal', () => ({ default: () => <div data-testid="hero" /> }))
vi.mock('./components/NeuralBackground/NeuralBackground', () => ({ default: () => <div data-testid="bg" /> }))
vi.mock('./components/ErrorBoundary/ErrorBoundary', () => ({ default: ({ children }) => <>{children}</> }))

// Mock lazy loaded components
vi.mock('./components/FloatingIdentity/FloatingIdentity', () => ({ default: () => <div /> }))
vi.mock('./components/ProjectsConstellation/ProjectsConstellation', () => ({ default: () => <div /> }))
vi.mock('./components/SkillsOrbit/SkillsOrbit', () => ({ default: () => <div /> }))
vi.mock('./components/ExperienceTimeline/ExperienceTimeline', () => ({ default: () => <div /> }))
vi.mock('./components/ContactPortal/ContactPortal', () => ({ default: () => <div /> }))

describe('App Performance', () => {
  beforeEach(() => {
    vi.useFakeTimers()

    // Mock window.matchMedia
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(), // deprecated
        removeListener: vi.fn(), // deprecated
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    })
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.clearAllMocks()
  })

  it('should maintain referential equality of springConfig across renders', async () => {
    render(<App />)

    // Initial render should have called useSpring once
    expect(useSpring).toHaveBeenCalled()
    const firstCallConfig = useSpring.mock.calls[0][1]

    // Fast-forward time to trigger setIsLoaded(true) inside App's useEffect
    // The timeout is 100ms
    act(() => {
      vi.advanceTimersByTime(150)
    })

    // We expect a re-render, so useSpring should be called again
    expect(useSpring.mock.calls.length).toBeGreaterThan(1)

    const lastCallConfig = useSpring.mock.calls[useSpring.mock.calls.length - 1][1]

    // Verify referential equality
    // This expects the config object to be the EXACT same object instance
    expect(lastCallConfig).toBe(firstCallConfig)
  })
})

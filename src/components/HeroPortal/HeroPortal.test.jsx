import { render, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import HeroPortal from './HeroPortal'
import * as FramerMotion from 'framer-motion'

// Mock Framer Motion
vi.mock('framer-motion', async () => {
    const actual = await vi.importActual('framer-motion')
    return {
        ...actual,
        useMotionValue: vi.fn((initial) => ({
            set: vi.fn(),
            get: () => initial,
            onChange: vi.fn(),
            destroy: vi.fn(),
        })),
        // Mock other hooks to prevent errors during render
        useScroll: () => ({ scrollYProgress: { get: () => 0, onChange: () => {} } }),
        useTransform: () => ({ get: () => 0, onChange: () => {} }),
        useSpring: () => ({ get: () => 0, onChange: () => {} }),
        motion: {
            div: ({ children, ...props }) => <div {...props}>{children}</div>,
            h1: ({ children, ...props }) => <h1 {...props}>{children}</h1>,
            h2: ({ children, ...props }) => <h2 {...props}>{children}</h2>,
            p: ({ children, ...props }) => <p {...props}>{children}</p>,
            button: ({ children, ...props }) => <button {...props}>{children}</button>,
        }
    }
})

describe('HeroPortal Performance', () => {
    let mockSetX

    beforeEach(() => {
        vi.useFakeTimers()

        // Setup spies for motion values
        mockSetX = vi.fn()

        vi.mocked(FramerMotion.useMotionValue).mockImplementation(() => ({
            set: (val) => {
                // Determine if this is X or Y based on value or call order is tricky
                // But for this test, we just care that *some* set was called.
                // To be precise, we can just capture all calls.
                mockSetX(val)
            },
            get: () => 0,
            onChange: vi.fn(),
        }))
    })

    afterEach(() => {
        vi.useRealTimers()
        vi.restoreAllMocks()
    })

    it('throttles mousemove events using requestAnimationFrame', () => {
        const { container } = render(<HeroPortal isLoaded={true} />)

        // Mock getBoundingClientRect
        const element = container.firstChild
        vi.spyOn(element, 'getBoundingClientRect').mockReturnValue({
            left: 0,
            top: 0,
            width: 1000,
            height: 1000,
        })

        // Simulate rapid mouse movements
        const numberOfEvents = 10
        for (let i = 0; i < numberOfEvents; i++) {
            fireEvent.mouseMove(window, { clientX: i * 10, clientY: i * 10 })
        }

        // In an unthrottled implementation, set() is called immediately for each event
        // So we expect 10 calls (actually 20, 10 for X and 10 for Y)
        // In a throttled implementation (rAF), set() should NOT be called immediately

        // Check immediate calls.
        // If unthrottled (current state), this will be high.
        // If throttled (future state), this should be 0.
        const initialCallCount = mockSetX.mock.calls.length

        // Log for debugging visibility
        console.log(`Initial call count (synchronous): ${initialCallCount}`)

        // If we are strictly testing that it IS throttled, we expect this to be 0
        // However, to use this as a verification test that passes *after* optimization,
        // we should assert based on the *optimized* behavior.

        // Run any pending timers/animation frames
        vi.runAllTimers() // or vi.runAllTicks() depending on implementation

        const finalCallCount = mockSetX.mock.calls.length
        console.log(`Final call count (after timers): ${finalCallCount}`)

        // Assertion for Optimized Behavior:
        // 1. Immediate calls should be 0 (because rAF is async)
        // 2. Final calls should be significantly less than numberOfEvents * 2 (X and Y)
        //    Ideally, just 1 update (2 calls: setX, setY) if all events happened in one frame.

        // Since we want this test to PASS after optimization and FAIL before:
        // Before optimization: initialCallCount == 20 (FAIL)
        // After optimization: initialCallCount == 0 (PASS)

        expect(initialCallCount).toBe(0)

        // After timers, it should have updated exactly once (processing the last event)
        expect(finalCallCount).toBeGreaterThan(0)
        expect(finalCallCount).toBeLessThanOrEqual(2) // 1 update for X, 1 for Y
    })
})


import { render, fireEvent, screen, act } from '@testing-library/react'
import ProjectsConstellation from './ProjectsConstellation'
import { vi, test } from 'vitest'

// Mock IntersectionObserver
const IntersectionObserverMock = vi.fn(() => ({
  disconnect: vi.fn(),
  observe: vi.fn(),
  takeRecords: vi.fn(),
  unobserve: vi.fn(),
}))
vi.stubGlobal('IntersectionObserver', IntersectionObserverMock)

// Mock ResizeObserver
const ResizeObserverMock = vi.fn(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))
vi.stubGlobal('ResizeObserver', ResizeObserverMock)

// Partial mock of framer-motion to avoid complex animation logic in JSDOM but keep component structure
// We want to ensure that if props change, the component re-renders.
vi.mock('framer-motion', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    // We mock useInView to always return true so elements are rendered
    useInView: () => true,
    // Mock animate/transition to be instant or no-op
    motion: {
        ...actual.motion,
        div: ({ children, ...props }) => <div {...props}>{children}</div>,
        a: ({ children, ...props }) => <a {...props}>{children}</a>,
    }
  }
})

test('ProjectsConstellation render performance', async () => {
  const iterations = 500
  const startTime = performance.now()

  render(<ProjectsConstellation />)

  // Find the first project card
  // Based on the code: <div className="project-index mono">0{project.id}</div>
  // Project 1 has id 1, so "01"
  const card1 = screen.getByText('01').closest('.project-card')

  if (!card1) throw new Error('Card not found')

  await act(async () => {
      for (let i = 0; i < iterations; i++) {
        fireEvent.click(card1)
      }
  })

  const endTime = performance.now()
  console.log(`[Vitest] Benchmark Duration (${iterations} clicks): ${endTime - startTime}ms`)
})

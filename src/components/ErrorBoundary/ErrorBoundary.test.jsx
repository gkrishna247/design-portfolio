import { render, screen, fireEvent } from '@testing-library/react'
import { vi, test, describe, expect, beforeEach, afterEach } from 'vitest'
import ErrorBoundary from './ErrorBoundary'

// Component that throws an error when told to
const ThrowError = ({ shouldThrow }) => {
  if (shouldThrow) {
    throw new Error('Test error')
  }
  return <div>Child component</div>
}

describe('ErrorBoundary', () => {
  let consoleErrorSpy

  beforeEach(() => {
    // Suppress console.error during tests to avoid noise
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    consoleErrorSpy.mockRestore()
  })

  test('renders children when there is no error', () => {
    render(
      <ErrorBoundary>
        <div>Test Child</div>
      </ErrorBoundary>
    )

    expect(screen.getByText('Test Child')).toBeDefined()
  })

  test('catches errors and displays fallback UI', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    )

    // Verify error boundary displays fallback UI
    expect(screen.getByText('Something went wrong')).toBeDefined()
    expect(screen.getByText('Failed to load this section. Please try again.')).toBeDefined()
    expect(screen.getByRole('button', { name: /retry/i })).toBeDefined()
    
    // Verify the warning icon is displayed
    expect(screen.getByText('⚠')).toBeDefined()
  })

  test('displays custom fallback message when provided', () => {
    const customMessage = 'Custom error message for testing'
    
    render(
      <ErrorBoundary fallbackMessage={customMessage}>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    )

    expect(screen.getByText('Something went wrong')).toBeDefined()
    expect(screen.getByText(customMessage)).toBeDefined()
  })

  test('logs error to console when error is caught', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    )

    // Verify console.error was called
    expect(consoleErrorSpy).toHaveBeenCalled()
    
    // Check that error message contains expected text
    const errorCalls = consoleErrorSpy.mock.calls.filter(call => 
      call.some(arg => typeof arg === 'string' && arg.includes('ErrorBoundary caught an error'))
    )
    expect(errorCalls.length).toBeGreaterThan(0)
  })

  test('retry button triggers page reload', () => {
    // Mock window.location.reload
    const originalLocation = window.location
    delete window.location
    window.location = { reload: vi.fn() }

    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    )

    const retryButton = screen.getByRole('button', { name: /retry/i })
    fireEvent.click(retryButton)

    // Verify reload was called
    expect(window.location.reload).toHaveBeenCalledTimes(1)

    // Restore window.location
    window.location = originalLocation
  })

  test('error boundary has correct CSS classes', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    )

    // Verify the container has the correct class
    const container = screen.getByText('Something went wrong').closest('.error-boundary')
    expect(container).toBeDefined()
    expect(container.classList.contains('error-boundary')).toBe(true)

    // Verify content wrapper
    const content = screen.getByText('Something went wrong').closest('.error-boundary-content')
    expect(content).toBeDefined()

    // Verify button class
    const button = screen.getByRole('button', { name: /retry/i })
    expect(button.classList.contains('error-boundary-button')).toBe(true)
  })

  test('does not render fallback when child component is working', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={false} />
      </ErrorBoundary>
    )

    // Verify child component is rendered
    expect(screen.getByText('Child component')).toBeDefined()
    
    // Verify error UI is not present
    expect(screen.queryByText('Something went wrong')).toBeNull()
    expect(screen.queryByRole('button', { name: /retry/i })).toBeNull()
  })

  test('handles multiple children correctly', () => {
    render(
      <ErrorBoundary>
        <div>First child</div>
        <div>Second child</div>
        <div>Third child</div>
      </ErrorBoundary>
    )

    expect(screen.getByText('First child')).toBeDefined()
    expect(screen.getByText('Second child')).toBeDefined()
    expect(screen.getByText('Third child')).toBeDefined()
  })

  test('getDerivedStateFromError returns correct state', () => {
    const testError = new Error('Test error for derived state')
    const derivedState = ErrorBoundary.getDerivedStateFromError(testError)

    expect(derivedState).toEqual({
      hasError: true,
      error: testError
    })
  })
})

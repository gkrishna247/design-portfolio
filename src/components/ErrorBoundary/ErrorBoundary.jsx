import React from 'react'
import './ErrorBoundary.css'

/**
 * Error Boundary component to catch and handle errors in lazy-loaded components.
 * Prevents the entire app from crashing when a chunk fails to load.
 */
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props)
        this.state = { hasError: false, error: null }
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error }
    }

    componentDidCatch(error, errorInfo) {
        // Log error to console in development
        console.error('ErrorBoundary caught an error:', error, errorInfo)
    }

    handleRetry = () => {
        this.setState({ hasError: false, error: null })
        // Reload the page to retry loading chunks
        window.location.reload()
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="error-boundary">
                    <div className="error-boundary-content">
                        <div className="error-boundary-icon">⚠</div>
                        <h2 className="error-boundary-title">Something went wrong</h2>
                        <p className="error-boundary-message">
                            {this.props.fallbackMessage || 'Failed to load this section. Please try again.'}
                        </p>
                        <button
                            className="error-boundary-button"
                            onClick={this.handleRetry}
                        >
                            Retry
                        </button>
                    </div>
                </div>
            )
        }

        return this.props.children
    }
}

export default ErrorBoundary

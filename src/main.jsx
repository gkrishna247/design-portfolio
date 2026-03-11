import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './styles/index.css'
import { MouseProvider } from './contexts/MouseContext.jsx'
import { ReducedMotionProvider } from './contexts/ReducedMotionContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ReducedMotionProvider>
      <MouseProvider>
        <App />
      </MouseProvider>
    </ReducedMotionProvider>
  </StrictMode>,
)

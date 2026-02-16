import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './styles/index.css'
import { MouseProvider } from './contexts/MouseContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MouseProvider>
      <App />
    </MouseProvider>
  </StrictMode>,
)

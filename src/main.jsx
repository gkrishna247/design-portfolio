import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

// Localized Fonts (Self-Contained Offline Support)
import '@fontsource/space-grotesk/300.css'
import '@fontsource/space-grotesk/400.css'
import '@fontsource/space-grotesk/500.css'
import '@fontsource/space-grotesk/600.css'
import '@fontsource/space-grotesk/700.css'

import '@fontsource/jetbrains-mono/300.css'
import '@fontsource/jetbrains-mono/400.css'
import '@fontsource/jetbrains-mono/500.css'
import '@fontsource/jetbrains-mono/600.css'
import '@fontsource/jetbrains-mono/700.css'

import '@fontsource/outfit/300.css'
import '@fontsource/outfit/400.css'
import '@fontsource/outfit/500.css'
import '@fontsource/outfit/600.css'
import '@fontsource/outfit/700.css'

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

import { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Lenis from 'lenis'
import Navigation from './components/Navigation/Navigation'

import Hero from './components/Hero/Hero'
import ProjectGallery from './components/ProjectGallery/ProjectGallery'
import About from './components/About/About'
import { CursorProvider } from './context/CursorContext'
import Cursor from './components/Cursor/Cursor'

function Home() {
  return (
    <div style={{ padding: 0 }}>
      <Hero />
      <ProjectGallery />
    </div>
  )
}

function App() {
  useEffect(() => {
    const lenis = new Lenis()

    function raf(time) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    return () => {
      // Cleanup if necessary
    }
  }, [])

  return (
    <CursorProvider>
      <Cursor />
      <Router>
        <Navigation />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </Router>
    </CursorProvider>
  )
}

export default App

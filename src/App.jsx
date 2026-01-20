import Navigation from './components/Navigation/Navigation'
import Hero from './components/Hero/Hero'
import BentoGrid from './components/BentoGrid/BentoGrid'
import { CursorProvider } from './context/CursorContext'
import Cursor from './components/Cursor/Cursor'

function Home() {
  return (
    <div style={{ padding: 0 }}>
      {/* Scroll Sections */}
      <Hero />
      <BentoGrid />
      <div style={{ height: '20vh' }}></div> {/* Spacer Footer */}
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
      <Navigation />
      <Home />
    </CursorProvider>
  )
}

export default App

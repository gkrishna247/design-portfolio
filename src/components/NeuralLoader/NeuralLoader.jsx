import './NeuralLoader.css'

/**
 * NeuralLoader - High-performance loading indicator
 * 
 * Pure CSS animation (no JavaScript) with:
 * - Pulsing circular orbit using CSS keyframes
 * - Neural Flux colors: Neon Violet & Cyan
 * - GPU-accelerated transforms for 60fps
 * - Minimal DOM footprint
 */
function NeuralLoader() {
  return (
    <div className="neural-loader-wrapper">
      <div className="neural-loader">
        {/* Central core */}
        <div className="loader-core" />
        
        {/* Outer rotating orbit */}
        <div className="loader-orbit">
          <div className="loader-particle violet" />
          <div className="loader-particle cyan" />
        </div>
      </div>
      
      {/* Loading text */}
      <p className="loader-text">Neural Flux Initializing...</p>
    </div>
  )
}

export default NeuralLoader

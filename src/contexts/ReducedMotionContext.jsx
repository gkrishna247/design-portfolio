import React, { createContext, useContext, useState, useMemo, useEffect } from 'react'

const ReducedMotionContext = createContext({
  prefersReducedMotion: false,
  toggleReducedMotion: () => {},
})

export const useReducedMotion = () => useContext(ReducedMotionContext)

export const ReducedMotionProvider = ({ children }) => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches
    }
    return false
  })

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
      const handleChange = (e) => setPrefersReducedMotion(e.matches)

      mediaQuery.addEventListener('change', handleChange)
      return () => mediaQuery.removeEventListener('change', handleChange)
    }
  }, [])

  const toggleReducedMotion = () => {
    setPrefersReducedMotion((prev) => !prev)
  }

  const value = useMemo(
    () => ({
      prefersReducedMotion,
      toggleReducedMotion,
    }),
    [prefersReducedMotion]
  )

  return (
    <ReducedMotionContext.Provider value={value}>
      {children}
    </ReducedMotionContext.Provider>
  )
}

import { createContext, useContext, useState } from 'react'

const CursorContext = createContext()

export function CursorProvider({ children }) {
    const [cursorVariant, setCursorVariant] = useState('default')
    const [cursorText, setCursorText] = useState('')

    const textEnter = (text) => {
        setCursorVariant('text')
        setCursorText(text)
    }

    const textLeave = () => {
        setCursorVariant('default')
        setCursorText('')
    }

    const hoverEnter = () => setCursorVariant('hover')
    const hoverLeave = () => setCursorVariant('default')

    return (
        <CursorContext.Provider value={{ cursorVariant, cursorText, textEnter, textLeave, hoverEnter, hoverLeave }}>
            {children}
        </CursorContext.Provider>
    )
}

export function useCursor() {
    return useContext(CursorContext)
}

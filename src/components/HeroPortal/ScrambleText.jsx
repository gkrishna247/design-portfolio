import { useState, useEffect, memo } from 'react'

/**
 * Text scramble effect hook - isolates scramble state updates
 */
function useScrambleText(text, isActive) {
    const [displayText, setDisplayText] = useState('')
    const chars = '!<>-_\\/[]{}—=+*^?#_01アイウエオカキクケコ'

    useEffect(() => {
        if (!isActive) {
            setDisplayText('')
            return
        }

        let iteration = 0
        const totalIterations = text.length * 2

        const interval = setInterval(() => {
            setDisplayText(
                text
                    .split('')
                    .map((letter, index) => {
                        if (index < Math.floor(iteration / 2)) {
                            return text[index]
                        }
                        return chars[Math.floor(Math.random() * chars.length)]
                    })
                    .join('')
            )

            iteration++

            if (iteration >= totalIterations) {
                setDisplayText(text)
                clearInterval(interval)
            }
        }, 50)

        return () => clearInterval(interval)
    }, [text, isActive])

    return displayText || text
}

/**
 * ScrambleText component to isolate re-renders caused by the scramble animation
 */
const ScrambleText = memo(({ text, isActive, as: Component = 'span', children, ...props }) => {
    const scrambledText = useScrambleText(text, isActive)

    return (
        <Component data-text={scrambledText} {...props}>
            {typeof children === 'function' ? children(scrambledText) : (children || scrambledText)}
        </Component>
    )
})

ScrambleText.displayName = 'ScrambleText'

export default ScrambleText

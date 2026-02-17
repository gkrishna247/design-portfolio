import { render, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import MagneticCursor from './MagneticCursor'
import { MouseProvider } from '../../contexts/MouseContext'
import React from 'react'

describe('MagneticCursor', () => {
    beforeEach(() => {
        vi.stubGlobal('requestAnimationFrame', (cb) => setTimeout(cb, 0))
        vi.stubGlobal('cancelAnimationFrame', (id) => clearTimeout(id))
        // Ensure not touch device
        try { delete window.ontouchstart } catch (e) {
            // ignore
        }
        Object.defineProperty(navigator, 'maxTouchPoints', { value: 0, writable: true })
        document.body.innerHTML = ''
    })

    it('reacts to hover on existing data-cursor elements', () => {
        const el = document.createElement('div')
        el.setAttribute('data-cursor', 'true')
        document.body.appendChild(el)

        const { container } = render(
            <MouseProvider>
                <MagneticCursor />
            </MouseProvider>
        )

        const cursor = container.querySelector('.cursor-arrow')
        expect(cursor).not.toBeNull()

        // Initial state
        expect(cursor.classList.contains('hovering')).toBe(false)

        // Simulate hover
        // Use mouseover with bubbles: true for delegation
        const event = new MouseEvent('mouseover', { bubbles: true })
        act(() => {
            el.dispatchEvent(event)
        })

        expect(cursor.classList.contains('hovering')).toBe(true)
    })

    it('reacts to hover on dynamically added data-cursor elements', () => {
        render(
            <MouseProvider>
                <MagneticCursor />
            </MouseProvider>
        )

        const cursor = document.querySelector('.cursor-arrow')

        const el = document.createElement('div')
        el.setAttribute('data-cursor', 'true')

        // Add to DOM
        act(() => {
            document.body.appendChild(el)
        })

        // Simulate hover
        act(() => {
            el.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }))
        })
        expect(cursor.classList.contains('hovering')).toBe(true)

        // Simulate leave
        act(() => {
            // Move to body
            el.dispatchEvent(new MouseEvent('mouseout', { bubbles: true, relatedTarget: document.body }))
        })
        expect(cursor.classList.contains('hovering')).toBe(false)
    })

    it('handles nested data-cursor elements being added', () => {
        render(
            <MouseProvider>
                <MagneticCursor />
            </MouseProvider>
        )
        const cursor = document.querySelector('.cursor-arrow')

        const container = document.createElement('div')
        const el = document.createElement('div')
        el.setAttribute('data-cursor', 'true')
        container.appendChild(el)

        act(() => {
            document.body.appendChild(container)
        })

        act(() => {
            el.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }))
        })
        expect(cursor.classList.contains('hovering')).toBe(true)
    })

    it('handles attribute changes', () => {
        render(
            <MouseProvider>
                <MagneticCursor />
            </MouseProvider>
        )
        const cursor = document.querySelector('.cursor-arrow')
        const el = document.createElement('div')
        document.body.appendChild(el)

        // Initially no cursor attribute, so mouseover shouldn't trigger hover
        act(() => {
            el.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }))
        })
        expect(cursor.classList.contains('hovering')).toBe(false)

        // Add attribute
        act(() => {
            el.setAttribute('data-cursor', 'true')
        })

        // Dispatch again
        act(() => {
            el.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }))
        })
        expect(cursor.classList.contains('hovering')).toBe(true)
    })
})

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
        // 'ontouchstart' in window check: we need to ensure the property is NOT present
        try { delete window.ontouchstart } catch (e) {
            // ignore
        }
        Object.defineProperty(navigator, 'maxTouchPoints', { value: 0, writable: true })
        document.body.innerHTML = ''
    })

    it('attaches listeners to existing data-cursor elements', () => {
        const el = document.createElement('div')
        el.setAttribute('data-cursor', 'true')
        document.body.appendChild(el)

        const { container } = render(
            <MouseProvider>
                <MagneticCursor />
            </MouseProvider>
        )
        // Debug
        // console.log(container.innerHTML)

        const cursor = container.querySelector('.cursor-arrow')
        expect(cursor).not.toBeNull()

        // Initial state
        expect(cursor.classList.contains('hovering')).toBe(false)

        // Simulate hover
        const event = new MouseEvent('mouseenter', { bubbles: false })
        act(() => {
            el.dispatchEvent(event)
        })

        expect(cursor.classList.contains('hovering')).toBe(true)
    })

    it('attaches listeners to dynamically added data-cursor elements', async () => {
        render(
            <MouseProvider>
                <MagneticCursor />
            </MouseProvider>
        )

        const cursor = document.querySelector('.cursor-arrow')

        const el = document.createElement('div')
        el.setAttribute('data-cursor', 'true')

        await act(async () => {
            document.body.appendChild(el)
            // Wait for MutationObserver
            await new Promise(resolve => setTimeout(resolve, 0))
        })

        act(() => {
            el.dispatchEvent(new MouseEvent('mouseenter'))
        })
        expect(cursor.classList.contains('hovering')).toBe(true)

        act(() => {
            el.dispatchEvent(new MouseEvent('mouseleave'))
        })
        expect(cursor.classList.contains('hovering')).toBe(false)
    })

    it('handles nested data-cursor elements being added', async () => {
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

        await act(async () => {
            document.body.appendChild(container)
            await new Promise(resolve => setTimeout(resolve, 0))
        })

        act(() => {
            el.dispatchEvent(new MouseEvent('mouseenter'))
        })
        expect(cursor.classList.contains('hovering')).toBe(true)
    })

    it('handles attribute changes', async () => {
        render(
            <MouseProvider>
                <MagneticCursor />
            </MouseProvider>
        )
        const cursor = document.querySelector('.cursor-arrow')
        const el = document.createElement('div')
        document.body.appendChild(el)

        // Initially no cursor
        act(() => {
            el.dispatchEvent(new MouseEvent('mouseenter'))
        })
        expect(cursor.classList.contains('hovering')).toBe(false)

        // Add attribute
        await act(async () => {
            el.setAttribute('data-cursor', 'true')
            await new Promise(resolve => setTimeout(resolve, 0))
        })

        act(() => {
            el.dispatchEvent(new MouseEvent('mouseenter'))
        })
        expect(cursor.classList.contains('hovering')).toBe(true)
    })
})

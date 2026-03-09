import { render } from '@testing-library/react'
import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest'
import NeuralBackground from './NeuralBackground'

// Mock MouseContext
vi.mock('../../contexts/MouseContext', () => ({
  useMouse: () => ({ subscribe: vi.fn(() => vi.fn()) }),
}))

// Mock matchMedia and WebGL context
const originalGetContext = HTMLCanvasElement.prototype.getContext

beforeAll(() => {
  window.matchMedia = vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }))

  // Mock WebGL2 Context for JsDOM
  HTMLCanvasElement.prototype.getContext = vi.fn((type) => {
    if (type === 'webgl2') {
      return {
        createShader: vi.fn(),
        shaderSource: vi.fn(),
        compileShader: vi.fn(),
        getShaderParameter: vi.fn(() => true),
        getShaderInfoLog: vi.fn(),
        deleteShader: vi.fn(),
        createProgram: vi.fn(),
        attachShader: vi.fn(),
        linkProgram: vi.fn(),
        getProgramParameter: vi.fn(() => true),
        getProgramInfoLog: vi.fn(),
        deleteProgram: vi.fn(),
        createBuffer: vi.fn(),
        bindBuffer: vi.fn(),
        bufferData: vi.fn(),
        bufferSubData: vi.fn(),
        deleteBuffer: vi.fn(),
        createVertexArray: vi.fn(),
        bindVertexArray: vi.fn(),
        deleteVertexArray: vi.fn(),
        enableVertexAttribArray: vi.fn(),
        vertexAttribPointer: vi.fn(),
        useProgram: vi.fn(),
        getUniformLocation: vi.fn(),
        enable: vi.fn(),
        disable: vi.fn(),
        blendFunc: vi.fn(),
        viewport: vi.fn(),
        clearColor: vi.fn(),
        clear: vi.fn(),
        uniformMatrix4fv: vi.fn(),
        uniform1f: vi.fn(),
        drawArrays: vi.fn(),
        getExtension: vi.fn(),
        COLOR_BUFFER_BIT: 16384,
        ARRAY_BUFFER: 34962,
        STATIC_DRAW: 35044,
        DYNAMIC_DRAW: 35048,
        FLOAT: 5126,
        BLEND: 3042,
        SRC_ALPHA: 770,
        ONE: 1,
        DEPTH_TEST: 2929,
        POINTS: 0,
        LINES: 1,
        VERTEX_SHADER: 35633,
        FRAGMENT_SHADER: 35632,
        COMPILE_STATUS: 35713,
        LINK_STATUS: 35714,
      }
    }
    return originalGetContext.call(this, type)
  })
})

afterAll(() => {
    HTMLCanvasElement.prototype.getContext = originalGetContext
})

describe('NeuralBackground', () => {
  it('renders without crashing and initializes canvas', () => {
    const { container } = render(<NeuralBackground />)
    expect(container.querySelector('.neural-background')).toBeTruthy()
    expect(container.querySelector('canvas.neural-canvas')).toBeTruthy()
  })
})

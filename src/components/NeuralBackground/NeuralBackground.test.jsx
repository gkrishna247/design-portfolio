import { render } from '@testing-library/react';
import { describe, it, expect, vi, beforeAll } from 'vitest';
import NeuralBackground from './NeuralBackground';

// Mock Canvas to NOT render children, avoiding the R3F/DOM mismatch issues for instancedMesh
vi.mock('@react-three/fiber', () => ({
  Canvas: ({ children, ...props }) => <div data-testid="canvas" {...props} />,
  useFrame: vi.fn(),
  useThree: () => ({ camera: {}, gl: {}, size: { width: 100, height: 100 }, viewport: { width: 100, height: 100 } }),
}));

// Mock MouseContext
vi.mock('../../contexts/MouseContext', () => ({
  useMouse: () => ({ mouseRef: { current: { clientX: 0, clientY: 0 } }, isInitialized: { current: true } }),
}));

// Mock matchMedia
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
    }));
});

describe('NeuralBackground', () => {
  it('renders without crashing', () => {
    const { container } = render(<NeuralBackground />);
    expect(container.querySelector('.neural-background')).toBeTruthy();
    expect(container.querySelector('[data-testid="canvas"]')).toBeTruthy();
  });
});

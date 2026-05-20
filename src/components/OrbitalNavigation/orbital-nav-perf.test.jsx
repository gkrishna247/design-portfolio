import React from 'react';
import { render } from '@testing-library/react';
import { describe, it, vi } from 'vitest';
import OrbitalNavigation from './OrbitalNavigation';
import { useMotionValue } from 'framer-motion';

// Mock scrollIntoView
window.HTMLElement.prototype.scrollIntoView = vi.fn();

const TestWrapper = () => {
    const scrollProgress = useMotionValue(0);
    return <OrbitalNavigation activeSection="hero" scrollProgress={scrollProgress} />;
};

describe('OrbitalNavigation Performance', () => {
    it('render performance', () => {
        const start = performance.now();
        for (let i = 0; i < 1000; i++) {
            const { unmount } = render(<TestWrapper />);
            unmount();
        }
        const end = performance.now();
        console.log(`Render time (1000 cycles): ${end - start}ms`);
    });
});

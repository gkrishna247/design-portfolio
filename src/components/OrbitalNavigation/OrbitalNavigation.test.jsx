import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import OrbitalNavigation from './OrbitalNavigation';
import { useMotionValue } from 'framer-motion';

// Mock scrollIntoView
window.HTMLElement.prototype.scrollIntoView = vi.fn();

const TestWrapper = () => {
    const scrollProgress = useMotionValue(0);
    return <OrbitalNavigation activeSection="hero" scrollProgress={scrollProgress} />;
};

describe('OrbitalNavigation', () => {
    it('shows tooltip on hover', async () => {
        render(<TestWrapper />);

        const centralButton = screen.getByLabelText(/Open navigation menu/i);
        fireEvent.click(centralButton);

        // Wait for items to be visible. The items are rendered conditionally {isExpanded && ...}
        // and have Framer Motion animations.
        // We can wait for the 'CONNECT' button to appear.
        const connectButton = await screen.findByLabelText('Navigate to CONNECT section');

        // Hover
        fireEvent.mouseEnter(connectButton);

        // Check for tooltip text 'CONNECT'
        const tooltip = await screen.findByText('CONNECT');
        expect(tooltip).toBeDefined();
        // Ensure it's inside the tooltip container (optional but good)
        expect(tooltip.parentElement.className).toContain('orbital-tooltip');
        expect(tooltip.className).toContain('mono');
    });
});

import React from 'react';
import { renderToString } from 'react-dom/server';
import SkillsOrbitSection from './SkillsOrbit.jsx';

import { describe, it } from 'vitest';

describe('SkillsOrbit Performance', () => {
    it('benchmark render', () => {
        const start = performance.now();
        for (let i = 0; i < 5000; i++) {
            renderToString(<SkillsOrbitSection />);
        }
        const end = performance.now();
        console.log(`Render time for 5000 iterations: ${end - start} ms`);
    }, 60000);
});

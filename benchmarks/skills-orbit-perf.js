import React from 'react';
import { renderToString } from 'react-dom/server';
import SkillsOrbitSection from '../src/components/SkillsOrbit/SkillsOrbit.jsx';

const start = performance.now();
for (let i = 0; i < 5000; i++) {
    renderToString(React.createElement(SkillsOrbitSection));
}
const end = performance.now();
console.log(`Render time for 5000 iterations: ${end - start} ms`);

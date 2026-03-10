import React from 'react';
import { renderToString } from 'react-dom/server';
import OrbitalNavigation from '../src/components/OrbitalNavigation/OrbitalNavigation.jsx';

const mockScrollProgress = { current: 0, get: () => 0, onChange: () => () => {}, on: () => () => {} };

const start = performance.now();
for (let i = 0; i < 10000; i++) {
    renderToString(React.createElement(OrbitalNavigation, { activeSection: "hero", scrollProgress: mockScrollProgress }));
}
const end = performance.now();
console.log(`Render time: ${end - start} ms`);

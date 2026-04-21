# Krishna.DEV Portfolio - Neural Flux v2.0

A cutting-edge AI Engineer portfolio built with React, Three.js, and Framer Motion. This project showcases a "Neural Flux" design aesthetic with immersive 3D backgrounds, interactive elements, and a focus on performance and accessibility.

![Portfolio Preview](public/vite.svg)

## ✨ Features

### 🎨 Visual Experience
- **Neural Background**: Interactive 3D particle system (1500 particles on desktop, 500 on mobile) with glowing orbs and connection lines, all reactive to mouse and scroll.
- **Magnetic Cursor**: Custom SVG arrow cursor with instant DOM transforms, hover/click states, and glow effects. Hidden on touch devices.
- **Orbital Navigation**: Circular navigation system with spring animations, escape-key close, and scroll-linked rotation.
- **Text Scramble Effect**: Japanese-inspired character scramble animation on hero text.
- **Parallax Transforms**: Scroll-linked transformations on hero content with spring-based smoothing.

### 📄 Content Sections (6 Total)
1. **Hero Portal**: Grand entrance with glitch effects, status indicator, and CTAs.
2. **Floating Identity**: About section with 3D card transforms and stats grid.
3. **Projects Constellation**: Memoized project cards with responsive dot decorations.
4. **Skills Orbit**: Interactive skill categories arranged in an orbital pattern.
5. **Experience Timeline**: Alternating timeline cards with glassmorphism.
6. **Contact Portal**: Social links with hover states and footer.

### ⚡ Performance
- **Lazy Loading**: Below-the-fold components loaded on demand via `React.lazy()`.
- **Error Boundary**: Graceful error handling for failed chunk loads with retry button.
- **Responsive Particle Counts**: Reduced 3D particle counts on mobile for 60fps target.
- **Optimized DPR**: Canvas uses `dpr={[1, 1.5]}` to prevent GPU overload.
- **Memoized Components**: `React.memo()` on heavy components to prevent re-renders.
- **Passive Event Listeners**: All mouse/scroll handlers use `{ passive: true }`.

### ♿ Accessibility (WCAG 2.1)
- **Skip-to-Content Link**: Keyboard-accessible link to main content (WCAG 2.4.1).
- **Reduced Motion Support**: Respects `prefers-reduced-motion` for animations and scroll.
- **ARIA Labels**: Navigation buttons and interactive elements are labeled.
- **Keyboard Navigation**: Escape key closes navigation menu.
- **Focus Indicators**: Visible focus states on all interactive elements.

### 🔍 SEO & PWA
- **Open Graph / Twitter Cards**: Rich previews for social sharing.
- **Sitemap & robots.txt**: Search engine discovery and crawling.
- **PWA Manifest**: Installable web app with theme colors.
- **Canonical URL**: Prevents duplicate content issues.
- **Meta Tags**: Description, keywords, and author.

## 🛠️ Tech Stack

| Category       | Technologies                                       |
| -------------- | -------------------------------------------------- |
| **Framework**  | React 18, Vite                                     |
| **3D Graphics**| Three.js, @react-three/fiber, @react-three/drei    |
| **Animations** | Framer Motion                                      |
| **Smooth Scroll** | Lenis                                           |
| **Styling**    | CSS Variables, Glassmorphism, Aurora Gradients     |
| **Testing**    | Vitest, Playwright, Testing Library                |
| **Linting**    | ESLint                                             |

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/gkrishna247/design-portfolio.git
cd design-portfolio

# Install dependencies
npm install

# Start development server
npm run dev
```

## 🏗️ Scripts

| Script          | Description                              |
| --------------- | ---------------------------------------- |
| `npm run dev`   | Start development server                 |
| `npm run build` | Create production build                  |
| `npm run preview` | Preview production build locally       |
| `npm run lint`  | Run ESLint checks                        |
| `npm run test`  | Run Vitest tests                         |

## 🎨 Design System

The "Neural Flux" design system is defined in `src/styles/index.css`:

- **Colors**: Void Black (`#030308`), Neon Violet (`#a855f7`), Cyan (`#22d3ee`), Pink (`#ec4899`).
- **Typography**: Space Grotesk (Display), JetBrains Mono (Code), Outfit (Body).
- **Effects**: Glassmorphism, Aurora Gradients, Neon Glows, Holographic Shimmer.
- **Animations**: Float, Pulse Glow, Morph, Glitch, Stagger-in.

## 📁 Project Structure

```
src/
├── components/
│   ├── ContactPortal/      # Contact section with social links
│   ├── ErrorBoundary/      # Error handling for lazy loading
│   ├── ExperienceTimeline/ # Timeline cards
│   ├── FloatingIdentity/   # About section
│   ├── HeroPortal/         # Hero section
│   ├── MagneticCursor/     # Custom cursor
│   ├── NeuralBackground/   # R3F 3D background
│   ├── OrbitalNavigation/  # Circular navigation
│   ├── ProjectsConstellation/  # Project cards
│   └── SkillsOrbit/        # Skills visualization
├── data/
│   └── projects.js         # Project data (4 AI/ML projects)
├── styles/
│   └── index.css           # Design system
├── App.jsx                 # Main layout
└── main.jsx                # Entry point
```

---

Built by [Krishna](https://github.com/gkrishna247)

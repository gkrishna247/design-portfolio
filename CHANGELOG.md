# Changelog 

All notable changes to this project will be documented in this file.


## [2.1.1] - 2026-01-30

### Documentation
- **README**: Comprehensive rewrite with detailed feature list based on line-by-line codebase analysis.
  - Added Performance section (lazy loading, memoization, responsive particles).
  - Added Accessibility section (skip link, reduced motion, ARIA labels, focus states).
  - Added SEO/PWA section (Open Graph, sitemap, manifest).
  - Added project structure diagram.
  - Updated Tech Stack to table format with testing tools.
- **AGENTS**: Updated agent roles with available skills (`build_verify`, `code_linter`, `state_manager`).

## [2.1.0] - 2026-01-28

### Added
- **SEO**: Twitter Card meta tags for social sharing previews
- **SEO**: Open Graph image support for link previews
- **SEO**: robots.txt for search engine crawling
- **SEO**: sitemap.xml for search engine discovery
- **SEO**: manifest.json for PWA support
- **SEO**: Canonical URL to prevent duplicate content issues
- **Accessibility**: Skip-to-content link for keyboard navigation (WCAG 2.4.1)
- **Accessibility**: Escape key closes orbital navigation menu
- **Accessibility**: aria-label on navigation buttons for screen readers
- **Accessibility**: aria-expanded state on navigation toggle
- **Accessibility**: aria-current on active navigation items
- **UX**: noscript fallback for JavaScript-disabled browsers
- **Docs**: .env.example for environment variable documentation
- **Docs**: CHANGELOG.md to track project changes

### Fixed
- **ESLint**: Resolved `process` undefined error in playwright.config.js
- **Navigation**: Scroll detection now properly tracks all 6 sections including Experience
- **Navigation**: Added missing aria-labels to orbital navigation buttons

### Security
- **External Links**: Added `rel="noopener noreferrer"` to prevent tabnabbing attacks
- **External Links**: Added `target="_blank"` for proper new tab behavior

### Changed
- Updated eslint.config.js to include Node.js globals for config files
- Scroll thresholds adjusted for balanced section detection

## [2.0.0] - 2026-01-27

### Initial Release
- Neural Flux v2.0 design system
- React 18 with lazy loading
- Three.js neural background
- Framer Motion animations
- Lenis smooth scrolling
- Responsive design (mobile-first)

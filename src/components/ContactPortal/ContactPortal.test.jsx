import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ContactPortal from './ContactPortal';

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
    a: ({ children, ...props }) => <a {...props}>{children}</a>,
    span: ({ children, ...props }) => <span {...props}>{children}</span>,
    footer: ({ children, ...props }) => <footer {...props}>{children}</footer>,
  },
  useInView: () => true,
}));

describe('ContactPortal', () => {
  it('renders correctly', () => {
    render(<ContactPortal />);
    expect(screen.getByText('CONNECT')).toBeTruthy();
    expect(screen.getByText('HAVE A PROJECT')).toBeTruthy();
    expect(screen.getByText('IN MIND?')).toBeTruthy();
  });

  it('renders contact links with correct hrefs', () => {
    render(<ContactPortal />);

    const githubLink = screen.getByText('GitHub').closest('a');
    expect(githubLink.getAttribute('href')).toBe('https://github.com');

    const linkedinLink = screen.getByText('LinkedIn').closest('a');
    expect(linkedinLink.getAttribute('href')).toBe('https://linkedin.com');

    const twitterLink = screen.getByText('Twitter').closest('a');
    expect(twitterLink.getAttribute('href')).toBe('https://twitter.com');

    const emailLink = screen.getByText('Email').closest('a');
    expect(emailLink.getAttribute('href')).toBe('mailto:alex@dev.com');
  });

  it('does not have active class on links (since we removed it)', () => {
    render(<ContactPortal />);
    const link = screen.getByText('GitHub').closest('a');

    // Initial class check (should not have 'active')
    expect(link.classList.contains('active')).toBe(false);

    // Hover
    fireEvent.mouseEnter(link);

    // Should still not have 'active' class (handled by CSS :hover now)
    expect(link.classList.contains('active')).toBe(false);

    // Unhover
    fireEvent.mouseLeave(link);

    expect(link.classList.contains('active')).toBe(false);
  });
});

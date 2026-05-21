import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ScrollReveal from '../src/components/ScrollReveal';

describe('ScrollReveal', () => {
  beforeEach(() => {
    vi.stubGlobal('IntersectionObserver', vi.fn((cb) => ({
      observe: (el) => {
        cb([{ isIntersecting: true, target: el }]);
      },
      unobserve: vi.fn(),
      disconnect: vi.fn(),
    })));
  });

  it('renders children and becomes visible', () => {
    render(
      <ScrollReveal>
        <p>Animated content</p>
      </ScrollReveal>
    );
    expect(screen.getByText('Animated content')).toBeInTheDocument();
    expect(document.querySelector('.scroll-reveal--visible')).toBeTruthy();
  });
});

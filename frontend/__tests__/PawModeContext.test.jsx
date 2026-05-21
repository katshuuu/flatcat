import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { PawModeProvider, usePawMode } from '../src/context/PawModeContext';

function TestConsumer() {
  const { pawMode, togglePawMode, pawCount, incrementPawCount, clearPaws } = usePawMode();
  return (
    <div>
      <span data-testid="mode">{pawMode ? 'on' : 'off'}</span>
      <span data-testid="count">{pawCount}</span>
      <button type="button" onClick={togglePawMode}>toggle</button>
      <button type="button" onClick={incrementPawCount}>inc</button>
      <button type="button" onClick={clearPaws}>clear</button>
    </div>
  );
}

describe('PawModeContext', () => {
  beforeEach(() => {
    localStorage.clear();
    document.body.classList.remove('paw-mode-active');
  });

  it('toggles paw mode and persists to localStorage', () => {
    render(
      <PawModeProvider>
        <TestConsumer />
      </PawModeProvider>
    );

    expect(screen.getByTestId('mode')).toHaveTextContent('off');
    fireEvent.click(screen.getByText('toggle'));
    expect(screen.getByTestId('mode')).toHaveTextContent('on');
    expect(localStorage.getItem('flatcat_paw_mode')).toBe('1');
    expect(document.body.classList.contains('paw-mode-active')).toBe(true);
  });

  it('tracks and clears paw count', () => {
    render(
      <PawModeProvider>
        <TestConsumer />
      </PawModeProvider>
    );

    fireEvent.click(screen.getByText('inc'));
    fireEvent.click(screen.getByText('inc'));
    expect(screen.getByTestId('count')).toHaveTextContent('2');
    fireEvent.click(screen.getByText('clear'));
    expect(screen.getByTestId('count')).toHaveTextContent('0');
  });

  it('restores paw mode from localStorage', () => {
    localStorage.setItem('flatcat_paw_mode', '1');
    render(
      <PawModeProvider>
        <TestConsumer />
      </PawModeProvider>
    );
    expect(screen.getByTestId('mode')).toHaveTextContent('on');
  });
});

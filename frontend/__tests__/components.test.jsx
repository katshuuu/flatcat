import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import Header from '../src/components/Header';
import Footer from '../src/components/Footer';
import { AuthProvider } from '../src/context/AuthContext';
import { PawModeProvider } from '../src/context/PawModeContext';

function renderHeader() {
  return render(
    <MemoryRouter>
      <PawModeProvider>
        <Header />
      </PawModeProvider>
    </MemoryRouter>
  );
}

vi.mock('../src/context/AuthContext', async () => {
  const actual = await vi.importActual('../src/context/AuthContext');
  return {
    ...actual,
    useAuth: vi.fn(() => ({
      user: null,
      logout: vi.fn(),
      loading: false,
    })),
  };
});

describe('Header', () => {
  it('renders navigation links', () => {
    renderHeader();
    expect(screen.getByText('Главная')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Создать домик' })).toBeInTheDocument();
    expect(screen.queryByText('О нас')).not.toBeInTheDocument();
  });
});

describe('Footer', () => {
  it('renders brand info', () => {
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    );
    expect(screen.getAllByText(/FlatCat/).length).toBeGreaterThan(0);
    expect(screen.getByText('hello@flatcat.ru')).toBeInTheDocument();
    expect(screen.getByText(/красиво · лениво/)).toBeInTheDocument();
  });
});

describe('Header with admin user', () => {
  it('shows admin link for admin role', async () => {
    const { useAuth } = await import('../src/context/AuthContext');
    useAuth.mockReturnValueOnce({
      user: { role: 'admin', email: 'a@b.com' },
      logout: vi.fn(),
      loading: false,
    });

    renderHeader();
    expect(screen.getByText('Админ')).toBeInTheDocument();
  });
});

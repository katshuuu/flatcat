import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Home from '../src/pages/Home';
import About from '../src/pages/About';
import Catalog from '../src/pages/Catalog';
import Login from '../src/pages/Login';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('../src/context/AuthContext', () => ({
  useAuth: () => ({
    login: vi.fn().mockResolvedValue({}),
    register: vi.fn(),
    user: null,
    token: null,
    loading: false,
  }),
}));

describe('Home page', () => {
  beforeEach(() => {
    vi.stubGlobal('IntersectionObserver', vi.fn(() => ({
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
    })));
  });

  it('renders hero banner image', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );
    const img = screen.getByRole('img', { name: /FlatCat/i });
    expect(img).toHaveAttribute('src', '/hero-banner.png');
  });

  it('renders hero action buttons', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );
    expect(screen.getByText('Создать домик')).toBeInTheDocument();
    expect(screen.getByText('Смотреть каталог')).toBeInTheDocument();
  });

  it('renders product lines section', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );
    expect(screen.getByText('Четыре линейки')).toBeInTheDocument();
  });
});

describe('About page', () => {
  it('renders about content', () => {
    render(<About />);
    expect(screen.getByText('О бренде')).toBeInTheDocument();
    expect(screen.getByText(/FlatCat/)).toBeInTheDocument();
  });
});

describe('Catalog page', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')));
  });

  it('shows sample products when API fails', async () => {
    render(
      <MemoryRouter>
        <Catalog />
      </MemoryRouter>
    );
    expect(await screen.findByText('Фрукт «Клубника»')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Фрукт «Клубника»' })).toHaveAttribute(
      'src',
      '/products/03-fruit-strawberry.png',
    );
  });
});

describe('Login page', () => {
  it('renders login form', () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );
    expect(screen.getByText('Вход')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('submits login form', async () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );
    const inputs = screen.getAllByRole('textbox');
    fireEvent.change(inputs[0], { target: { value: 'a@b.com' } });
    const passwordInput = document.querySelector('input[type="password"]');
    fireEvent.change(passwordInput, { target: { value: 'pass' } });
    fireEvent.click(screen.getByRole('button', { name: 'Войти' }));
    expect(await screen.findByText('Вход...')).toBeInTheDocument();
  });
});

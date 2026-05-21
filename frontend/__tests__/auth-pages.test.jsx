import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AuthProvider } from '../src/context/AuthContext';
import Register from '../src/pages/Register';
import Constructor from '../src/pages/Constructor';
import Orders from '../src/pages/Orders';
import Admin from '../src/pages/Admin';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});

function renderWithAuth(ui) {
  return render(
    <MemoryRouter>
      <AuthProvider>{ui}</AuthProvider>
    </MemoryRouter>
  );
}

describe('Register page', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false }));
    mockNavigate.mockClear();
  });

  it('renders registration form', () => {
    renderWithAuth(<Register />);
    expect(screen.getByText('Регистрация')).toBeInTheDocument();
    expect(screen.getByText('Создать аккаунт')).toBeInTheDocument();
  });

  it('shows validation errors for invalid fields', () => {
    renderWithAuth(<Register />);
    fireEvent.click(screen.getByText('Создать аккаунт'));
    expect(screen.getByText('Укажите email')).toBeInTheDocument();
    expect(screen.getByText('Укажите пароль')).toBeInTheDocument();
    expect(fetch).not.toHaveBeenCalled();
  });

  it('validates email on blur', () => {
    renderWithAuth(<Register />);
    const email = screen.getByLabelText(/Email/i);
    fireEvent.change(email, { target: { value: 'not-an-email' } });
    fireEvent.blur(email);
    expect(screen.getByText('Некорректный формат email')).toBeInTheDocument();
  });
});

describe('Constructor page', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false }));
  });

  it('renders personality quiz first', () => {
    renderWithAuth(<Constructor />);
    expect(screen.getByText(/Какой кот живёт в вашем коте/)).toBeInTheDocument();
  });
});

describe('Orders page', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false }));
    mockNavigate.mockClear();
  });

  it('redirects when not logged in', async () => {
    renderWithAuth(<Orders />);
    await vi.waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/login'));
  });
});

describe('Admin page', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false }));
    mockNavigate.mockClear();
  });

  it('redirects non-admin users', async () => {
    renderWithAuth(<Admin />);
    await vi.waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/'));
  });
});

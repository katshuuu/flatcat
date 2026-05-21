import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import App from '../src/App';
import { AuthProvider } from '../src/context/AuthContext';
import { PawModeProvider } from '../src/context/PawModeContext';

vi.mock('../src/components/PawModeOverlay', () => ({ default: () => null }));

vi.mock('../src/pages/Home', () => ({ default: () => <div>Home Page</div> }));
vi.mock('../src/pages/Catalog', () => ({ default: () => <div>Catalog Page</div> }));
vi.mock('../src/pages/Constructor', () => ({ default: () => <div>Constructor Page</div> }));
vi.mock('../src/pages/About', () => ({ default: () => <div>About Page</div> }));
vi.mock('../src/pages/Login', () => ({ default: () => <div>Login Page</div> }));
vi.mock('../src/pages/Register', () => ({ default: () => <div>Register Page</div> }));
vi.mock('../src/pages/Orders', () => ({ default: () => <div>Orders Page</div> }));
vi.mock('../src/pages/Admin', () => ({ default: () => <div>Admin Page</div> }));

function renderApp(path = '/') {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <AuthProvider>
        <PawModeProvider>
          <App />
        </PawModeProvider>
      </AuthProvider>
    </MemoryRouter>
  );
}

describe('App', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false }));
  });

  it('renders header with FlatCat brand', () => {
    renderApp();
    expect(screen.getByRole('link', { name: 'FLATCAT' })).toBeInTheDocument();
  });

  it('renders home page on /', async () => {
    renderApp('/');
    expect(await screen.findByText('Home Page')).toBeInTheDocument();
  });

  it('renders about page on /about', async () => {
    renderApp('/about');
    expect(await screen.findByText('About Page')).toBeInTheDocument();
  });

  it('renders login link when not authenticated', () => {
    renderApp();
    expect(screen.getByText('Войти')).toBeInTheDocument();
  });

  it('renders floating paw mode toggle', () => {
    renderApp();
    expect(document.getElementById('paw-btn')).toBeInTheDocument();
    expect(screen.queryByText('🐾 Лапка')).not.toBeInTheDocument();
  });
});

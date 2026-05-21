import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NAV = [
  { to: '/', label: 'Главная' },
  { to: '/catalog', label: 'Каталог' },
];

export default function Header() {
  const { user, logout } = useAuth();
  const location = useLocation();

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <div className="site-logo-wrap">
          <Link to="/" className="site-logo">FLATCAT</Link>
          <Link
            to="/constructor"
            className={`site-logo-cta nav-link${location.pathname === '/constructor' ? ' active' : ''}`}
          >
            Создать домик
          </Link>
        </div>

        <nav className="site-nav">
          {NAV.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={location.pathname === to ? 'nav-link active' : 'nav-link'}
            >
              {label}
            </Link>
          ))}

          {user ? (
            <>
              <Link
                to="/orders"
                className={location.pathname === '/orders' ? 'nav-link active' : 'nav-link'}
              >
                Заказы
              </Link>
              {(user.role === 'admin' || user.role === 'manager') && (
                <Link
                  to="/admin"
                  className={location.pathname === '/admin' ? 'nav-link active' : 'nav-link'}
                >
                  Админ
                </Link>
              )}
              <button type="button" onClick={logout} className="btn btn-outline btn-sm" style={{ marginLeft: 6 }}>
                Выйти
              </button>
            </>
          ) : (
            <Link to="/login" className="btn btn-primary btn-sm" style={{ marginLeft: 6 }}>
              Войти
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}

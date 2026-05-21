import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <h3>FlatCat</h3>
          <p className="text-muted" style={{ fontSize: 14, lineHeight: 1.6 }}>
            Красиво. Лениво. Лежанки-домики для кошек с характером.
          </p>
          <p className="text-pink text-uppercase" style={{ marginTop: 10 }}>красиво · лениво</p>
        </div>
        <div>
          <h4>Навигация</h4>
          <div className="footer-links">
            <Link to="/catalog">Каталог</Link>
            <Link to="/constructor">Создать домик</Link>
            <Link to="/about">О нас</Link>
          </div>
        </div>
        <div>
          <h4>Линейки</h4>
          <div className="footer-links">
            <span className="text-muted">Домики-ушки</span>
            <span className="text-muted">Когтеточки</span>
            <span className="text-muted">Фруктовые</span>
            <span className="text-muted">Кубик</span>
          </div>
        </div>
        <div>
          <h4>Контакты</h4>
          <div className="footer-links">
            <a href="mailto:hello@flatcat.ru">hello@flatcat.ru</a>
            <span className="text-muted">Доставка СДЭК / Почта России</span>
          </div>
        </div>
      </div>
      <div className="container footer-bottom">
        FlatCat &copy; {new Date().getFullYear()} — красиво, лениво, по-кошачьи
      </div>
    </footer>
  );
}

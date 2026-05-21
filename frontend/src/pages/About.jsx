export default function About() {
  return (
    <div className="fade-in page-section">
      <div className="container-medium">
        <h1 className="page-title">О бренде</h1>
        <p className="text-muted" style={{ fontSize: 16, lineHeight: 1.8, marginBottom: 24 }}>
          «FlatCat» — онлайн-магазин лежанок-домиков для кошек. Мы не продаём «коробку с дырой»:
          каждый домик — метафора «кот в своём теле». Рыжий пушистый для рыжего, полосатый для тигра,
          чёрный — для пантеры.
        </p>
        <p className="text-muted" style={{ fontSize: 16, lineHeight: 1.8, marginBottom: 32 }}>
          Домики сочетают зоопсихологический комфорт, ручную работу и игровую биомеханику.
          Оформление магазина вдохновлено эстетикой{' '}
          <a href="https://ushki.store/" target="_blank" rel="noreferrer">ushki.store</a>
          {' '}— чистота, розовый акцент и внимание к деталям.
        </p>

        <div className="card form-card" style={{ marginBottom: 24 }}>
          <h2 className="font-display" style={{ fontSize: 24, marginBottom: 16 }}>Цены</h2>
          <ul style={{ paddingLeft: 20, lineHeight: 2, color: 'var(--ushki-text-muted)' }}>
            <li>Готовый домик: 3 500 – 5 500 ₽</li>
            <li>Кастом из конструктора: 6 500 – 12 000 ₽</li>
            <li>Сменная панель для кубика: от 1 200 ₽</li>
            <li>Подписка «Смена настроения»</li>
          </ul>
        </div>

        <div className="card form-card">
          <h2 className="font-display" style={{ fontSize: 24, marginBottom: 16 }}>Доставка</h2>
          <p className="text-muted" style={{ lineHeight: 1.7 }}>
            СДЭК — оплата при получении в пункте выдачи. Почта России — 400 ₽.
            Установка в Москве — +500 ₽.
          </p>
        </div>
      </div>
    </div>
  );
}

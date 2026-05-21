import { Link } from 'react-router-dom';
import ScrollReveal from '../components/ScrollReveal';

const lines = [
  { icon: '\u{1F442}', title: 'Домики-ушки', desc: 'Мягкий круг с большими ушами на крыше. Кот зарывается носом в валики — акустический комфорт.' },
  { icon: '\u{1F9F9}', title: 'Когтеточки', desc: 'Сизаль + съёмный меховой чехол. Точит когти о бортики и спит внутри — не на диване.' },
  { icon: '\u{1F349}', title: 'Фруктовые', desc: 'Арбуз, апельсин, киви, авокадо. Пушистая «мякоть» внутри — идеально для Instagram.' },
  { icon: '\u{1F4E6}', title: 'Кубик', desc: 'Минималистичный куб со сменными панелями: когтеточка, карман для мяты.' },
];

const values = [
  { title: 'Подлинность', desc: 'Текстуры и окрасы максимально близки к настоящей кошачьей шерсти.' },
  { title: 'Ручная работа', desc: 'Каждый домик собирается вручную по вашей схеме из конструктора.' },
  { title: 'Со-творчество', desc: 'Вы — соавтор дизайна. Мастер подбирает мех и сшивает по выбранному окрасу.' },
];

export default function Home() {
  return (
    <div className="fade-in home-page">
      <ScrollReveal className="hero-banner-wrap" immediate>
        <section className="hero-banner">
          <img
            src="/hero-banner.png"
            alt="FlatCat — красиво, лениво. Лежанки-домики для кошек"
            className="hero-banner__img"
          />
          <div className="hero-banner__overlay">
            <div className="hero-banner__actions">
              <Link to="/constructor" className="btn btn-primary btn-lg">Создать домик</Link>
              <Link to="/catalog" className="btn btn-white btn-lg">Смотреть каталог</Link>
            </div>
          </div>
        </section>
      </ScrollReveal>

      <ScrollReveal as="section" className="section" delay={80}>
        <div className="container">
          <h2 className="section-title">Четыре линейки</h2>
          <div className="grid-features">
            {lines.map((item, i) => (
              <ScrollReveal key={item.title} className="card feature-card" delay={i * 100}>
                <div className="feature-card-icon">{item.icon}</div>
                <h3>{item.title}</h3>
                <p className="text-muted">{item.desc}</p>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </ScrollReveal>

      <ScrollReveal as="section" className="section section-alt" delay={100}>
        <div className="container">
          <h2 className="section-title">Ценности бренда</h2>
          <div className="grid-features">
            {values.map((v, i) => (
              <ScrollReveal
                key={v.title}
                style={{ textAlign: 'center', padding: '8px 12px' }}
                delay={i * 80}
              >
                <h3 className="font-display" style={{ fontSize: 22, marginBottom: 10 }}>{v.title}</h3>
                <p className="text-muted" style={{ fontSize: 14 }}>{v.desc}</p>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </ScrollReveal>

      <ScrollReveal as="section" className="section-cta" delay={120}>
        <div className="container">
          <h2 className="section-title" style={{ marginBottom: 16 }}>Кастомный домик от 6 500 ₽</h2>
          <p className="section-subtitle" style={{ margin: '0 auto 28px' }}>
            Выберите шаблон, текстуру шерсти и окрас в конструкторе — мастер сшьёт укрытие вручную
          </p>
          <Link to="/constructor" className="btn btn-primary btn-lg">Перейти в конструктор</Link>
        </div>
      </ScrollReveal>
    </div>
  );
}

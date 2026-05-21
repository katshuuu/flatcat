import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CATALOG_PRODUCTS } from '../data/catalogProducts';

const LINE_LABELS = {
  ears: 'Ушки',
  scratchpad: 'Когтеточка',
  fruit: 'Фрукт',
  cube: 'Кубик',
  donut: 'Лежанки',
  accessory: 'Аксессуар',
};

const FILTERS = [
  { id: 'all', label: 'Все' },
  { id: 'ears', label: 'Ушки' },
  { id: 'scratchpad', label: 'Когтеточки' },
  { id: 'fruit', label: 'Фруктовые' },
  { id: 'cube', label: 'Кубик' },
  { id: 'donut', label: 'Лежанки' },
];

export default function Catalog() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch('/api/products');
        if (res.ok) {
          const data = await res.json();
          if (data.length > 0) { setProducts(data); setLoading(false); return; }
        }
      } catch {
        /* fallback */
      }
      setProducts(CATALOG_PRODUCTS);
      setLoading(false);
    }
    fetchProducts();
  }, []);

  const filtered = filter === 'all'
    ? products
    : products.filter((p) => (p.line || p.product_line) === filter);

  if (loading) return <div className="loading-container"><div className="spinner" /></div>;

  return (
    <div className="fade-in page-section">
      <div className="container">
        <h1 className="page-title">Каталог</h1>
        <p className="section-subtitle" style={{ textAlign: 'left', margin: '0 0 32px', maxWidth: 'none' }}>
          Готовые модели из наличия или кастом в конструкторе от 6 500 ₽
        </p>

        <div className="filters-row">
          {FILTERS.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              className={`btn btn-filter ${filter === id ? 'active' : ''}`}
              onClick={() => setFilter(id)}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="grid-products">
          {filtered.map((product) => (
            <article key={product.id} className="card product-card">
              <div className="product-card-image">
                <img
                  src={product.image_url}
                  alt={product.name}
                  loading="lazy"
                />
                {(product.line || product.product_line) && (
                  <span className="badge" style={{ position: 'absolute', top: 14, left: 14 }}>
                    {LINE_LABELS[product.line || product.product_line] || 'Домик'}
                  </span>
                )}
              </div>
              <div className="product-card-body">
                <h3 className="product-card-title">{product.name}</h3>
                <p className="product-card-desc">{product.description}</p>
                <div className="product-card-footer">
                  <span className="product-price">{product.base_price} ₽</span>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <Link to="/constructor" className="btn btn-primary btn-sm">Кастом</Link>
                    <Link to="/constructor" className="btn btn-outline-pink btn-sm">Подробнее</Link>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

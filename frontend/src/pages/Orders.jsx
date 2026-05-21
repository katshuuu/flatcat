import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const STATUS_LABELS = {
  pending: 'Ожидает',
  processing: 'Шьём вручную',
  shipped: 'Отправлен',
  delivered: 'Доставлен',
  cancelled: 'Отменён',
};

const LINE_LABELS = {
  ears: 'Ушки',
  scratchpad: 'Когтеточка',
  fruit: 'Фрукт',
  cube: 'Кубик',
};

export default function Orders() {
  const { user, token, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { navigate('/login'); return; }

    async function load() {
      try {
        const res = await fetch('/api/orders/my', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) setOrders(await res.json());
      } catch {
        /* ignore */
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [user, token, authLoading, navigate]);

  if (authLoading || loading) {
    return <div className="loading-container"><div className="spinner" /></div>;
  }

  return (
    <div className="fade-in page-section">
      <div className="container">
        <h1 className="page-title">Мои заказы</h1>
        {orders.length === 0 ? (
          <div className="empty-state">
            <p className="text-muted" style={{ marginBottom: 20 }}>Заказов пока нет</p>
            <Link to="/constructor" className="btn btn-primary">Создать домик</Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {orders.map((order) => {
              const prefs = order.design_preferences || {};
              const line = prefs.template || order.carabiner_type;
              return (
                <div key={order.id} className="card order-card">
                  <div className="order-card-header">
                    <div>
                      <strong style={{ fontSize: 16 }}>{order.cat_name || order.pet_name}</strong>
                      {line && (
                        <span className="text-muted" style={{ marginLeft: 12, fontSize: 13 }}>
                          {LINE_LABELS[line] || line}
                        </span>
                      )}
                    </div>
                    <span className="badge badge-outline">{STATUS_LABELS[order.status] || order.status}</span>
                  </div>
                  <p className="text-muted" style={{ marginTop: 10, fontSize: 14 }}>
                    <span className="product-price" style={{ fontSize: 22 }}>{order.total_price} ₽</span>
                    {' · '}{order.delivery_method}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

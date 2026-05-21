import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

const LINE_LABELS = {
  ears: 'Ушки',
  scratchpad: 'Когтеточка',
  fruit: 'Фрукт',
  cube: 'Кубик',
};

export default function Admin() {
  const { user, token, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user || !['admin', 'manager'].includes(user.role)) {
      navigate('/');
      return;
    }

    async function load() {
      try {
        const res = await fetch('/api/orders', {
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

  const updateStatus = async (id, status) => {
    const res = await fetch(`/api/orders/${id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      const updated = await res.json();
      setOrders((prev) => prev.map((o) => (o.id === id ? updated : o)));
    }
  };

  if (authLoading || loading) {
    return <div className="loading-container"><div className="spinner" /></div>;
  }

  return (
    <div className="fade-in page-section">
      <div className="container">
        <h1 className="page-title">Админ-панель</h1>
        <p className="text-muted" style={{ marginBottom: 28 }}>Управление заказами домиков</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {orders.map((order) => {
            const prefs = order.design_preferences || {};
            const line = prefs.template || order.carabiner_type;
            return (
              <div key={order.id} className="card order-card">
                <div className="order-card-header">
                  <div>
                    <strong>{order.cat_name || order.pet_name}</strong>
                    {line && <span className="text-muted" style={{ marginLeft: 8 }}>({LINE_LABELS[line]})</span>}
                    <p className="text-muted" style={{ fontSize: 14, marginTop: 6 }}>
                      {order.phone_number} · <span className="text-pink">{order.total_price} ₽</span>
                    </p>
                    {prefs.embroidery_name && (
                      <p style={{ fontSize: 13, marginTop: 4 }}>Вышивка: {prefs.embroidery_name}</p>
                    )}
                  </div>
                  <select
                    className="form-select"
                    style={{ width: 180 }}
                    value={order.status}
                    onChange={(e) => updateStatus(order.id, e.target.value)}
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>
            );
          })}
          {orders.length === 0 && <p className="text-muted">Заказов нет</p>}
        </div>
      </div>
    </div>
  );
}

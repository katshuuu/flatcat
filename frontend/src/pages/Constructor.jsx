import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const TEMPLATES = [
  { id: 'ears', label: 'Домик-ушки', desc: 'Круглый домик с ушами на крыше, съёмная подушка-язычок', base: 4500 },
  { id: 'scratchpad', label: 'Когтеточка', desc: 'Сизаль + меховой чехол, точит и спит', base: 5200 },
  { id: 'fruit', label: 'Фруктовый', desc: 'Арбуз, апельсин, киви или авокадо', base: 5500 },
  { id: 'cube', label: 'Кубик', desc: 'Минимализм, сменные панели', base: 3800 },
];

const TEXTURES = [
  { id: 'velour', label: 'Короткий велюр' },
  { id: 'mohair', label: 'Длинный мохер' },
  { id: 'karakul', label: 'Кудрявый «каракуль»' },
  { id: 'plush', label: 'Гладкий плюш' },
];

const COAT_PATTERNS = [
  { id: 'ginger_tabby', label: 'Рыжий с полосками (макрель)', color: '#e07b39', preview: 'linear-gradient(90deg, #c45c1a 25%, #e8924f 25%, #e8924f 50%, #c45c1a 50%)' },
  { id: 'black_red', label: 'Чёрный с красным подпалом', color: '#1a1a1a', preview: '#1a1a1a' },
  { id: 'blue_gray', label: 'Серо-голубой (русская)', color: '#9ca3af', preview: '#9ca3af' },
  { id: 'white_hetero', label: 'Белый с гетерохромией', color: '#f5f5f4', preview: '#f5f5f4' },
  { id: 'tortie', label: 'Черепаховый', color: '#78716c', preview: 'linear-gradient(135deg, #444 40%, #c45c1a 40%, #c45c1a 60%, #78716c 60%)' },
  { id: 'colorpoint', label: 'Колор-поинт (сиамский)', color: '#e7e5e4', preview: 'linear-gradient(180deg, #e7e5e4 60%, #57534e 60%)' },
];

const FRUITS = ['watermelon', 'orange', 'kiwi', 'avocado'];
const FRUIT_LABELS = { watermelon: 'Арбуз', orange: 'Апельсин', kiwi: 'Киви', avocado: 'Авокадо' };

const STEPS = ['Шаблон', 'Текстура и окрас', 'Детали', 'Кот и доставка', 'Предпросмотр'];

const PERSONALITY_QUIZ = [
  { q: 'Ваш кот чаще…', a: ['Спит 18 часов', 'Охотится за пылинками', 'Просит вкусняшку', 'Сидит на подоконнике'] },
  { q: 'Любимое место…', a: ['Коробка', 'Ваши колени', 'Когтеточка', 'Шкаф'] },
];

export default function Constructor() {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [quizStep, setQuizStep] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState([]);
  const [showQuiz, setShowQuiz] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    template: 'ears',
    texture: 'velour',
    coat: 'ginger_tabby',
    fruitType: 'watermelon',
    hand_paint: '',
    embroidery_name: '',
    cat_name: '',
    phone_number: '',
    cat_birthday: '',
    delivery_method: 'cdek',
    delivery_address: '',
  });

  const update = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  const coatData = COAT_PATTERNS.find((c) => c.id === form.coat) || COAT_PATTERNS[0];
  const templateData = TEMPLATES.find((t) => t.id === form.template) || TEMPLATES[0];

  const totalPrice = useMemo(() => {
    let price = templateData.base;
    if (form.hand_paint.trim()) price += 800;
    if (form.embroidery_name.trim()) price += 500;
    if (form.template === 'custom') price = 6500;
    return Math.max(price, 6500);
  }, [form, templateData]);

  const getPersonalityHint = (answers) => {
    if (answers.length < 2) return null;
    const sum = answers.reduce((a, b) => a + b, 0);
    if (sum <= 1) return { fruit: 'watermelon', text: 'Ваш кот — арбузная долька: сладкий и лучистый!' };
    if (sum <= 3) return { fruit: 'orange', text: 'Ваш кот — апельсиновая долька: сладкий и лучистый!' };
    if (sum <= 5) return { coat: 'ginger_tabby', text: 'Скрытая личность — рыжий тигр с полосками!' };
    return { coat: 'colorpoint', text: 'Внутри живёт элегантный сиамский аристократ.' };
  };

  const personalityHint = getPersonalityHint(quizAnswers);

  const finishQuiz = (answers) => {
    const hint = getPersonalityHint(answers);
    if (hint?.fruit) {
      setForm((f) => ({ ...f, template: 'fruit', fruitType: hint.fruit }));
    }
    if (hint?.coat) {
      setForm((f) => ({ ...f, coat: hint.coat }));
    }
    setShowQuiz(false);
  };

  const previewStyle = {
    background: coatData.preview || coatData.color,
    backgroundSize: '12px 12px',
  };

  const handleSubmit = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (!form.cat_name || !form.phone_number) {
      setError('Укажите кличку кота и телефон');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          cat_name: form.cat_name,
          phone_number: form.phone_number,
          product_line: form.template,
          design_preferences: {
            template: form.template,
            texture: form.texture,
            coat: form.coat,
            fruitType: form.fruitType,
            hand_paint: form.hand_paint,
            embroidery_name: form.embroidery_name,
            cat_birthday: form.cat_birthday,
          },
          delivery_method: form.delivery_method,
          delivery_address: form.delivery_address,
          total_price: totalPrice,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Ошибка заказа');
      navigate('/orders');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (showQuiz && step === 0) {
    const q = PERSONALITY_QUIZ[quizStep];
    return (
      <div className="fade-in page-section">
        <div className="container-medium">
          <h1 className="page-title">Какой кот живёт в вашем коте?</h1>
          <p className="text-muted section-subtitle" style={{ textAlign: 'left', margin: '0 0 24px' }}>
            Короткий тест подберёт домик по характеру
          </p>
          <div className="quiz-card">
            <p style={{ fontWeight: 600, marginBottom: 16, color: 'var(--ushki-text)' }}>{q.q}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {q.a.map((opt, i) => (
                <button
                  key={opt}
                  type="button"
                  className="btn btn-outline"
                  style={{ justifyContent: 'flex-start', width: '100%' }}
                  onClick={() => {
                    const next = [...quizAnswers, i];
                    setQuizAnswers(next);
                    if (quizStep < PERSONALITY_QUIZ.length - 1) {
                      setQuizStep(quizStep + 1);
                    } else {
                      setQuizStep(0);
                      finishQuiz(next);
                    }
                  }}
                >
                  {opt}
                </button>
              ))}
            </div>
            <button type="button" className="btn btn-outline-pink btn-sm" style={{ marginTop: 16 }}
              onClick={() => setShowQuiz(false)}>
              Пропустить тест
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fade-in page-section">
      <div className="container-medium">
        <h1 className="page-title">Конструктор домика</h1>
        <p className="text-muted" style={{ marginBottom: 28 }}>
          Станьте соавтором: мастер сшьёт домик по вашей схеме вручную
        </p>

        {personalityHint && step === 0 && (
          <div className="quiz-result">
            <strong>Результат теста:</strong> {personalityHint.text}
          </div>
        )}

        <div className="steps-bar">
          {STEPS.map((label, i) => (
            <button
              key={label}
              type="button"
              className={`btn btn-sm ${i === step ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setStep(i)}
            >
              {i + 1}. {label}
            </button>
          ))}
        </div>

        {step === 0 && (
          <div className="grid-templates">
            {TEMPLATES.map((t) => (
              <button
                key={t.id}
                type="button"
                className={`template-card ${form.template === t.id ? 'selected' : ''}`}
                onClick={() => update('template', t.id)}
              >
                <strong>{t.label}</strong>
                <p className="text-muted" style={{ fontSize: 13, marginTop: 6 }}>{t.desc}</p>
                <p className="text-pink" style={{ fontSize: 14, marginTop: 8, fontFamily: 'var(--font-display)' }}>от {t.base} ₽</p>
              </button>
            ))}
          </div>
        )}

        {step === 1 && (
          <div className="card form-card">
            <label className="form-label">Текстура шерсти</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8, marginBottom: 24 }}>
              {TEXTURES.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  className={`btn ${form.texture === t.id ? 'btn-primary' : 'btn-outline'}`}
                  onClick={() => update('texture', t.id)}
                >
                  {t.label}
                </button>
              ))}
            </div>
            <label className="form-label">Окрас «кошачьей шубы»</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
              {COAT_PATTERNS.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  title={c.label}
                  className={`color-swatch ${form.coat === c.id ? 'selected' : ''}`}
                  style={{ background: c.preview || c.color }}
                  onClick={() => update('coat', c.id)}
                />
              ))}
            </div>
            <p className="form-hint">{coatData.label}</p>
            {form.template === 'fruit' && (
              <>
                <label className="form-label" style={{ marginTop: 16 }}>Тип фрукта</label>
                <select className="form-select" value={form.fruitType} onChange={(e) => update('fruitType', e.target.value)}>
                  {FRUITS.map((f) => <option key={f} value={f}>{FRUIT_LABELS[f]}</option>)}
                </select>
              </>
            )}
          </div>
        )}

        {step === 2 && (
          <div className="card form-card">
            <div className="form-group">
              <label className="form-label">Ручная роспись (пятна, усы, нос)</label>
              <textarea className="form-textarea" rows={3} placeholder="Опишите желаемые детали..."
                value={form.hand_paint} onChange={(e) => update('hand_paint', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Вышивка имени на бортике / бирке</label>
              <input className="form-input" placeholder="Кличка для вышивки"
                value={form.embroidery_name} onChange={(e) => update('embroidery_name', e.target.value)} />
            </div>
            <p className="form-hint">
              В день рождения кота — бесплатный вышитый язычок (укажите дату на следующем шаге)
            </p>
          </div>
        )}

        {step === 3 && (
          <div className="card form-card">
            <div className="form-group">
              <label className="form-label">Кличка кота *</label>
              <input className="form-input" value={form.cat_name} onChange={(e) => update('cat_name', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Телефон *</label>
              <input className="form-input" value={form.phone_number} onChange={(e) => update('phone_number', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">День рождения кота (для акции)</label>
              <input type="date" className="form-input" value={form.cat_birthday}
                onChange={(e) => update('cat_birthday', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Способ доставки</label>
              <select className="form-select" value={form.delivery_method} onChange={(e) => update('delivery_method', e.target.value)}>
                <option value="cdek">СДЭК (оплата при получении)</option>
                <option value="post">Почта России (400 ₽)</option>
                <option value="moscow_install">Москва + установка (+500 ₽)</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Адрес пункта выдачи / почтового отделения</label>
              <input className="form-input" value={form.delivery_address}
                onChange={(e) => update('delivery_address', e.target.value)} />
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="card form-card" style={{ textAlign: 'center' }}>
            <div
              className={`preview-house ${form.template === 'ears' ? 'ears' : ''}`}
              style={previewStyle}
            >
              {form.embroidery_name || form.cat_name || '🐱'}
            </div>
            <p><strong>{templateData.label}</strong> · {TEXTURES.find((t) => t.id === form.texture)?.label}</p>
            <p className="text-muted">{coatData.label}</p>
            {form.cat_name && <p style={{ marginTop: 8 }}>Для: <strong>{form.cat_name}</strong></p>}
            <p className="product-price" style={{ marginTop: 20, fontSize: 36 }}>
              {totalPrice} ₽
            </p>
            {error && <p className="form-error" style={{ marginTop: 12 }}>{error}</p>}
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24 }}>
          <button type="button" className="btn btn-outline" disabled={step === 0} onClick={() => setStep((s) => s - 1)}>
            Назад
          </button>
          {step < 4 ? (
            <button type="button" className="btn btn-primary" onClick={() => setStep((s) => s + 1)}>Далее</button>
          ) : (
            <button type="button" className="btn btn-primary" disabled={submitting} onClick={handleSubmit}>
              {submitting ? 'Отправка...' : 'Заказать домик'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

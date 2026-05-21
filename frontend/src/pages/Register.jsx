import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  validateEmail,
  validatePassword,
  validateName,
  validatePhone,
  validateRegisterForm,
  isRegisterFormValid,
} from '../utils/registerValidation';

const FIELD_VALIDATORS = {
  email: validateEmail,
  password: validatePassword,
  name: validateName,
  phone: validatePhone,
};

const EMPTY_ERRORS = { email: '', password: '', name: '', phone: '' };

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '', name: '', phone: '' });
  const [errors, setErrors] = useState(EMPTY_ERRORS);
  const [touched, setTouched] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (touched[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: FIELD_VALIDATORS[field](value),
      }));
    }
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    setErrors((prev) => ({
      ...prev,
      [field]: FIELD_VALIDATORS[field](form[field]),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nextErrors = validateRegisterForm(form);
    setErrors(nextErrors);
    setTouched({ email: true, password: true, name: true, phone: true });
    if (!isRegisterFormValid(nextErrors)) return;

    setLoading(true);
    setError('');
    try {
      await register(form.email.trim(), form.password, form.name.trim(), form.phone.trim());
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (field) =>
    `form-input${touched[field] && errors[field] ? ' form-input--invalid' : ''}`;

  return (
    <div className="fade-in page-section">
      <div className="container-narrow">
        <h1 className="page-title">Регистрация</h1>
        <form onSubmit={handleSubmit} className="card form-card" noValidate>
          {error && <p className="form-error">{error}</p>}
          <div className="form-group">
            <label className="form-label" htmlFor="reg-email">Email *</label>
            <input
              id="reg-email"
              type="email"
              className={inputClass('email')}
              autoComplete="email"
              value={form.email}
              onChange={(e) => updateField('email', e.target.value)}
              onBlur={() => handleBlur('email')}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? 'reg-email-error' : undefined}
            />
            {touched.email && errors.email && (
              <p id="reg-email-error" className="form-field-error" role="alert">
                {errors.email}
              </p>
            )}
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="reg-password">Пароль *</label>
            <input
              id="reg-password"
              type="password"
              className={inputClass('password')}
              autoComplete="new-password"
              value={form.password}
              onChange={(e) => updateField('password', e.target.value)}
              onBlur={() => handleBlur('password')}
              aria-invalid={Boolean(errors.password)}
              aria-describedby={errors.password ? 'reg-password-error' : 'reg-password-hint'}
            />
            <p id="reg-password-hint" className="form-hint" style={{ marginTop: 6, marginBottom: 0 }}>
              Минимум 8 символов, буквы и цифры
            </p>
            {touched.password && errors.password && (
              <p id="reg-password-error" className="form-field-error" role="alert">
                {errors.password}
              </p>
            )}
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="reg-name">Имя</label>
            <input
              id="reg-name"
              type="text"
              className={inputClass('name')}
              autoComplete="name"
              value={form.name}
              onChange={(e) => updateField('name', e.target.value)}
              onBlur={() => handleBlur('name')}
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? 'reg-name-error' : undefined}
            />
            {touched.name && errors.name && (
              <p id="reg-name-error" className="form-field-error" role="alert">
                {errors.name}
              </p>
            )}
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="reg-phone">Телефон</label>
            <input
              id="reg-phone"
              type="tel"
              className={inputClass('phone')}
              autoComplete="tel"
              placeholder="+7 999 123-45-67"
              value={form.phone}
              onChange={(e) => updateField('phone', e.target.value)}
              onBlur={() => handleBlur('phone')}
              aria-invalid={Boolean(errors.phone)}
              aria-describedby={errors.phone ? 'reg-phone-error' : undefined}
            />
            {touched.phone && errors.phone && (
              <p id="reg-phone-error" className="form-field-error" role="alert">
                {errors.phone}
              </p>
            )}
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Регистрация...' : 'Создать аккаунт'}
          </button>
        </form>
        <p className="text-muted" style={{ marginTop: 20, textAlign: 'center', fontSize: 14 }}>
          Уже есть аккаунт? <Link to="/login">Войти</Link>
        </p>
      </div>
    </div>
  );
}

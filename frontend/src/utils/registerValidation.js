const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
const PASSWORD_RE = /^(?=.*[A-Za-zА-Яа-яЁё])(?=.*\d).{8,}$/;
const NAME_RE = /^[A-Za-zА-Яа-яЁё\s'-]{2,60}$/;

export function validateEmail(value) {
  const email = value.trim();
  if (!email) return 'Укажите email';
  if (!EMAIL_RE.test(email)) return 'Некорректный формат email';
  return '';
}

export function validatePassword(value) {
  if (!value) return 'Укажите пароль';
  if (value.length < 8) return 'Пароль должен быть не короче 8 символов';
  if (!PASSWORD_RE.test(value)) {
    return 'Пароль должен содержать буквы и цифры';
  }
  return '';
}

export function validateName(value) {
  const name = value.trim();
  if (!name) return '';
  if (!NAME_RE.test(name)) {
    return 'Имя: от 2 символов, только буквы, пробел и дефис';
  }
  return '';
}

export function validatePhone(value) {
  const phone = value.trim();
  if (!phone) return '';
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 10) return '';
  if (digits.length === 11 && (digits.startsWith('7') || digits.startsWith('8'))) return '';
  return 'Введите корректный телефон: +7 999 123-45-67';
}

export function validateRegisterForm(form) {
  return {
    email: validateEmail(form.email),
    password: validatePassword(form.password),
    name: validateName(form.name),
    phone: validatePhone(form.phone),
  };
}

export function isRegisterFormValid(errors) {
  return Object.values(errors).every((msg) => !msg);
}

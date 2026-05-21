import { describe, it, expect } from 'vitest';
import {
  validateEmail,
  validatePassword,
  validateName,
  validatePhone,
  validateRegisterForm,
  isRegisterFormValid,
} from '../src/utils/registerValidation';

describe('registerValidation', () => {
  it('validates email', () => {
    expect(validateEmail('')).toBe('Укажите email');
    expect(validateEmail('bad')).toBe('Некорректный формат email');
    expect(validateEmail('user@mail.ru')).toBe('');
  });

  it('validates password', () => {
    expect(validatePassword('')).toBe('Укажите пароль');
    expect(validatePassword('short1')).toContain('8 символов');
    expect(validatePassword('onlyletters')).toContain('буквы и цифры');
    expect(validatePassword('Password1')).toBe('');
  });

  it('validates optional name', () => {
    expect(validateName('')).toBe('');
    expect(validateName('A')).not.toBe('');
    expect(validateName('Маша')).toBe('');
  });

  it('validates optional phone', () => {
    expect(validatePhone('')).toBe('');
    expect(validatePhone('abc')).not.toBe('');
    expect(validatePhone('+7 999 123-45-67')).toBe('');
    expect(validatePhone('89991234567')).toBe('');
  });

  it('validates full form', () => {
    const errors = validateRegisterForm({
      email: 'a@b.co',
      password: 'Secret12',
      name: '',
      phone: '',
    });
    expect(isRegisterFormValid(errors)).toBe(true);
  });
});

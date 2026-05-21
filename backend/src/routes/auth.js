const express = require('express');
const supabase = require('../config/supabase');
const { generateToken, authMiddleware } = require('../middleware/auth');

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { email, password, name, phone } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const { data: existing } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .maybeSingle();

    if (existing) {
      return res.status(409).json({ error: 'User already exists' });
    }

    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError) {
      return res.status(400).json({ error: signUpError.message });
    }

    const userId = signUpData.user?.id;
    if (!userId) {
      return res.status(500).json({ error: 'Failed to create auth user' });
    }

    const { data: user, error: dbError } = await supabase
      .from('users')
      .insert({ id: userId, email, name: name || '', phone: phone || '', role: 'customer' })
      .select()
      .single();

    if (dbError) {
      return res.status(500).json({ error: dbError.message });
    }

    const token = generateToken({ id: user.id, email: user.email, role: user.role });
    res.status(201).json({ user, token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const { data: user } = await supabase
      .from('users')
      .select('*')
      .eq('id', signInData.user.id)
      .maybeSingle();

    if (!user) {
      return res.status(404).json({ error: 'User profile not found' });
    }

    const token = generateToken({ id: user.id, email: user.email, role: user.role });
    res.json({ user, token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/me', authMiddleware, async (req, res) => {
  try {
    const { data: user } = await supabase
      .from('users')
      .select('*')
      .eq('id', req.user.id)
      .maybeSingle();

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

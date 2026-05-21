const express = require('express');
const supabase = require('../config/supabase');
const { authMiddleware } = require('../middleware/auth');
const { publishTask } = require('../workers/producer');

const router = express.Router();

router.post('/', authMiddleware, async (req, res) => {
  try {
    const { type, payload } = req.body;
    if (!type) return res.status(400).json({ error: 'Task type is required' });

    const { data: task, error } = await supabase
      .from('tasks')
      .insert({ type, payload: payload || {}, status: 'pending' })
      .select()
      .single();

    if (error) return res.status(500).json({ error: error.message });

    try {
      await publishTask({ taskId: task.id, type, payload: task.payload });
    } catch (queueErr) {
      console.warn('RabbitMQ unavailable, task stored for later processing:', queueErr.message);
    }

    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/', authMiddleware, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

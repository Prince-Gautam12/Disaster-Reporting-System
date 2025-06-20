const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// GET all disasters
router.get('/', async (req, res) => {
  const { data, error } = await supabase.from('disasters').select('*');
  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: 'GET all disasters route working ✅', data });
});

// POST a new disaster
router.post('/', async (req, res) => {
  const { title, location_name, description, tags, owner_id, location } = req.body;

  const { data, error } = await supabase.from('disasters').insert([{
    title,
    location_name,
    description,
    tags,
    owner_id,
    location,
    created_at: new Date().toISOString(),
    audit_trail: {
      action: "created",
      user_id: owner_id,
      timestamp: new Date().toISOString()
    }
  }], { returning: 'representation' });

  if (error) {
    console.error('Insert error:', error);
    return res.status(500).json({ error: error.message });
  }

  // ✅ FIX: prevent socket crash if data[0] undefined
  try {
    const io = req.app.get('io');
    if (io && data && data.length > 0) {
      io.emit('new_disaster', data[0]);
    }
  } catch (emitErr) {
    console.warn('⚠️ Socket emit failed:', emitErr.message);
  }

  res.status(201).json({ message: 'Disaster created ✅', data });
});

// DELETE a disaster
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  const { error } = await supabase
    .from('disasters')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Delete error:', error);
    return res.status(500).json({ error: error.message });
  }

  res.json({ message: 'Disaster deleted successfully ✅' });
});

module.exports = router;

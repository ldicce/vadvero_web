
const express = require('express');
const { pool } = require('../server');

const router = express.Router();

// Get users by entity
router.get('/entity/:entityId', async (req, res) => {
  try {
    const { entityId } = req.params;
    const result = await pool.query(
      'SELECT id, name, email, role, entity_id, created_at, updated_at FROM users WHERE entity_id = $1 ORDER BY created_at DESC',
      [entityId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all users (admin only)
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, name, email, role, entity_id, created_at, updated_at FROM users ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new user
router.post('/', async (req, res) => {
  try {
    const { name, email, role, entity_id } = req.body;
    
    const query = `
      INSERT INTO users (name, email, role, entity_id, password)
      VALUES ($1, $2, $3, $4, 'temp_password')
      RETURNING id, name, email, role, entity_id, created_at, updated_at
    `;
    
    const result = await pool.query(query, [name, email, role, entity_id]);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update user
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, role } = req.body;
    
    const query = `
      UPDATE users 
      SET name = $1, email = $2, role = $3, updated_at = CURRENT_TIMESTAMP
      WHERE id = $4
      RETURNING id, name, email, role, entity_id, created_at, updated_at
    `;
    
    const result = await pool.query(query, [name, email, role, id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete user
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(
      'DELETE FROM users WHERE id = $1 RETURNING *', 
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;

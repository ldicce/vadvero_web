
const express = require('express');
const { pool } = require('../server');

const router = express.Router();

// Get sectors by entity
router.get('/entity/:entityId', async (req, res) => {
  try {
    const { entityId } = req.params;
    const result = await pool.query(
      'SELECT * FROM sectors WHERE entity_id = $1 ORDER BY created_at DESC',
      [entityId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching sectors:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new sector
router.post('/', async (req, res) => {
  try {
    const { name, description, department_id, entity_id } = req.body;
    
    const query = `
      INSERT INTO sectors (name, description, department_id, entity_id)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    
    const result = await pool.query(query, [name, description, department_id, entity_id]);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating sector:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update sector
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, department_id } = req.body;
    
    const query = `
      UPDATE sectors 
      SET name = $1, description = $2, department_id = $3, updated_at = CURRENT_TIMESTAMP
      WHERE id = $4
      RETURNING *
    `;
    
    const result = await pool.query(query, [name, description, department_id, id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Sector not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating sector:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete sector
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query('DELETE FROM sectors WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Sector not found' });
    }
    
    res.json({ message: 'Sector deleted successfully' });
  } catch (error) {
    console.error('Error deleting sector:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;

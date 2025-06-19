
const express = require('express');
const { pool } = require('../server');

const router = express.Router();

// Get positions by entity
router.get('/entity/:entityId', async (req, res) => {
  try {
    const { entityId } = req.params;
    const result = await pool.query(
      'SELECT * FROM positions WHERE entity_id = $1 ORDER BY created_at DESC',
      [entityId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching positions:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new position
router.post('/', async (req, res) => {
  try {
    const { name, description, sector_id, entity_id } = req.body;
    
    const query = `
      INSERT INTO positions (name, description, sector_id, entity_id)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    
    const result = await pool.query(query, [name, description, sector_id, entity_id]);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating position:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update position
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, sector_id } = req.body;
    
    const query = `
      UPDATE positions 
      SET name = $1, description = $2, sector_id = $3, updated_at = CURRENT_TIMESTAMP
      WHERE id = $4
      RETURNING *
    `;
    
    const result = await pool.query(query, [name, description, sector_id, id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Position not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating position:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete position
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query('DELETE FROM positions WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Position not found' });
    }
    
    res.json({ message: 'Position deleted successfully' });
  } catch (error) {
    console.error('Error deleting position:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;


const express = require('express');
const pool = require('../config/db');

const router = express.Router();

// Get anexos by reunião
router.get('/reuniao/:reuniaoId', async (req, res) => {
  try {
    const { reuniaoId } = req.params;
    const result = await pool.query(
      'SELECT * FROM anexo_reuniao WHERE reuniao = $1 ORDER BY created_at DESC',
      [reuniaoId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching anexos:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new anexo
router.post('/', async (req, res) => {
  try {
    const { arquivo, descricao, reuniao } = req.body;

    const result = await pool.query(
      `INSERT INTO anexo_reuniao (arquivo, descricao, reuniao, created_at)
       VALUES ($1, $2, $3, NOW()) RETURNING *`,
      [arquivo, descricao, reuniao]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating anexo:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete anexo
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query('DELETE FROM anexo_reuniao WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Anexo not found' });
    }

    res.json({ message: 'Anexo deleted successfully' });
  } catch (error) {
    console.error('Error deleting anexo:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;

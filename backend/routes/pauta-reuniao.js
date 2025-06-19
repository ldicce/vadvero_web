
const express = require('express');
const pool = require('../config/db');

const router = express.Router();

// Get pautas by reunião
router.get('/reuniao/:reuniaoId', async (req, res) => {
  try {
    const { reuniaoId } = req.params;
    const result = await pool.query(
      'SELECT * FROM pauta_reuniao WHERE reuniao = $1 ORDER BY ordem ASC',
      [reuniaoId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching pautas:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new pauta
router.post('/', async (req, res) => {
  try {
    const { descricao, reuniao, ordem } = req.body;

    const result = await pool.query(
      `INSERT INTO pauta_reuniao (descricao, reuniao, ordem, created_at)
       VALUES ($1, $2, $3, NOW()) RETURNING *`,
      [descricao, reuniao, ordem]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating pauta:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update pauta
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { descricao, ordem } = req.body;

    const result = await pool.query(
      `UPDATE pauta_reuniao SET descricao = $1, ordem = $2
       WHERE id = $3 RETURNING *`,
      [descricao, ordem, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Pauta not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating pauta:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete pauta
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query('DELETE FROM pauta_reuniao WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Pauta not found' });
    }

    res.json({ message: 'Pauta deleted successfully' });
  } catch (error) {
    console.error('Error deleting pauta:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;

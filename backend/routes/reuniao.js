
const express = require('express');
const pool = require('../config/db');

const router = express.Router();

// Get all reuniões
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM reuniao ORDER BY data_inicial DESC'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching reuniões:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new reunião
router.post('/', async (req, res) => {
  try {
    const {
      titulo,
      descricao,
      reuniao_presencial,
      reuniao_online,
      data_inicial,
      data_final,
      liberar_votacao_inicio,
      liberar_votacao_fim,
      mediador
    } = req.body;

    const result = await pool.query(
      `INSERT INTO reuniao (
        titulo, descricao, reuniao_presencial, reuniao_online,
        data_inicial, data_final, liberar_votacao_inicio,
        liberar_votacao_fim, mediador, created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())
      RETURNING *`,
      [
        titulo, descricao, reuniao_presencial, reuniao_online,
        data_inicial, data_final, liberar_votacao_inicio,
        liberar_votacao_fim, mediador
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating reunião:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update reunião
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      titulo,
      descricao,
      reuniao_presencial,
      reuniao_online,
      data_inicial,
      data_final,
      liberar_votacao_inicio,
      liberar_votacao_fim,
      mediador
    } = req.body;

    const result = await pool.query(
      `UPDATE reuniao SET
        titulo = $1, descricao = $2, reuniao_presencial = $3,
        reuniao_online = $4, data_inicial = $5, data_final = $6,
        liberar_votacao_inicio = $7, liberar_votacao_fim = $8,
        mediador = $9
      WHERE id = $10 RETURNING *`,
      [
        titulo, descricao, reuniao_presencial, reuniao_online,
        data_inicial, data_final, liberar_votacao_inicio,
        liberar_votacao_fim, mediador, id
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Reunião not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating reunião:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete reunião
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query('DELETE FROM reuniao WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Reunião not found' });
    }

    res.json({ message: 'Reunião deleted successfully' });
  } catch (error) {
    console.error('Error deleting reunião:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;


const express = require('express');
const { pool } = require('../server');

const router = express.Router();

// Get meetings by entity
router.get('/entity/:entityId', async (req, res) => {
  try {
    const { entityId } = req.params;
    const result = await pool.query(
      'SELECT * FROM meetings WHERE entity_id = $1 ORDER BY start_date DESC',
      [entityId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching meetings:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new meeting
router.post('/', async (req, res) => {
  try {
    const {
      title,
      start_date,
      end_date,
      location,
      president_name,
      secretary_name,
      is_online,
      is_presential,
      manual_voting,
      voting_start,
      voting_end,
      description,
      entity_id,
      created_by
    } = req.body;
    
    const query = `
      INSERT INTO meetings (
        title, start_date, end_date, location, president_name, secretary_name,
        is_online, is_presential, manual_voting, voting_start, voting_end,
        description, entity_id, created_by
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      RETURNING *
    `;
    
    const result = await pool.query(query, [
      title, start_date, end_date, location, president_name, secretary_name,
      is_online, is_presential, manual_voting, voting_start, voting_end,
      description, entity_id, created_by
    ]);
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating meeting:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;

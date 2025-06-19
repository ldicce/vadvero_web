const express = require('express');
const bcrypt = require('bcryptjs');
const pool = require('../config/db');

const router = express.Router();

// Get all entities (empresas)
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM empresa ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching entities:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new entity with user
router.post('/', async (req, res) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const { 
      // Dados da empresa
      nome, email, cnpj, telefone1, celular1, cep, logradouro, 
      numero, complemento, bairro, cidade, uf,
      // Dados do usuário da empresa
      usuario_nome, usuario_email, usuario_senha
    } = req.body;
    
    // Inserir empresa
    const empresaQuery = `
      INSERT INTO empresa (nome, email, cnpj, telefone1, celular1, cep, logradouro, numero, complemento, bairro, cidade, uf)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING id
    `;
    
    const empresaResult = await client.query(empresaQuery, [
      nome, email, cnpj, telefone1, celular1, cep, logradouro, 
      numero, complemento, bairro, cidade, uf
    ]);
    
    // Criptografar senha do usuário
    const hashedPassword = await bcrypt.hash(usuario_senha, 10);
    
    // Inserir usuário da empresa (sem empresa_id)
    const usuarioQuery = `
      INSERT INTO usuario_empresa (nome, email, senha)
      VALUES ($1, $2, $3)
      RETURNING id
    `;
    
    await client.query(usuarioQuery, [
      usuario_nome, usuario_email, hashedPassword
    ]);
    
    await client.query('COMMIT');
    
    // Buscar dados completos da empresa criada
    const empresaCompleta = await client.query('SELECT * FROM empresa WHERE id = $1', [empresaResult.rows[0].id]);
    
    res.status(201).json({
      message: 'Empresa e usuário criados com sucesso',
      empresa: empresaCompleta.rows[0]
    });
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error creating entity:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    client.release();
  }
});

// Update entity
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      nome, email, cnpj, telefone1, celular1, cep, logradouro, 
      numero, complemento, bairro, cidade, uf 
    } = req.body;
    
    const query = `
      UPDATE empresa 
      SET nome = $1, email = $2, cnpj = $3, telefone1 = $4, celular1 = $5, 
          cep = $6, logradouro = $7, numero = $8, complemento = $9, 
          bairro = $10, cidade = $11, uf = $12, updated_at = CURRENT_TIMESTAMP
      WHERE id = $13
      RETURNING *
    `;
    
    const result = await pool.query(query, [
      nome, email, cnpj, telefone1, celular1, cep, logradouro, 
      numero, complemento, bairro, cidade, uf, id
    ]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Entity not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating entity:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete entity
router.delete('/:id', async (req, res) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const { id } = req.params;

    // Como não existe empresa_id na tabela usuario_empresa, ignoramos essa exclusão vinculada

    // Deletar a empresa
    const result = await client.query('DELETE FROM empresa WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Entity not found' });
    }
    
    await client.query('COMMIT');
    res.json({ message: 'Entity deleted successfully' });
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error deleting entity:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    client.release();
  }
});

module.exports = router;

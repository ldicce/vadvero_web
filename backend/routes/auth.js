
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

const router = express.Router();

// Login endpoint
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    console.log('Tentativa de login:', { email });
    
    // Primeiro, verificar na tabela usuario_adm
    try {
      const adminQuery = 'SELECT * FROM usuario_adm WHERE email = $1';
      const adminResult = await pool.query(adminQuery, [email]);
      
      if (adminResult.rows.length > 0) {
        const user = adminResult.rows[0];
        
        // Verificar senha usando bcrypt
        const isValidPassword = await bcrypt.compare(password, user.senha);
        
        if (isValidPassword) {
          console.log('Login bem-sucedido para usuário admin:', user.email);
          
          const token = jwt.sign(
            { 
              userId: user.id, 
              email: user.email, 
              role: 'admin',
              userType: 'admin'
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
          );
          
          return res.json({
            token,
            user: {
              id: user.id,
              name: user.nome,
              email: user.email,
              role: 'admin',
              entity_id: null
            }
          });
        }
      }
    } catch (dbError) {
      console.error('Erro ao consultar usuário admin:', dbError.message);
    }
    
    // Se não encontrou admin, verificar na tabela usuario_empresa
    try {
      const empresaQuery = `
        SELECT ue.*, e.id as empresa_id, e.nome as empresa_nome 
        FROM usuario_empresa ue
        LEFT JOIN empresa e ON e.email = ue.email
        WHERE ue.email = $1
      `;
      const empresaResult = await pool.query(empresaQuery, [email]);
      
      if (empresaResult.rows.length > 0) {
        const user = empresaResult.rows[0];
        
        // Verificar senha usando bcrypt
        const isValidPassword = await bcrypt.compare(password, user.senha);
        
        if (isValidPassword) {
          console.log('Login bem-sucedido para usuário empresa:', user.email);
          
          const token = jwt.sign(
            { 
              userId: user.id, 
              email: user.email, 
              role: 'entity',
              userType: 'entity',
              entityId: user.empresa_id
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
          );
          
          return res.json({
            token,
            user: {
              id: user.id,
              name: user.nome,
              email: user.email,
              role: 'entity',
              entity_id: user.empresa_id
            }
          });
        }
      }
    } catch (dbError) {
      console.error('Erro ao consultar usuário empresa:', dbError.message);
    }
    
    console.log('Credenciais inválidas para:', email);
    return res.status(401).json({ error: 'Invalid credentials' });
    
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Endpoint para criar usuário admin com senha criptografada
router.post('/register-admin', async (req, res) => {
  try {
    const { nome, email, celular, senha, tipo_acesso } = req.body;
    
    // Criptografar a senha
    const hashedPassword = await bcrypt.hash(senha, 10);
    
    const query = `
      INSERT INTO usuario_adm (nome, email, celular, senha, tipo_acesso)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, nome, email, celular, tipo_acesso, created_at
    `;
    
    const result = await pool.query(query, [nome, email, celular, hashedPassword, tipo_acesso]);
    
    res.status(201).json({
      message: 'Usuário admin criado com sucesso',
      user: result.rows[0]
    });
    
  } catch (error) {
    console.error('Error creating admin user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;

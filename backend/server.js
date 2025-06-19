
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
console.log('Registering routes...');
app.use('/api/auth', require('./routes/auth'));
app.use('/api/entities', require('./routes/entities'));
app.use('/api/departments', require('./routes/departments'));
app.use('/api/sectors', require('./routes/sectors'));
app.use('/api/positions', require('./routes/positions'));
app.use('/api/users', require('./routes/users'));
app.use('/api/meetings', require('./routes/meetings'));
app.use('/api/reuniao', require('./routes/reuniao'));
app.use('/api/anexo-reuniao', require('./routes/anexo-reuniao'));
app.use('/api/pauta-reuniao', require('./routes/pauta-reuniao'));
console.log('All routes registered successfully');

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error', details: err.message });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

const express = require('express');
const cors = require('cors');
require('dotenv').config();
const pool = require('./config/db');
const productRoutes = require('./routes/productRoutes');

const app = express();
app.use(cors());
app.use(express.json());
app.get('/api/health', async (_req, res) => {
  try { await pool.query('SELECT 1'); res.json({ status: 'ok', database: 'connected' }); }
  catch { res.status(500).json({ status: 'error', database: 'disconnected' }); }
});
app.use('/api/products', productRoutes);
app.use((err, _req, res, _next) => { console.error(err); res.status(500).json({ message: 'Internal server error' }); });
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));

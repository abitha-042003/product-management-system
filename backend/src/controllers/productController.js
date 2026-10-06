const pool = require('../config/db');

const allowedSort = new Set(['product_name', 'price', 'date_added', 'quantity', 'product_id']);

function validateProduct(body) {
  const errors = [];
  const required = ['product_name', 'product_code', 'category', 'price', 'quantity', 'date_added', 'status'];
  required.forEach((field) => {
    if (body[field] === undefined || body[field] === null || String(body[field]).trim() === '') {
      errors.push(`${field} is required`);
    }
  });
  const price = Number(body.price);
  const quantity = Number(body.quantity);
  if (body.price !== undefined && (!Number.isFinite(price) || price <= 0)) errors.push('Price must be a valid positive number');
  if (body.quantity !== undefined && (!Number.isInteger(quantity) || quantity < 0)) errors.push('Quantity must be a valid non-negative number');
  if (body.status && !['Available', 'Unavailable'].includes(body.status)) errors.push('Status must be Available or Unavailable');
  return errors;
}

exports.getAll = async (req, res) => {
  try {
    const { search = '', category = '', status = '', page = 1, limit = 10, sortBy = 'product_name', sortOrder = 'ASC' } = req.query;
    const safeSort = allowedSort.has(sortBy) ? sortBy : 'product_name';
    const safeOrder = String(sortOrder).toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
    const safeLimit = Math.min(Math.max(Number(limit) || 10, 1), 100);
    const safePage = Math.max(Number(page) || 1, 1);
    const offset = (safePage - 1) * safeLimit;
    const conditions = [];
    const params = [];
    if (search) { conditions.push('(product_name LIKE ? OR product_code LIKE ?)'); params.push(`%${search}%`, `%${search}%`); }
    if (category) { conditions.push('category = ?'); params.push(category); }
    if (status) { conditions.push('status = ?'); params.push(status); }
    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
    const [countRows] = await pool.query(`SELECT COUNT(*) AS total FROM products ${where}`, params);
    const [rows] = await pool.query(`SELECT product_id, product_name, product_code, category, price, quantity, date_added, status, created_at, updated_at FROM products ${where} ORDER BY ${safeSort} ${safeOrder} LIMIT ? OFFSET ?`, [...params, safeLimit, offset]);
    res.json({ products: rows, pagination: { page: safePage, limit: safeLimit, total: countRows[0].total, totalPages: Math.ceil(countRows[0].total / safeLimit) } });
  } catch (error) { console.error(error); res.status(500).json({ message: 'Failed to fetch products' }); }
};

exports.getById = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM products WHERE product_id = ?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ message: 'Product not found' });
    res.json(rows[0]);
  } catch (error) { res.status(500).json({ message: 'Failed to fetch product' }); }
};

exports.create = async (req, res) => {
  try {
    const errors = validateProduct(req.body);
    if (errors.length) return res.status(400).json({ message: errors.join(', ') });
    const { product_name, product_code, category, price, quantity, date_added, status } = req.body;
    const [result] = await pool.query('INSERT INTO products (product_name, product_code, category, price, quantity, date_added, status) VALUES (?, ?, ?, ?, ?, ?, ?)', [product_name.trim(), product_code.trim(), category.trim(), Number(price), Number(quantity), date_added, status]);
    const [rows] = await pool.query('SELECT * FROM products WHERE product_id = ?', [result.insertId]);
    res.status(201).json({ message: 'Product added successfully', product: rows[0] });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') return res.status(409).json({ message: 'Product Code already exists' });
    res.status(500).json({ message: 'Failed to add product' });
  }
};

exports.update = async (req, res) => {
  try {
    const errors = validateProduct(req.body);
    if (errors.length) return res.status(400).json({ message: errors.join(', ') });
    const { product_name, product_code, category, price, quantity, date_added, status } = req.body;
    const [result] = await pool.query('UPDATE products SET product_name=?, product_code=?, category=?, price=?, quantity=?, date_added=?, status=? WHERE product_id=?', [product_name.trim(), product_code.trim(), category.trim(), Number(price), Number(quantity), date_added, status, req.params.id]);
    if (!result.affectedRows) return res.status(404).json({ message: 'Product not found' });
    const [rows] = await pool.query('SELECT * FROM products WHERE product_id = ?', [req.params.id]);
    res.json({ message: 'Product updated successfully', product: rows[0] });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') return res.status(409).json({ message: 'Product Code already exists' });
    res.status(500).json({ message: 'Failed to update product' });
  }
};

exports.remove = async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM products WHERE product_id = ?', [req.params.id]);
    if (!result.affectedRows) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted successfully' });
  } catch (error) { res.status(500).json({ message: 'Failed to delete product' }); }
};

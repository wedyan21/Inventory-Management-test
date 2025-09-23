import express from 'express';
import pool from '../config/database.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Get all items
router.get('/', authenticateToken, async (req, res) => {
  try {
    const [items] = await pool.execute(
      'SELECT * FROM items ORDER BY id DESC'
    );
    res.json(items);
  } catch (error) {
    console.error('Get items error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create item (admin, editor)
router.post('/', authenticateToken, requireRole(['admin', 'editor']), async (req, res) => {
  try {
    const { item_no, company_name, name, piece_type, office, qty, quantity_sold, exit_date, image_path } = req.body;

    if (!company_name || !name || !piece_type || !office || qty === undefined) {
      return res.status(400).json({ error: 'Company name, item name, piece type, office, and quantity are required' });
    }

    const remaining_qty = qty - (quantity_sold || 0);

    const [result] = await pool.execute(
      'INSERT INTO items (item_no, company_name, name, piece_type, office, qty, remaining_qty, quantity_sold, exit_date, image_path) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [item_no, company_name, name, piece_type, office, qty, remaining_qty, quantity_sold || 0, exit_date || null, image_path || null]
    );

    const [newItem] = await pool.execute(
      'SELECT * FROM items WHERE id = ?',
      [result.insertId]
    );

    res.status(201).json(newItem[0]);
  } catch (error) {
    console.error('Create item error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update item (admin, editor)
router.put('/:id', authenticateToken, requireRole(['admin', 'editor']), async (req, res) => {
  try {
    const { id } = req.params;
    const { item_no, company_name, name, piece_type, office, qty, quantity_sold, exit_date, image_path } = req.body;

    if (!company_name || !name || !piece_type || !office || qty === undefined) {
      return res.status(400).json({ error: 'Company name, item name, piece type, office, and quantity are required' });
    }

    const remaining_qty = qty - (quantity_sold || 0);

    await pool.execute(
      'UPDATE items SET item_no = ?, company_name = ?, name = ?, piece_type = ?, office = ?, qty = ?, remaining_qty = ?, quantity_sold = ?, exit_date = ?, image_path = ? WHERE id = ?',
      [item_no, company_name, name, piece_type, office, qty, remaining_qty, quantity_sold || 0, exit_date || null, image_path || null, id]
    );

    const [updatedItem] = await pool.execute(
      'SELECT * FROM items WHERE id = ?',
      [id]
    );

    res.json(updatedItem[0]);
  } catch (error) {
    console.error('Update item error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete item (admin, editor)
router.delete('/:id', authenticateToken, requireRole(['admin', 'editor']), async (req, res) => {
  try {
    const { id } = req.params;
    await pool.execute('DELETE FROM items WHERE id = ?', [id]);
    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error('Delete item error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
import express from 'express';
import pool from '../config/database.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Get report data (admin, editor)
router.get('/', authenticateToken, requireRole(['admin', 'editor']), async (req, res) => {
  try {
    // Get summary statistics
    const [summary] = await pool.execute(`
      SELECT 
        COUNT(*) as totalItems,
        COALESCE(SUM(qty), 0) as totalQuantity,
        COALESCE(SUM(quantity_sold), 0) as totalSold,
        COALESCE(SUM(remaining_qty), 0) as totalRemaining
      FROM items
    `);

    // Get low stock items (remaining_qty < 10)
    const [lowStockItems] = await pool.execute(
      'SELECT * FROM items WHERE remaining_qty < 10 ORDER BY remaining_qty ASC'
    );

    // Get recent exits (last 30 days)
    const [recentExits] = await pool.execute(
      'SELECT * FROM items WHERE exit_date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY) ORDER BY exit_date DESC'
    );

    res.json({
      ...summary[0],
      lowStockItems,
      recentExits
    });
  } catch (error) {
    console.error('Get reports error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
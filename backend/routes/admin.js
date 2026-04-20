const express = require('express');
const router = express.Router();
const db = require('../config/db');

// 测试接口 - 获取农场列表
router.get('/farms', async (req, res) => {
    try {
        const result = await db.query(`
            SELECT f.id, f.name, f.location, f.description, f.features, f.status,
                   fu.real_name as owner_name, fu.phone_number
            FROM farms f
            LEFT JOIN farm_users fu ON f.owner_id = fu.id
            ORDER BY f.created_at DESC
        `);
        res.json({ success: true, data: result.rows });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: '服务器错误' });
    }
});

// 测试接口 - 获取方案列表
router.get('/plans', async (req, res) => {
    try {
        const result = await db.query(`
            SELECT ap.*, f.name as farm_name 
            FROM ai_plans ap
            LEFT JOIN farms f ON ap.farm_id = f.id
            ORDER BY ap.created_at DESC
        `);
        res.json({ success: true, data: result.rows });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: '服务器错误' });
    }
});

// 测试接口 - 获取订单统计
router.get('/dashboard/stats', async (req, res) => {
    try {
        const gmvResult = await db.query(
            `SELECT COALESCE(SUM(total_amount), 0) as total FROM c_orders WHERE payment_time IS NOT NULL`
        );
        const orderResult = await db.query(
            `SELECT COUNT(*) as count FROM c_orders`
        );
        res.json({
            success: true,
            data: {
                total_gmv: parseFloat(gmvResult.rows[0].total),
                total_orders: parseInt(orderResult.rows[0].count)
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: '服务器错误' });
    }
});

module.exports = router;
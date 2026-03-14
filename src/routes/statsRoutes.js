const express = require('express');
const router = express.Router();
const { getDb } = require('../db/database');

// Track an event
router.post('/stats/track', async (req, res) => {
    const { event_type } = req.body;
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

    if (!event_type) {
        return res.status(400).json({ error: 'Event type is required' });
    }

    try {
        const db = getDb();
        await db.run(
            'INSERT INTO analytics (event_type, viewer_ip) VALUES (?, ?)',
            [event_type, ip]
        );
        res.json({ success: true });
    } catch (err) {
        console.error('Error tracking stat:', err);
        res.status(500).json({ error: 'Failed to track event' });
    }
});

// Admin stats summary
router.get('/admin/stats', async (req, res) => {
    try {
        const db = getDb();
        const counts = await db.all(
            'SELECT event_type, COUNT(*) as count FROM analytics GROUP BY event_type'
        );
        
        // Detailed recent events
        const recent = await db.all(
            'SELECT * FROM analytics ORDER BY timestamp DESC LIMIT 50'
        );

        res.json({ counts, recent });
    } catch (err) {
        console.error('Error fetching stats:', err);
        res.status(500).json({ error: 'Failed to fetch stats' });
    }
});

module.exports = router;

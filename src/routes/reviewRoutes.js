const express = require('express');
const router = express.Router();
const { getDb } = require('../db/database');

// GET approved reviews
router.get('/reviews', async (req, res) => {
    try {
        const db = getDb();
        const reviews = await db.all(
            'SELECT author_name, rating, comment, created_at FROM reviews WHERE status = ? ORDER BY created_at DESC',
            ['approved']
        );
        res.json(reviews);
    } catch (err) {
        console.error('Error fetching reviews:', err);
        res.status(500).json({ error: 'Failed to fetch reviews' });
    }
});

// POST new review (defaults to pending)
router.post('/reviews', async (req, res) => {
    const { author_name, rating, comment } = req.body;

    if (!author_name || !rating) {
        return res.status(400).json({ error: 'Name and rating are required' });
    }

    try {
        const db = getDb();
        await db.run(
            'INSERT INTO reviews (author_name, rating, comment) VALUES (?, ?, ?)',
            [author_name, rating, comment || '']
        );
        res.json({ success: true, message: 'Review submitted for approval' });
    } catch (err) {
        console.error('Error submitting review:', err);
        res.status(500).json({ error: 'Failed to submit review' });
    }
});

// Admin endpoints (simplified auth check could be added here or in middleware)
router.get('/admin/reviews', async (req, res) => {
    try {
        const db = getDb();
        const reviews = await db.all('SELECT * FROM reviews ORDER BY created_at DESC');
        res.json(reviews);
    } catch (err) {
        console.error('Error fetching admin reviews:', err);
        res.status(500).json({ error: 'Failed to fetch reviews' });
    }
});

router.patch('/admin/reviews/:id', async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!['approved', 'pending', 'hidden'].includes(status)) {
        return res.status(400).json({ error: 'Invalid status' });
    }

    try {
        const db = getDb();
        await db.run('UPDATE reviews SET status = ? WHERE id = ?', [status, id]);
        res.json({ success: true });
    } catch (err) {
        console.error('Error updating review status:', err);
        res.status(500).json({ error: 'Failed to update review' });
    }
});

router.delete('/admin/reviews/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const db = getDb();
        await db.run('DELETE FROM reviews WHERE id = ?', [id]);
        res.json({ success: true });
    } catch (err) {
        console.error('Error deleting review:', err);
        res.status(500).json({ error: 'Failed to delete review' });
    }
});

module.exports = router;

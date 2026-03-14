const express = require('express');
const path = require('path');
const { initDatabase } = require('../src/db/database');
const { seedDatabase } = require('../src/db/seed');
const reviewRoutes = require('../src/routes/reviewRoutes');
const statsRoutes = require('../src/routes/statsRoutes');
const licenseRoutes = require('../src/routes/licenseRoutes');
const { isCurrentlyDemo } = require('../src/utils/status');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware to ensure DB is initialized
let dbInitialized = false;
app.use(async (req, res, next) => {
    try {
        if (!dbInitialized && req.path.startsWith('/api')) {
            await initDatabase();
            await seedDatabase();
            dbInitialized = true;
        }
        next();
    } catch (err) {
        console.error('DB Init Error:', err);
        res.status(500).json({ error: 'Database error' });
    }
});

// --- API Routes ---

// Local routes handle /api/reviews or /reviews depending on Vercel's behavior
app.use('/api', reviewRoutes);
app.use('/api', statsRoutes);
app.use('/api', licenseRoutes);
app.use('/', reviewRoutes);
app.use('/', statsRoutes);
app.use('/', licenseRoutes);

app.get('/api/is-demo', async (req, res) => {
    try {
        res.json({ isDemo: await isCurrentlyDemo() });
    } catch (e) {
        res.json({ isDemo: true });
    }
});

// Catch-all for API 404s
app.use('/api/*', (req, res) => {
    res.status(404).json({ error: 'API Endpoint not found' });
});

module.exports = app;

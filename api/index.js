const express = require('express');
const path = require('path');
const { initDatabase } = require('../src/db/database');
const { seedDatabase } = require('../src/db/seed');
const reviewRoutes = require('../src/routes/reviewRoutes');
const statsRoutes = require('../src/routes/statsRoutes');
const licenseRoutes = require('../src/routes/licenseRoutes');
const { isCurrentlyDemo } = require('../src/utils/status');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database initialization middleware
let dbInitialized = false;
const ensureDb = async (req, res, next) => {
    try {
        if (!dbInitialized) {
            await initDatabase();
            await seedDatabase();
            dbInitialized = true;
        }
        next();
    } catch (err) {
        console.error('DB Init Error:', err);
        res.status(500).json({ error: 'Database failed to initialize' });
    }
};

// --- API Routes ---

// Mount at /api for consistency with frontend calls
app.use('/api', ensureDb, reviewRoutes);
app.use('/api', ensureDb, statsRoutes);
app.use('/api', ensureDb, licenseRoutes);

app.get('/api/is-demo', ensureDb, async (req, res) => {
    try {
        const isDemo = await isCurrentlyDemo();
        res.json({ isDemo });
    } catch (e) {
        res.json({ isDemo: true });
    }
});

// For any other path, serve from public folder if Vercel hasn't caught it
app.use(express.static(path.join(process.cwd(), 'public')));

// Catch-all for undefined API routes
app.use('/api/*', (req, res) => {
    res.status(404).json({ error: 'API Endpoint not found' });
});

module.exports = app;

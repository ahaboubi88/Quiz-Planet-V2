const express = require('express');
const path = require('path');
const app = express();

// --- CRITICAL: Diagnostic logging to catch require errors ---
let initError = null;
let reviewRoutes, statsRoutes, licenseRoutes, initDatabase, seedDatabase, isCurrentlyDemo;

try {
    initDatabase = require('../src/db/database').initDatabase;
    seedDatabase = require('../src/db/seed').seedDatabase;
    reviewRoutes = require('../src/routes/reviewRoutes');
    statsRoutes = require('../src/routes/statsRoutes');
    licenseRoutes = require('../src/routes/licenseRoutes');
    isCurrentlyDemo = require('../src/utils/status').isCurrentlyDemo;
} catch (err) {
    console.error('TOP-LEVEL REQUIRE ERROR:', err);
    initError = err;
}

process.on('uncaughtException', (err) => {
    console.error('CRITICAL UNCAUGHT EXCEPTION:', err);
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Middleware to ensure DB is initialized
let dbInitialized = false;
app.use(async (req, res, next) => {
    if (initError) {
        return res.status(500).json({ 
            error: 'Server failed to start (Initialization Error)', 
            details: initError.message,
            stack: initError.stack
        });
    }
    try {
        if (!dbInitialized) {
            console.log('  ⚡ Initializing Database for request:', req.path);
            await initDatabase();
            await seedDatabase();
            dbInitialized = true;
        }
        next();
    } catch (err) {
        console.error('DB Init Error:', err);
        // Return JSON error so we can see it in the frontend
        res.status(500).json({ 
            error: 'Database initialization failed', 
            details: err.message,
            stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
        });
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
        const isDemo = await isCurrentlyDemo();
        res.json({ isDemo });
    } catch (e) {
        res.json({ isDemo: true });
    }
});

// Catch-all for API 404s
app.use('/api/*', (req, res) => {
    res.status(404).json({ error: 'API Endpoint not found' });
});

// GLOBAL ERROR HANDLER
app.use((err, req, res, next) => {
    console.error('UNHANDLED SERVER ERROR:', err);
    res.status(500).json({ 
        error: 'Internal Server Error', 
        message: err.message 
    });
});

module.exports = app;

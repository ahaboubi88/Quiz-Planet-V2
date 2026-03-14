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
    // Only init DB for API requests
    if (!dbInitialized && req.path.startsWith('/api')) {
        try {
            console.log('  ⚡ Initializing Database for request:', req.path);
            await initDatabase();
            await seedDatabase();
            dbInitialized = true;
        } catch (err) {
            console.error('DB Init Error:', err);
            return res.status(500).json({ 
                error: 'Database initialization failed', 
                details: err.message
            });
        }
    }
    next();
});

// --- API Routes ---

app.get('/api', (req, res) => {
    res.json({ status: 'API IS ALIVE', version: '1.2.0' });
});

app.use('/api', reviewRoutes);
app.use('/api', statsRoutes);
app.use('/api', licenseRoutes);

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

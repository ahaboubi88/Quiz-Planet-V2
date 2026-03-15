const express = require('express');
const app = express();

// --- BARE MINIMUM PING (No DB, No Routes) ---
app.get('/api/ping', (req, res) => {
    res.json({ 
        status: 'ALIVE', 
        time: new Date().toISOString(),
        platform: process.platform,
        arch: process.arch,
        cwd: process.cwd(),
        dirname: __dirname
    });
});

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
    res.json({ 
        status: 'API IS ALIVE', 
        version: '1.2.0',
        initError: initError ? initError.message : null
    });
});

// Defensive mounting
if (reviewRoutes) app.use('/api', reviewRoutes);
if (statsRoutes) app.use('/api', statsRoutes);
if (licenseRoutes) app.use('/api', licenseRoutes);

app.get('/api/is-demo', async (req, res) => {
    if (initError || !isCurrentlyDemo) {
        return res.json({ isDemo: true, loadError: !!initError });
    }
    try {
        const isDemo = await isCurrentlyDemo();
        res.json({ isDemo });
    } catch (e) {
        res.json({ isDemo: true });
    }
});

// Catch-all for API 404s — Express 5 compatible (use middleware, not wildcard pattern)
app.use((req, res, next) => {
    if (req.path.startsWith('/api')) {
        if (initError) {
            return res.status(500).json({ error: 'Server load error', details: initError.message });
        }
        return res.status(404).json({ error: 'API Endpoint not found', path: req.path });
    }
    next();
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

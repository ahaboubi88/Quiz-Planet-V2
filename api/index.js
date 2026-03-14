const express = require('express');
const http = require('http');
const path = require('path');
const { initDatabase } = require('../src/db/database');
const { seedDatabase } = require('../src/db/seed');
const reviewRoutes = require('../src/routes/reviewRoutes');
const statsRoutes = require('../src/routes/statsRoutes');
const licenseRoutes = require('../src/routes/licenseRoutes');
const { isCurrentlyDemo } = require('../src/utils/status');

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from public/ - Vercel will prioritize this directory
app.use(express.static(path.join(process.cwd(), 'public')));

// Middleware to ensure DB is initialized (Serverless friendly)
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

// Mount routes at both / and /api to handle different Vercel rewrite behaviors
app.use('/api', ensureDb, reviewRoutes);
app.use('/api', ensureDb, statsRoutes);
app.use('/api', ensureDb, licenseRoutes);
app.use('/', ensureDb, reviewRoutes);
app.use('/', ensureDb, statsRoutes);
app.use('/', ensureDb, licenseRoutes);

app.get('/api/is-demo', ensureDb, async (req, res) => {
    res.json({ isDemo: await isCurrentlyDemo() });
});

// Fallback for API 404s
app.use('/api/*', (req, res) => {
    res.status(404).json({ error: 'API Endpoint not found' });
});

// Landing page fallback for non-file requests
app.get('/', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'public', 'landing.html'));
});

// For Vercel / Serverless
module.exports = app;
module.exports.handler = app;

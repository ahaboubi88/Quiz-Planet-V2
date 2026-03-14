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

// Serve static files from root - Express serves them locally, Vercel serves them automatically
app.use(express.static(process.cwd()));

// --- API Routes ---

app.use('/api', reviewRoutes);
app.use('/api', statsRoutes);
app.use('/api', licenseRoutes);

app.get('/api/is-demo', async (req, res) => {
    res.json({ isDemo: await isCurrentlyDemo() });
});

// Fallback for API 404s
app.use('/api/*', (req, res) => {
    res.status(404).json({ error: 'API Endpoint not found' });
});

// Landing page fallback for non-file requests - rename landing.html to index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'index.html'));
});

// Database initialization and server start
async function startServer() {
    try {
        await initDatabase();
        await seedDatabase();

        if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
            server.listen(PORT, '0.0.0.0', () => {
                console.log(`Quiz Planet Web Server (v2) running on port ${PORT}`);
            });
        }
    } catch (err) {
        console.error('SERVER STARTUP ERROR:', err);
        if (!process.env.VERCEL) process.exit(1);
    }
}

startServer();

// For Vercel / Serverless
module.exports = app;
module.exports.handler = app; // Backup for some hosting environments

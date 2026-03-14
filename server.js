const express = require('express');
const http = require('http');
const path = require('path');
const { initDatabase } = require('./src/db/database');
const { seedDatabase } = require('./src/db/seed');
const reviewRoutes = require('./src/routes/reviewRoutes');
const statsRoutes = require('./src/routes/statsRoutes');
const licenseRoutes = require('./src/routes/licenseRoutes');
const { isCurrentlyDemo } = require('./src/utils/status');

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from public/
app.use(express.static(path.join(__dirname, 'public')));

// --- API Routes ---

app.use('/api', reviewRoutes);
app.use('/api', statsRoutes);
app.use('/api', licenseRoutes);

app.get('/api/is-demo', async (req, res) => {
    res.json({ isDemo: await isCurrentlyDemo() });
});

// Serve landing page as default for any non-API routes (Express 5 safe)
app.use((req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(__dirname, 'public', 'landing.html'));
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

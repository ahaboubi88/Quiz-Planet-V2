const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const licenseUtil = require('../utils/license');
const { getDb } = require('../db/database');
const { invalidateStatusCache } = require('../utils/status');

/**
 * Get the current machine's HWID
 */
router.get('/license/hwid', (req, res) => {
    res.json({ hwid: licenseUtil.getHWID() });
});

/**
 * Check the overall activation status (Cascading check)
 */
router.get('/license/status', async (req, res) => {
    try {
        const { getAppStatus } = require('../utils/status');
        const status = await getAppStatus();
        // Add isPortable flag — electron-builder sets PORTABLE_EXECUTABLE_DIR for portable exes
        status.isPortable = !!process.env.PORTABLE_EXECUTABLE_DIR;
        res.json(status);
    } catch (err) {
        console.error('License status check error:', err);
        res.status(500).json({ error: 'Failed to check license status' });
    }
});

/**
 * Activate the primary installation
 */
router.post('/license/activate', async (req, res) => {
    const { key } = req.body;
    const hwid = licenseUtil.getHWID();

    if (licenseUtil.validateActivationKey(hwid, key)) {
        try {
            const db = getDb();
            await db.run('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)', ['license_key', key]);
            invalidateStatusCache(); // Bust cache so limits are removed immediately
            res.json({ success: true, message: 'Software activated successfully!' });
        } catch (err) {
            console.error('Database error during activation:', err);
            res.status(500).json({ success: false, error: 'Database error' });
        }
    } else {
        res.status(400).json({ success: false, error: 'Invalid activation key for this machine.' });
    }
});

/**
 * Authorize a portable version (write license.qp to target folder)
 */
router.post('/license/authorize-portable', async (req, res) => {
    const { targetPath } = req.body;

    // First, verify this installation is actually authorized to sign others
    try {
        const db = getDb();
        const setting = await db.get('SELECT value FROM settings WHERE key = ?', ['license_key']);
        const hwid = licenseUtil.getHWID();

        if (!licenseUtil.validateActivationKey(hwid, setting ? setting.value : null)) {
            return res.status(403).json({ success: false, error: 'Only activated installations can authorize portable versions.' });
        }

        if (!targetPath || !fs.existsSync(targetPath)) {
            return res.status(400).json({ success: false, error: 'Invalid target path.' });
        }

        const content = licenseUtil.createPortableLicenseContent(hwid);
        const filePath = path.join(targetPath, 'license.qp');

        fs.writeFileSync(filePath, content);
        res.json({ success: true, message: `License created successfully at ${filePath}` });
    } catch (err) {
        console.error('Portable authorization error:', err);
        res.status(500).json({ success: false, error: 'Failed to create portable license.' });
    }
});

/**
 * Public: Submit an activation request (from landing page)
 */
router.post('/license/request', async (req, res) => {
    const { name, email, phone, hwid } = req.body;
    console.log('License request received:', { name, email, phone, hwid });

    if (!name || !email || !phone || !hwid) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const db = getDb();
        await db.run(
            'INSERT INTO license_requests (name, email, phone, hwid) VALUES (?, ?, ?, ?)',
            [name, email, phone, hwid]
        );
        res.json({ success: true, message: 'Request sent! You will receive an email shortly.' });
    } catch (err) {
        console.error('License request error:', err);
        res.status(500).json({ error: 'Failed to submit request: ' + err.message });
    }
});

/**
 * Admin: Get all license requests
 */
router.get('/admin/license/requests', async (req, res) => {
    try {
        const db = getDb();
        const requests = await db.all('SELECT * FROM license_requests ORDER BY created_at DESC');
        res.json(requests);
    } catch (err) {
        res.status(500).json({ error: 'Database error' });
    }
});

/**
 * Admin: Generate key for a specific request
 */
router.post('/admin/license/generate', async (req, res) => {
    const { id, hwid } = req.body;
    if (!id || !hwid) return res.status(400).json({ error: 'ID and HWID required' });

    try {
        const key = licenseUtil.generateActivationKey(hwid);
        const db = getDb();
        await db.run(
            'UPDATE license_requests SET activation_key = ?, status = ? WHERE id = ?',
            [key, 'completed', id]
        );
        res.json({ success: true, key });
    } catch (err) {
        res.status(500).json({ error: 'Failed to generate key' });
    }
});

/**
 * Admin: Pick a folder on the host machine (Windows only helper)
 */
router.get('/admin/pick-folder', async (req, res) => {
    try {
        const { exec } = require('child_process');
        const script = `Add-Type -AssemblyName System.Windows.Forms; $f = New-Object System.Windows.Forms.FolderBrowserDialog; $f.Description = 'Select Portable Version Folder'; if ($f.ShowDialog() -eq 'OK') { $f.SelectedPath }`;

        exec(`powershell -Command "${script}"`, (error, stdout, stderr) => {
            if (error) return res.status(500).json({ error: 'Failed to open dialog' });
            const path = stdout.trim();
            res.json({ path });
        });
    } catch (err) {
        res.status(500).json({ error: 'Unexpected error' });
    }
});

/**
 * Download a portable license file content (Alternative to direct write)
 */
router.get('/license/download-portable', async (req, res) => {
    try {
        const db = getDb();
        const setting = await db.get('SELECT value FROM settings WHERE key = ?', ['license_key']);
        const hwid = licenseUtil.getHWID();

        if (!licenseUtil.validateActivationKey(hwid, setting ? setting.value : null)) {
            return res.status(403).json({ success: false, error: 'Unauthorized' });
        }

        const content = licenseUtil.createPortableLicenseContent(hwid);
        res.setHeader('Content-disposition', 'attachment; filename=license.qp');
        res.setHeader('Content-type', 'application/json');
        res.send(content);
    } catch (err) {
        res.status(500).send('Error');
    }
});

module.exports = router;

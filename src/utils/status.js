const { isDemo: isHardcodedDemo } = require('../config/demo-config');
const licenseUtil = require('./license');
const { getDb } = require('../db/database');

// Cache to avoid repeated DB + PowerShell calls on every request
let _cachedStatus = null;
let _cacheTime = 0;
const CACHE_TTL = 5000; // 5 seconds

/**
 * Detects if the system clock has been rolled back since the last run.
 * Returns true if tampering is detected.
 */
async function verifyClockIntegrity() {
    if (process.env.VERCEL) return { tampered: false }; // Skip check on serverless
    try {
        const db = getDb();
        const now = Date.now();
        
        // Use an obscure key name to make it harder to find
        const key = '_sys_sync_blob';
        const setting = await db.get('SELECT value FROM settings WHERE key = ?', [key]);
        
        if (setting) {
            const lastRun = parseInt(setting.value);
            // If current time is more than 3 minutes EARLIER than last run, it's a rollback
            // Using 3 minutes buffer to account for minor clock sync adjustments
            if (now < (lastRun - 180000)) {
                console.error('⚠ Clock Tamper Detected: Current time is earlier than last recorded run.');
                return { tampered: true, lastRun: new Date(lastRun).toLocaleString() };
            }
        }
        
        // Update the last run time (only if current time is move forward)
        await db.run('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)', [key, now.toString()]);
        return { tampered: false };
    } catch (err) {
        // Database might not be initialized yet
        return { tampered: false };
    }
}

/**
 * Gets the current application status (DEMO, FULL, or FULL_WARNING)
 * Result is cached for 5 seconds to prevent performance issues.
 */
async function getAppStatus() {
    // Return cached result if still fresh
    if (_cachedStatus && (Date.now() - _cacheTime) < CACHE_TTL) {
        return _cachedStatus;
    }

    let result;
    let licenseKey = null;

    // 1. Try to get activation key from database
    try {
        const db = getDb();
        const setting = await db.get('SELECT value FROM settings WHERE key = ?', ['license_key']);
        if (setting) {
            licenseKey = setting.value;
        }
    } catch (err) { }

    // 2. Check full cascading license (DB Key + Portable license.qp)
    const statusObj = licenseUtil.checkStatus(licenseKey);

    // 3. Anti-Tamper: Only for Portable Licenses
    // This prevents users from rolling back their clock to bypass the 30-day limit.
    if (statusObj.type === 'portable') {
        const clock = await verifyClockIntegrity();
        if (clock.tampered) {
            result = { 
                status: 'DEMO', 
                type: 'clock_error', 
                daysLeft: 0,
                error: 'System clock rollback detected. Access restricted.' 
            };
            _cachedStatus = result;
            _cacheTime = Date.now();
            return result;
        }
    }

    if (statusObj.status !== 'DEMO') {
        result = statusObj;
    } else {
        // 4. No database license found? Check build type
        if (isHardcodedDemo) {
            result = { status: 'DEMO', type: 'none', daysLeft: 0 };
        } else {
            result = { status: 'FULL', type: 'primary', daysLeft: 999 };
        }
    }

    _cachedStatus = result;
    _cacheTime = Date.now();
    return result;
}

/**
 * Helper to check if the app is currently behaving as a DEMO
 */
async function isCurrentlyDemo() {
    const status = await getAppStatus();
    return status.status === 'DEMO';
}

/**
 * Invalidate the cached status (call after activation/deactivation)
 */
function invalidateStatusCache() {
    _cachedStatus = null;
    _cacheTime = 0;
}

module.exports = {
    getAppStatus,
    isCurrentlyDemo,
    invalidateStatusCache
};

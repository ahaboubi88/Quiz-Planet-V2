const crypto = require('crypto');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// A secret "pepper" unique to this application to prevent easy key forgery.
// In a real-world scenario, this would be more complex, but for this app it's a solid balance.
const SECRET_PEPPER = 'QP-2026-CLASSROOM-JOY-99';

/**
 * Get the unique Hardware ID of the current machine.
 * Combines ProcessorId and BIOS SerialNumber for stability.
 * CACHED: PowerShell is only invoked once; subsequent calls return the cached value.
 */
let _cachedHWID = null;

function getHWID() {
    if (_cachedHWID) return _cachedHWID;

    try {
        // Use PowerShell to get IDs. These are standard on Windows.
        const cpuId = execSync('powershell -Command "(Get-CimInstance Win32_Processor).ProcessorId"', { timeout: 10000 }).toString().trim();
        const biosSerial = execSync('powershell -Command "(Get-CimInstance Win32_BIOS).SerialNumber"', { timeout: 10000 }).toString().trim();
        
        const raw = `QP-${cpuId}-${biosSerial}`;
        _cachedHWID = crypto.createHash('sha256').update(raw).digest('hex').substring(0, 16).toUpperCase();
        console.log('  ✔ HWID cached:', _cachedHWID);
        return _cachedHWID;
    } catch (err) {
        console.error('Error generating HWID:', err);
        return 'UNKNOWN-MACHINE-ID';
    }
}

/**
 * Generate an activation key for a specific HWID.
 * This is used by the admin tool to provide to customers.
 */
function generateActivationKey(hwid) {
    const salt = 'QP-ANCHOR-2026';
    const hash = crypto.createHmac('sha256', SECRET_PEPPER)
        .update(`${hwid}:${salt}`)
        .digest('hex')
        .substring(0, 12)
        .toUpperCase();
    
    // Format as XXXX-XXXX-XXXX
    return `${hash.slice(0, 4)}-${hash.slice(4, 8)}-${hash.slice(8, 12)}`;
}

/**
 * Verify if a key is valid for this machine's HWID.
 */
function validateActivationKey(hwid, key) {
    if (!key) return false;
    const expected = generateActivationKey(hwid);
    return key.replace(/-/g, '') === expected.replace(/-/g, '');
}

/**
 * Create a portable license file content.
 */
function createPortableLicenseContent(anchorHwid) {
    const issueDate = new Date();
    const expiryDate = new Date();
    expiryDate.setDate(issueDate.getDate() + 30);

    const data = {
        anchor_id: anchorHwid,
        issued: issueDate.toISOString().split('T')[0],
        expiry: expiryDate.toISOString().split('T')[0]
    };

    const signature = crypto.createHmac('sha256', SECRET_PEPPER)
        .update(`${data.anchor_id}:${data.expiry}`)
        .digest('hex');

    return JSON.stringify({ ...data, signature }, null, 2);
}

/**
 * Core cascading license check.
 * Checks local HWID first, then portable license file.
 */
function checkStatus(dbKey) {
    const currentHwid = getHWID();
    
    // 1. Check Primary Activation (Database Key vs HWID)
    if (dbKey && validateActivationKey(currentHwid, dbKey)) {
        return { status: 'FULL', type: 'primary', daysLeft: 999 };
    }

    // 2. Check Portable License File (license.qp)
    // Search multiple possible locations — electron-builder portable exe sets PORTABLE_EXECUTABLE_DIR
    const searchPaths = [
        process.env.PORTABLE_EXECUTABLE_DIR,              // Electron portable exe dir (where user put the exe)
        path.dirname(process.execPath),                    // Directory of the running executable
        process.cwd()                                      // Current working directory (fallback)
    ].filter(Boolean); // Remove undefined/null entries

    for (const dir of searchPaths) {
        const licensePath = path.join(dir, 'license.qp');
        if (fs.existsSync(licensePath)) {
            try {
                const license = JSON.parse(fs.readFileSync(licensePath, 'utf8'));
                const expectedSig = crypto.createHmac('sha256', SECRET_PEPPER)
                    .update(`${license.anchor_id}:${license.expiry}`)
                    .digest('hex');

                if (license.signature === expectedSig) {
                    const now = new Date();
                    const expiry = new Date(license.expiry);
                    const diffTime = expiry - now;
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                    if (diffDays > 0) {
                        return {
                            status: diffDays <= 3 ? 'FULL_WARNING' : 'FULL',
                            type: 'portable',
                            daysLeft: diffDays
                        };
                    }
                }
            } catch (err) {
                console.error('Portable license read error:', err);
            }
        }
    }

    return { status: 'DEMO', type: 'none', daysLeft: 0 };
}

module.exports = {
    getHWID,
    generateActivationKey,
    validateActivationKey,
    createPortableLicenseContent,
    checkStatus
};

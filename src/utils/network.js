/**
 * Network utilities
 * Detects local IP address for QR code generation
 */

const os = require('os');

/**
 * Get the machine's local network IPv4 address
 * Returns the first non-internal IPv4 address found
 */
function getLocalIP() {
    const interfaces = os.networkInterfaces();
    let fallbackIP = 'localhost';

    // First pass: look specifically for the common Windows Hotspot IP range
    for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name]) {
            if (iface.internal || iface.family !== 'IPv4') continue;
            // 192.168.137.1 is the default for Windows Mobile Hotspot
            if (iface.address.startsWith('192.168.137.')) {
                return iface.address;
            }
        }
    }

    // Second pass: standard local IP detection
    for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name]) {
            if (iface.internal || iface.family !== 'IPv4') continue;

            // Prioritize standard Wi-Fi or Ethernet ranges, ignore common virtual ones like 172.x (Docker/WSL)
            if (iface.address.startsWith('192.168.') || iface.address.startsWith('10.')) {
                return iface.address;
            }

            fallbackIP = iface.address;
        }
    }

    return fallbackIP;
}

/**
 * Get the full server URL
 */
function getServerUrl(port) {
    const ip = getLocalIP();
    return `http://${ip}:${port}`;
}

module.exports = { getLocalIP, getServerUrl };

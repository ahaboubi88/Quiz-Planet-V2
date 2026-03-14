/**
 * Database initialization and access
 * Uses sqlite3 with a Promise-based wrapper for compatibility.
 * This replaces better-sqlite3 because sqlite3 has better prebuilt binary support for Electron.
 */

const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// Database path — use the persistent path defined in main.js
// If not set (emergency fallback), use project local data
const PERSISTENT_DIR = process.env.QUIZ_PLANET_DATA_PATH || path.join(process.cwd(), 'data');
let DB_PATH = path.join(PERSISTENT_DIR, 'kahoot-local.db');

// Vercel/Serverless Fix: File system is read-only. Use in-memory DB as fallback.
if (process.env.VERCEL) {
    console.log('  ☁  Vercel detected: Using in-memory database');
    DB_PATH = ':memory:';
}

// Schema is part of the application source (read-only in ASAR), so it remains relative to __dirname
const SCHEMA_PATH = path.join(__dirname, 'schema.sql');

let dbInstance = null;
let dbPromise = null;

/**
 * Promise-based wrapper for sqlite3
 */
const dbWrapper = {
    all: (sql, params = []) => new Promise((resolve, reject) => {
        dbInstance.all(sql, params, (err, rows) => err ? reject(err) : resolve(rows));
    }),
    get: (sql, params = []) => new Promise((resolve, reject) => {
        dbInstance.get(sql, params, (err, row) => err ? reject(err) : resolve(row));
    }),
    run: (sql, params = []) => new Promise((resolve, reject) => {
        dbInstance.run(sql, params, function (err) {
            if (err) return reject(err);
            resolve({ lastInsertRowid: this.lastID, changes: this.changes });
        });
    }),
    exec: (sql) => new Promise((resolve, reject) => {
        dbInstance.exec(sql, (err) => err ? reject(err) : resolve());
    }),
    prepare: (sql) => {
        // Simplified prepare that returns an object with run/all/get that are actually wrappers around the DB methods
        // This is a minimal compatibility layer for better-sqlite3's prepare().run() etc
        return {
            run: (...params) => dbWrapper.run(sql, params),
            all: (...params) => dbWrapper.all(sql, params),
            get: (...params) => dbWrapper.get(sql, params)
        };
    },
    transaction: (fn) => {
        // Simple transaction wrapper (serialize in sqlite3)
        return async (...args) => {
            return new Promise((resolve, reject) => {
                dbInstance.serialize(async () => {
                    try {
                        await dbWrapper.exec('BEGIN TRANSACTION');
                        const result = await fn(...args);
                        await dbWrapper.exec('COMMIT');
                        resolve(result);
                    } catch (err) {
                        await dbWrapper.exec('ROLLBACK');
                        reject(err);
                    }
                });
            });
        };
    },
    pragma: (sql) => {
        // Pragmas are just exec in sqlite3
        return dbWrapper.exec(`PRAGMA ${sql}`);
    },
    close: () => new Promise((resolve, reject) => {
        dbInstance.close((err) => err ? reject(err) : resolve());
    })
};

/**
 * Initialize the database — create file and tables if they don't exist
 */
async function initDatabase() {
    // Ensure data directory exists (Skip if in-memory)
    if (DB_PATH !== ':memory:') {
        const dataDir = path.dirname(DB_PATH);
        if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir, { recursive: true });
        }
    }

    if (!dbPromise) {
        dbPromise = new Promise((resolve, reject) => {
            dbInstance = new sqlite3.Database(DB_PATH, async (err) => {
                if (err) {
                    console.error('Failed to open database:', err.message);
                    return reject(err);
                }

                try {
                    // Enable WAL and Foreign Keys
                    await dbWrapper.pragma('journal_mode = WAL');
                    await dbWrapper.pragma('foreign_keys = ON');

                    // Run schema
                    const schema = fs.readFileSync(SCHEMA_PATH, 'utf-8');
                    await dbWrapper.exec(schema);

                    // Migration: Ensure 'phone' column exists in license_requests
                    const tableInfo = await dbWrapper.all("PRAGMA table_info(license_requests)");
                    if (tableInfo.length > 0 && !tableInfo.some(col => col.name === 'phone')) {
                        console.log('  ⚠️  Migrating database: Adding phone column to license_requests');
                        await dbWrapper.exec("ALTER TABLE license_requests ADD COLUMN phone TEXT NOT NULL DEFAULT 'N/A'");
                    }

                    console.log('  ✔ Database initialized');
                    resolve(dbWrapper);
                } catch (initErr) {
                    reject(initErr);
                }
            });
        });
    }

    return dbPromise;
}

/**
 * Get the database instance
 */
function getDb() {
    if (!dbInstance) {
        throw new Error('Database not initialized. Call initDatabase() first.');
    }
    return dbWrapper;
}

/**
 * Close the database connection gracefully
 */
async function closeDatabase() {
    if (dbInstance) {
        await dbWrapper.close();
        dbInstance = null;
        dbPromise = null;
        console.log('  ✔ Database closed');
    }
}

module.exports = { initDatabase, getDb, closeDatabase };

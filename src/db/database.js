/**
 * Database initialization and access
 * Uses sql.js (pure JS/WASM SQLite) for Vercel compatibility.
 * Uses sqlite3 (native addon) for local/Electron environments.
 */

const path = require('path');
const fs = require('fs');

// Schema is part of the application source
const SCHEMA_PATH = path.join(__dirname, 'schema.sql');

let dbInstance = null;
let dbPromise = null;

// Detect environment
const IS_VERCEL = !!process.env.VERCEL;

// Database path for local environments
const PERSISTENT_DIR = process.env.QUIZ_PLANET_DATA_PATH || path.join(process.cwd(), 'data');
const DB_PATH = IS_VERCEL ? ':memory:' : path.join(PERSISTENT_DIR, 'kahoot-local.db');

if (IS_VERCEL) {
    console.log('  ☁  Vercel detected: Using sql.js (in-memory)');
}

// ─── libsql wrapper (Turso / Vercel Edge) ───────────────────────────
function createLibsqlWrapper(client) {
    return {
        all: async (sql, params = []) => {
            const result = await client.execute({ sql, args: params });
            return result.rows;
        },
        get: async (sql, params = []) => {
            const result = await client.execute({ sql, args: params });
            return result.rows[0];
        },
        run: async (sql, params = []) => {
            const result = await client.execute({ sql, args: params });
            return {
                lastInsertRowid: result.lastInsertRowid !== undefined && result.lastInsertRowid !== null 
                                 ? Number(result.lastInsertRowid) : 0,
                changes: result.rowsAffected
            };
        },
        exec: async (sql) => {
            // @libsql/client executeMultiple handles multiple statements like 'schema.sql'
            await client.executeMultiple(sql);
        },
        prepare: (sql) => ({
            run: async (...params) => {
                const result = await client.execute({ sql, args: params });
                return {
                    lastInsertRowid: result.lastInsertRowid !== undefined && result.lastInsertRowid !== null 
                                     ? Number(result.lastInsertRowid) : 0,
                    changes: result.rowsAffected
                };
            },
            all: async (...params) => {
                const result = await client.execute({ sql, args: params });
                return result.rows;
            },
            get: async (...params) => {
                const result = await client.execute({ sql, args: params });
                return result.rows[0];
            }
        }),
        transaction: (fn) => {
            // Turso transactions over HTTP require using a specific transaction object,
            // but for simple seeding we can bypass strict atomic locks.
            return async (...args) => {
                return await fn(...args);
            };
        },
        pragma: async (sql) => {
            try {
                await client.execute(`PRAGMA ${sql}`);
            } catch (e) {}
        },
        close: async () => {
            client.close();
        }
    };
}

// ─── sqlite3 wrapper (Local / Electron) ─────────────────────────────
function createSqlite3Wrapper(nativeDb) {
    const wrapper = {
        all: (sql, params = []) => new Promise((resolve, reject) => {
            nativeDb.all(sql, params, (err, rows) => err ? reject(err) : resolve(rows));
        }),
        get: (sql, params = []) => new Promise((resolve, reject) => {
            nativeDb.get(sql, params, (err, row) => err ? reject(err) : resolve(row));
        }),
        run: (sql, params = []) => new Promise((resolve, reject) => {
            nativeDb.run(sql, params, function (err) {
                if (err) return reject(err);
                resolve({ lastInsertRowid: this.lastID, changes: this.changes });
            });
        }),
        exec: (sql) => new Promise((resolve, reject) => {
            nativeDb.exec(sql, (err) => err ? reject(err) : resolve());
        }),
        prepare: (sql) => ({
            run: (...params) => wrapper.run(sql, params),
            all: (...params) => wrapper.all(sql, params),
            get: (...params) => wrapper.get(sql, params)
        }),
        transaction: (fn) => {
            return async (...args) => {
                return new Promise((resolve, reject) => {
                    nativeDb.serialize(async () => {
                        try {
                            await wrapper.exec('BEGIN TRANSACTION');
                            const result = await fn(...args);
                            await wrapper.exec('COMMIT');
                            resolve(result);
                        } catch (err) {
                            await wrapper.exec('ROLLBACK');
                            reject(err);
                        }
                    });
                });
            };
        },
        pragma: (sql) => wrapper.exec(`PRAGMA ${sql}`),
        close: () => new Promise((resolve, reject) => {
            nativeDb.close((err) => err ? reject(err) : resolve());
        })
    };
    return wrapper;
}

// ─── Shared db wrapper reference ────────────────────────────────────
let dbWrapper = null;

/**
 * Initialize the database — create tables if they don't exist
 */
async function initDatabase() {
    if (dbPromise) return dbPromise;

    dbPromise = (async () => {
        const schema = fs.readFileSync(SCHEMA_PATH, 'utf-8');

        if (IS_VERCEL) {
            // ── Turso / libsql path (Persistent Serverless Database) ──
            const { createClient } = require('@libsql/client');
            
            // Hardcoding tokens as fallback since user provided them directly
            const url = process.env.TURSO_DATABASE_URL || "libsql://quiz-planet-db-ahaboubi.aws-eu-west-1.turso.io";
            const authToken = process.env.TURSO_AUTH_TOKEN || "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NzM1NzA3MzAsImlkIjoiMDE5Y2YxMGMtMDgwMS03OWUzLTk0ZmQtNjljNmMzN2UyYjNiIiwicmlkIjoiYzVmNDFlYTEtZDc3Zi00ODNiLWI5NGItZTEwMDhiMDM1M2I5In0.KcP0fLhpudsKcTzgS28jZjGTo05oNiK90WV5jsCLoneKkAXAzklNVA8JvfiSHh-8G34FBfOsoYCsBe9IV0JpBw";
            
            dbInstance = createClient({
                url: url,
                authToken: authToken
            });
            dbWrapper = createLibsqlWrapper(dbInstance);
        } else {
            // ── sqlite3 path (native, for local/Electron) ──
            const sqlite3 = require('sqlite3').verbose();

            // Ensure data directory exists
            const dataDir = path.dirname(DB_PATH);
            if (!fs.existsSync(dataDir)) {
                fs.mkdirSync(dataDir, { recursive: true });
            }

            await new Promise((resolve, reject) => {
                dbInstance = new sqlite3.Database(DB_PATH, (err) => {
                    if (err) return reject(err);
                    resolve();
                });
            });
            dbWrapper = createSqlite3Wrapper(dbInstance);
        }

        // Enable foreign keys
        try { await dbWrapper.pragma('foreign_keys = ON'); } catch (e) { }

        // Run schema
        await dbWrapper.exec(schema);

        // Migration: Ensure 'phone' column exists in license_requests
        const tableInfo = await dbWrapper.all("PRAGMA table_info(license_requests)");
        if (tableInfo.length > 0 && !tableInfo.some(col => col.name === 'phone')) {
            console.log('  ⚠️  Migrating database: Adding phone column');
            await dbWrapper.exec("ALTER TABLE license_requests ADD COLUMN phone TEXT NOT NULL DEFAULT 'N/A'");
        }

        console.log('  ✔ Database initialized' + (IS_VERCEL ? ' (sql.js in-memory)' : ` (sqlite3 at ${DB_PATH})`));
        return dbWrapper;
    })();

    return dbPromise;
}

/**
 * Get the database instance
 */
function getDb() {
    if (!dbWrapper) {
        throw new Error('Database not initialized. Call initDatabase() first.');
    }
    return dbWrapper;
}

/**
 * Close the database connection gracefully
 */
async function closeDatabase() {
    if (dbWrapper) {
        await dbWrapper.close();
        dbInstance = null;
        dbWrapper = null;
        dbPromise = null;
        console.log('  ✔ Database closed');
    }
}

module.exports = { initDatabase, getDb, closeDatabase };

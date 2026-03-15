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

// ─── sql.js wrapper (Vercel / serverless) ───────────────────────────
function createSqlJsWrapper(sqlJsDb) {
    return {
        all: (sql, params = []) => {
            try {
                const stmt = sqlJsDb.prepare(sql);
                if (params.length) stmt.bind(params);
                const results = [];
                while (stmt.step()) {
                    results.push(stmt.getAsObject());
                }
                stmt.free();
                return Promise.resolve(results);
            } catch (err) {
                return Promise.reject(err);
            }
        },
        get: (sql, params = []) => {
            try {
                const stmt = sqlJsDb.prepare(sql);
                if (params.length) stmt.bind(params);
                const row = stmt.step() ? stmt.getAsObject() : undefined;
                stmt.free();
                return Promise.resolve(row);
            } catch (err) {
                return Promise.reject(err);
            }
        },
        run: (sql, params = []) => {
            try {
                sqlJsDb.run(sql, params);
                return Promise.resolve({
                    lastInsertRowid: sqlJsDb.exec("SELECT last_insert_rowid()")[0]?.values[0]?.[0] || 0,
                    changes: sqlJsDb.getRowsModified()
                });
            } catch (err) {
                return Promise.reject(err);
            }
        },
        exec: (sql) => {
            try {
                sqlJsDb.exec(sql);
                return Promise.resolve();
            } catch (err) {
                return Promise.reject(err);
            }
        },
        prepare: (sql) => ({
            run: (...params) => {
                sqlJsDb.run(sql, params);
                return Promise.resolve({
                    lastInsertRowid: sqlJsDb.exec("SELECT last_insert_rowid()")[0]?.values[0]?.[0] || 0,
                    changes: sqlJsDb.getRowsModified()
                });
            },
            all: (...params) => {
                const stmt = sqlJsDb.prepare(sql);
                if (params.length) stmt.bind(params);
                const results = [];
                while (stmt.step()) results.push(stmt.getAsObject());
                stmt.free();
                return Promise.resolve(results);
            },
            get: (...params) => {
                const stmt = sqlJsDb.prepare(sql);
                if (params.length) stmt.bind(params);
                const row = stmt.step() ? stmt.getAsObject() : undefined;
                stmt.free();
                return Promise.resolve(row);
            }
        }),
        transaction: (fn) => {
            return async (...args) => {
                sqlJsDb.exec('BEGIN TRANSACTION');
                try {
                    const result = await fn(...args);
                    sqlJsDb.exec('COMMIT');
                    return result;
                } catch (err) {
                    sqlJsDb.exec('ROLLBACK');
                    throw err;
                }
            };
        },
        pragma: (sql) => {
            try {
                sqlJsDb.exec(`PRAGMA ${sql}`);
                return Promise.resolve();
            } catch (e) {
                return Promise.resolve(); // Ignore pragma failures
            }
        },
        close: () => {
            sqlJsDb.close();
            return Promise.resolve();
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
            // ── sql.js path (pure JS, no native deps) ──
            // On Vercel, we completely bypass WASM to avoid ENOENT errors for the .wasm binary.
            // We directly load the asm.js (pure JavaScript) fallback which works everywhere.
            const initSqlJs = require('sql.js/dist/sql-asm.js');
            const SQL = await initSqlJs();
            dbInstance = new SQL.Database();
            dbWrapper = createSqlJsWrapper(dbInstance);
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

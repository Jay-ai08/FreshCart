const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const mongoose = require('mongoose');

const STORE_PATH = path.join(__dirname, '..', 'data', 'local-db.json');
const DEFAULT_STORE = { users: [], orders: [], contacts: [] };

function isDatabaseReady() {
    return mongoose.connection.readyState === 1;
}

function ensureStore() {
    const dir = path.dirname(STORE_PATH);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    if (!fs.existsSync(STORE_PATH)) {
        fs.writeFileSync(STORE_PATH, JSON.stringify(DEFAULT_STORE, null, 2));
    }
}

function readStore() {
    ensureStore();
    try {
        const parsed = JSON.parse(fs.readFileSync(STORE_PATH, 'utf8'));
        return { ...DEFAULT_STORE, ...parsed };
    } catch {
        return { ...DEFAULT_STORE };
    }
}

function writeStore(store) {
    ensureStore();
    fs.writeFileSync(STORE_PATH, JSON.stringify({ ...DEFAULT_STORE, ...store }, null, 2));
}

function createId() {
    return crypto.randomUUID();
}

function publicUser(user) {
    if (!user) return null;
    const { password, ...safeUser } = user;
    return safeUser;
}

module.exports = {
    isDatabaseReady,
    readStore,
    writeStore,
    createId,
    publicUser,
};

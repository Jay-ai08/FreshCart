const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { secret, expiresIn } = require('../config/jwtConfig');
const { createId, isDatabaseReady, publicUser, readStore, writeStore } = require('../utils/localStore');

// Helper function to hash password (simple - use bcrypt in production)
function hashPassword(password) {
    return crypto.createHash('sha256').update(password).digest('hex');
}

function signUser(user) {
    return jwt.sign(
        { userId: user._id, email: user.email, role: user.role || 'user' },
        secret,
        { expiresIn }
    );
}

function normalizeEmail(email) {
    return String(email || '').trim().toLowerCase();
}

function sendAuthResponse(res, status, message, user) {
    const authUser = {
        ...user,
        role: user.role || (configuredAdminEmails().includes(normalizeEmail(user.email)) ? 'admin' : 'user'),
    };
    const token = signUser(authUser);
    res.status(status).json({ message, token, user: publicUser(authUser) });
}

function configuredAdminEmails() {
    return String(process.env.ADMIN_EMAILS || '')
        .split(',')
        .map((email) => normalizeEmail(email))
        .filter(Boolean);
}

async function resolveRole(email, hasExistingUsers) {
    if (configuredAdminEmails().includes(email)) return 'admin';
    return hasExistingUsers ? 'user' : 'admin';
}

async function signupLocal({ name, email, phone, password }, res) {
    const store = readStore();
    const normalizedEmail = normalizeEmail(email);
    const existingUser = store.users.find((user) => user.email === normalizedEmail);

    if (existingUser) {
        return res.status(400).json({ error: 'Email already registered' });
    }

    const user = {
        _id: createId(),
        name: String(name).trim(),
        email: normalizedEmail,
        phone: String(phone).trim(),
        password: hashPassword(password),
        role: await resolveRole(normalizedEmail, store.users.length > 0),
        address: '',
        city: '',
        createdAt: new Date().toISOString(),
    };

    store.users.push(user);
    writeStore(store);
    return sendAuthResponse(res, 201, 'Account created successfully', user);
}

async function loginLocal({ email, password }, res) {
    const store = readStore();
    const normalizedEmail = normalizeEmail(email);
    const user = store.users.find((item) => item.email === normalizedEmail);

    if (!user || user.password !== hashPassword(password)) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }

    return sendAuthResponse(res, 200, 'Login successful', user);
}

// Sign up
const signup = async (req, res) => {
    try {
        const { name, email, phone, password, confirmPassword } = req.body;

        if (!name || !email || !phone || !password || !confirmPassword) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ error: 'Passwords do not match' });
        }

        const normalizedEmail = normalizeEmail(email);

        if (!isDatabaseReady()) {
            return signupLocal({ name, email: normalizedEmail, phone, password }, res);
        }

        let existingUser = await User.findOne({ email: normalizedEmail });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        const hashedPassword = hashPassword(password);
        const hasExistingUsers = await User.exists({});
        const user = new User({
            name: String(name).trim(),
            email: normalizedEmail,
            phone: String(phone).trim(),
            password: hashedPassword,
            role: await resolveRole(normalizedEmail, Boolean(hasExistingUsers))
        });

        const savedUser = await user.save();
        return sendAuthResponse(res, 201, 'Account created successfully', savedUser.toObject());
    } catch (error) {
        res.status(500).json({ error: error.message || 'Failed to create account' });
    }
};

// Login
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password required' });
        }

        const normalizedEmail = normalizeEmail(email);

        if (!isDatabaseReady()) {
            return loginLocal({ email: normalizedEmail, password }, res);
        }

        const user = await User.findOne({ email: normalizedEmail }).lean();
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const hashedPassword = hashPassword(password);
        if (user.password !== hashedPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        return sendAuthResponse(res, 200, 'Login successful', user);
    } catch (error) {
        res.status(500).json({ error: error.message || 'Login failed' });
    }
};

// Get dashboard (authenticated user info)
const getDashboard = async (req, res) => {
    try {
        const userId = req.user.userId;

        if (!isDatabaseReady()) {
            const store = readStore();
            const user = store.users.find((item) => String(item._id) === String(userId));
            return res.json({ user: publicUser(user) });
        }

        const user = await User.findById(userId).select('-password').lean();
        res.json({ user });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch dashboard' });
    }
};

module.exports = { signup, login, getDashboard };

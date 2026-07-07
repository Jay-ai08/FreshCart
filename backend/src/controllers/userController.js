const User = require('../models/userModel');
const { isDatabaseReady, publicUser, readStore, writeStore } = require('../utils/localStore');

function sanitizeProfileUpdate(data) {
    return {
        name: String(data.name || '').trim(),
        email: String(data.email || '').trim().toLowerCase(),
        phone: String(data.phone || '').trim(),
        address: String(data.address || '').trim(),
        city: String(data.city || '').trim(),
    };
}

// Get user profile
exports.getUserProfile = async (req, res) => {
    try {
        const { userId } = req.params;

        if (String(req.user?.userId) !== String(userId)) {
            return res.status(403).json({ error: 'You can only view your own profile' });
        }

        if (!isDatabaseReady()) {
            const store = readStore();
            const user = store.users.find((item) => String(item._id) === String(userId));
            if (!user) return res.status(404).json({ error: 'User not found' });
            return res.json(publicUser(user));
        }

        const user = await User.findById(userId).select('-password').lean();

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch user profile' });
    }
};

// Update user profile
exports.updateUserProfile = async (req, res) => {
    try {
        const { userId } = req.params;

        if (String(req.user?.userId) !== String(userId)) {
            return res.status(403).json({ error: 'You can only update your own profile' });
        }

        const update = sanitizeProfileUpdate(req.body);

        if (!update.name || !update.email) {
            return res.status(400).json({ error: 'Name and email are required' });
        }

        if (!isDatabaseReady()) {
            const store = readStore();
            const index = store.users.findIndex((item) => String(item._id) === String(userId));
            if (index === -1) return res.status(404).json({ error: 'User not found' });

            const duplicateEmail = store.users.find((item) => item.email === update.email && String(item._id) !== String(userId));
            if (duplicateEmail) return res.status(400).json({ error: 'Email already registered' });

            store.users[index] = { ...store.users[index], ...update };
            writeStore(store);
            return res.json({ message: 'Profile updated successfully', user: publicUser(store.users[index]) });
        }

        const user = await User.findByIdAndUpdate(
            userId,
            update,
            { new: true, runValidators: true }
        ).select('-password').lean();

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ message: 'Profile updated successfully', user });
    } catch (error) {
        res.status(400).json({ error: error.message || 'Failed to update profile' });
    }
};

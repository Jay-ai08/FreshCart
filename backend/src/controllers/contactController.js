const Contact = require('../models/contactModel');
const { createId, isDatabaseReady, readStore, writeStore } = require('../utils/localStore');

function cleanContact(body) {
    return {
        name: String(body.name || '').trim(),
        email: String(body.email || '').trim().toLowerCase(),
        phone: String(body.phone || '').trim(),
        subject: String(body.subject || '').trim(),
        message: String(body.message || '').trim(),
    };
}

// Submit contact form
exports.submitContact = async (req, res) => {
    try {
        const contactData = cleanContact(req.body);
        const { name, email, phone, subject, message } = contactData;

        if (!name || !email || !phone || !subject || !message) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        if (!isDatabaseReady()) {
            const store = readStore();
            const contact = {
                _id: createId(),
                ...contactData,
                status: 'new',
                createdAt: new Date().toISOString(),
            };
            store.contacts.unshift(contact);
            writeStore(store);
            return res.status(201).json({
                message: 'Thank you for contacting FreshCart. We will get back to you soon.',
                contact
            });
        }

        const contact = new Contact(contactData);
        const savedContact = await contact.save();
        res.status(201).json({
            message: 'Thank you for contacting FreshCart. We will get back to you soon.',
            contact: savedContact
        });
    } catch (error) {
        res.status(400).json({ error: error.message || 'Failed to submit contact form' });
    }
};

// Get all contacts (admin)
exports.getAllContacts = async (req, res) => {
    try {
        if (!isDatabaseReady()) return res.json(readStore().contacts);
        const contacts = await Contact.find().sort({ createdAt: -1 }).lean();
        res.json(contacts);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch contacts' });
    }
};

// Get single contact
exports.getContact = async (req, res) => {
    try {
        const { id } = req.params;

        if (!isDatabaseReady()) {
            const contact = readStore().contacts.find((item) => String(item._id) === String(id));
            if (!contact) return res.status(404).json({ error: 'Contact not found' });
            return res.json(contact);
        }

        const contact = await Contact.findById(id).lean();

        if (!contact) {
            return res.status(404).json({ error: 'Contact not found' });
        }

        res.json(contact);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch contact' });
    }
};

// Update contact status (admin)
exports.updateContactStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const validStatuses = ['new', 'read', 'replied'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ error: 'Invalid status' });
        }

        if (!isDatabaseReady()) {
            const store = readStore();
            const index = store.contacts.findIndex((item) => String(item._id) === String(id));
            if (index === -1) return res.status(404).json({ error: 'Contact not found' });
            store.contacts[index].status = status;
            writeStore(store);
            return res.json(store.contacts[index]);
        }

        const contact = await Contact.findByIdAndUpdate(id, { status }, { new: true });

        if (!contact) {
            return res.status(404).json({ error: 'Contact not found' });
        }

        res.json(contact);
    } catch (error) {
        res.status(400).json({ error: 'Failed to update contact' });
    }
};

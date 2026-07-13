const Razorpay = require('razorpay');

const keyId = process.env.RAZORPAY_KEY_ID || '';
const keySecret = process.env.RAZORPAY_KEY_SECRET || '';

if (!keyId || !keySecret) {
    console.warn('⚠️  RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET not set in .env — online payments will fail until configured.');
}

const razorpay = new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
});

module.exports = { razorpay, keyId };
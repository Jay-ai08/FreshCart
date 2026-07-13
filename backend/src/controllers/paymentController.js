const crypto = require('crypto');
const { razorpay, keyId } = require('../config/razorpayConfig');

function toNumber(value) {
    const number = Number(value);
    return Number.isFinite(number) ? number : 0;
}

// Create a Razorpay order for the given amount (in rupees).
// The frontend opens the Razorpay Checkout widget with the returned order id.
exports.createRazorpayOrder = async (req, res) => {
    try {
        const amount = toNumber(req.body.amount);

        if (amount <= 0) {
            return res.status(400).json({ error: 'Invalid amount' });
        }

        const options = {
            amount: Math.round(amount * 100), // Razorpay expects paise
            currency: 'INR',
            receipt: `rcpt_${Date.now()}`,
        };

        const order = await razorpay.orders.create(options);

        res.json({
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
            keyId,
        });
    } catch (error) {
        console.error('Razorpay order creation error:', error);
        res.status(500).json({ error: 'Failed to create payment order' });
    }
};

// Verify the payment signature Razorpay returns after a successful checkout.
// This MUST happen server-side — never trust a "payment succeeded" claim from the browser alone.
exports.verifyRazorpayPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return res.status(400).json({ error: 'Missing payment verification fields' });
        }

        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '')
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest('hex');

        const isValid = expectedSignature === razorpay_signature;

        if (!isValid) {
            return res.status(400).json({ verified: false, error: 'Payment signature verification failed' });
        }

        res.json({ verified: true, razorpay_payment_id, razorpay_order_id });
    } catch (error) {
        console.error('Razorpay verification error:', error);
        res.status(500).json({ error: 'Failed to verify payment' });
    }
};
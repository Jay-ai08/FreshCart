import { useState } from 'react';
import LinkButton from '../components/LinkButton';
import { formatPrice } from '../utils';
import { ordersAPI } from '../services/api';

function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem('user') || '{}');
  } catch {
    return {};
  }
}

export default function Checkout({ cartItems, totals, onNavigate, onPlaceOrder }) {
  const [placed, setPlaced] = useState(false);
  const [payment, setPayment] = useState('card');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [user] = useState(getStoredUser);
  const isLoggedIn = Boolean(user?._id && localStorage.getItem('authToken'));

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');

    if (!isLoggedIn) {
      setError('Please login before placing an order.');
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData(event.currentTarget);

      const orderData = {
        userId: user._id,
        email: user.email,
        items: cartItems.map((item) => ({
          productId: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
        })),
        deliveryDetails: {
          firstName: formData.get('firstName'),
          lastName: formData.get('lastName'),
          email: user.email,
          phone: formData.get('phone'),
          address: formData.get('address'),
          city: formData.get('city'),
          pincode: formData.get('pincode'),
          instructions: formData.get('instructions'),
        },
        paymentMethod: payment,
      };

      await ordersAPI.create(orderData);
      setPlaced(true);
      onPlaceOrder();
      event.currentTarget.reset();
    } catch (err) {
      setError(err.message || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  if (placed) {
    return (
      <main className="page-pad">
        <section className="order-success">
          <div>✅</div>
          <h1>Order placed successfully!</h1>
          <p>Thank you for shopping with FreshCart. Your fresh essentials will be delivered soon.</p>
          <div className="action-row center-actions">
            <LinkButton to="/orders" onNavigate={onNavigate} className="primary-button">View Orders</LinkButton>
            <LinkButton to="/" onNavigate={onNavigate} className="secondary-button">Back to Home</LinkButton>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="page-pad">
      <section className="checkout-head">
        <span className="section-pill">Secure checkout</span>
        <h1>Complete your order</h1>
        <p>Fast delivery, fresh essentials, and a smooth payment experience.</p>
      </section>

      {cartItems.length === 0 ? (
        <section className="empty-state">
          <div>🧺</div>
          <h2>No products selected</h2>
          <p>Add products to your cart before checkout.</p>
          <div className="action-row center-actions">
            <LinkButton to="/fruits-vegetables" onNavigate={onNavigate} className="primary-button">Shop Products</LinkButton>
            <LinkButton to="/orders" onNavigate={onNavigate} className="secondary-button">View Your Orders</LinkButton>
          </div>
        </section>
      ) : !isLoggedIn ? (
        <section className="empty-state">
          <div>🔐</div>
          <h2>Login required</h2>
          <p>Please login first so your order can be saved in the backend and shown in your order history.</p>
          <div className="action-row center-actions">
            <LinkButton to="/login" onNavigate={onNavigate} className="primary-button">Login</LinkButton>
            <LinkButton to="/signup" onNavigate={onNavigate} className="secondary-button">Create Account</LinkButton>
          </div>
        </section>
      ) : (
        <section className="checkout-layout">
          <form className="form-card" onSubmit={handleSubmit}>
            <h2>Delivery details</h2>
            <div className="form-grid two-cols">
              <label>First name<input type="text" name="firstName" defaultValue={user.name?.split(' ')[0] || ''} required /></label>
              <label>Last name<input type="text" name="lastName" defaultValue={user.name?.split(' ').slice(1).join(' ') || ''} /></label>
            </div>
            <label>Email<input type="email" name="email" value={user.email || ''} readOnly /></label>
            <label>Phone number<input type="tel" name="phone" defaultValue={user.phone || ''} required /></label>
            <label>Address<textarea name="address" rows="3" defaultValue={user.address || ''} required /></label>
            <div className="form-grid two-cols">
              <label>City<input type="text" name="city" defaultValue={user.city || ''} required /></label>
              <label>Pin code<input type="text" name="pincode" required /></label>
            </div>
            <label>Delivery instructions<textarea name="instructions" rows="3" placeholder="Optional" /></label>

            <h2>Payment method</h2>
            <div className="payment-options">
              {[
                ['card', 'Credit / Debit Card'],
                ['upi', 'UPI'],
                ['cod', 'Cash on Delivery'],
              ].map(([value, label]) => (
                <label key={value} className={payment === value ? 'selected' : ''}>
                  <input type="radio" name="payment" value={value} checked={payment === value} onChange={() => setPayment(value)} />
                  {label}
                </label>
              ))}
            </div>
            {error && <p className="error-text">{error}</p>}
            <button type="submit" className="primary-button full-width" disabled={loading}>
              {loading ? 'Placing Order...' : 'Place Order'}
            </button>
          </form>

          <aside className="summary-card">
            <h2>Order summary</h2>
            <div className="checkout-items">
              {cartItems.map((item) => (
                <div key={item.id} className="checkout-line">
                  <div><strong>{item.name}</strong><span>Qty: {item.quantity}</span></div>
                  <strong>{formatPrice(item.price * item.quantity)}</strong>
                </div>
              ))}
            </div>
            <div className="summary-row"><span>Subtotal</span><strong>{formatPrice(totals.subtotal)}</strong></div>
            <div className="summary-row"><span>Delivery</span><strong className="free-text">Free</strong></div>
            <div className="summary-row"><span>Tax</span><strong>{formatPrice(totals.tax)}</strong></div>
            <div className="summary-row summary-total"><span>Total</span><strong>{formatPrice(totals.total)}</strong></div>
            <LinkButton to="/cart" onNavigate={onNavigate} className="secondary-button full-width">Back to cart</LinkButton>
          </aside>
        </section>
      )}
    </main>
  );
}

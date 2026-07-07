import LinkButton from '../components/LinkButton';
import { FALLBACK_IMAGE, formatPrice, getAssetImage } from '../utils';

export default function Cart({ cartItems, onNavigate, onIncrease, onDecrease, onRemove, totals }) {
  return (
    <main className="cart-page">
      <section className="cart-header">
        <span className="section-pill">Shopping Cart</span>
        <h1>Your Shopping Cart</h1>
        <p>Review your items, update quantities, and proceed to secure checkout.</p>
      </section>

      {cartItems.length === 0 ? (
        <section className="empty-state">
          <div>🛒</div>
          <h2>Your cart is empty</h2>
          <p>Add fresh products from any category to start your order.</p>
          <LinkButton to="/fruits-vegetables" onNavigate={onNavigate} className="primary-button">Start Shopping</LinkButton>
          <LinkButton to="/orders" onNavigate={onNavigate} className="secondary-button">View Your Orders</LinkButton>
        </section>
      ) : (
        <section className="cart-layout">
          <div className="cart-items">
            {cartItems.map((item) => (
              <article className="cart-item" key={item.id}>
                <img src={getAssetImage(item.image)} alt={item.alt || item.name} onError={(event) => { event.currentTarget.src = FALLBACK_IMAGE; }} />
                <div className="cart-item-info">
                  <span>{item.tag}</span>
                  <h3>{item.name}</h3>
                  <p>{formatPrice(item.price)}</p>
                </div>
                <div className="quantity-control">
                  <button type="button" onClick={() => onDecrease(item.id)} aria-label={`Decrease ${item.name}`}>−</button>
                  <strong>{item.quantity}</strong>
                  <button type="button" onClick={() => onIncrease(item.id)} aria-label={`Increase ${item.name}`}>+</button>
                </div>
                <button type="button" className="remove-button" onClick={() => onRemove(item.id)}>Remove</button>
              </article>
            ))}
          </div>

          <OrderSummary totals={totals} itemCount={cartItems.length} onNavigate={onNavigate} />
        </section>
      )}
    </main>
  );
}

function OrderSummary({ totals, itemCount, onNavigate }) {
  return (
    <aside className="summary-card">
      <h2>Order Summary</h2>
      <div className="summary-row"><span>Subtotal ({itemCount} items)</span><strong>{formatPrice(totals.subtotal)}</strong></div>
      <div className="summary-row"><span>Delivery Charges</span><strong className="free-text">FREE</strong></div>
      <div className="summary-row"><span>Tax (GST 5%)</span><strong>{formatPrice(totals.tax)}</strong></div>
      <div className="summary-row summary-total"><span>Total Amount</span><strong>{formatPrice(totals.total)}</strong></div>
      <LinkButton to="/checkout" onNavigate={onNavigate} className="checkout-button">Proceed to Checkout →</LinkButton>
    </aside>
  );
}

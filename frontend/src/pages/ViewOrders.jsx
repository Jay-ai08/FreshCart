import { useEffect, useState } from 'react';
import LinkButton from '../components/LinkButton';
import { ordersAPI } from '../services/api';
import { formatPrice } from '../utils';

export default function ViewOrders({ onNavigate }) {
  function getStoredUser() {
    try {
      return JSON.parse(localStorage.getItem('user') || 'null');
    } catch {
      return null;
    }
  }

  const [currentUser] = useState(getStoredUser);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(() => Boolean(getStoredUser()?._id && localStorage.getItem('authToken')));
  const [error, setError] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    if (!currentUser?._id || !localStorage.getItem('authToken')) return undefined;

    let active = true;

    async function fetchOrders() {
      try {
        const data = await ordersAPI.getUserOrders(currentUser._id);
        if (!active) return;
        setOrders(Array.isArray(data) ? data : []);
        setError('');
      } catch (err) {
        if (!active) return;
        console.error('Error loading orders:', err);
        setError(err.message || 'Failed to load orders');
        setOrders([]);
      } finally {
        if (active) setLoading(false);
      }
    }

    fetchOrders();
    return () => {
      active = false;
    };
  }, [currentUser?._id]);


  function getStatusColor(status) {
    switch (status) {
      case 'pending':
        return '#f59e0b';
      case 'confirmed':
        return '#3b82f6';
      case 'shipped':
        return '#8b5cf6';
      case 'delivered':
        return '#10b981';
      case 'cancelled':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  }

  function getStatusEmoji(status) {
    switch (status) {
      case 'pending':
        return '⏳';
      case 'confirmed':
        return '✅';
      case 'shipped':
        return '📦';
      case 'delivered':
        return '🎉';
      case 'cancelled':
        return '❌';
      default:
        return '❓';
    }
  }

  if (loading) {
    return (
      <main className="page-pad">
        <section className="orders-section">
          <p>Loading your orders...</p>
        </section>
      </main>
    );
  }

  if (!currentUser?._id) {
    return (
      <main className="page-pad">
        <section className="empty-state">
          <div>🔐</div>
          <h2>Please login first</h2>
          <p>You need to be logged in to view your orders.</p>
          <LinkButton to="/login" onNavigate={onNavigate} className="primary-button">
            Go to Login
          </LinkButton>
        </section>
      </main>
    );
  }

  return (
    <main className="page-pad">
      <section className="orders-header">
        <span className="section-pill">📋 My Orders</span>
        <h1>Your Order History</h1>
        <p>View and track all your orders</p>
      </section>

      {error && <div className="error-banner">{error}</div>}

      <section className="orders-section">
        {orders.length === 0 ? (
          <div className="empty-state">
            <div>📦</div>
            <h2>No orders yet</h2>
            <p>Start shopping to place your first order</p>
            <LinkButton to="/fruits-vegetables" onNavigate={onNavigate} className="primary-button">
              Start Shopping
            </LinkButton>
          </div>
        ) : (
          <div className="orders-container">
            {/* Orders List */}
            <div className="orders-list">
              {orders.map((order) => (
                <div
                  key={order._id}
                  className="order-card"
                  onClick={() => setSelectedOrder(selectedOrder?._id === order._id ? null : order)}
                >
                  <div className="order-header">
                    <div className="order-info">
                      <h3>{order.orderId}</h3>
                      <p className="order-date">
                        {new Date(order.createdAt).toLocaleDateString('en-IN', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                    <div className="order-status" style={{ borderColor: getStatusColor(order.status) }}>
                      <span style={{ color: getStatusColor(order.status) }}>
                        {getStatusEmoji(order.status)} {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </div>
                    <div className="order-amount">
                      <span className="total-label">Total</span>
                      <span className="total-price">{formatPrice(order.total)}</span>
                    </div>
                    <button className="expand-btn">
                      {selectedOrder?._id === order._id ? '▲' : '▼'}
                    </button>
                  </div>

                  {selectedOrder?._id === order._id && (
                    <div className="order-details">
                      <div className="details-grid">
                        <div className="detail-section">
                          <h4>Delivery Details</h4>
                          <p><strong>Name:</strong> {order.deliveryDetails.firstName} {order.deliveryDetails.lastName}</p>
                          <p><strong>Phone:</strong> {order.deliveryDetails.phone}</p>
                          <p><strong>Address:</strong> {order.deliveryDetails.address}</p>
                          <p><strong>City:</strong> {order.deliveryDetails.city}</p>
                          <p><strong>Pincode:</strong> {order.deliveryDetails.pincode}</p>
                          {order.deliveryDetails.instructions && (
                            <p><strong>Instructions:</strong> {order.deliveryDetails.instructions}</p>
                          )}
                        </div>

                        <div className="detail-section">
                          <h4>Payment Details</h4>
                          <p><strong>Method:</strong> {order.paymentMethod.toUpperCase()}</p>
                          <p><strong>Items Count:</strong> {order.items.length}</p>
                          <p><strong>Subtotal:</strong> {formatPrice(order.subtotal)}</p>
                          <p><strong>Tax (5%):</strong> {formatPrice(order.tax)}</p>
                          <p><strong>Total:</strong> {formatPrice(order.total)}</p>
                        </div>
                      </div>

                      <div className="items-section">
                        <h4>Items ({order.items.length})</h4>
                        <div className="items-list">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="order-item">
                              <div className="item-info">
                                <p className="item-name">{item.name}</p>
                                <p className="item-qty">Quantity: {item.quantity}</p>
                              </div>
                              <div className="item-price">
                                <p>{formatPrice(item.price)}</p>
                                <p className="item-total">× {item.quantity} = {formatPrice(item.price * item.quantity)}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="timeline">
                        <h4>Order Timeline</h4>
                        <div className="timeline-items">
                          <div className="timeline-item completed">
                            <div className="timeline-marker"></div>
                            <div className="timeline-content">
                              <p className="timeline-title">Order Placed</p>
                              <p className="timeline-date">{new Date(order.createdAt).toLocaleString('en-IN')}</p>
                            </div>
                          </div>
                          <div className={`timeline-item ${['confirmed', 'shipped', 'delivered'].includes(order.status) ? 'completed' : ''}`}>
                            <div className="timeline-marker"></div>
                            <div className="timeline-content">
                              <p className="timeline-title">Order Confirmed</p>
                              <p className="timeline-date">Within 24 hours</p>
                            </div>
                          </div>
                          <div className={`timeline-item ${['shipped', 'delivered'].includes(order.status) ? 'completed' : ''}`}>
                            <div className="timeline-marker"></div>
                            <div className="timeline-content">
                              <p className="timeline-title">Out for Delivery</p>
                              <p className="timeline-date">2-3 days</p>
                            </div>
                          </div>
                          <div className={`timeline-item ${order.status === 'delivered' ? 'completed' : ''}`}>
                            <div className="timeline-marker"></div>
                            <div className="timeline-content">
                              <p className="timeline-title">Delivered</p>
                              <p className="timeline-date">Expected soon</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Stats Sidebar */}
            <div className="orders-sidebar">
              <div className="stat-card">
                <h3>📊 Order Stats</h3>
                <div className="stat-item">
                  <span>Total Orders</span>
                  <strong>{orders.length}</strong>
                </div>
                <div className="stat-item">
                  <span>Pending</span>
                  <strong>{orders.filter(o => o.status === 'pending').length}</strong>
                </div>
                <div className="stat-item">
                  <span>Shipped</span>
                  <strong>{orders.filter(o => ['confirmed', 'shipped'].includes(o.status)).length}</strong>
                </div>
                <div className="stat-item">
                  <span>Delivered</span>
                  <strong>{orders.filter(o => o.status === 'delivered').length}</strong>
                </div>
              </div>

              <div className="stat-card">
                <h3>💰 Total Spent</h3>
                <p className="total-spent">
                  {formatPrice(orders.reduce((sum, o) => sum + o.total, 0))}
                </p>
                <p className="spent-note">
                  Across {orders.length} {orders.length === 1 ? 'order' : 'orders'}
                </p>
              </div>

              <div className="stat-card">
                <h3>🛍️ Quick Links</h3>
                <LinkButton to="/" onNavigate={onNavigate} className="link-button">Continue Shopping</LinkButton>
                <LinkButton to="/profile" onNavigate={onNavigate} className="link-button">My Profile</LinkButton>
              </div>
            </div>
          </div>
        )}
      </section>

      <style>{`
        .error-banner {
          background-color: #fee;
          color: #c33;
          padding: 12px 16px;
          border-radius: 8px;
          margin-bottom: 20px;
          border-left: 4px solid #c33;
        }

        .orders-header {
          margin-bottom: 30px;
        }

        .orders-header h1 {
          font-size: 2.5rem;
          margin: 15px 0;
        }

        .orders-section {
          margin-bottom: 40px;
        }

        .orders-container {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(260px, 320px);
          gap: 30px;
          align-items: start;
        }

        @media (max-width: 1024px) {
          .orders-container {
            grid-template-columns: 1fr;
          }

          .orders-sidebar {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
          }
        }

        .orders-list {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .order-card {
          background: white;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          overflow: hidden;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .order-card:hover {
          box-shadow: 0 4px 16px rgba(0,0,0,0.15);
          transform: translateY(-2px);
        }

        .order-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px;
          border-bottom: 1px solid #f0f0f0;
          gap: 15px;
        }

        .order-info h3 {
          margin: 0 0 5px 0;
          font-size: 16px;
          font-weight: 600;
        }

        .order-date {
          margin: 0;
          font-size: 13px;
          color: #999;
        }

        .order-status {
          padding: 6px 12px;
          border-radius: 6px;
          border: 2px solid;
          font-weight: 500;
          font-size: 13px;
          white-space: nowrap;
        }

        .order-amount {
          text-align: right;
        }

        .total-label {
          display: block;
          font-size: 12px;
          color: #999;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .total-price {
          display: block;
          font-size: 18px;
          font-weight: 700;
          color: #333;
        }

        .expand-btn {
          background: none;
          border: none;
          font-size: 20px;
          cursor: pointer;
          color: #667eea;
          padding: 0 5px;
        }

        .order-details {
          padding: 20px;
          background: #f9f9f9;
          border-top: 1px solid #f0f0f0;
        }

        .details-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 20px;
          margin-bottom: 20px;
        }

        .detail-section h4 {
          margin: 0 0 12px 0;
          font-size: 14px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: #333;
        }

        .detail-section p {
          margin: 8px 0;
          font-size: 14px;
          color: #666;
        }

        .detail-section strong {
          color: #333;
        }

        .items-section {
          margin: 20px 0;
          padding: 15px;
          background: white;
          border-radius: 8px;
        }

        .items-section h4 {
          margin: 0 0 12px 0;
          font-size: 14px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .items-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .order-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px;
          background: #f9f9f9;
          border-radius: 6px;
        }

        .item-name {
          margin: 0 0 4px 0;
          font-weight: 500;
          color: #333;
        }

        .item-qty {
          margin: 0;
          font-size: 13px;
          color: #999;
        }

        .item-price {
          text-align: right;
        }

        .item-price p {
          margin: 0;
          font-weight: 500;
          color: #333;
        }

        .item-total {
          font-size: 12px;
          color: #999;
          margin-top: 4px !important;
        }

        .timeline {
          margin-top: 20px;
          padding: 15px;
          background: white;
          border-radius: 8px;
        }

        .timeline h4 {
          margin: 0 0 15px 0;
          font-size: 14px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .timeline-items {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .timeline-item {
          display: flex;
          gap: 15px;
          opacity: 0.5;
        }

        .timeline-item.completed {
          opacity: 1;
        }

        .timeline-marker {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #ddd;
          margin-top: 4px;
          flex-shrink: 0;
        }

        .timeline-item.completed .timeline-marker {
          background: #10b981;
        }

        .timeline-title {
          margin: 0 0 4px 0;
          font-weight: 500;
          color: #333;
        }

        .timeline-date {
          margin: 0;
          font-size: 13px;
          color: #999;
        }

        .orders-sidebar {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .stat-card {
          background: white;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          padding: 20px;
        }

        .stat-card h3 {
          margin: 0 0 15px 0;
          font-size: 16px;
        }

        .stat-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 0;
          border-bottom: 1px solid #f0f0f0;
        }

        .stat-item:last-child {
          border-bottom: none;
        }

        .stat-item span {
          color: #666;
          font-size: 14px;
        }

        .stat-item strong {
          font-weight: 600;
          color: #333;
          font-size: 16px;
        }

        .total-spent {
          font-size: 28px;
          font-weight: 700;
          color: #667eea;
          margin: 10px 0 5px 0;
        }

        .spent-note {
          margin: 0;
          font-size: 13px;
          color: #999;
        }

        .link-button {
          display: block;
          padding: 10px 0;
          color: #667eea;
          text-decoration: none;
          font-weight: 500;
          transition: all 0.2s;
          border-bottom: 1px solid #f0f0f0;
        }

        .link-button:hover {
          color: #5568d3;
          padding-left: 5px;
        }

        .link-button:last-child {
          border-bottom: none;
        }

        .empty-state {
          grid-column: 1 / -1;
        }

        @media (max-width: 640px) {
          .orders-header h1 {
            font-size: clamp(1.8rem, 9vw, 2.2rem);
          }

          .order-header {
            display: grid;
            grid-template-columns: 1fr auto;
            align-items: start;
            padding: 16px;
          }

          .order-status,
          .order-amount {
            text-align: left;
          }

          .order-status,
          .order-amount,
          .expand-btn {
            grid-column: 1 / -1;
          }

          .details-grid {
            grid-template-columns: 1fr;
          }

          .order-item {
            align-items: flex-start;
            flex-direction: column;
          }

          .item-price {
            text-align: left;
          }
        }

      `}</style>
    </main>
  );
}

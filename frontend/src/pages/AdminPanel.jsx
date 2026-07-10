import { useEffect, useMemo, useState } from 'react';
import LinkButton from '../components/LinkButton';
import { categories, productsByCategory } from '../data/products';
import { ordersAPI } from '../services/api';
import { formatPrice, getAssetImage } from '../utils';

const ORDER_STATUSES = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];

function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem('user') || 'null');
  } catch {
    return null;
  }
}

function statusLabel(status) {
  return String(status || 'pending').charAt(0).toUpperCase() + String(status || 'pending').slice(1);
}

export default function AdminPanel({ onNavigate }) {
  const [user] = useState(getStoredUser);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(Boolean(localStorage.getItem('authToken')));
  const [error, setError] = useState('');
  const [orderFilter, setOrderFilter] = useState('all');
  const [productFilter, setProductFilter] = useState('all');
  const [updatingOrderId, setUpdatingOrderId] = useState('');
  const isLoggedIn = Boolean(user?._id && localStorage.getItem('authToken'));

  const products = useMemo(
    () => categories.flatMap((category) => (
      productsByCategory[category.slug] || []
    ).map((product) => ({ ...product, categoryTitle: category.title }))),
    []
  );

  const filteredProducts = productFilter === 'all'
    ? products
    : products.filter((product) => product.category === productFilter);

  const filteredOrders = orderFilter === 'all'
    ? orders
    : orders.filter((order) => order.status === orderFilter);

  const metrics = useMemo(() => {
    const revenue = orders.reduce((sum, order) => sum + Number(order.total || 0), 0);
    return {
      products: products.length,
      categories: categories.length,
      orders: orders.length,
      revenue,
      pending: orders.filter((order) => order.status === 'pending').length,
      delivered: orders.filter((order) => order.status === 'delivered').length,
    };
  }, [orders, products.length]);

  useEffect(() => {
    if (!isLoggedIn) {
      setLoading(false);
      return undefined;
    }

    let active = true;

    async function loadOrders() {
      try {
        const data = await ordersAPI.getAll();
        if (!active) return;
        setOrders(Array.isArray(data) ? data : []);
        setError('');
      } catch (err) {
        if (!active) return;
        setError(err.message || 'Failed to load admin orders.');
        setOrders([]);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadOrders();
    return () => {
      active = false;
    };
  }, [isLoggedIn]);

  async function handleStatusChange(orderId, status) {
    setUpdatingOrderId(orderId);
    setError('');

    try {
      const updatedOrder = await ordersAPI.updateStatus(orderId, status);
      setOrders((current) => current.map((order) => (
        order.orderId === orderId ? { ...order, ...updatedOrder } : order
      )));
    } catch (err) {
      setError(err.message || 'Could not update order status.');
    } finally {
      setUpdatingOrderId('');
    }
  }

  if (!isLoggedIn) {
    return (
      <main className="page-pad">
        <section className="empty-state">
          <div>Admin</div>
          <h1>Login required</h1>
          <p>Please login first to open the FreshCart admin panel.</p>
          <div className="action-row center-actions">
            <LinkButton to="/login" onNavigate={onNavigate} className="primary-button">Login</LinkButton>
            <LinkButton to="/" onNavigate={onNavigate} className="secondary-button">Back to Home</LinkButton>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="page-pad admin-page">
      <section className="admin-hero">
        <div>
          <span className="section-pill">Admin Panel</span>
          <h1>FreshCart Control Center</h1>
          <p>Manage catalog visibility, review orders, and update delivery status from one workspace.</p>
        </div>
        <div className="admin-user-card">
          <span>Signed in as</span>
          <strong>{user.name || 'FreshCart Admin'}</strong>
          <small>{user.email}</small>
        </div>
      </section>

      {error && <div className="error-banner">{error}</div>}

      <section className="admin-metrics">
        <article><span>Total Products</span><strong>{metrics.products}</strong></article>
        <article><span>Categories</span><strong>{metrics.categories}</strong></article>
        <article><span>Orders</span><strong>{loading ? '...' : metrics.orders}</strong></article>
        <article><span>Revenue</span><strong>{loading ? '...' : formatPrice(metrics.revenue)}</strong></article>
        <article><span>Pending</span><strong>{loading ? '...' : metrics.pending}</strong></article>
        <article><span>Delivered</span><strong>{loading ? '...' : metrics.delivered}</strong></article>
      </section>

      <section className="admin-grid">
        <div className="admin-panel-block">
          <div className="admin-block-head">
            <div>
              <h2>Product Inventory</h2>
              <p>{filteredProducts.length} items visible</p>
            </div>
            <select value={productFilter} onChange={(event) => setProductFilter(event.target.value)}>
              <option value="all">All categories</option>
              {categories.map((category) => (
                <option key={category.slug} value={category.slug}>{category.title}</option>
              ))}
            </select>
          </div>

          <div className="admin-table product-admin-table">
            <div className="admin-table-row admin-table-head">
              <span>Product</span>
              <span>Category</span>
              <span>Price</span>
              <span>Status</span>
            </div>
            {filteredProducts.map((product) => (
              <div className="admin-table-row" key={product.id}>
                <span className="admin-product-cell">
                  <img src={getAssetImage(product.image)} alt={product.alt || product.name} />
                  <span>
                    <strong>{product.name}</strong>
                    <small>{product.tag}</small>
                  </span>
                </span>
                <span>{product.categoryTitle}</span>
                <span>{formatPrice(product.price)}</span>
                <span><mark>Active</mark></span>
              </div>
            ))}
          </div>
        </div>

        <aside className="admin-panel-block category-admin-block">
          <div className="admin-block-head">
            <div>
              <h2>Categories</h2>
              <p>Current shopping aisles</p>
            </div>
          </div>
          <div className="admin-category-list">
            {categories.map((category) => (
              <LinkButton
                key={category.slug}
                to={`/${category.slug}`}
                onNavigate={onNavigate}
                className="admin-category-item"
              >
                <span>
                  <strong>{category.title}</strong>
                  <small>{category.subtitle}</small>
                </span>
                <b>{productsByCategory[category.slug]?.length || 0}</b>
              </LinkButton>
            ))}
          </div>
        </aside>
      </section>

      <section className="admin-panel-block">
        <div className="admin-block-head">
          <div>
            <h2>Order Management</h2>
            <p>{loading ? 'Loading orders...' : `${filteredOrders.length} orders shown`}</p>
          </div>
          <select value={orderFilter} onChange={(event) => setOrderFilter(event.target.value)}>
            <option value="all">All statuses</option>
            {ORDER_STATUSES.map((status) => (
              <option key={status} value={status}>{statusLabel(status)}</option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="admin-empty">Loading orders...</div>
        ) : filteredOrders.length === 0 ? (
          <div className="admin-empty">No orders found yet.</div>
        ) : (
          <div className="admin-table order-admin-table">
            <div className="admin-table-row admin-table-head">
              <span>Order</span>
              <span>Customer</span>
              <span>Total</span>
              <span>Status</span>
              <span>Placed</span>
            </div>
            {filteredOrders.map((order) => (
              <div className="admin-table-row" key={order.orderId}>
                <span>
                  <strong>{order.orderId}</strong>
                  <small>{order.items?.length || 0} items</small>
                </span>
                <span>
                  <strong>{order.deliveryDetails?.firstName || 'Customer'} {order.deliveryDetails?.lastName || ''}</strong>
                  <small>{order.email}</small>
                </span>
                <span>{formatPrice(order.total)}</span>
                <span>
                  <select
                    value={order.status || 'pending'}
                    disabled={updatingOrderId === order.orderId}
                    onChange={(event) => handleStatusChange(order.orderId, event.target.value)}
                  >
                    {ORDER_STATUSES.map((status) => (
                      <option key={status} value={status}>{statusLabel(status)}</option>
                    ))}
                  </select>
                </span>
                <span>{order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-IN') : 'Today'}</span>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

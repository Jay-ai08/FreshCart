import { useEffect, useMemo, useState } from 'react';
import LinkButton from '../components/LinkButton';
import { categories } from '../data/products';
import { contactAPI, ordersAPI, productsAPI } from '../services/api';
import { formatPrice } from '../utils';

const ORDER_STATUSES = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
const CONTACT_STATUSES = ['new', 'read', 'replied'];

const emptyProduct = {
  id: '',
  name: '',
  tag: '',
  desc: '',
  price: '',
  image: '',
  alt: '',
  category: categories[0]?.slug || 'fruits-vegetables',
  inStock: true,
};

function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem('user') || 'null');
  } catch {
    return null;
  }
}

function createSlug(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export default function Admin({ onNavigate }) {
  const [user] = useState(getStoredUser);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [productForm, setProductForm] = useState(emptyProduct);
  const [editingProductId, setEditingProductId] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    if (!isAdmin || !localStorage.getItem('authToken')) {
      return undefined;
    }

    let active = true;

    async function loadAdminData() {
      setLoading(true);
      setError('');
      try {
        const [productData, orderData, contactData] = await Promise.all([
          productsAPI.getAll(),
          ordersAPI.getAll(),
          contactAPI.getAll(),
        ]);

        if (!active) return;
        setProducts(Array.isArray(productData) ? productData : []);
        setOrders(Array.isArray(orderData) ? orderData : []);
        setContacts(Array.isArray(contactData) ? contactData : []);
      } catch (err) {
        if (active) setError(err.message || 'Failed to load admin data');
      } finally {
        if (active) setLoading(false);
      }
    }

    loadAdminData();
    return () => {
      active = false;
    };
  }, [isAdmin]);

  const stats = useMemo(() => {
    const revenue = orders.reduce((sum, order) => sum + Number(order.total || 0), 0);
    return {
      products: products.length,
      orders: orders.length,
      pendingOrders: orders.filter((order) => order.status === 'pending').length,
      revenue,
      messages: contacts.filter((contact) => contact.status === 'new').length,
      outOfStock: products.filter((product) => product.inStock === false).length,
    };
  }, [contacts, orders, products]);

  function showMessage(text) {
    setMessage(text);
    window.setTimeout(() => setMessage(''), 2200);
  }

  function handleProductChange(event) {
    const { name, value, type, checked } = event.target;
    setProductForm((form) => ({
      ...form,
      [name]: type === 'checkbox' ? checked : value,
    }));
  }

  function startEditProduct(product) {
    setEditingProductId(product.id);
    setProductForm({
      id: product.id || '',
      name: product.name || '',
      tag: product.tag || '',
      desc: product.desc || '',
      price: product.price || '',
      image: product.image || '',
      alt: product.alt || '',
      category: product.category || emptyProduct.category,
      inStock: product.inStock !== false,
    });
    setActiveTab('products');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function resetProductForm() {
    setProductForm(emptyProduct);
    setEditingProductId('');
  }

  async function handleSaveProduct(event) {
    event.preventDefault();
    setSaving(true);
    setError('');

    const payload = {
      ...productForm,
      id: productForm.id || createSlug(productForm.name),
      price: Number(productForm.price),
      alt: productForm.alt || productForm.name,
    };

    try {
      const savedProduct = editingProductId
        ? await productsAPI.update(editingProductId, payload)
        : await productsAPI.create(payload);

      setProducts((items) => {
        if (editingProductId) {
          return items.map((item) => (item.id === editingProductId ? savedProduct : item));
        }
        return [savedProduct, ...items];
      });
      resetProductForm();
      showMessage(editingProductId ? 'Product updated' : 'Product added');
    } catch (err) {
      setError(err.message || 'Failed to save product');
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteProduct(productId) {
    const confirmed = window.confirm('Delete this product from FreshCart?');
    if (!confirmed) return;

    setError('');
    try {
      await productsAPI.remove(productId);
      setProducts((items) => items.filter((item) => item.id !== productId));
      if (editingProductId === productId) resetProductForm();
      showMessage('Product deleted');
    } catch (err) {
      setError(err.message || 'Failed to delete product');
    }
  }

  async function handleOrderStatus(orderId, status) {
    setError('');
    try {
      const updatedOrder = await ordersAPI.updateStatus(orderId, status);
      setOrders((items) => items.map((item) => (item.orderId === orderId ? updatedOrder : item)));
      showMessage('Order status updated');
    } catch (err) {
      setError(err.message || 'Failed to update order');
    }
  }

  async function handleContactStatus(contactId, status) {
    setError('');
    try {
      const updatedContact = await contactAPI.updateStatus(contactId, status);
      setContacts((items) => items.map((item) => (item._id === contactId ? updatedContact : item)));
      showMessage('Message status updated');
    } catch (err) {
      setError(err.message || 'Failed to update message');
    }
  }

  if (!isAdmin) {
    return (
      <main className="page-pad">
        <section className="empty-state">
          <div>Admin</div>
          <h1>Admin access required</h1>
          <p>Login with an admin account to manage products, orders, and customer messages.</p>
          <LinkButton to="/login" onNavigate={onNavigate} className="primary-button">Go to Login</LinkButton>
        </section>
      </main>
    );
  }

  return (
    <main className="admin-page">
      <section className="admin-header">
        <div>
          <span className="section-pill">FreshCart Admin</span>
          <h1>Operations Panel</h1>
          <p>Manage products, customer orders, and support messages from one focused workspace.</p>
        </div>
        <div className="admin-user">
          <span>{user.name}</span>
          <strong>{user.email}</strong>
        </div>
      </section>

      <section className="admin-tabs" aria-label="Admin sections">
        {['dashboard', 'products', 'orders', 'messages'].map((tab) => (
          <button
            key={tab}
            type="button"
            className={activeTab === tab ? 'active' : ''}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </section>

      {error && <p className="error-text admin-alert">{error}</p>}
      {message && <p className="success-text admin-alert">{message}</p>}

      {loading ? (
        <section className="admin-panel">
          <p>Loading admin data...</p>
        </section>
      ) : (
        <>
          {activeTab === 'dashboard' && <Dashboard stats={stats} orders={orders} contacts={contacts} />}
          {activeTab === 'products' && (
            <ProductsAdmin
              form={productForm}
              editingProductId={editingProductId}
              products={products}
              saving={saving}
              onChange={handleProductChange}
              onSave={handleSaveProduct}
              onCancel={resetProductForm}
              onEdit={startEditProduct}
              onDelete={handleDeleteProduct}
            />
          )}
          {activeTab === 'orders' && <OrdersAdmin orders={orders} onStatusChange={handleOrderStatus} />}
          {activeTab === 'messages' && <MessagesAdmin contacts={contacts} onStatusChange={handleContactStatus} />}
        </>
      )}
    </main>
  );
}

function Dashboard({ stats, orders, contacts }) {
  const recentOrders = orders.slice(0, 5);
  const recentContacts = contacts.slice(0, 4);

  return (
    <section className="admin-grid">
      <div className="admin-stat"><span>Total Revenue</span><strong>{formatPrice(stats.revenue)}</strong></div>
      <div className="admin-stat"><span>Orders</span><strong>{stats.orders}</strong></div>
      <div className="admin-stat"><span>Pending Orders</span><strong>{stats.pendingOrders}</strong></div>
      <div className="admin-stat"><span>Products</span><strong>{stats.products}</strong></div>
      <div className="admin-stat"><span>New Messages</span><strong>{stats.messages}</strong></div>
      <div className="admin-stat"><span>Out of Stock</span><strong>{stats.outOfStock}</strong></div>

      <div className="admin-panel wide">
        <h2>Recent Orders</h2>
        <AdminTable emptyText="No orders yet">
          {recentOrders.map((order) => (
            <tr key={order._id || order.orderId}>
              <td>{order.orderId}</td>
              <td>{order.email}</td>
              <td>{order.status}</td>
              <td>{formatPrice(order.total)}</td>
            </tr>
          ))}
        </AdminTable>
      </div>

      <div className="admin-panel">
        <h2>Latest Messages</h2>
        <div className="admin-list">
          {recentContacts.length === 0 ? <p>No messages yet</p> : recentContacts.map((contact) => (
            <article key={contact._id}>
              <strong>{contact.subject}</strong>
              <span>{contact.name} - {contact.status}</span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProductsAdmin({ form, editingProductId, products, saving, onChange, onSave, onCancel, onEdit, onDelete }) {
  return (
    <section className="admin-layout">
      <form className="admin-panel admin-form" onSubmit={onSave}>
        <h2>{editingProductId ? 'Edit Product' : 'Add Product'}</h2>
        <div className="form-grid two-cols">
          <label>Product ID<input name="id" value={form.id} onChange={onChange} placeholder="apple-fresh" /></label>
          <label>Name<input name="name" value={form.name} onChange={onChange} required /></label>
        </div>
        <label>Description<textarea name="desc" value={form.desc} onChange={onChange} rows="3" required /></label>
        <div className="form-grid two-cols">
          <label>Price<input name="price" type="number" min="0" value={form.price} onChange={onChange} required /></label>
          <label>Tag<input name="tag" value={form.tag} onChange={onChange} placeholder="Fresh" /></label>
        </div>
        <div className="form-grid two-cols">
          <label>Category
            <select name="category" value={form.category} onChange={onChange}>
              {categories.map((category) => <option key={category.slug} value={category.slug}>{category.title}</option>)}
            </select>
          </label>
          <label>Image path<input name="image" value={form.image} onChange={onChange} placeholder="Fruits&Vegetables/apple.jpeg" required /></label>
        </div>
        <label>Alt text<input name="alt" value={form.alt} onChange={onChange} /></label>
        <label className="checkbox-label"><input name="inStock" type="checkbox" checked={form.inStock} onChange={onChange} /> In stock</label>
        <div className="action-row">
          <button type="submit" className="primary-button" disabled={saving}>{saving ? 'Saving...' : 'Save Product'}</button>
          {editingProductId && <button type="button" className="secondary-button" onClick={onCancel}>Cancel</button>}
        </div>
      </form>

      <div className="admin-panel">
        <h2>Products</h2>
        <AdminTable emptyText="No products found">
          {products.map((product) => (
            <tr key={product.id}>
              <td>
                <strong>{product.name}</strong>
                <span>{product.id}</span>
              </td>
              <td>{product.category}</td>
              <td>{formatPrice(product.price)}</td>
              <td>{product.inStock === false ? 'Out' : 'In'}</td>
              <td className="admin-actions">
                <button type="button" onClick={() => onEdit(product)}>Edit</button>
                <button type="button" className="danger" onClick={() => onDelete(product.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </AdminTable>
      </div>
    </section>
  );
}

function OrdersAdmin({ orders, onStatusChange }) {
  return (
    <section className="admin-panel">
      <h2>Orders</h2>
      <AdminTable emptyText="No orders yet">
        {orders.map((order) => (
          <tr key={order._id || order.orderId}>
            <td>
              <strong>{order.orderId}</strong>
              <span>{new Date(order.createdAt).toLocaleString('en-IN')}</span>
            </td>
            <td>
              <strong>{order.deliveryDetails?.firstName} {order.deliveryDetails?.lastName}</strong>
              <span>{order.email}</span>
            </td>
            <td>{order.items?.length || 0} items</td>
            <td>{formatPrice(order.total)}</td>
            <td>
              <select value={order.status} onChange={(event) => onStatusChange(order.orderId, event.target.value)}>
                {ORDER_STATUSES.map((status) => <option key={status} value={status}>{status}</option>)}
              </select>
            </td>
          </tr>
        ))}
      </AdminTable>
    </section>
  );
}

function MessagesAdmin({ contacts, onStatusChange }) {
  return (
    <section className="admin-panel">
      <h2>Customer Messages</h2>
      <div className="message-list">
        {contacts.length === 0 ? <p>No messages yet</p> : contacts.map((contact) => (
          <article key={contact._id} className="message-item">
            <div>
              <strong>{contact.subject}</strong>
              <span>{contact.name} - {contact.email} - {contact.phone}</span>
              <p>{contact.message}</p>
            </div>
            <select value={contact.status} onChange={(event) => onStatusChange(contact._id, event.target.value)}>
              {CONTACT_STATUSES.map((status) => <option key={status} value={status}>{status}</option>)}
            </select>
          </article>
        ))}
      </div>
    </section>
  );
}

function AdminTable({ children, emptyText }) {
  const rows = Array.isArray(children) ? children.filter(Boolean) : children;
  const isEmpty = Array.isArray(rows) && rows.length === 0;

  if (isEmpty) return <p>{emptyText}</p>;

  return (
    <div className="admin-table-wrap">
      <table className="admin-table">
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

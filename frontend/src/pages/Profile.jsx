import { useEffect, useState } from 'react';
import LinkButton from '../components/LinkButton';
import { usersAPI } from '../services/api';
import { notifyAuthChanged } from '../utils';

export default function Profile({ onNavigate }) {
  function getStoredUser() {
    try {
      return JSON.parse(localStorage.getItem('user') || 'null');
    } catch {
      return null;
    }
  }

  const [user, setUser] = useState(getStoredUser);
  const [loading, setLoading] = useState(() => Boolean(getStoredUser()?._id && localStorage.getItem('authToken')));
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState(() => getStoredUser() || {});

  useEffect(() => {
    if (!user?._id || !localStorage.getItem('authToken')) return undefined;

    let active = true;

    async function refreshProfile() {
      try {
        const latestUser = await usersAPI.getProfile(user._id);
        if (!active) return;
        setUser(latestUser);
        setFormData(latestUser);
        localStorage.setItem('user', JSON.stringify(latestUser));
        notifyAuthChanged();
        setError('');
      } catch (profileError) {
        console.warn('Using cached profile because backend profile fetch failed:', profileError);
      } finally {
        if (active) setLoading(false);
      }
    }

    refreshProfile();
    return () => {
      active = false;
    };
  }, [user?._id]);

  async function handleUpdate(e) {
    e.preventDefault();
    try {
      setLoading(true);
      if (user._id) {
        const response = await usersAPI.updateProfile(user._id, formData);
        const updatedUser = { ...user, ...response.user };
        setUser(updatedUser);
        setFormData(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        notifyAuthChanged();
        setEditing(false);
        setError('');
      }
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  }

  function handleInputChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  }

  function handleLogout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    notifyAuthChanged();
    onNavigate('/');
  }


  if (loading) {
    return (
      <main className="page-pad">
        <section className="profile-section">
          <p>Loading profile...</p>
        </section>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="page-pad">
        <section className="empty-state">
          <div>🔐</div>
          <h2>Please login first</h2>
          <p>You need to be logged in to view your profile.</p>
          <LinkButton to="/login" onNavigate={onNavigate} className="primary-button">
            Go to Login
          </LinkButton>
        </section>
      </main>
    );
  }

  return (
    <main className="page-pad">
      <section className="profile-header">
        <span className="section-pill">👤 My Profile</span>
        <h1>Welcome, {user.name}!</h1>
        <p>Manage your account information and preferences</p>
      </section>

      {error && <div className="error-banner">{error}</div>}

      <section className="profile-section">
        <div className="profile-card">
          <div className="profile-header-content">
            <div className="profile-avatar">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="profile-info">
              <h2>{user.name}</h2>
              <p>{user.email}</p>
            </div>
          </div>

          {!editing ? (
            <div className="profile-content">
              <div className="info-grid">
                <div className="info-item">
                  <label>Full Name</label>
                  <p>{user.name || '-'}</p>
                </div>
                <div className="info-item">
                  <label>Email</label>
                  <p>{user.email || '-'}</p>
                </div>
                <div className="info-item">
                  <label>Phone</label>
                  <p>{user.phone || '-'}</p>
                </div>
                <div className="info-item">
                  <label>City</label>
                  <p>{user.city || '-'}</p>
                </div>
                <div className="info-item">
                  <label>Address</label>
                  <p>{user.address || '-'}</p>
                </div>
                <div className="info-item">
                  <label>Member Since</label>
                  <p>{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '-'}</p>
                </div>
              </div>

              <div className="profile-actions">
                <button 
                  type="button" 
                  className="primary-button" 
                  onClick={() => setEditing(true)}
                >
                  Edit Profile
                </button>
                <button 
                  type="button" 
                  className="secondary-button" 
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <form className="profile-form" onSubmit={handleUpdate}>
              <div className="form-grid two-cols">
                <label>
                  Full Name
                  <input
                    type="text"
                    name="name"
                    value={formData.name || ''}
                    onChange={handleInputChange}
                    required
                  />
                </label>
                <label>
                  Email
                  <input
                    type="email"
                    name="email"
                    value={formData.email || ''}
                    onChange={handleInputChange}
                    required
                  />
                </label>
              </div>

              <div className="form-grid two-cols">
                <label>
                  Phone
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone || ''}
                    onChange={handleInputChange}
                  />
                </label>
                <label>
                  City
                  <input
                    type="text"
                    name="city"
                    value={formData.city || ''}
                    onChange={handleInputChange}
                  />
                </label>
              </div>

              <label>
                Address
                <textarea
                  name="address"
                  value={formData.address || ''}
                  onChange={handleInputChange}
                  rows="3"
                />
              </label>

              <div className="form-actions">
                <button type="submit" className="primary-button" disabled={loading}>
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
                <button 
                  type="button" 
                  className="secondary-button" 
                  onClick={() => {
                    setEditing(false);
                    setFormData(user);
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>

        <div className="profile-sidebar">
          <div className="sidebar-card">
            <h3>📊 Account Status</h3>
            <div className="status-item">
              <span>Status</span>
              <strong className="active">Active</strong>
            </div>
            <div className="status-item">
              <span>Member Since</span>
              <strong>{user.createdAt ? new Date(user.createdAt).getFullYear() : 'N/A'}</strong>
            </div>
          </div>

          <div className="sidebar-card">
            <h3>🛍️ Quick Links</h3>
            <LinkButton to="/orders" onNavigate={onNavigate} className="link-button">View Orders</LinkButton>
            <LinkButton to="/cart" onNavigate={onNavigate} className="link-button">View Cart</LinkButton>
            <LinkButton to="/fruits-vegetables" onNavigate={onNavigate} className="link-button">Shop Products</LinkButton>
            <LinkButton to="/contact" onNavigate={onNavigate} className="link-button">Contact Support</LinkButton>
          </div>
        </div>
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

        .profile-header {
          margin-bottom: 30px;
        }

        .profile-header h1 {
          font-size: 2.5rem;
          margin: 15px 0;
        }

        .profile-section {
          display: grid;
          grid-template-columns: 1fr 300px;
          gap: 30px;
          margin-bottom: 40px;
        }

        @media (max-width: 768px) {
          .profile-section {
            grid-template-columns: 1fr;
          }

          .profile-actions,
          .form-actions {
            flex-wrap: wrap;
          }
        }

        .profile-card {
          background: white;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          padding: 30px;
        }

        .profile-header-content {
          display: flex;
          align-items: center;
          gap: 20px;
          margin-bottom: 30px;
          padding-bottom: 20px;
          border-bottom: 1px solid #eee;
        }

        .profile-avatar {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 32px;
          font-weight: bold;
        }

        .profile-info h2 {
          margin: 0 0 5px 0;
        }

        .profile-info p {
          margin: 0;
          color: #666;
        }

        .info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }

        .info-item label {
          display: block;
          font-weight: 600;
          color: #333;
          margin-bottom: 5px;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .info-item p {
          margin: 0;
          color: #666;
          padding: 8px 0;
        }

        .profile-form {
          display: grid;
          gap: 20px;
        }

        .profile-form label {
          display: block;
        }

        .profile-form label span {
          display: block;
          font-weight: 600;
          margin-bottom: 8px;
        }

        .profile-form input,
        .profile-form textarea {
          width: 100%;
          padding: 10px 12px;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-family: inherit;
          font-size: 14px;
        }

        .profile-form input:focus,
        .profile-form textarea:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .profile-actions,
        .form-actions {
          display: flex;
          gap: 10px;
          margin-top: 20px;
        }

        .primary-button,
        .secondary-button {
          padding: 12px 24px;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
        }

        .primary-button {
          background: #667eea;
          color: white;
        }

        .primary-button:hover:not(:disabled) {
          background: #5568d3;
          transform: translateY(-2px);
        }

        .secondary-button {
          background: #f0f0f0;
          color: #333;
        }

        .secondary-button:hover {
          background: #e0e0e0;
        }

        .primary-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .profile-sidebar {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .sidebar-card {
          background: white;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          padding: 20px;
        }

        .sidebar-card h3 {
          margin: 0 0 15px 0;
          font-size: 16px;
        }

        .status-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 0;
          border-bottom: 1px solid #f0f0f0;
        }

        .status-item:last-child {
          border-bottom: none;
        }

        .status-item span {
          color: #666;
          font-size: 14px;
        }

        .status-item strong {
          font-weight: 600;
          color: #333;
        }

        .active {
          color: #2ecc71 !important;
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

        .form-grid {
          display: grid;
          gap: 20px;
        }

        .form-grid.two-cols {
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        }

        @media (max-width: 640px) {
          .profile-header h1 {
            font-size: clamp(1.8rem, 9vw, 2.2rem);
          }

          .profile-card {
            padding: 20px;
          }

          .profile-header-content {
            align-items: flex-start;
            flex-direction: column;
            gap: 14px;
          }

          .profile-avatar {
            width: 64px;
            height: 64px;
            font-size: 26px;
          }

          .profile-actions .primary-button,
          .profile-actions .secondary-button,
          .form-actions .primary-button,
          .form-actions .secondary-button {
            width: 100%;
          }
        }

      `}</style>
    </main>
  );
}

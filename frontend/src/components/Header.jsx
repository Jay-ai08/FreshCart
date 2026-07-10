import { useState, useEffect } from 'react';
import { notifyAuthChanged } from '../utils';
import { categories } from '../data/products';
import LinkButton from './LinkButton';
import freshCartLogo from '../assets/freshcart-logo.jpg';

export default function Header({ currentPath, onNavigate, cartCount }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    function syncUser() {
      const storedUser = localStorage.getItem('user');
      if (!storedUser) {
        setUser(null);
        return;
      }

      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Failed to parse user data:', e);
        setUser(null);
      }
    }

    syncUser();
    window.addEventListener('storage', syncUser);
    window.addEventListener('freshcart-auth-changed', syncUser);
    return () => {
      window.removeEventListener('storage', syncUser);
      window.removeEventListener('freshcart-auth-changed', syncUser);
    };
  }, []);

  const navItems = [
    { label: 'Home', path: '/' },
    ...categories.map((category) => ({ label: category.title, path: `/${category.slug}` })),
    { label: 'About', path: '/about' },
    { label: 'Contact', path: '/contact' },
  ];

  function navigate(path) {
    setMenuOpen(false);
    setShowUserMenu(false);
    onNavigate(path);
  }

  function handleLogout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setUser(null);
    notifyAuthChanged();
    setShowUserMenu(false);
    onNavigate('/');
  }

  return (
    <header className="site-header">
      <div className="nav-shell">
        <LinkButton to="/" onNavigate={navigate} className="brand-logo" aria-label="FreshCart Home">
          <img src={freshCartLogo} alt="FreshCart" />
        </LinkButton>

        <button
          type="button"
          className="menu-toggle"
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span />
          <span />
          <span />
        </button>

        <nav className={`main-nav ${menuOpen ? 'is-open' : ''}`}>
          <div className="nav-links">
            {navItems.map((item) => (
              <LinkButton
                key={item.path}
                to={item.path}
                onNavigate={navigate}
                className={`nav-link ${currentPath === item.path ? 'active' : ''}`}
              >
                {item.label}
              </LinkButton>
            ))}
          </div>

          <div className="nav-actions">
            {user ? (
              <>
                <div className="user-menu">
                  <button
                    type="button"
                    className="user-profile-btn"
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    aria-expanded={showUserMenu}
                  >
                    <span className={`user-avatar ${user.profilePhoto ? 'has-photo' : ''}`}>
                      {user.profilePhoto ? (
                        <img src={user.profilePhoto} alt={`${user.name || 'User'} profile`} />
                      ) : (
                        user.name?.charAt(0).toUpperCase() || 'U'
                      )}
                    </span>
                    <span className="user-name">{user.name}</span>
                  </button>

                  {showUserMenu && (
                    <div className="user-dropdown">
                      <div className="dropdown-header">
                        <p className="user-email">{user.email}</p>
                      </div>
                      <LinkButton
                        to="/profile"
                        onNavigate={navigate}
                        className="dropdown-item"
                      >
                        👤 My Profile
                      </LinkButton>
                      <LinkButton
                        to="/orders"
                        onNavigate={navigate}
                        className="dropdown-item"
                      >
                        📦 My Orders
                      </LinkButton>
                      <LinkButton
                        to="/admin"
                        onNavigate={navigate}
                        className="dropdown-item"
                      >
                        Admin Panel
                      </LinkButton>
                      <LinkButton
                        to="/cart"
                        onNavigate={navigate}
                        className="dropdown-item"
                      >
                        🛒 My Cart
                      </LinkButton>
                      <button
                        type="button"
                        className="dropdown-item logout"
                        onClick={handleLogout}
                      >
                        🚪 Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <LinkButton to="/login" onNavigate={navigate} className="login-link">
                  Login
                </LinkButton>
                <LinkButton to="/signup" onNavigate={navigate} className="primary-small">
                  Sign Up
                </LinkButton>
              </>
            )}
            <LinkButton to="/cart" onNavigate={navigate} className="cart-link" aria-label="Open cart">
              <span className="cart-icon">🛒</span>
              <span className="cart-badge">{cartCount}</span>
            </LinkButton>
          </div>
        </nav>
      </div>

      <style>{`
        .user-menu {
          position: relative;
        }

        .user-profile-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 8px 12px;
          border-radius: 6px;
          font-weight: 500;
          transition: background-color 0.2s;
        }

        .user-profile-btn:hover {
          background-color: #f0f0f0;
        }

        .user-avatar {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          font-weight: 600;
          font-size: 14px;
          overflow: hidden;
          flex: 0 0 auto;
        }

        .user-avatar.has-photo {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
        }

        .user-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .user-name {
          display: none;
        }

        @media (min-width: 768px) {
          .user-name {
            display: inline;
            color: #333;
          }
        }

        .user-dropdown {
          position: absolute;
          top: 100%;
          right: 0;
          margin-top: 8px;
          background: white;
          border: 1px solid #ddd;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          width: max-content;
          min-width: 200px;
          max-width: min(240px, calc(100vw - 40px));
          z-index: 1000;
        }

        .dropdown-header {
          padding: 12px 16px;
          border-bottom: 1px solid #f0f0f0;
        }

        .user-email {
          margin: 0;
          font-size: 13px;
          color: #666;
          overflow-wrap: anywhere;
        }

        .dropdown-item {
          display: block;
          width: 100%;
          text-align: left;
          padding: 12px 16px;
          border: none;
          background: none;
          cursor: pointer;
          color: #333;
          font-size: 14px;
          text-decoration: none;
          transition: background-color 0.2s;
        }

        .dropdown-item:hover {
          background-color: #f5f5f5;
        }

        .dropdown-item.logout {
          color: #e74c3c;
        }

        .dropdown-item.logout:hover {
          background-color: #fee;
        }

        @media (max-width: 900px) {
          .user-dropdown {
            position: static;
            width: 100%;
            max-width: none;
            margin-top: 10px;
            box-shadow: none;
          }
        }
      `}</style>
    </header>
  );
}

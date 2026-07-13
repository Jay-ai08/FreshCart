import { useState } from 'react';
import LinkButton from '../components/LinkButton';
import { authAPI } from '../services/api';
import { notifyAuthChanged } from '../utils';

export function Login({ onNavigate }) {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loginAs, setLoginAs] = useState('user');

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    const formData = new FormData(event.currentTarget);
    const email = formData.get('email');
    const password = formData.get('password');

    try {
      const response = await authAPI.login(email, password);
      const actualRole = response.user?.role === 'admin' ? 'admin' : 'user';

      if (loginAs === 'admin' && actualRole !== 'admin') {
        setError('This account does not have admin access. Login as a user instead.');
        setLoading(false);
        return;
      }

      const sessionUser = {
        ...response.user,
        role: loginAs === 'admin' ? actualRole : 'user',
      };

      localStorage.setItem('authToken', response.token);
      localStorage.setItem('user', JSON.stringify(sessionUser));
      notifyAuthChanged();
      setMessage('');
      onNavigate('/');
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout
      eyebrow="Welcome back"
      title="Login to access fresh groceries and daily deals."
      description="Securely sign in to manage your cart, review orders, and save your favourite essentials."
      features={[['Quick checkout', 'Fast payments with saved account details.'], ['Exclusive deals', 'Member-only offers delivered to your inbox.']]}
    >
      <form className="auth-card" onSubmit={handleSubmit}>
        <h1>Login to FreshCart</h1>
        <p>Use your account to continue shopping for fresh groceries.</p>

        <div className="login-role-toggle" role="radiogroup" aria-label="Login as">
          <button
            type="button"
            role="radio"
            aria-checked={loginAs === 'user'}
            className={`role-option ${loginAs === 'user' ? 'active' : ''}`}
            onClick={() => setLoginAs('user')}
          >
            👤 User
          </button>
          <button
            type="button"
            role="radio"
            aria-checked={loginAs === 'admin'}
            className={`role-option ${loginAs === 'admin' ? 'active' : ''}`}
            onClick={() => setLoginAs('admin')}
          >
            🛡️ Admin
          </button>
        </div>

        <label>Email address<input type="email" name="email" required /></label>
        <label>Password<input type="password" name="password" required /></label>
        <div className="form-inline">
          <label className="checkbox-label"><input type="checkbox" /> Remember me</label>
          <button type="button" className="text-button">Forgot password?</button>
        </div>
        <button type="submit" className="primary-button full-width" disabled={loading}>
          {loading ? 'Logging in...' : `Login as ${loginAs === 'admin' ? 'Admin' : 'User'}`}
        </button>
        {error && <p className="error-text">{error}</p>}
        {message && <p className="success-text">{message}</p>}
        <p className="auth-switch">New to FreshCart? <LinkButton to="/signup" onNavigate={onNavigate}>Create an account</LinkButton></p>
      </form>

      <style>{`
        .login-role-toggle {
          display: flex;
          gap: 8px;
          margin-bottom: 16px;
          background: #f5f5f5;
          padding: 4px;
          border-radius: 8px;
        }

        .role-option {
          flex: 1;
          padding: 10px 12px;
          border: none;
          background: none;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 500;
          font-size: 14px;
          color: #555;
          transition: background-color 0.2s, color 0.2s;
        }

        .role-option.active {
          background: white;
          color: #e63946;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.12);
        }
      `}</style>
    </AuthLayout>
  );
}

export function SignUp({ onNavigate }) {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    const formData = new FormData(event.currentTarget);
    const name = formData.get('name');
    const email = formData.get('email');
    const phone = formData.get('phone');
    const password = formData.get('password');
    const confirmPassword = formData.get('confirmPassword');

    if (password !== confirmPassword) {
      setError('Password and confirm password do not match.');
      setLoading(false);
      return;
    }

    try {
      const response = await authAPI.signup(name, email, phone, password, confirmPassword);
      localStorage.setItem('authToken', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      notifyAuthChanged();
      setMessage('');
      onNavigate('/');
    } catch (err) {
      setError(err.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout
      eyebrow="FreshCart account"
      title="Create your account with fresh grocery offers."
      description="Sign up today and get access to exclusive discounts, fast delivery, and curated daily essentials."
      features={[['Fast delivery', 'Same-day delivery on selected items.'], ['Fresh guarantee', 'Only premium quality groceries in every order.']]}
    >
      <form className="auth-card" onSubmit={handleSubmit}>
        <h1>Sign up to FreshCart</h1>
        <p>Enter your information to create your fresh grocery shopper account.</p>
        <label>Full name<input type="text" name="name" required /></label>
        <label>Phone<input type="tel" name="phone" required /></label>
        <label>Email address<input type="email" name="email" required /></label>
        <label>Password<input name="password" type={showPassword ? 'text' : 'password'} required /></label>
        <label>Confirm password<input name="confirmPassword" type={showPassword ? 'text' : 'password'} required /></label>
        <label className="checkbox-label"><input type="checkbox" checked={showPassword} onChange={(event) => setShowPassword(event.target.checked)} /> Show password</label>
        <label className="checkbox-label"><input type="checkbox" /> Send me fresh offers and updates</label>
        <button type="submit" className="primary-button full-width" disabled={loading}>
          Create Account
        </button>
        {error && <p className="error-text">{error}</p>}
        {message && <p className="success-text">{message}</p>}
        <p className="auth-switch">Already have an account? <LinkButton to="/login" onNavigate={onNavigate}>Login</LinkButton></p>
      </form>
    </AuthLayout>
  );
}

function AuthLayout({ eyebrow, title, description, features, children }) {
  return (
    <main className="auth-page">
      <section className="auth-layout">
        <aside className="auth-aside">
          <span className="section-pill">{eyebrow}</span>
          <h1>{title}</h1>
          <p>{description}</p>
          <div className="feature-list">
            {features.map(([heading, text]) => (
              <div key={heading}>
                <h3>{heading}</h3>
                <p>{text}</p>
              </div>
            ))}
          </div>
        </aside>
        {children}
      </section>
    </main>
  );
}
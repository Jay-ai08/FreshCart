import { useEffect, useMemo, useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import CategoryPage from './pages/CategoryPage';
import About from './pages/About';
import Contact from './pages/Contact';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Profile from './pages/Profile';
import ViewOrders from './pages/ViewOrders';
import Admin from './pages/Admin';
import { Login, SignUp } from './pages/Auth';
import { categories } from './data/products';
import './App.css';

const STORAGE_KEY = 'freshcart-react-cart';
const knownCategorySlugs = categories.map((category) => category.slug);

function normalizePath(pathname) {
  const clean = pathname.replace(/\/$/, '') || '/';
  const legacyPaths = {
    '/index.html': '/',
    '/fruits-vegetable.html': '/fruits-vegetables',
    '/beverages.html': '/beverages',
    '/dairy.html': '/dairy',
    '/snacks.html': '/snacks',
    '/about.html': '/about',
    '/contact.html': '/contact',
    '/cart.html': '/cart',
    '/orders.html': '/orders',
    '/profile.html': '/profile',
    '/admin.html': '/admin',
    '/checkout.html': '/checkout',
    '/login.html': '/login',
    '/Login.html': '/login',
    '/signup.html': '/signup',
    '/SignUp.html': '/signup',
  };
  return legacyPaths[clean] || clean;
}

function loadCart() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

export default function App() {
  const [path, setPath] = useState(() => normalizePath(window.location.pathname));
  const [cartItems, setCartItems] = useState(loadCart);
  const [toast, setToast] = useState('');

  useEffect(() => {
    const handlePopState = () => setPath(normalizePath(window.location.pathname));
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = window.setTimeout(() => setToast(''), 2200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const totals = useMemo(() => {
    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const tax = Math.round(subtotal * 0.05);
    return { subtotal, tax, total: subtotal + tax };
  }, [cartItems]);

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  function navigate(to) {
    const nextPath = normalizePath(to);
    if (nextPath !== path) {
      window.history.pushState({}, '', nextPath);
      setPath(nextPath);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  function addToCart(product) {
    setCartItems((items) => {
      const existing = items.find((item) => item.id === product.id);
      if (existing) {
        return items.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...items, { ...product, quantity: 1 }];
    });
    setToast(`${product.name} added to cart`);
  }

  function increaseQuantity(id) {
    setCartItems((items) => items.map((item) => item.id === id ? { ...item, quantity: item.quantity + 1 } : item));
  }

  function decreaseQuantity(id) {
    setCartItems((items) => items
      .map((item) => item.id === id ? { ...item, quantity: item.quantity - 1 } : item)
      .filter((item) => item.quantity > 0));
  }

  function removeItem(id) {
    setCartItems((items) => items.filter((item) => item.id !== id));
  }

  function placeOrder() {
    setCartItems([]);
  }

  function renderPage() {
    if (path === '/') return <Home onNavigate={navigate} />;
    if (path === '/about') return <About onNavigate={navigate} />;
    if (path === '/contact') return <Contact />;
    if (path === '/profile') return <Profile onNavigate={navigate} />;
    if (path === '/orders') return <ViewOrders onNavigate={navigate} />;
    if (path === '/admin') return <Admin onNavigate={navigate} />;
    if (path === '/cart') {
      return (
        <Cart
          cartItems={cartItems}
          onNavigate={navigate}
          onIncrease={increaseQuantity}
          onDecrease={decreaseQuantity}
          onRemove={removeItem}
          totals={totals}
        />
      );
    }
    if (path === '/checkout') {
      return <Checkout cartItems={cartItems} totals={totals} onNavigate={navigate} onPlaceOrder={placeOrder} />;
    }
    if (path === '/login') return <Login onNavigate={navigate} />;
    if (path === '/signup') return <SignUp onNavigate={navigate} />;

    const categorySlug = path.replace('/', '');
    if (knownCategorySlugs.includes(categorySlug)) {
      return <CategoryPage slug={categorySlug} onAddToCart={addToCart} />;
    }

    return (
      <main className="page-pad">
        <section className="empty-state">
          <div>🔎</div>
          <h1>Page not found</h1>
          <p>The page you are looking for does not exist in FreshCart.</p>
          <button type="button" className="primary-button" onClick={() => navigate('/')}>Back to Home</button>
        </section>
      </main>
    );
  }

  return (
    <div className="app-shell">
      <Header currentPath={path} onNavigate={navigate} cartCount={cartCount} />
      {renderPage()}
      <Footer onNavigate={navigate} />
      {toast && <div className="toast-message">{toast}</div>}
    </div>
  );
}

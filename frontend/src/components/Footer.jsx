import LinkButton from './LinkButton';

export default function Footer({ onNavigate }) {
  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <div>
          <h3>FreshCart</h3>
          <p>Your favorite online grocery store delivering fresh products straight to your home.</p>
        </div>
        <div>
          <h3>Quick Links</h3>
          <div className="footer-links">
            <LinkButton to="/about" onNavigate={onNavigate}>About Us</LinkButton>
            <LinkButton to="/contact" onNavigate={onNavigate}>Contact Us</LinkButton>
            <LinkButton to="/login" onNavigate={onNavigate}>My Account</LinkButton>
          </div>
        </div>
        <div>
          <h3>Contact Info</h3>
          <p>Email: support@freshcart.com</p>
          <p>Phone: +123 456 7890</p>
        </div>
      </div>
      <div className="footer-bottom">© 2026 FreshCart. All rights reserved.</div>
    </footer>
  );
}

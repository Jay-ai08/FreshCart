import LinkButton from '../components/LinkButton';

export default function About({ onNavigate }) {
  return (
    <main>
      <section className="about-hero">
        <div>
          <span className="section-pill">About FreshCart</span>
          <h1>We make everyday grocery shopping feel effortless.</h1>
          <p>
            FreshCart brings premium groceries, fresh produce, and pantry essentials straight to your home with fast delivery and a modern shopping experience.
          </p>
          <div className="hero-actions">
            <LinkButton to="/fruits-vegetables" onNavigate={onNavigate} className="primary-button">Shop Now</LinkButton>
            <LinkButton to="/contact" onNavigate={onNavigate} className="secondary-button">Get in Touch</LinkButton>
          </div>
        </div>
        <div className="about-card">
          <span className="about-icon">🛒</span>
          <h2>Why customers choose us</h2>
          <ul>
            <li>Same-day delivery for nearby orders</li>
            <li>Freshly sourced fruits, dairy, snacks, and beverages</li>
            <li>Easy returns and responsive support</li>
          </ul>
        </div>
      </section>

      <section className="feature-grid">
        <div className="feature-card"><span>🌿</span><h3>Freshly sourced</h3><p>We partner with trusted vendors to bring you quality products that feel as good as they taste.</p></div>
        <div className="feature-card"><span>⚡</span><h3>Fast delivery</h3><p>Your essentials reach your door quickly, so your kitchen stays stocked without the stress.</p></div>
        <div className="feature-card"><span>💬</span><h3>Friendly support</h3><p>Our support team is here to help with questions, replacements, and smooth shopping assistance.</p></div>
      </section>

      <section className="mission-section">
        <div>
          <span className="section-pill">Our mission</span>
          <h2>A grocery experience designed around you</h2>
          <p>
            We believe grocery shopping should be simple, inspiring, and trustworthy. FreshCart combines convenience, quality, and a touch of delight in every delivery.
          </p>
          <p>From morning coffee to evening snacks, we help you find what you need with confidence and speed.</p>
        </div>
        <div className="mission-stats">
          <div><strong>500+</strong><span>Daily essentials</span></div>
          <div><strong>24/7</strong><span>Support access</span></div>
          <div><strong>4.9★</strong><span>Average rating</span></div>
          <div><strong>100%</strong><span>Fresh promise</span></div>
        </div>
      </section>
    </main>
  );
}

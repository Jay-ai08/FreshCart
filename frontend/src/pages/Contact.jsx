import { useState } from 'react';
import { contactAPI } from '../services/api';

export default function Contact() {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError('');
    setSent(false);

    const formData = new FormData(event.currentTarget);
    const name = formData.get('name');
    const email = formData.get('email');
    const phone = formData.get('phone');
    const subject = formData.get('subject');
    const message = formData.get('message');

    try {
      await contactAPI.submit(name, email, phone, subject, message);
      setSent(true);
      event.currentTarget.reset();
      setTimeout(() => setSent(false), 3000);
    } catch (err) {
      setError(err.message || 'Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="page-pad">
      <section className="contact-layout">
        <div className="contact-info">
          <span className="section-pill">Contact us</span>
          <h1>We’d love to hear from you.</h1>
          <p>Whether you have a question about delivery, need help with an order, or want to share feedback, our support team is ready to assist.</p>
          <div className="contact-list">
            <div><h3>📍 Visit us</h3><p>123 Fresh Street, Noida, India</p></div>
            <div><h3>📞 Call us</h3><p>+123 456 7890</p></div>
            <div><h3>✉️ Email</h3><p>support@freshcart.com</p></div>
          </div>
        </div>

        <form className="form-card" onSubmit={handleSubmit}>
          <h2>Send us a message</h2>
          <div className="form-grid two-cols">
            <label>Your Name<input type="text" name="name" placeholder="Enter your name" required /></label>
            <label>Email Address<input type="email" name="email" placeholder="Enter your email" required /></label>
          </div>
          <label>Phone<input type="tel" name="phone" placeholder="Enter your phone number" required /></label>
          <label>Subject<input type="text" name="subject" placeholder="How can we help?" required /></label>
          <label>Message<textarea name="message" rows="5" placeholder="Write your message here..." required /></label>
          <button type="submit" className="primary-button" disabled={loading}>
            {loading ? 'Sending...' : 'Send Message'}
          </button>
          {error && <p className="error-text">{error}</p>}
          {sent && <p className="success-text">Message sent successfully. FreshCart support will contact you soon.</p>}
        </form>
      </section>
    </main>
  );
}

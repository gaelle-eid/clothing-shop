import { useState } from 'react';
import api from '../api/axios';

function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSending(true);
    setError('');

    api
      .post('/contact/', form)
      .then(() => {
        setSent(true);
        setForm({ name: '', email: '', message: '' });
        setSending(false);
      })
      .catch((err) => {
        console.error(err);
        setError('Something went wrong. Please try again.');
        setSending(false);
      });
  };

  return (
    <div className="auth-container">
      <div className="auth-card" style={{ maxWidth: '500px' }}>
        <h1 className="auth-title">Contact Us</h1>
        <p className="auth-subtitle">We'd love to hear from you</p>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Your name"
            className="auth-input"
            value={form.name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Your email"
            className="auth-input"
            value={form.email}
            onChange={handleChange}
            required
          />
          <textarea
            name="message"
            placeholder="Your message"
            className="auth-input"
            rows="5"
            value={form.message}
            onChange={handleChange}
            required
            style={{ resize: 'vertical' }}
          />

          <button type="submit" className="auth-btn" disabled={sending}>
            {sending ? 'Sending...' : 'Send Message'}
          </button>
        </form>

        {sent && (
          <p className="auth-message success">
            Thank you! Your message has been sent — we'll get back to you soon.
          </p>
        )}
        {error && <p className="auth-message error">{error}</p>}
      </div>
    </div>
  );
}

export default Contact;
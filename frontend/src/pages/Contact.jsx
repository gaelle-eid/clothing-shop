import { useState } from 'react';

function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // No backend wired up yet — just simulate a confirmation for now.
    setSent(true);
    setForm({ name: '', email: '', message: '' });
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

          <button type="submit" className="auth-btn">Send Message</button>
        </form>

        {sent && (
          <p className="auth-message success">
            Thank you! Your message has been noted. (Note: not yet connected to a real backend.)
          </p>
        )}
      </div>
    </div>
  );
}

export default Contact;
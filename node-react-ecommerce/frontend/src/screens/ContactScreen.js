import React, { useState } from 'react';

function ContactScreen() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, you'd POST this to your backend
    setSubmitted(true);
  };

  return (
    <div className="contact-page">
      <div className="contact-header">
        <h1>Get in Touch</h1>
        <p>We'd love to hear from you. Our team is always here to help.</p>
      </div>

      <div className="contact-grid">
        {/* Contact Info Cards */}
        <div className="contact-info">
          <div className="contact-info-card">
            <div className="contact-info-icon">📧</div>
            <div>
              <h3>Email Us</h3>
              <a href="mailto:support@amazona.in">support@amazona.in</a>
              <p style={{ marginTop: '0.4rem' }}>We respond within 24 hours.</p>
            </div>
          </div>

          <div className="contact-info-card">
            <div className="contact-info-icon">📞</div>
            <div>
              <h3>Call Us</h3>
              <a href="tel:+919876543210">+91 98765 43210</a>
              <p style={{ marginTop: '0.4rem' }}>Mon–Sat, 9am – 8pm IST</p>
            </div>
          </div>

          <div className="contact-info-card">
            <div className="contact-info-icon">📍</div>
            <div>
              <h3>Visit Us</h3>
              <p>MG Road, Tech Park</p>
              <p>Bengaluru, Karnataka 560001, India</p>
            </div>
          </div>

          <div className="contact-info-card">
            <div className="contact-info-icon">💬</div>
            <div>
              <h3>Live Chat</h3>
              <p>Available on our website</p>
              <p style={{ marginTop: '0.4rem' }}>Mon–Sat, 9am – 8pm IST</p>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="contact-form-card">
          {submitted ? (
            <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
              <div style={{ fontSize: '5rem', marginBottom: '1.6rem' }}>✅</div>
              <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '2.4rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1.2rem' }}>
                Message Sent!
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1.5rem' }}>
                Thanks for reaching out, <strong style={{ color: 'var(--text-primary)' }}>{formData.name}</strong>!
                We'll get back to you at {formData.email} within 24 hours.
              </p>
              <button
                className="button primary"
                style={{ marginTop: '2.4rem' }}
                onClick={() => { setSubmitted(false); setFormData({ name: '', email: '', subject: '', message: '' }); }}
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <>
              <h2>Send a Message</h2>
              <form onSubmit={handleSubmit}>
                <div className="contact-form-group">
                  <label htmlFor="contact-name">Your Name</label>
                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="contact-form-group">
                  <label htmlFor="contact-email">Email Address</label>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="contact-form-group">
                  <label htmlFor="contact-subject">Subject</label>
                  <input
                    id="contact-subject"
                    name="subject"
                    type="text"
                    placeholder="How can we help?"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="contact-form-group">
                  <label htmlFor="contact-message">Message</label>
                  <textarea
                    id="contact-message"
                    name="message"
                    placeholder="Tell us more about your question or concern..."
                    value={formData.message}
                    onChange={handleChange}
                    required
                  />
                </div>
                <button type="submit" className="button primary full-width">
                  Send Message →
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ContactScreen;

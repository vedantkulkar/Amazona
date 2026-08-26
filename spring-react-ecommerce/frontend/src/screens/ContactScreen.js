import React, { useState } from 'react';

const CONTACT_INFO = {
  supportEmail: 'support@amazona.in',
  directEmail: 'samkulk345@gmail.com',
  phone: '0240 796 8216',
  address: 'MG Road, Tech Innovation Park, Pune, Maharashtra, India',
};

function ContactScreen() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const openChat = () => {
    window.dispatchEvent(new Event('openSupportChat'));
  };

  return (
    <div className="contact-page">
      <div className="contact-header">
        <div className="form-page-icon">📬</div>
        <h1>Contact Us</h1>
        <p>We're here to help! Reach out to us via email, phone, or live chat anytime.</p>
      </div>

      <div className="contact-grid">
        {/* Clean Professional Store Contact Cards */}
        <div className="contact-info">
          {/* Email Support */}
          <div className="contact-info-card">
            <div className="contact-info-icon">📧</div>
            <div>
              <h3>Email Inquiries</h3>
              <a href={`mailto:${CONTACT_INFO.supportEmail}`} style={{ color: 'var(--accent-2)', fontWeight: 600 }}>
                {CONTACT_INFO.supportEmail}
              </a>
              <p style={{ marginTop: '0.4rem', color: 'var(--txt-3)', fontSize: '1.3rem' }}>
                Direct: <a href={`mailto:${CONTACT_INFO.directEmail}`} style={{ color: 'var(--txt-2)' }}>{CONTACT_INFO.directEmail}</a>
              </p>
            </div>
          </div>

          {/* Call Us */}
          <div className="contact-info-card">
            <div className="contact-info-icon">📞</div>
            <div>
              <h3>Phone &amp; Helpline</h3>
              <a href={`tel:${CONTACT_INFO.phone.replace(/\s+/g, '')}`} style={{ color: 'var(--accent-2)', fontWeight: 600, fontSize: '1.5rem' }}>
                {CONTACT_INFO.phone}
              </a>
              <p style={{ marginTop: '0.4rem', color: 'var(--txt-3)', fontSize: '1.3rem' }}>
                Mon–Sun • 24/7 Available
              </p>
            </div>
          </div>

          {/* Visit Us */}
          <div className="contact-info-card">
            <div className="contact-info-icon">📍</div>
            <div>
              <h3>Office &amp; Store Location</h3>
              <p style={{ color: 'var(--txt)', fontWeight: 500, fontSize: '1.4rem' }}>{CONTACT_INFO.address}</p>
            </div>
          </div>

          {/* Live 24/7 Support Chat Trigger */}
          <div
            className="contact-info-card"
            onClick={openChat}
            style={{ cursor: 'pointer', borderColor: 'rgba(16, 185, 129, 0.4)' }}
          >
            <div className="contact-info-icon" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
              💬
            </div>
            <div>
              <h3>Instant 24/7 Live AI Chat</h3>
              <p style={{ color: '#10b981', fontWeight: 600, fontSize: '1.3rem' }}>● Online Now — Click to Open Assistant</p>
              <p style={{ marginTop: '0.4rem', color: 'var(--txt-3)', fontSize: '1.2rem' }}>
                Get instant help with order tracking, returns, and payments
              </p>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="contact-form-card">
          {submitted ? (
            <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
              <div style={{ fontSize: '5rem', marginBottom: '1.6rem' }}>✅</div>
              <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '2.4rem', fontWeight: 700, color: 'var(--txt)', marginBottom: '1.2rem' }}>
                Message Sent Successfully!
              </h2>
              <p style={{ color: 'var(--txt-2)', fontSize: '1.5rem', lineHeight: '1.6' }}>
                Thank you for contacting us, <strong style={{ color: 'var(--txt)' }}>{formData.name}</strong>!<br />
                A member of our team will get back to you at <span style={{ color: 'var(--accent-2)' }}>{formData.email}</span> shortly.
              </p>
              <button
                className="button primary"
                style={{ marginTop: '2.4rem', padding: '1.2rem 2.4rem' }}
                onClick={() => {
                  setSubmitted(false);
                  setFormData({ name: '', email: '', subject: '', message: '' });
                }}
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <>
              <h2 style={{ fontSize: '2.2rem', marginBottom: '0.6rem' }}>Send Us a Message</h2>
              <p style={{ color: 'var(--txt-3)', fontSize: '1.4rem', marginBottom: '2rem' }}>
                Fill out the form below and we will respond right away.
              </p>
              <form onSubmit={handleSubmit}>
                <div className="contact-form-group">
                  <label htmlFor="contact-name">Your Full Name</label>
                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    placeholder="e.g. John Doe"
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
                    placeholder="e.g. you@example.com"
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
                    placeholder="e.g. Order Inquiry / Question"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="contact-form-group">
                  <label htmlFor="contact-message">Your Message</label>
                  <textarea
                    id="contact-message"
                    name="message"
                    rows="5"
                    placeholder="Write your message or inquiry here..."
                    value={formData.message}
                    onChange={handleChange}
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="button primary full-width"
                  style={{ padding: '1.3rem', fontSize: '1.5rem', marginTop: '1rem' }}
                >
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

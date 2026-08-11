import React from 'react';
import { Link } from 'react-router-dom';

const values = [
  {
    icon: '🌿',
    title: 'Sustainable Fashion',
    description:
      'We partner with ethical manufacturers who use eco-friendly materials and fair labor practices. Fashion should be good for the planet.',
  },
  {
    icon: '💎',
    title: 'Premium Quality',
    description:
      'Every item in our catalog is hand-selected by our team. We refuse to sell anything we wouldn\'t wear ourselves.',
  },
  {
    icon: '🚀',
    title: 'Fast Delivery',
    description:
      'Orders are processed within 24 hours. With our logistics partners, most domestic orders arrive within 2-3 business days.',
  },
  {
    icon: '🔄',
    title: 'Hassle-Free Returns',
    description:
      'Not happy? Return any item within 30 days for a full refund, no questions asked. We make it simple.',
  },
  {
    icon: '🤝',
    title: 'Community First',
    description:
      'We give back. 1% of every purchase goes to social causes that support underprivileged communities around the world.',
  },
  {
    icon: '🛡️',
    title: 'Secure Shopping',
    description:
      'Your data and payments are encrypted and protected. Shop with confidence knowing your information is always safe.',
  },
];

function AboutScreen() {
  return (
    <div className="about-page">
      {/* Hero */}
      <div className="about-hero">
        <h1>Our Story</h1>
        <p>
          Amazona was born from a simple idea: everyone deserves access to premium, stylish
          clothing without the luxury price tag. We're changing what fashion means.
        </p>
      </div>

      {/* Stats */}
      <div className="about-stats">
        <div className="about-stat">
          <strong>12,000+</strong>
          <span>Happy Customers</span>
        </div>
        <div className="about-stat">
          <strong>120+</strong>
          <span>Products Curated</span>
        </div>
        <div className="about-stat">
          <strong>4.9 ★</strong>
          <span>Average Rating</span>
        </div>
        <div className="about-stat">
          <strong>2025</strong>
          <span>Founded</span>
        </div>
      </div>

      {/* Mission */}
      <section className="about-section">
        <h2>Our Mission</h2>
        <p style={{ color: 'var(--text-secondary)', textAlign: 'center', maxWidth: '70rem', margin: '0 auto 4rem', fontSize: '1.6rem', lineHeight: 1.8 }}>
          We believe that great style shouldn't be a privilege. Our mission is to democratize
          fashion — to make premium, ethically-sourced clothing accessible to everyone,
          everywhere. We curate, test, and stand behind every single product we sell.
        </p>
        <div className="about-values">
          {values.map((v) => (
            <div className="about-value-card" key={v.title}>
              <div className="about-value-icon">{v.icon}</div>
              <h3>{v.title}</h3>
              <p>{v.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ textAlign: 'center', padding: '5rem 4rem 8rem', borderTop: '1px solid var(--border)' }}>
        <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '3rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1.2rem' }}>
          Ready to shop?
        </h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '3rem', fontSize: '1.6rem' }}>
          Browse our curated collection of premium clothing and accessories.
        </p>
        <Link to="/" className="btn-hero-primary" style={{ display: 'inline-block', padding: '1.4rem 3.6rem' }}>
          Explore Collection →
        </Link>
      </section>
    </div>
  );
}

export default AboutScreen;

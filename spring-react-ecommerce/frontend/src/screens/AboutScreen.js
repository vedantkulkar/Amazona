import React from 'react';
import { Link } from 'react-router-dom';

const values = [
  {
    icon: '💎',
    title: 'Uncompromising Quality',
    description:
      'Every fabric is rigorously tested for durability, breathability, and comfort. We only offer products that meet our exacting standards.',
  },
  {
    icon: '🌿',
    title: 'Ethical & Sustainable',
    description:
      'We partner exclusively with verified ethical manufacturers committed to fair worker wages, safe conditions, and eco-friendly dyes.',
  },
  {
    icon: '⚡',
    title: 'Express Doorstep Delivery',
    description:
      'Orders are packed and dispatched within 24 hours. Enjoy fast, reliable delivery right to your doorstep across India.',
  },
  {
    icon: '🔄',
    title: '7-Day Hassle-Free Returns',
    description:
      'Wrong size or not fully satisfied? Return or exchange any item within 7 days for a full refund with free doorstep pickup.',
  },
  {
    icon: '🔒',
    title: '100% Secure Payments',
    description:
      'Shop with confidence using 256-bit encrypted checkout. We support UPI (GPay, PhonePe, Paytm), Cards, NetBanking, and COD.',
  },
  {
    icon: '💬',
    title: '24/7 Dedicated Support',
    description:
      'We are always by your side. Get immediate assistance for order tracking, styling advice, and exchanges anytime.',
  },
];

const promisePoints = [
  {
    icon: '🏷️',
    title: 'Fair & Transparent Pricing',
    text: 'By eliminating traditional retail middlemen, we deliver luxury aesthetics without the luxury markup.',
  },
  {
    icon: '🧵',
    title: 'Artisanal Craftsmanship',
    text: 'Every garment is stitched with reinforced seams and premium threads designed to last wash after wash.',
  },
  {
    icon: '📦',
    title: 'Eco-Conscious Packaging',
    text: 'All shipments are delivered in 100% recyclable, minimal-waste packaging to reduce environmental footprint.',
  },
  {
    icon: '🛡️',
    title: 'Guaranteed Authenticity',
    text: 'Every branded item is sourced directly from authorized brand partners and verified for 100% authenticity.',
  },
];

function AboutScreen() {
  return (
    <div className="about-page">
      {/* Hero */}
      <div className="about-hero">
        <div className="form-page-icon">✨</div>
        <h1>Elevating Everyday Style</h1>
        <p>
          Amazona was founded on a simple belief: premium fashion should be modern, comfortable,
          and accessible to everyone without inflated price tags.
        </p>
      </div>

      {/* Stats Strip */}
      <div className="about-stats">
        <div className="about-stat">
          <strong>50,000+</strong>
          <span>Delighted Customers</span>
        </div>
        <div className="about-stat">
          <strong>24+</strong>
          <span>Curated Styles</span>
        </div>
        <div className="about-stat">
          <strong>4.9 ★</strong>
          <span>Customer Satisfaction</span>
        </div>
        <div className="about-stat">
          <strong>100%</strong>
          <span>Authentic Products</span>
        </div>
      </div>

      {/* Mission & Story */}
      <section className="about-section">
        <h2>Our Core Values</h2>
        <p
          style={{
            color: 'var(--txt-2)',
            textAlign: 'center',
            maxWidth: '75rem',
            margin: '0 auto 4rem',
            fontSize: '1.6rem',
            lineHeight: 1.8,
          }}
        >
          We curate contemporary wardrobes that transition effortlessly from everyday work to weekend leisure.
          Here is what sets our collection apart:
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

      {/* The Amazona Promise */}
      <section className="about-section" style={{ borderTop: '1px solid var(--border)', paddingTop: '5rem' }}>
        <h2>The Amazona Promise</h2>
        <p
          style={{
            color: 'var(--txt-2)',
            textAlign: 'center',
            maxWidth: '70rem',
            margin: '0 auto 3.6rem',
            fontSize: '1.5rem',
            lineHeight: 1.7,
          }}
        >
          Your shopping experience and satisfaction are at the heart of everything we do.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(26rem, 1fr))', gap: '2rem', maxWidth: '110rem', margin: '0 auto' }}>
          {promisePoints.map((item) => (
            <div
              key={item.title}
              style={{
                padding: '2.4rem',
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid var(--border)',
                borderRadius: '16px',
                display: 'flex',
                gap: '1.4rem',
                alignItems: 'flex-start',
              }}
            >
              <div style={{ fontSize: '2.8rem' }}>{item.icon}</div>
              <div>
                <h4 style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--txt)', margin: '0 0 0.6rem 0' }}>
                  {item.title}
                </h4>
                <p style={{ fontSize: '1.35rem', color: 'var(--txt-3)', margin: 0, lineHeight: 1.5 }}>
                  {item.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ textAlign: 'center', padding: '6rem 4rem 8rem', borderTop: '1px solid var(--border)' }}>
        <h2
          style={{
            fontFamily: 'Outfit, sans-serif',
            fontSize: '3.2rem',
            fontWeight: 700,
            color: 'var(--txt)',
            marginBottom: '1.2rem',
          }}
        >
          Ready to Elevate Your Wardrobe?
        </h2>
        <p style={{ color: 'var(--txt-2)', marginBottom: '3rem', fontSize: '1.6rem' }}>
          Explore our complete collection of shirts, pants, jackets, shoes, and accessories.
        </p>
        <Link to="/" className="btn-hero-primary" style={{ display: 'inline-block', padding: '1.4rem 4rem', fontSize: '1.6rem' }}>
          Shop Collection Now →
        </Link>
      </section>
    </div>
  );
}

export default AboutScreen;

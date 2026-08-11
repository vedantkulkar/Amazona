import React, { useState, useEffect, useRef } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { listProducts } from '../actions/productActions';
import { addToCart } from '../actions/cartActions';

/* ── Tiny hook: triggers once when element enters viewport ── */
function useInView(threshold = 0.12) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setInView(true); obs.disconnect(); }
    }, { threshold });
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

/* ── Animated counter ── */
function Counter({ end, suffix = '' }) {
  const [count, setCount] = useState(0);
  const [ref, inView] = useInView();
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = Math.ceil(end / 60);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else setCount(start);
    }, 20);
    return () => clearInterval(timer);
  }, [inView, end]);
  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

const CATEGORIES = [
  { id: 'Shirts',      icon: '👕', label: 'Shirts',      desc: 'Everyday essentials' },
  { id: 'Pants',       icon: '👖', label: 'Pants',       desc: 'Comfort & style' },
  { id: 'Shoes',       icon: '👟', label: 'Shoes',       desc: 'Step in confidence' },
  { id: 'Accessories', icon: '⌚', label: 'Accessories', desc: 'Finishing touches' },
];

function HomeScreen(props) {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [sortOrder, setSortOrder] = useState('');
  const [addedId, setAddedId] = useState(null);
  const category = props.match && props.match.params.id ? props.match.params.id : '';

  const productList  = useSelector((state) => state.productList);
  const { products, loading, error } = productList;
  const dispatch  = useDispatch();
  const history   = useHistory();

  const [heroRef,    heroInView]    = useInView(0.05);
  const [catRef,     catInView]     = useInView(0.1);
  const [prodRef,    prodInView]    = useInView(0.05);

  useEffect(() => {
    dispatch(listProducts(category));
  }, [category]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(listProducts(category, searchKeyword, sortOrder));
  };

  const sortHandler = (e) => {
    const val = e.target.value;
    setSortOrder(val);
    dispatch(listProducts(category, searchKeyword, val));
  };

  const handleAddToCart = (product) => {
    dispatch(addToCart(product._id, 1));
    setAddedId(product._id);
    setTimeout(() => setAddedId(null), 1500);
  };

  return (
    <>
      {/* ════════════════════════════════════════
          HERO — Full-viewport landing section
      ════════════════════════════════════════ */}
      {!category && (
        <section className="hero" ref={heroRef}>
          {/* Animated background blobs */}
          <div className="hero-blob hero-blob-1" />
          <div className="hero-blob hero-blob-2" />
          <div className="hero-blob hero-blob-3" />

          {/* Floating particles */}
          <div className="hero-particles">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="particle" style={{ '--i': i }} />
            ))}
          </div>

          <div className={`hero-content ${heroInView ? 'anim-in' : ''}`}>
            <div className="hero-badge">
              <span className="hero-badge-dot" />
              New Season 2025 Collection
            </div>

            <h1 className="hero-title">
              Wear What You <br />
              <span className="hero-gradient-text">Were Born For</span>
            </h1>

            <p className="hero-subtitle">
              Premium fashion curated for the modern lifestyle.
              Free shipping on orders over ₹1,999. Easy 30-day returns.
            </p>

            <div className="hero-actions">
              <button
                className="btn-hero-primary"
                onClick={() => {
                  document.querySelector('.products-section').scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Shop Now
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              </button>
              <Link to="/about" className="btn-hero-ghost">
                Our Story
              </Link>
            </div>

            <div className="hero-stats">
              <div className="hero-stat">
                <strong><Counter end={12000} suffix="+" /></strong>
                <span>Happy Customers</span>
              </div>
              <div className="hero-stat-divider" />
              <div className="hero-stat">
                <strong>4.9 ★</strong>
                <span>Avg. Rating</span>
              </div>
              <div className="hero-stat-divider" />
              <div className="hero-stat">
                <strong>Free</strong>
                <span>Returns</span>
              </div>
              <div className="hero-stat-divider" />
              <div className="hero-stat">
                <strong><Counter end={120} suffix="+" /></strong>
                <span>Products</span>
              </div>
            </div>
          </div>

          <div className="hero-scroll-hint">
            <span>Scroll to explore</span>
            <div className="hero-scroll-arrow">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="6 9 12 15 18 9"/></svg>
            </div>
          </div>
        </section>
      )}

      {/* ════════════════════════════════════════
          CATEGORY PILLS — shown on homepage only
      ════════════════════════════════════════ */}
      {!category && (
        <section className="categories-section" ref={catRef}>
          <div className={`categories-grid ${catInView ? 'anim-in' : ''}`}>
            {CATEGORIES.map((cat, idx) => (
              <Link
                key={cat.id}
                to={`/category/${cat.id}`}
                className="category-card"
                style={{ '--delay': `${idx * 0.08}s` }}
              >
                <div className="category-card-icon">{cat.icon}</div>
                <div className="category-card-text">
                  <strong>{cat.label}</strong>
                  <span>{cat.desc}</span>
                </div>
                <svg className="category-card-arrow" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ════════════════════════════════════════
          PRODUCTS GRID
      ════════════════════════════════════════ */}
      <div className="products-section" ref={prodRef}>
        <div className="section-header">
          <div>
            <h2>{category || 'All Products'}</h2>
            {products && !loading && (
              <p>{products.length} item{products.length !== 1 ? 's' : ''} available</p>
            )}
          </div>
        </div>

        {/* Filter Bar */}
        <div className="filter-bar">
          <form onSubmit={submitHandler}>
            <input
              name="searchKeyword"
              placeholder="Search products…"
              onChange={(e) => setSearchKeyword(e.target.value)}
              value={searchKeyword}
            />
            <button type="submit">Search</button>
          </form>
          <label>Sort by</label>
          <select name="sortOrder" onChange={sortHandler} value={sortOrder}>
            <option value="">Newest</option>
            <option value="lowest">Price: Low → High</option>
            <option value="highest">Price: High → Low</option>
          </select>
        </div>

        {/* States */}
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner" />
            <p>Loading products…</p>
          </div>
        ) : error ? (
          <div className="error-container">
            <div style={{ fontSize: '4rem' }}>⚠️</div>
            <h3>Could not load products</h3>
            <p>{error}</p>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.3rem', marginTop: '0.4rem' }}>
              Make sure the backend server is running at port 5000.
            </p>
          </div>
        ) : (
          <ul className={`products ${prodInView ? 'anim-in' : ''}`}>
            {products && products.map((product, idx) => (
              <li key={product._id} className="product-li" style={{ '--delay': `${(idx % 4) * 0.07}s` }}>
                <div className="product">
                  {/* Image */}
                  <div className="product-image-wrapper">
                    <Link to={`/product/${product._id}`}>
                      <img
                        className="product-image"
                        src={product.image}
                        alt={product.name}
                        loading="lazy"
                      />
                    </Link>
                    <span className="product-badge">{product.category}</span>
                    {product.countInStock === 0 && (
                      <span className="product-oos-badge">Out of Stock</span>
                    )}
                  </div>

                  {/* Body */}
                  <div className="product-body">
                    <div className="product-brand">{product.brand}</div>
                    <div className="product-name">
                      <Link to={`/product/${product._id}`}>{product.name}</Link>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="product-footer">
                    <div className="product-price">₹{Number(product.price).toLocaleString('en-IN')}</div>
                    <button
                      className={`btn-add-cart ${addedId === product._id ? 'added' : ''}`}
                      onClick={() => handleAddToCart(product)}
                      disabled={product.countInStock === 0}
                    >
                      {addedId === product._id ? '✓ Added!' : '+ Cart'}
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* ════════════════════════════════════════
          FEATURES STRIP
      ════════════════════════════════════════ */}
      {!category && (
        <section className="features-strip">
          {[
            { icon: '🚚', title: 'Free Shipping', desc: 'On all orders over ₹1,999' },
            { icon: '🔄', title: '30-Day Returns', desc: 'No questions asked' },
            { icon: '🔒', title: 'Secure Checkout', desc: '256-bit SSL encryption' },
            { icon: '💬', title: '24/7 Support', desc: 'Always here to help' },
          ].map((f) => (
            <div className="feature-item" key={f.title}>
              <div className="feature-icon">{f.icon}</div>
              <div>
                <strong>{f.title}</strong>
                <span>{f.desc}</span>
              </div>
            </div>
          ))}
        </section>
      )}
    </>
  );
}

export default HomeScreen;

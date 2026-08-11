import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { detailsProduct, saveProductReview } from '../actions/productActions';
import Rating from '../components/Rating';
import { PRODUCT_REVIEW_SAVE_RESET } from '../constants/productConstants';

/* ── Tiny toast component ── */
function Toast({ message, icon = '✅', onDone }) {
  const [exiting, setExiting] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setExiting(true), 2500);
    const t2 = setTimeout(() => onDone(), 3000);
    return () => { clearTimeout(t); clearTimeout(t2); };
  }, [onDone]);
  return (
    <div className={`toast ${exiting ? 'toast-exit' : ''}`}>
      <span className="toast-icon">{icon}</span>
      <span>{message}</span>
    </div>
  );
}

/* ── Star display helper ── */
function StarRow({ value }) {
  return (
    <div style={{ display: 'flex', gap: '0.2rem', alignItems: 'center' }}>
      {[1, 2, 3, 4, 5].map((s) => (
        <span key={s} style={{ fontSize: '1.4rem', color: s <= Math.round(value) ? 'var(--warning)' : 'var(--border)' }}>★</span>
      ))}
    </div>
  );
}

function ProductScreen(props) {
  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [showToast, setShowToast] = useState(false);

  const userSignin = useSelector((state) => state.userSignin);
  const { userInfo } = userSignin;

  const productDetails = useSelector((state) => state.productDetails);
  const { product, loading, error } = productDetails;

  const productReviewSave = useSelector((state) => state.productReviewSave);
  const { success: productSaveSuccess } = productReviewSave;

  const dispatch = useDispatch();

  useEffect(() => {
    if (productSaveSuccess) {
      setShowToast(true);
      setRating(0);
      setComment('');
      dispatch({ type: PRODUCT_REVIEW_SAVE_RESET });
    }
    dispatch(detailsProduct(props.match.params.id));
    return () => {};
  }, [productSaveSuccess]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(
      saveProductReview(props.match.params.id, {
        name: userInfo.name,
        rating: rating,
        comment: comment,
      })
    );
  };

  const handleAddToCart = () => {
    props.history.push('/cart/' + props.match.params.id + '?qty=' + qty);
  };

  return (
    <>
      {showToast && (
        <Toast
          message="Review submitted successfully!"
          icon="⭐"
          onDone={() => setShowToast(false)}
        />
      )}

      {loading ? (
        <div className="loading-container" style={{ paddingTop: 'calc(6.4rem + 4rem)' }}>
          <div className="loading-spinner" />
          <p>Loading product…</p>
        </div>
      ) : error ? (
        <div className="error-container" style={{ paddingTop: 'calc(6.4rem + 3rem)' }}>
          <div style={{ fontSize: '4rem' }}>⚠️</div>
          <h3>Product not found</h3>
          <p>{error}</p>
          <Link to="/" className="button primary" style={{ marginTop: '1.6rem' }}>← Back to Shop</Link>
        </div>
      ) : (
        <>
          {/* ── Back Link ── */}
          <div className="back-to-result">
            <Link to="/">
              ← Back to results
            </Link>
          </div>

          {/* ── Product Details ── */}
          <div className="details">
            {/* Image */}
            <div className="details-image">
              <img src={product.image} alt={product.name} />
            </div>

            {/* Info */}
            <div className="details-info">
              <ul>
                <li>
                  <div className="product-brand-label">{product.brand}</div>
                  <h1>{product.name}</h1>
                </li>
                <li>
                  <a href="#reviews" style={{ textDecoration: 'none' }}>
                    <Rating value={product.rating} text={`${product.numReviews} reviews`} />
                  </a>
                </li>
                <li>
                  <span className="details-price-label">Price</span>
                  <span className="details-price">₹{Number(product.price).toLocaleString('en-IN')}</span>
                </li>
                <li>
                  <div className="details-description">{product.description}</div>
                </li>
              </ul>
            </div>

            {/* Action Panel */}
            <div className="details-action">
              <h2>Add to Cart</h2>
              <ul>
                <li>
                  <div className="details-action-item">
                    <span className="details-action-label">Price</span>
                    <span className="details-action-value">₹{Number(product.price).toLocaleString('en-IN')}</span>
                  </div>
                </li>
                <li>
                  <div className="details-action-item">
                    <span className="details-action-label">Status</span>
                    {product.countInStock > 0 ? (
                      <span className="badge badge-success">✓ In Stock</span>
                    ) : (
                      <span className="badge badge-danger">✕ Out of Stock</span>
                    )}
                  </div>
                </li>
                {product.countInStock > 0 && (
                  <li>
                    <div className="details-action-item">
                      <span className="details-action-label">Quantity</span>
                      <select
                        className="details-qty-select"
                        value={qty}
                        onChange={(e) => setQty(e.target.value)}
                      >
                        {[...Array(product.countInStock).keys()].map((x) => (
                          <option key={x + 1} value={x + 1}>
                            {x + 1}
                          </option>
                        ))}
                      </select>
                    </div>
                  </li>
                )}
                <li style={{ marginTop: '0.8rem' }}>
                  {product.countInStock > 0 ? (
                    <button
                      onClick={handleAddToCart}
                      className="button primary full-width"
                      style={{ padding: '1.4rem', fontSize: '1.5rem' }}
                    >
                      🛒 Add to Cart
                    </button>
                  ) : (
                    <button className="button full-width" disabled style={{ opacity: 0.4 }}>
                      Out of Stock
                    </button>
                  )}
                </li>
              </ul>
            </div>
          </div>

          {/* ── Reviews Section ── */}
          <div className="reviews-section" id="reviews">
            <h2>Customer Reviews</h2>

            {product.reviews && product.reviews.length === 0 ? (
              <div className="reviews-empty">
                <span style={{ fontSize: '2rem' }}>💬</span>
                <span>No reviews yet. Be the first to share your experience!</span>
              </div>
            ) : (
              <ul className="review" style={{ marginBottom: '2.4rem' }}>
                {product.reviews && product.reviews.map((review) => (
                  <li key={review._id}>
                    <div className="review-card">
                      <div className="review-header">
                        <span className="review-author">👤 {review.name}</span>
                        <span className="review-date">{review.createdAt ? review.createdAt.substring(0, 10) : ''}</span>
                      </div>
                      <StarRow value={review.rating} />
                      <div className="review-comment">{review.comment}</div>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            {/* Write Review Form */}
            <div className="review-form-card">
              <h3>✍️ Write a Review</h3>
              {userInfo ? (
                <form onSubmit={submitHandler}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.6rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                      <label style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--txt-2)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Rating
                      </label>
                      <select
                        value={rating}
                        onChange={(e) => setRating(e.target.value)}
                        style={{ maxWidth: '24rem' }}
                      >
                        <option value="">— Select rating —</option>
                        <option value="1">⭐ 1 — Poor</option>
                        <option value="2">⭐⭐ 2 — Fair</option>
                        <option value="3">⭐⭐⭐ 3 — Good</option>
                        <option value="4">⭐⭐⭐⭐ 4 — Very Good</option>
                        <option value="5">⭐⭐⭐⭐⭐ 5 — Excellent</option>
                      </select>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                      <label style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--txt-2)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Comment
                      </label>
                      <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Share your experience with this product…"
                        style={{ minHeight: '10rem', resize: 'vertical' }}
                      />
                    </div>
                    <button type="submit" className="button primary" style={{ alignSelf: 'flex-start', padding: '1.1rem 2.8rem' }}>
                      Submit Review
                    </button>
                  </div>
                </form>
              ) : (
                <div className="review-sign-in-prompt">
                  Please <Link to="/signin">sign in</Link> to write a review.
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default ProductScreen;

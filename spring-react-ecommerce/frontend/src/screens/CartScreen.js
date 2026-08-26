import React, { useEffect, useState } from 'react';
import { addToCart, removeFromCart } from '../actions/cartActions';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const PROMO_CODES = {
  WELCOME10: { type: 'percent', value: 10, label: '10% Welcome Discount' },
  AMAZONA500: { type: 'flat', value: 500, label: '₹500 Festival Discount' },
  FREESHIP: { type: 'freeship', value: 0, label: 'Free Express Shipping' },
};

function CartScreen(props) {
  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');

  const productId = props.match.params.id;
  const qty = props.location.search ? Number(props.location.search.split('=')[1]) : 1;
  const dispatch = useDispatch();

  const removeFromCartHandler = (productId) => {
    dispatch(removeFromCart(productId));
  };

  useEffect(() => {
    if (productId) {
      dispatch(addToCart(productId, qty));
    }
  }, [dispatch, productId, qty]);

  const checkoutHandler = () => {
    props.history.push('/signin?redirect=shipping');
  };

  const itemsCount = cartItems.reduce((a, c) => a + c.qty, 0);
  const subtotal = cartItems.reduce((a, c) => a + c.price * c.qty, 0);

  let discountAmount = 0;
  let isFreeShipPromo = false;

  if (appliedCoupon && subtotal > 0) {
    if (appliedCoupon.type === 'percent') {
      discountAmount = Math.round((subtotal * appliedCoupon.value) / 100);
    } else if (appliedCoupon.type === 'flat') {
      discountAmount = Math.min(appliedCoupon.value, subtotal);
    } else if (appliedCoupon.type === 'freeship') {
      isFreeShipPromo = true;
    }
  }

  const shippingPrice =
    cartItems.length === 0
      ? 0
      : subtotal > 1999 || isFreeShipPromo
      ? 0
      : 149;

  const totalPrice = Math.max(0, subtotal - discountAmount + shippingPrice);

  const handleApplyCoupon = (codeToApply) => {
    const code = (codeToApply || couponInput).trim().toUpperCase();
    setCouponError('');
    if (!code) return;

    if (PROMO_CODES[code]) {
      setAppliedCoupon({ code, ...PROMO_CODES[code] });
      setCouponInput('');
    } else {
      setCouponError('Invalid coupon code. Try WELCOME10 or AMAZONA500.');
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponError('');
  };

  return (
    <div className="cart">
      {/* ── Cart Items ── */}
      <div className="cart-list">
        <h1 className="cart-title">
          🛒 Shopping Cart
          {cartItems.length > 0 && (
            <span style={{ fontSize: '1.6rem', fontWeight: 500, color: 'var(--txt-3)', marginLeft: '1rem' }}>
              ({itemsCount} {itemsCount === 1 ? 'item' : 'items'})
            </span>
          )}
        </h1>

        {cartItems.length === 0 ? (
          <div className="cart-empty">
            <div className="cart-empty-icon">🛒</div>
            <h3>Your cart is empty</h3>
            <p>Looks like you haven't added anything yet.</p>
            <Link to="/" className="button primary" style={{ marginTop: '0.8rem' }}>
              Start Shopping →
            </Link>
          </div>
        ) : (
          <div>
            {cartItems.map((item) => (
              <div key={item.product} className="cart-item">
                {/* Image */}
                <Link to={`/product/${item.product}`}>
                  <img src={item.image} alt={item.name} />
                </Link>

                {/* Info */}
                <div className="cart-item-info">
                  <div className="cart-item-name">
                    <Link to={`/product/${item.product}`}>{item.name}</Link>
                  </div>
                  <div className="cart-item-controls">
                    <div className="cart-item-qty">
                      <select
                        value={item.qty}
                        onChange={(e) => dispatch(addToCart(item.product, Number(e.target.value)))}
                      >
                        {[...Array(item.countInStock).keys()].map((x) => (
                          <option key={x + 1} value={x + 1}>
                            Qty: {x + 1}
                          </option>
                        ))}
                      </select>
                    </div>
                    <button
                      className="cart-delete-btn"
                      onClick={() => removeFromCartHandler(item.product)}
                    >
                      🗑 Remove
                    </button>
                  </div>
                </div>

                {/* Price */}
                <div>
                  <div className="cart-item-price">₹{Number(item.price).toLocaleString('en-IN')}</div>
                  {item.qty > 1 && (
                    <div className="cart-item-subtotal">
                      ₹{Number(item.price).toLocaleString('en-IN')} × {item.qty} = ₹{(item.price * item.qty).toLocaleString('en-IN')}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Order Summary ── */}
      <div className="cart-action">
        <div className="cart-summary-title">Order Summary</div>

        <div className="cart-summary-row">
          <span>Items ({itemsCount})</span>
          <span>₹{subtotal.toLocaleString('en-IN')}</span>
        </div>

        {appliedCoupon && discountAmount > 0 && (
          <div className="cart-summary-row" style={{ color: 'var(--success)', fontWeight: 600 }}>
            <span>Discount ({appliedCoupon.code})</span>
            <span>- ₹{discountAmount.toLocaleString('en-IN')}</span>
          </div>
        )}

        <div className="cart-summary-row">
          <span>Shipping</span>
          <span>
            {cartItems.length === 0
              ? '₹0'
              : subtotal > 1999 || isFreeShipPromo
              ? <span style={{ color: 'var(--success)', fontWeight: 600 }}>FREE</span>
              : '₹149'}
          </span>
        </div>

        {cartItems.length > 0 && subtotal <= 1999 && !isFreeShipPromo && (
          <div style={{ fontSize: '1.2rem', color: 'var(--txt-3)', paddingBottom: '0.6rem', lineHeight: 1.5 }}>
            Add ₹{(1999 - subtotal).toLocaleString('en-IN')} more for free shipping!
          </div>
        )}

        {/* Coupon Input Area */}
        {cartItems.length > 0 && (
          <div style={{ margin: '1.4rem 0', padding: '1.2rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', borderRadius: '12px' }}>
            <div style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--txt)', marginBottom: '0.8rem', display: 'flex', justifyContent: 'space-between' }}>
              <span>🏷️ Have a Coupon?</span>
              {appliedCoupon && (
                <button onClick={handleRemoveCoupon} style={{ background: 'none', border: 'none', color: 'var(--danger)', fontSize: '1.15rem', cursor: 'pointer' }}>
                  Remove ✕
                </button>
              )}
            </div>

            {appliedCoupon ? (
              <div style={{ padding: '0.6rem 1rem', background: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.4)', borderRadius: '8px', color: '#10b981', fontSize: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>✅ <strong>{appliedCoupon.code}</strong> applied ({appliedCoupon.label})</span>
              </div>
            ) : (
              <div>
                <div style={{ display: 'flex', gap: '0.6rem' }}>
                  <input
                    type="text"
                    placeholder="Enter coupon code"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                    style={{ flex: 1, padding: '0.8rem 1rem', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--txt)', textTransform: 'uppercase', fontSize: '1.25rem' }}
                  />
                  <button
                    type="button"
                    onClick={() => handleApplyCoupon()}
                    className="button secondary"
                    style={{ padding: '0.8rem 1.4rem', fontSize: '1.2rem' }}
                  >
                    Apply
                  </button>
                </div>
                {couponError && <p style={{ color: 'var(--danger)', fontSize: '1.15rem', margin: '0.6rem 0 0 0' }}>{couponError}</p>}
                <div style={{ display: 'flex', gap: '0.6rem', marginTop: '0.8rem', flexWrap: 'wrap' }}>
                  <button type="button" onClick={() => handleApplyCoupon('WELCOME10')} style={{ fontSize: '1.1rem', padding: '0.3rem 0.8rem', background: 'rgba(99, 102, 241, 0.1)', border: '1px dashed var(--accent)', borderRadius: '6px', color: 'var(--accent-2)', cursor: 'pointer' }}>
                    Use WELCOME10 (10% Off)
                  </button>
                  <button type="button" onClick={() => handleApplyCoupon('AMAZONA500')} style={{ fontSize: '1.1rem', padding: '0.3rem 0.8rem', background: 'rgba(99, 102, 241, 0.1)', border: '1px dashed var(--accent)', borderRadius: '6px', color: 'var(--accent-2)', cursor: 'pointer' }}>
                    Use AMAZONA500 (₹500 Off)
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="cart-summary-total">
          <span>Total</span>
          <span>₹{totalPrice.toLocaleString('en-IN')}</span>
        </div>

        <button
          onClick={checkoutHandler}
          className="button primary full-width"
          disabled={cartItems.length === 0}
          style={{ padding: '1.4rem', fontSize: '1.5rem' }}
        >
          Proceed to Checkout →
        </button>

        {cartItems.length > 0 && (
          <Link to="/" className="button secondary full-width text-center" style={{ marginTop: '1rem', display: 'block', padding: '1.1rem' }}>
            Continue Shopping
          </Link>
        )}
      </div>
    </div>
  );
}

export default CartScreen;
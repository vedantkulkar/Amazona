import React, { useEffect } from 'react';
import { addToCart, removeFromCart } from '../actions/cartActions';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

function CartScreen(props) {
  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

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
  }, []);

  const checkoutHandler = () => {
    props.history.push('/signin?redirect=shipping');
  };

  const itemsCount = cartItems.reduce((a, c) => a + c.qty, 0);
  const subtotal = cartItems.reduce((a, c) => a + c.price * c.qty, 0);
  const shippingPrice = cartItems.length === 0 ? 0 : subtotal > 1999 ? 0 : 149;
  const totalPrice = subtotal + shippingPrice;

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
        <div className="cart-summary-row">
          <span>Shipping</span>
          <span>
            {cartItems.length === 0
              ? '₹0'
              : subtotal > 1999
              ? <span style={{ color: 'var(--success)' }}>FREE</span>
              : '₹149'}
          </span>
        </div>
        {cartItems.length > 0 && subtotal <= 1999 && (
          <div style={{ fontSize: '1.2rem', color: 'var(--txt-3)', paddingBottom: '0.6rem', lineHeight: 1.5 }}>
            Add ₹{(1999 - subtotal).toLocaleString('en-IN')} more for free shipping!
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
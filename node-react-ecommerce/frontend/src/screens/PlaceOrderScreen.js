import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import CheckoutSteps from '../components/CheckoutSteps';
import { createOrder } from '../actions/orderActions';

function PlaceOrderScreen(props) {
  const cart = useSelector((state) => state.cart) || {};
  const orderCreate = useSelector((state) => state.orderCreate) || {};
  const { loading, success, error, order } = orderCreate;

  const cartItems = cart.cartItems || [];
  const shipping = cart.shipping || {};
  const payment = cart.payment || {};

  if (!shipping.address) {
    props.history.push('/shipping');
  } else if (!payment.paymentMethod) {
    props.history.push('/payment');
  }

  const itemsPrice = cartItems.reduce((a, c) => a + c.price * c.qty, 0);
  const shippingPrice = cartItems.length === 0 ? 0 : itemsPrice > 1999 ? 0 : 149;
  const taxPrice = cartItems.length === 0 ? 0 : Math.round(0.18 * itemsPrice);
  const totalPrice = itemsPrice + shippingPrice + taxPrice;

  const dispatch = useDispatch();

  const placeOrderHandler = () => {
    dispatch(
      createOrder({
        orderItems: cartItems,
        shipping,
        payment,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
      })
    );
  };

  useEffect(() => {
    if (success) {
      props.history.push('/order/' + order._id);
    }
  }, [success]);

  return (
    <div>
      <CheckoutSteps step1 step2 step3 step4 />

      <div className="placeorder">
        {/* ── Left: Info ── */}
        <div className="placeorder-info">
          {/* Shipping Section */}
          <div className="order-section">
            <div className="order-section-header">
              <span className="order-section-icon">🚚</span>
              <h3>Shipping Address</h3>
            </div>
            <div className="order-section-body">
              {shipping.address}, {shipping.city}, {shipping.postalCode}, {shipping.country}
            </div>
          </div>

          {/* Payment Section */}
          <div className="order-section">
            <div className="order-section-header">
              <span className="order-section-icon">💳</span>
              <h3>Payment Method</h3>
            </div>
            <div className="order-section-body">
              {payment.paymentMethod === 'upi'
                ? '📱 UPI (Google Pay, PhonePe, Paytm, BHIM)'
                : payment.paymentMethod === 'cod'
                ? '💵 Cash on Delivery (COD)'
                : payment.paymentMethod === 'netbanking'
                ? '🏦 NetBanking / Debit & Credit Card'
                : '🅿️ PayPal / International Cards'}
            </div>
          </div>

          {/* Items Section */}
          <div className="order-section">
            <div className="order-section-header">
              <span className="order-section-icon">📦</span>
              <h3>Order Items ({cartItems.length})</h3>
            </div>
            {cartItems.length === 0 ? (
              <div style={{ color: 'var(--txt-3)', padding: '1rem 0' }}>Cart is empty.</div>
            ) : (
              cartItems.map((item) => (
                <div key={item.product} className="order-item">
                  <img src={item.image} alt={item.name} />
                  <div className="order-item-info">
                    <div className="order-item-name">
                      <Link to={`/product/${item.product}`}>{item.name}</Link>
                    </div>
                    <div className="order-item-qty">
                      {item.qty} × ₹{Number(item.price).toLocaleString('en-IN')} = ₹{(item.qty * item.price).toLocaleString('en-IN')}
                    </div>
                  </div>
                  <div className="order-item-price">₹{(item.qty * item.price).toLocaleString('en-IN')}</div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* ── Right: Summary ── */}
        <div className="placeorder-action">
          <div className="order-summary-card">
            <div className="order-summary-title">Order Summary</div>

            <div className="order-summary-row">
              <span>Items</span>
              <span>₹{itemsPrice.toLocaleString('en-IN')}</span>
            </div>
            <div className="order-summary-row">
              <span>Shipping</span>
              <span>
                {shippingPrice === 0
                  ? <span style={{ color: 'var(--success)' }}>FREE</span>
                  : `₹${shippingPrice.toLocaleString('en-IN')}`}
              </span>
            </div>
            <div className="order-summary-row">
              <span>GST (18%)</span>
              <span>₹{taxPrice.toLocaleString('en-IN')}</span>
            </div>
            <div className="order-summary-total">
              <span>Order Total</span>
              <span>₹{totalPrice.toLocaleString('en-IN')}</span>
            </div>

            {error && (
              <div className="alert alert-error" style={{ margin: '1.2rem 0 0' }}>
                <span className="alert-icon">⚠️</span>
                {error}
              </div>
            )}

            <button
              className="button primary full-width"
              onClick={placeOrderHandler}
              disabled={cartItems.length === 0 || loading}
              style={{ marginTop: '1.8rem', padding: '1.4rem', fontSize: '1.5rem' }}
            >
              {loading ? '⏳ Placing Order…' : '✓ Place Order'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PlaceOrderScreen;
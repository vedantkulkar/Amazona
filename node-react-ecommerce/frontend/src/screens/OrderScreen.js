import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { detailsOrder, payOrder, cancelOrder, returnOrder } from '../actions/orderActions';
import PaypalButton from '../components/PaypalButton';

function OrderScreen(props) {
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('Ordered by mistake');

  const [showReturnModal, setShowReturnModal] = useState(false);
  const [returnType, setReturnType] = useState('replace');
  const [returnReason, setReturnReason] = useState('Size or fit issue');

  // Interactive Payment Widget States
  const [upiTab, setUpiTab] = useState('vpa');
  const [vpaId, setVpaId] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [cardExp, setCardExp] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [selectedBank, setSelectedBank] = useState('HDFC');
  const [paymentMode, setPaymentMode] = useState('upi');

  const orderPay = useSelector((state) => state.orderPay);
  const { loading: loadingPay, success: successPay } = orderPay;

  const orderCancel = useSelector((state) => state.orderCancel) || {};
  const { loading: loadingCancel, success: successCancel } = orderCancel;

  const orderReturn = useSelector((state) => state.orderReturn) || {};
  const { loading: loadingReturn, success: successReturn } = orderReturn;

  const orderDetails = useSelector((state) => state.orderDetails);
  const { loading, order, error } = orderDetails;

  const dispatch = useDispatch();

  useEffect(() => {
    if (successPay || successCancel || successReturn) {
      dispatch(detailsOrder(props.match.params.id));
      setShowCancelModal(false);
      setShowReturnModal(false);
    } else {
      dispatch(detailsOrder(props.match.params.id));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [successPay, successCancel, successReturn, dispatch, props.match.params.id]);

  useEffect(() => {
    if (order && order.payment && order.payment.paymentMethod) {
      setPaymentMode(order.payment.paymentMethod);
    }
  }, [order]);

  const handleSuccessPayment = (paymentResult) => {
    dispatch(payOrder(order, paymentResult));
  };

  const handleCancelSubmit = (e) => {
    e.preventDefault();
    dispatch(cancelOrder(order._id, cancelReason));
  };

  const handleReturnSubmit = (e) => {
    e.preventDefault();
    dispatch(returnOrder(order._id, { returnType, reason: returnReason }));
  };

  if (loading) {
    return (
      <div className="loading-container" style={{ paddingTop: 'calc(6.4rem + 4rem)' }}>
        <div className="loading-spinner" />
        <p>Loading order…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container" style={{ paddingTop: 'calc(6.4rem + 3rem)' }}>
        <div style={{ fontSize: '4rem' }}>⚠️</div>
        <h3>Order not found</h3>
        <p>{error}</p>
        <Link to="/profile" className="button primary" style={{ marginTop: '1.6rem' }}>← My Orders</Link>
      </div>
    );
  }

  return (
    <div>
      <div className="placeorder">
        {/* ── Left: Info ── */}
        <div className="placeorder-info">

          {/* Order ID header */}
          <div style={{ paddingTop: 'calc(6.4rem + 1rem)', marginBottom: '0.4rem' }}>
            <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '2.4rem', fontWeight: 800, color: 'var(--txt)' }}>
              Order Details
            </h1>
            <p style={{ fontSize: '1.25rem', color: 'var(--txt-3)', marginTop: '0.4rem' }}>
              Order ID: <span style={{ color: 'var(--txt-2)', fontFamily: 'monospace' }}>{order._id}</span>
            </p>
          </div>

          {/* Status Banners */}
          {/* Status Banners */}
          {(order.isCanceled || order.canceled || order.orderStatus === 'Cancelled') && (
            <div className="alert alert-error" style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <span style={{ fontSize: '2.4rem' }}>❌</span>
              <div>
                <strong style={{ fontSize: '1.5rem', display: 'block' }}>Order Canceled</strong>
                <span style={{ fontSize: '1.3rem' }}>Reason: {order.cancelReason || 'Canceled by user'}</span>
                {(order.isPaid || order.paid) && (
                  <div style={{ fontSize: '1.2rem', marginTop: '0.3rem', opacity: 0.9 }}>
                    ✓ Refund initiated. Money will be credited back within 3-5 business days.
                  </div>
                )}
              </div>
            </div>
          )}

          {(order.isReturned || order.returned) && (
            <div className="alert alert-warning" style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <span style={{ fontSize: '2.4rem' }}>🔄</span>
              <div>
                <strong style={{ fontSize: '1.5rem', display: 'block' }}>
                  {order.returnType === 'replace' ? 'Replacement Requested' : 'Return & Refund Requested'}
                </strong>
                <span style={{ fontSize: '1.3rem' }}>Reason: {order.returnReason || 'Customer requested return'}</span>
                <div style={{ fontSize: '1.2rem', marginTop: '0.3rem', opacity: 0.9 }}>
                  🚚 Delivery partner pickup scheduled within 24-48 hours.
                </div>
              </div>
            </div>
          )}

          {/* Shipping Section */}
          <div className="order-section">
            <div className="order-section-header">
              <span className="order-section-icon">🚚</span>
              <h3>Shipping</h3>
              <div style={{ marginLeft: 'auto' }}>
                {(order.isCanceled || order.canceled || order.orderStatus === 'Cancelled') ? (
                  <span className="badge badge-danger">❌ Canceled</span>
                ) : (order.isReturned || order.returned) ? (
                  <span className="badge badge-warning">🔄 {order.returnType === 'replace' ? 'Replace' : 'Return'}</span>
                ) : (order.isDelivered || order.delivered || order.orderStatus === 'Delivered') ? (
                  <span className="badge badge-success">✓ Delivered</span>
                ) : (
                  <span className="badge badge-warning">⏳ {order.orderStatus || 'Processing'}</span>
                )}
              </div>
            </div>
            <div className="order-section-body">
              <strong style={{ color: 'var(--txt)' }}>Address:</strong>{' '}
              {order.shipping.address}, {order.shipping.city}, {order.shipping.postalCode}, {order.shipping.country}
              {(order.isDelivered || order.delivered) && (
                <div style={{ marginTop: '0.6rem', color: 'var(--success)', fontSize: '1.3rem' }}>
                  ✓ Delivered on {new Date(order.deliveredAt).toLocaleDateString()}
                </div>
              )}
            </div>
          </div>

          {/* Payment Section */}
          <div className="order-section">
            <div className="order-section-header">
              <span className="order-section-icon">💳</span>
              <h3>Payment Method</h3>
              <div style={{ marginLeft: 'auto' }}>
                {(order.isPaid || order.paid || order.orderStatus === 'Paid') ? (
                  <span className="badge badge-success">✓ Paid</span>
                ) : (order.isCanceled || order.canceled || order.orderStatus === 'Cancelled') ? (
                  <span className="badge badge-danger">✕ Canceled</span>
                ) : (
                  <span className="badge badge-danger">✕ Pending Payment</span>
                )}
              </div>
            </div>
            <div className="order-section-body">
              <strong style={{ color: 'var(--txt)' }}>Selected:</strong>{' '}
              {order.payment?.paymentMethod === 'upi'
                ? '📱 UPI (Google Pay, PhonePe, Paytm, BHIM)'
                : order.payment?.paymentMethod === 'cod'
                ? '💵 Cash on Delivery (COD)'
                : order.payment?.paymentMethod === 'netbanking'
                ? '🏦 NetBanking / Debit & Credit Card'
                : '🅿️ PayPal / International Cards'}
              {(order.isPaid || order.paid) && (
                <div style={{ marginTop: '0.6rem', color: 'var(--success)', fontSize: '1.3rem' }}>
                  ✓ Paid on {order.paidAt ? new Date(order.paidAt).toLocaleDateString() : 'Today'}
                </div>
              )}
            </div>
          </div>

          {/* Items Section */}
          <div className="order-section">
            <div className="order-section-header">
              <span className="order-section-icon">📦</span>
              <h3>Order Items</h3>
            </div>
            {order.orderItems.length === 0 ? (
              <div style={{ color: 'var(--txt-3)', padding: '1rem 0' }}>No items.</div>
            ) : (
              order.orderItems.map((item) => (
                <div key={item._id || item.product} className="order-item">
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

        {/* ── Right: Summary & Action Buttons ── */}
        <div className="placeorder-action">
          <div className="order-summary-card">
            <div className="order-summary-title">Order Summary</div>

            <div className="order-summary-row">
              <span>Items</span>
              <span>₹{Number(order.itemsPrice).toLocaleString('en-IN')}</span>
            </div>
            <div className="order-summary-row">
              <span>Shipping</span>
              <span>
                {Number(order.shippingPrice) === 0
                  ? <span style={{ color: 'var(--success)' }}>FREE</span>
                  : `₹${Number(order.shippingPrice).toLocaleString('en-IN')}`}
              </span>
            </div>
            <div className="order-summary-row">
              <span>GST (18%)</span>
              <span>₹{Number(order.taxPrice).toLocaleString('en-IN')}</span>
            </div>
            <div className="order-summary-total">
              <span>Order Total</span>
              <span>₹{Number(order.totalPrice).toLocaleString('en-IN')}</span>
            </div>

            {/* Dynamic Payment Options */}
            {/* Dynamic Payment Options */}
            {!order.isPaid && !order.isCanceled && (
              <div style={{ marginTop: '1.6rem' }}>
                {loadingPay ? (
                  <div className="alert alert-loading" style={{ padding: '2rem', justifyContent: 'center' }}>
                    <div className="loading-spinner" style={{ width: '2.8rem', height: '2.8rem', marginRight: '1rem' }} />
                    Processing your payment securely…
                  </div>
                ) : (
                  <div>
                    {/* Payment Mode Selector Pills */}
                    <div style={{ display: 'flex', gap: '0.6rem', marginBottom: '1.4rem', overflowX: 'auto', paddingBottom: '0.4rem' }}>
                      <button
                        type="button"
                        onClick={() => setPaymentMode('upi')}
                        className={`upi-tab-btn ${paymentMode === 'upi' ? 'active' : ''}`}
                      >
                        📱 UPI
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentMode('netbanking')}
                        className={`upi-tab-btn ${paymentMode === 'netbanking' ? 'active' : ''}`}
                      >
                        🏦 Card / Banking
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentMode('cod')}
                        className={`upi-tab-btn ${paymentMode === 'cod' ? 'active' : ''}`}
                      >
                        💵 COD
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentMode('paypal')}
                        className={`upi-tab-btn ${paymentMode === 'paypal' ? 'active' : ''}`}
                      >
                        🅿️ PayPal
                      </button>
                    </div>

                    {/* 📱 UPI PAYMENT WIDGET */}
                    {paymentMode === 'upi' && (
                      <div className="payment-widget-container">
                        <div className="payment-widget-header">
                          <span>📱</span>
                          <h4>Instant UPI Payment</h4>
                        </div>

                        {/* UPI Mode Tabs */}
                        <div className="upi-tab-buttons">
                          <button
                            type="button"
                            className={`upi-tab-btn ${upiTab === 'vpa' ? 'active' : ''}`}
                            onClick={() => setUpiTab('vpa')}
                          >
                            VPA / ID
                          </button>
                          <button
                            type="button"
                            className={`upi-tab-btn ${upiTab === 'qr' ? 'active' : ''}`}
                            onClick={() => setUpiTab('qr')}
                          >
                            Scan QR
                          </button>
                          <button
                            type="button"
                            className={`upi-tab-btn ${upiTab === 'app' ? 'active' : ''}`}
                            onClick={() => setUpiTab('app')}
                          >
                            UPI Apps
                          </button>
                        </div>

                        {upiTab === 'vpa' && (
                          <div>
                            <label style={{ display: 'block', fontSize: '1.2rem', color: 'var(--txt-2)', marginBottom: '0.6rem' }}>
                              Enter UPI ID / VPA (e.g. mobile@upi, name@okicici)
                            </label>
                            <input
                              type="text"
                              placeholder="9876543210@paytm / user@upi"
                              value={vpaId}
                              onChange={(e) => setVpaId(e.target.value)}
                              style={{ marginBottom: '1rem' }}
                            />
                            <button
                              type="button"
                              onClick={() =>
                                handleSuccessPayment({
                                  paymentMethod: 'upi',
                                  payerID: vpaId || 'UPI_USER',
                                  orderID: order._id,
                                  paymentID: 'UPI_VPA_' + Date.now(),
                                })
                              }
                              className="button primary full-width"
                              style={{ padding: '1.2rem', background: '#5f259f', borderColor: '#5f259f', fontSize: '1.4rem' }}
                            >
                              📱 Verify & Pay ₹{Number(order.totalPrice).toLocaleString('en-IN')}
                            </button>
                          </div>
                        )}

                        {upiTab === 'qr' && (
                          <div className="upi-qr-box">
                            <div className="upi-qr-frame">
                              <div className="upi-qr-scanner-line" />
                              <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="#1e1b4b" strokeWidth="2">
                                <rect x="2" y="2" width="8" height="8" rx="1" fill="#1e1b4b" />
                                <rect x="14" y="2" width="8" height="8" rx="1" fill="#1e1b4b" />
                                <rect x="2" y="14" width="8" height="8" rx="1" fill="#1e1b4b" />
                                <rect x="14" y="14" width="4" height="4" fill="#5f259f" />
                                <rect x="18" y="18" width="4" height="4" fill="#5f259f" />
                                <rect x="10" y="10" width="4" height="4" fill="#5f259f" />
                              </svg>
                            </div>
                            <p style={{ fontSize: '1.2rem', color: 'var(--txt-2)' }}>
                              Scan with PhonePe, Google Pay, Paytm or any UPI App
                            </p>
                            <button
                              type="button"
                              onClick={() =>
                                handleSuccessPayment({
                                  paymentMethod: 'upi',
                                  payerID: 'UPI_QR_SCANNED',
                                  orderID: order._id,
                                  paymentID: 'UPI_QR_' + Date.now(),
                                })
                              }
                              className="button primary full-width"
                              style={{ padding: '1.1rem', background: '#5f259f', borderColor: '#5f259f' }}
                            >
                              ✓ Simulate QR Scan Payment
                            </button>
                          </div>
                        )}

                        {upiTab === 'app' && (
                          <div>
                            <p style={{ fontSize: '1.2rem', color: 'var(--txt-2)', marginBottom: '0.8rem' }}>
                              Select your preferred app:
                            </p>
                            <div className="upi-apps-grid">
                              {['Google Pay', 'PhonePe', 'Paytm', 'BHIM'].map((appName) => (
                                <button
                                  key={appName}
                                  type="button"
                                  className="upi-app-chip"
                                  onClick={() =>
                                    handleSuccessPayment({
                                      paymentMethod: 'upi',
                                      payerID: `UPI_${appName.toUpperCase().replace(/\s+/g, '_')}`,
                                      orderID: order._id,
                                      paymentID: 'UPI_APP_' + Date.now(),
                                    })
                                  }
                                >
                                  <span style={{ fontSize: '2rem' }}>
                                    {appName === 'Google Pay' ? '🔵' : appName === 'PhonePe' ? '🟣' : appName === 'Paytm' ? '🟦' : '🇮🇳'}
                                  </span>
                                  <span>{appName}</span>
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* 🏦 CARD / NETBANKING WIDGET */}
                    {paymentMode === 'netbanking' && (
                      <div className="payment-widget-container">
                        <div className="payment-widget-header">
                          <span>🏦</span>
                          <h4>Debit / Credit Card & NetBanking</h4>
                        </div>

                        {/* Interactive Visual Card Preview */}
                        <div className="card-preview">
                          <div className="card-chip" />
                          <div className="card-number-display">
                            {cardNumber || '•••• •••• •••• ••••'}
                          </div>
                          <div className="card-details-display">
                            <div>
                              <span style={{ fontSize: '0.9rem', opacity: 0.7, display: 'block' }}>CARD HOLDER</span>
                              <strong>{cardHolder || 'YOUR NAME'}</strong>
                            </div>
                            <div>
                              <span style={{ fontSize: '0.9rem', opacity: 0.7, display: 'block' }}>EXPIRES</span>
                              <strong>{cardExp || 'MM/YY'}</strong>
                            </div>
                            <div>
                              <span style={{ fontSize: '1.4rem' }}>
                                {cardNumber.startsWith('4') ? 'VISA' : cardNumber.startsWith('5') ? 'MC' : 'CARD'}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="card-inputs-grid">
                          <div>
                            <label style={{ display: 'block', fontSize: '1.1rem', color: 'var(--txt-2)', marginBottom: '0.4rem' }}>
                              Card Number
                            </label>
                            <input
                              type="text"
                              maxLength="19"
                              placeholder="4532 8912 3456 7890"
                              value={cardNumber}
                              onChange={(e) => {
                                const val = e.target.value.replace(/\D/g, '').substring(0, 16);
                                setCardNumber(val.replace(/(.{4})/g, '$1 ').trim());
                              }}
                            />
                          </div>

                          <div className="card-input-row">
                            <div style={{ flex: 1 }}>
                              <label style={{ display: 'block', fontSize: '1.1rem', color: 'var(--txt-2)', marginBottom: '0.4rem' }}>
                                Expiry (MM/YY)
                              </label>
                              <input
                                type="text"
                                maxLength="5"
                                placeholder="12/28"
                                value={cardExp}
                                onChange={(e) => setCardExp(e.target.value)}
                              />
                            </div>
                            <div style={{ width: '9rem' }}>
                              <label style={{ display: 'block', fontSize: '1.1rem', color: 'var(--txt-2)', marginBottom: '0.4rem' }}>
                                CVV
                              </label>
                              <input
                                type="password"
                                maxLength="3"
                                placeholder="123"
                                value={cardCvv}
                                onChange={(e) => setCardCvv(e.target.value)}
                              />
                            </div>
                          </div>

                          <div>
                            <label style={{ display: 'block', fontSize: '1.1rem', color: 'var(--txt-2)', marginBottom: '0.4rem' }}>
                              Cardholder Name
                            </label>
                            <input
                              type="text"
                              placeholder="Name on card"
                              value={cardHolder}
                              onChange={(e) => setCardHolder(e.target.value)}
                            />
                          </div>

                          <div>
                            <label style={{ display: 'block', fontSize: '1.1rem', color: 'var(--txt-2)', marginBottom: '0.4rem' }}>
                              Or Select NetBanking Bank
                            </label>
                            <select value={selectedBank} onChange={(e) => setSelectedBank(e.target.value)}>
                              <option value="HDFC">HDFC Bank</option>
                              <option value="SBI">State Bank of India (SBI)</option>
                              <option value="ICICI">ICICI Bank</option>
                              <option value="AXIS">Axis Bank</option>
                              <option value="PNB">Punjab National Bank</option>
                              <option value="KOTAK">Kotak Mahindra Bank</option>
                            </select>
                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              handleSuccessPayment({
                                paymentMethod: 'netbanking',
                                payerID: cardHolder || selectedBank + '_USER',
                                orderID: order._id,
                                paymentID: 'CARD_' + Date.now(),
                              })
                            }
                            className="button primary full-width"
                            style={{ padding: '1.3rem', fontSize: '1.4rem', marginTop: '0.4rem' }}
                          >
                            🔒 Pay ₹{Number(order.totalPrice).toLocaleString('en-IN')} Securely
                          </button>
                        </div>
                      </div>
                    )}

                    {/* 💵 CASH ON DELIVERY WIDGET */}
                    {paymentMode === 'cod' && (
                      <div className="payment-widget-container">
                        <div className="payment-widget-header">
                          <span>💵</span>
                          <h4>Cash on Delivery (COD)</h4>
                        </div>
                        <p style={{ fontSize: '1.3rem', color: 'var(--txt-2)', marginBottom: '1.2rem' }}>
                          You can pay via Cash or UPI directly to the delivery agent upon item arrival.
                        </p>
                        <button
                          type="button"
                          onClick={() =>
                            handleSuccessPayment({
                              paymentMethod: 'cod',
                              payerID: 'COD_CUSTOMER',
                              orderID: order._id,
                              paymentID: 'COD_' + Date.now(),
                            })
                          }
                          className="button primary full-width"
                          style={{ padding: '1.3rem', fontSize: '1.4rem' }}
                        >
                          ✓ Confirm Cash on Delivery Order
                        </button>
                      </div>
                    )}

                    {/* 🅿️ PAYPAL WIDGET */}
                    {paymentMode === 'paypal' && (
                      <div className="payment-widget-container">
                        <div className="payment-widget-header">
                          <span>🅿️</span>
                          <h4>PayPal / International Card</h4>
                        </div>
                        <PaypalButton amount={order.totalPrice} onSuccess={handleSuccessPayment} />
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {order.isPaid && !order.isCanceled && (
              <div className="alert alert-success" style={{ marginTop: '1.6rem' }}>
                <span className="alert-icon">✅</span>
                Payment confirmed! Your order has been placed successfully.
              </div>
            )}

            {/* ── Cancel & Return/Replace Action Buttons ── */}
            <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* Cancel Button */}
              {!order.isCanceled && !order.isReturned && (
                <button
                  type="button"
                  onClick={() => setShowCancelModal(!showCancelModal)}
                  className="button secondary full-width text-center"
                  style={{
                    padding: '1.1rem',
                    color: '#ef4444',
                    borderColor: '#ef4444',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.6rem',
                  }}
                >
                  ❌ Cancel Order
                </button>
              )}

              {/* Cancel Form / Box */}
              {showCancelModal && !order.isCanceled && (
                <form onSubmit={handleCancelSubmit} style={{ padding: '1.2rem', background: 'var(--bg-2)', borderRadius: '8px', border: '1px solid var(--border)' }}>
                  <h4 style={{ marginBottom: '0.8rem', color: 'var(--txt)' }}>Cancel Order</h4>
                  <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '1.2rem', color: 'var(--txt-2)' }}>
                    Select Reason:
                  </label>
                  <select
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                    style={{ width: '100%', padding: '0.8rem', borderRadius: '6px', marginBottom: '1rem', background: 'var(--bg)', color: 'var(--txt)', border: '1px solid var(--border)' }}
                  >
                    <option value="Ordered by mistake">Ordered by mistake</option>
                    <option value="Found better price elsewhere">Found better price elsewhere</option>
                    <option value="Delivery time is too long">Delivery time is too long</option>
                    <option value="Changed my mind">Changed my mind</option>
                    <option value="Incorrect shipping address">Incorrect shipping address</option>
                  </select>
                  <div style={{ display: 'flex', gap: '0.8rem' }}>
                    <button type="submit" disabled={loadingCancel} className="button primary full-width" style={{ padding: '0.9rem', background: '#ef4444', borderColor: '#ef4444' }}>
                      {loadingCancel ? 'Canceling…' : 'Confirm Cancel'}
                    </button>
                    <button type="button" onClick={() => setShowCancelModal(false)} className="button secondary full-width" style={{ padding: '0.9rem' }}>
                      Back
                    </button>
                  </div>
                </form>
              )}

              {/* Return / Replace Button */}
              {!order.isCanceled && !order.isReturned && (
                <button
                  type="button"
                  onClick={() => setShowReturnModal(!showReturnModal)}
                  className="button secondary full-width text-center"
                  style={{
                    padding: '1.1rem',
                    color: 'var(--accent)',
                    borderColor: 'var(--accent)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.6rem',
                  }}
                >
                  🔄 Return or Replace Item
                </button>
              )}

              {/* Return / Replace Form / Box */}
              {showReturnModal && !order.isCanceled && !order.isReturned && (
                <form onSubmit={handleReturnSubmit} style={{ padding: '1.2rem', background: 'var(--bg-2)', borderRadius: '8px', border: '1px solid var(--border)' }}>
                  <h4 style={{ marginBottom: '0.8rem', color: 'var(--txt)' }}>Return or Replace Request</h4>

                  <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '1.2rem', color: 'var(--txt-2)' }}>
                    Choose Action Type:
                  </label>
                  <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '1.3rem' }}>
                      <input
                        type="radio"
                        name="returnType"
                        value="replace"
                        checked={returnType === 'replace'}
                        onChange={(e) => setReturnType(e.target.value)}
                      />
                      🔄 Replace (New Item)
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '1.3rem' }}>
                      <input
                        type="radio"
                        name="returnType"
                        value="return"
                        checked={returnType === 'return'}
                        onChange={(e) => setReturnType(e.target.value)}
                      />
                      💰 Return & Refund
                    </label>
                  </div>

                  <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '1.2rem', color: 'var(--txt-2)' }}>
                    Reason:
                  </label>
                  <select
                    value={returnReason}
                    onChange={(e) => setReturnReason(e.target.value)}
                    style={{ width: '100%', padding: '0.8rem', borderRadius: '6px', marginBottom: '1rem', background: 'var(--bg)', color: 'var(--txt)', border: '1px solid var(--border)' }}
                  >
                    <option value="Size or fit issue">Size or fit issue</option>
                    <option value="Item damaged or defective">Item damaged or defective</option>
                    <option value="Product not as described">Product not as described</option>
                    <option value="Wrong item delivered">Wrong item delivered</option>
                    <option value="Changed my mind">Changed my mind</option>
                  </select>

                  <div style={{ display: 'flex', gap: '0.8rem' }}>
                    <button type="submit" disabled={loadingReturn} className="button primary full-width" style={{ padding: '0.9rem' }}>
                      {loadingReturn ? 'Submitting…' : returnType === 'replace' ? 'Submit Replacement' : 'Submit Return'}
                    </button>
                    <button type="button" onClick={() => setShowReturnModal(false)} className="button secondary full-width" style={{ padding: '0.9rem' }}>
                      Back
                    </button>
                  </div>
                </form>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderScreen;
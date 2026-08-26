import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { savePayment } from '../actions/cartActions';
import CheckoutSteps from '../components/CheckoutSteps';

function PaymentScreen(props) {
  const [paymentMethod, setPaymentMethod] = useState('upi');

  const dispatch = useDispatch();

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(savePayment({ paymentMethod }));
    props.history.push('placeorder');
  };

  return (
    <div>
      <CheckoutSteps step1 step2 step3 />
      <div className="form">
        <form onSubmit={submitHandler}>
          <ul className="form-container">
            <li>
              <div className="form-page-icon">💳</div>
              <h1>Payment Method</h1>
            </li>

            <li>
              <label style={{ marginBottom: '1rem', display: 'block', fontSize: '1.3rem', fontWeight: 600, color: 'var(--txt-2)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Select a payment option
              </label>

              {/* UPI Option */}
              <label className="radio-card">
                <input
                  type="radio"
                  name="paymentMethod"
                  id="upi"
                  value="upi"
                  checked={paymentMethod === 'upi'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <div className="radio-card-label">
                  <strong>📱 UPI (Google Pay, PhonePe, Paytm, BHIM)</strong>
                  <span>Instant payment via any UPI App / VPA ID</span>
                </div>
              </label>

              {/* NetBanking / Cards Option */}
              <label className="radio-card">
                <input
                  type="radio"
                  name="paymentMethod"
                  id="netbanking"
                  value="netbanking"
                  checked={paymentMethod === 'netbanking'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <div className="radio-card-label">
                  <strong>🏦 NetBanking / Debit & Credit Card</strong>
                  <span>HDFC, SBI, ICICI, Axis, Visa, Mastercard</span>
                </div>
              </label>

              {/* COD Option */}
              <label className="radio-card">
                <input
                  type="radio"
                  name="paymentMethod"
                  id="cod"
                  value="cod"
                  checked={paymentMethod === 'cod'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <div className="radio-card-label">
                  <strong>💵 Cash on Delivery (COD)</strong>
                  <span>Pay cash or UPI at the time of delivery</span>
                </div>
              </label>


            </li>

            <li>
              <button
                type="submit"
                className="button primary full-width"
                style={{ padding: '1.3rem', marginTop: '0.8rem' }}
              >
                Continue to Place Order →
              </button>
            </li>
          </ul>
        </form>
      </div>
    </div>
  );
}

export default PaymentScreen;

import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { saveShipping } from '../actions/cartActions';
import CheckoutSteps from '../components/CheckoutSteps';

function ShippingScreen(props) {
  const cart = useSelector((state) => state.cart) || {};
  const shipping = cart.shipping || {};

  const [address, setAddress] = useState(shipping.address || '');
  const [city, setCity] = useState(shipping.city || '');
  const [postalCode, setPostalCode] = useState(shipping.postalCode || '');
  const [country, setCountry] = useState(shipping.country || '');

  const dispatch = useDispatch();

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(saveShipping({ address, city, postalCode, country }));
    props.history.push('payment');
  };

  return (
    <div>
      <CheckoutSteps step1 step2 />
      <div className="form">
        <form onSubmit={submitHandler}>
          <ul className="form-container">
            <li>
              <div className="form-page-icon">🚚</div>
              <h1>Shipping Address</h1>
            </li>

            <li>
              <label htmlFor="address">Street Address</label>
              <input
                type="text"
                name="address"
                id="address"
                placeholder="123 Fashion Street"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </li>

            <li>
              <label htmlFor="city">City</label>
              <input
                type="text"
                name="city"
                id="city"
                placeholder="New York"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
              />
            </li>

            <li>
              <label htmlFor="postalCode">Postal Code</label>
              <input
                type="text"
                name="postalCode"
                id="postalCode"
                placeholder="10001"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                required
              />
            </li>

            <li>
              <label htmlFor="country">Country</label>
              <input
                type="text"
                name="country"
                id="country"
                placeholder="United States"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                required
              />
            </li>

            <li>
              <button type="submit" className="button primary full-width" style={{ marginTop: '0.8rem', padding: '1.3rem' }}>
                Continue to Payment →
              </button>
            </li>
          </ul>
        </form>
      </div>
    </div>
  );
}

export default ShippingScreen;
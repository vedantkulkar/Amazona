import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { logout, update } from '../actions/userActions';
import { listMyOrders } from '../actions/orderActions';
import { useDispatch, useSelector } from 'react-redux';

function ProfileScreen(props) {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const dispatch = useDispatch();

  const userSignin = useSelector((state) => state.userSignin);
  const { userInfo } = userSignin;

  const handleLogout = () => {
    dispatch(logout());
    props.history.push('/signin');
  };

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(update({ userId: userInfo._id, email, name, password }));
  };

  const userUpdate = useSelector((state) => state.userUpdate);
  const { loading, success, error } = userUpdate;

  const myOrderList = useSelector((state) => state.myOrderList);
  const { loading: loadingOrders, orders, error: errorOrders } = myOrderList;

  useEffect(() => {
    if (userInfo) {
      setEmail(userInfo.email);
      setName(userInfo.name);
    }
    dispatch(listMyOrders());
    return () => {};
  }, [userInfo]);

  /* Initial letter avatar */
  const initials = userInfo && userInfo.name ? userInfo.name.charAt(0).toUpperCase() : '?';

  return (
    <div className="profile">
      {/* ── Profile Form ── */}
      <div className="profile-info">
        <div className="form" style={{ paddingTop: 'calc(6.4rem + 2rem)', paddingBottom: '2rem' }}>
          <form onSubmit={submitHandler}>
            <ul className="form-container">
              <li>
                {/* Avatar */}
                <div className="profile-avatar">{initials}</div>
                <h2 style={{ textAlign: 'center', marginBottom: '0.4rem' }}>My Profile</h2>
                <p style={{ textAlign: 'center', color: 'var(--txt-3)', fontSize: '1.3rem', marginBottom: '1.2rem' }}>
                  Update your account details
                </p>
              </li>

              {/* Status messages */}
              <li>
                {loading && (
                  <div className="alert alert-loading">
                    <div className="loading-spinner" style={{ width: '2rem', height: '2rem', flexShrink: 0 }} />
                    Updating profile…
                  </div>
                )}
                {error && (
                  <div className="alert alert-error">
                    <span className="alert-icon">⚠️</span>
                    {error}
                  </div>
                )}
                {success && (
                  <div className="alert alert-success">
                    <span className="alert-icon">✅</span>
                    Profile saved successfully!
                  </div>
                )}
              </li>

              <li>
                <label htmlFor="name">Full Name</label>
                <input
                  value={name}
                  type="text"
                  name="name"
                  id="name"
                  placeholder="Your name"
                  onChange={(e) => setName(e.target.value)}
                />
              </li>

              <li>
                <label htmlFor="email">Email Address</label>
                <input
                  value={email}
                  type="email"
                  name="email"
                  id="email"
                  placeholder="you@example.com"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </li>

              <li>
                <label htmlFor="password">New Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Leave blank to keep current"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </li>

              <li>
                <button type="submit" className="button primary full-width" style={{ padding: '1.2rem' }}>
                  Save Changes
                </button>
              </li>

              <li>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem', margin: '0.4rem 0' }}>
                  <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
                  <span style={{ fontSize: '1.2rem', color: 'var(--txt-3)' }}>account</span>
                  <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
                </div>
              </li>

              <li>
                <button type="button" onClick={handleLogout} className="button secondary full-width" style={{ padding: '1.1rem' }}>
                  🚪 Log Out
                </button>
              </li>
            </ul>
          </form>
        </div>
      </div>

      {/* ── My Orders ── */}
      <div className="profile-orders content-margined" style={{ paddingTop: 'calc(6.4rem + 2rem)' }}>
        <div className="profile-section-title">My Orders</div>

        {loadingOrders ? (
          <div className="loading-container" style={{ padding: '4rem' }}>
            <div className="loading-spinner" />
            <p>Loading orders…</p>
          </div>
        ) : errorOrders ? (
          <div className="alert alert-error">
            <span className="alert-icon">⚠️</span>
            {errorOrders}
          </div>
        ) : orders && orders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '5rem 2rem', color: 'var(--txt-3)' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1.2rem' }}>📦</div>
            <p style={{ fontSize: '1.5rem' }}>No orders yet.</p>
            <Link to="/" className="button primary" style={{ marginTop: '1.6rem', display: 'inline-block' }}>
              Start Shopping →
            </Link>
          </div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Date</th>
                <th>Total</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {orders && orders.map((order) => (
                <tr key={order._id}>
                  <td style={{ fontFamily: 'monospace', fontSize: '1.2rem' }}>
                    {order._id.substring(0, 10)}…
                  </td>
                  <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700 }}>
                    ₹{Number(order.totalPrice).toLocaleString('en-IN')}
                  </td>
                  <td>
                    {(order.isPaid || order.paid || order.orderStatus === 'Paid') ? (
                      <span className="badge badge-success">✓ Paid</span>
                    ) : (
                      <span className="badge badge-danger">✕ Unpaid</span>
                    )}
                  </td>
                  <td>
                    {(order.isCanceled || order.canceled || order.orderStatus === 'Cancelled') ? (
                      <span className="badge badge-danger">❌ Canceled</span>
                    ) : (order.isReturned || order.returned) ? (
                      <span className="badge badge-warning">🔄 {order.returnType === 'replace' ? 'Replace' : 'Return'}</span>
                    ) : (order.isDelivered || order.delivered || order.orderStatus === 'Delivered') ? (
                      <span className="badge badge-success">✓ Delivered</span>
                    ) : (
                      <span className="badge badge-warning">⏳ {order.orderStatus || 'Processing'}</span>
                    )}
                  </td>
                  <td>
                    <Link to={`/order/${order._id}`} className="btn-table btn-table-edit">
                      Manage →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default ProfileScreen;
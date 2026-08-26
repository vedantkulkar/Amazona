import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Axios from 'axios';

function ForgotPasswordScreen(props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 4) {
      setError('Password must be at least 4 characters long.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const { data } = await Axios.post('/api/users/reset-password', {
        email,
        password,
      });
      setLoading(false);
      setSuccess('Password updated successfully! Redirecting to Sign In…');
      setTimeout(() => {
        props.history.push('/signin');
      }, 1500);
    } catch (err) {
      setLoading(false);
      const msg =
        err.response && err.response.data && (err.response.data.message || err.response.data.error)
          ? err.response.data.message || err.response.data.error
          : err.message || 'Failed to reset password.';
      setError(msg);
    }
  };

  return (
    <div className="form">
      <form onSubmit={submitHandler}>
        <ul className="form-container">
          <li>
            <div className="form-page-icon">🔑</div>
            <h1>Reset Password</h1>
            <p
              style={{
                textAlign: 'center',
                color: 'var(--txt-3)',
                fontSize: '1.4rem',
                marginTop: '-1.6rem',
                marginBottom: '0.4rem',
              }}
            >
              Enter your account email and choose a new password.
            </p>
          </li>

          {loading && (
            <li>
              <div className="alert alert-loading">
                <div className="loading-spinner" style={{ width: '2rem', height: '2rem', flexShrink: 0 }} />
                Updating password…
              </div>
            </li>
          )}

          {error && (
            <li>
              <div className="alert alert-error">
                <span className="alert-icon">⚠️</span>
                {error}
              </div>
            </li>
          )}

          {success && (
            <li>
              <div className="alert alert-success">
                <span className="alert-icon">✅</span>
                {success}
              </div>
            </li>
          )}

          <li>
            <label htmlFor="email">Registered Email</label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </li>

          <li>
            <label htmlFor="password">New Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </li>

          <li>
            <label htmlFor="confirmPassword">Confirm New Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </li>

          <li>
            <button
              type="submit"
              className="button primary full-width"
              style={{ padding: '1.3rem', fontSize: '1.5rem' }}
              disabled={loading}
            >
              {loading ? 'Resetting…' : 'Set New Password →'}
            </button>
          </li>

          <li>
            <div className="signin-divider">
              <span>or</span>
            </div>
          </li>

          <li>
            <Link
              to="/signin"
              className="button secondary full-width text-center"
              style={{ padding: '1.1rem', display: 'block' }}
            >
              Back to Sign In
            </Link>
          </li>
        </ul>
      </form>
    </div>
  );
}

export default ForgotPasswordScreen;

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { register } from '../actions/userActions';

function RegisterScreen(props) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rePassword, setRePassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const userRegister = useSelector((state) => state.userRegister);
  const { loading, userInfo, error } = userRegister;
  const dispatch = useDispatch();

  const redirect = props.location.search ? props.location.search.split('=')[1] : '/';

  useEffect(() => {
    if (userInfo) {
      props.history.push(redirect);
    }
    return () => {};
  }, [userInfo]);

  const submitHandler = (e) => {
    e.preventDefault();
    if (password !== rePassword) {
      setPasswordError('Passwords do not match.');
      return;
    }
    setPasswordError('');
    dispatch(register(name, email, password));
  };

  return (
    <div className="form">
      <form onSubmit={submitHandler}>
        <ul className="form-container">
          <li>
            <div className="form-page-icon">✨</div>
            <h1>Create Account</h1>
            <p style={{ textAlign: 'center', color: 'var(--txt-3)', fontSize: '1.4rem', marginTop: '-1.6rem', marginBottom: '0.4rem' }}>
              Join Amazona today — it's free!
            </p>
          </li>

          {/* Status messages */}
          {loading && (
            <li>
              <div className="alert alert-loading">
                <div className="loading-spinner" style={{ width: '2rem', height: '2rem', flexShrink: 0 }} />
                Creating your account…
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
          {passwordError && (
            <li>
              <div className="alert alert-error">
                <span className="alert-icon">🔒</span>
                {passwordError}
              </div>
            </li>
          )}

          <li>
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              name="name"
              id="name"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </li>

          <li>
            <label htmlFor="email">Email Address</label>
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
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Min. 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </li>

          <li>
            <label htmlFor="rePassword">Confirm Password</label>
            <input
              type="password"
              id="rePassword"
              name="rePassword"
              placeholder="Repeat your password"
              value={rePassword}
              onChange={(e) => setRePassword(e.target.value)}
              required
            />
          </li>

          <li>
            <button type="submit" className="button primary full-width" style={{ padding: '1.3rem', fontSize: '1.5rem' }}>
              Create Account →
            </button>
          </li>

          <li>
            <div className="signin-divider"><span>or</span></div>
          </li>

          <li>
            <p style={{ textAlign: 'center', color: 'var(--txt-3)', fontSize: '1.4rem', marginBottom: '1rem' }}>
              Already have an account?
            </p>
            <Link
              to={redirect === '/' ? 'signin' : 'signin?redirect=' + redirect}
              className="button secondary full-width text-center"
              style={{ padding: '1.1rem', display: 'block' }}
            >
              Sign In Instead
            </Link>
          </li>
        </ul>
      </form>
    </div>
  );
}

export default RegisterScreen;
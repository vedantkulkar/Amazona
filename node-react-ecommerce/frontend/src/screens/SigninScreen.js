import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { signin } from '../actions/userActions';

function SigninScreen(props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const userSignin = useSelector((state) => state.userSignin);
  const { loading, userInfo, error } = userSignin;
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
    dispatch(signin(email, password));
  };

  return (
    <div className="form">
      <form onSubmit={submitHandler}>
        <ul className="form-container">
          <li>
            <div className="form-page-icon">👤</div>
            <h1>Welcome Back</h1>
            <p style={{ textAlign: 'center', color: 'var(--txt-3)', fontSize: '1.4rem', marginTop: '-1.6rem', marginBottom: '0.4rem' }}>
              Sign in to your Amazona account
            </p>
          </li>

          {/* Status messages */}
          {loading && (
            <li>
              <div className="alert alert-loading">
                <div className="loading-spinner" style={{ width: '2rem', height: '2rem', flexShrink: 0 }} />
                Signing in…
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

          <li>
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="you@example.com"
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
              placeholder="••••••••"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </li>

          <li>
            <button type="submit" className="button primary full-width" style={{ padding: '1.3rem', fontSize: '1.5rem' }}>
              Sign In →
            </button>
          </li>

          <li>
            <div className="signin-divider"><span>or</span></div>
          </li>

          <li>
            <p style={{ textAlign: 'center', color: 'var(--txt-3)', fontSize: '1.4rem', marginBottom: '1rem' }}>
              New to Amazona?
            </p>
            <Link
              to={redirect === '/' ? 'register' : 'register?redirect=' + redirect}
              className="button secondary full-width text-center"
              style={{ padding: '1.1rem', display: 'block' }}
            >
              Create an Account
            </Link>
          </li>
        </ul>
      </form>
    </div>
  );
}

export default SigninScreen;
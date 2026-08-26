import React, { useEffect } from 'react';
import { BrowserRouter, Route, Link, Switch } from 'react-router-dom';
import './App.css';
import HomeScreen from './screens/HomeScreen';
import ProductScreen from './screens/ProductScreen';
import CartScreen from './screens/CartScreen';
import SigninScreen from './screens/SigninScreen';
import { useSelector } from 'react-redux';
import RegisterScreen from './screens/RegisterScreen';
import ProductsScreen from './screens/ProductsScreen';
import ShippingScreen from './screens/ShippingScreen';
import PaymentScreen from './screens/PaymentScreen';
import PlaceOrderScreen from './screens/PlaceOrderScreen';
import OrderScreen from './screens/OrderScreen';
import ProfileScreen from './screens/ProfileScreen';
import OrdersScreen from './screens/OrdersScreen';
import AboutScreen from './screens/AboutScreen';
import ContactScreen from './screens/ContactScreen';
import ForgotPasswordScreen from './screens/ForgotPasswordScreen';
import SupportChatWidget from './components/SupportChatWidget';
import DashboardScreen from './screens/DashboardScreen';

function App() {
  const userSignin = useSelector((state) => state.userSignin || {});
  const { userInfo } = userSignin;

  const cartState = useSelector((state) => state.cart || {});
  const cartCount = (cartState.cartItems && Array.isArray(cartState.cartItems))
    ? cartState.cartItems.reduce((a, c) => a + (c.qty || 1), 0)
    : 0;

  useEffect(() => {
    const header = document.querySelector('.header');
    const onScroll = () => {
      if (!header) return;
      header.classList.toggle('scrolled', window.scrollY > 20);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const openMenu = () => {
    document.querySelector('.sidebar').classList.add('open');
  };
  const closeMenu = () => {
    document.querySelector('.sidebar').classList.remove('open');
  };

  return (
    <BrowserRouter>
      <div className="grid-container">
        {/* ── HEADER ── */}
        <header className="header">
          <div className="brand">
            <button onClick={openMenu} aria-label="Open menu">&#9776;</button>
            <Link to="/">amazona</Link>
          </div>

          <div className="header-links">
            <Link to="/">Home</Link>
            <Link to="/about">About</Link>
            <Link to="/contact">Contact</Link>
            <Link to="/cart" className="cart-link">
              🛒 Cart {cartCount > 0 && <strong>({cartCount})</strong>}
            </Link>
            {userInfo ? (
              <Link to="/profile" className="nav-cta">{userInfo.name}</Link>
            ) : (
              <Link to="/signin" className="nav-cta">Sign In</Link>
            )}
            {userInfo && userInfo.isAdmin && (
              <div className="dropdown">
                <a href="#admin">Admin ▾</a>
                <ul className="dropdown-content">
                  <li>
                    <Link to="/dashboard">📊 Dashboard</Link>
                    <Link to="/orders">📦 Orders</Link>
                    <Link to="/products">👕 Products</Link>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </header>

        {/* ── SIDEBAR ── */}
        <aside className="sidebar">
          <h3>Categories</h3>
          <button className="sidebar-close-button" onClick={closeMenu} aria-label="Close menu">×</button>
          <ul className="categories">
            <li><Link to="/" onClick={closeMenu}>🏠 All Products</Link></li>
            <li><Link to="/category/Shirts" onClick={closeMenu}>👕 Shirts</Link></li>
            <li><Link to="/category/Pants" onClick={closeMenu}>👖 Pants</Link></li>
            <li><Link to="/category/Shoes" onClick={closeMenu}>👟 Shoes</Link></li>
            <li><Link to="/category/Accessories" onClick={closeMenu}>⌚ Accessories</Link></li>
          </ul>
        </aside>

        {/* ── MAIN ── */}
        <main className="main">
          <div className="content">
            <Switch>
              <Route path="/dashboard" component={DashboardScreen} />
              <Route path="/orders" component={OrdersScreen} />
              <Route path="/profile" component={ProfileScreen} />
              <Route path="/order/:id" component={OrderScreen} />
              <Route path="/products" component={ProductsScreen} />
              <Route path="/shipping" component={ShippingScreen} />
              <Route path="/payment" component={PaymentScreen} />
              <Route path="/placeorder" component={PlaceOrderScreen} />
              <Route path="/signin" component={SigninScreen} />
              <Route path="/register" component={RegisterScreen} />
              <Route path="/forgot-password" component={ForgotPasswordScreen} />
              <Route path="/product/:id" component={ProductScreen} />
              <Route path="/cart/:id?" component={CartScreen} />
              <Route path="/category/:id" component={HomeScreen} />
              <Route path="/about" component={AboutScreen} />
              <Route path="/contact" component={ContactScreen} />
              <Route path="/" exact={true} component={HomeScreen} />
            </Switch>
          </div>
        </main>

        {/* ── FOOTER ── */}
        <footer className="footer">
          <div className="footer-grid">
            <div className="footer-brand">
              <span className="footer-logo">amazona</span>
              <p>A premium e-commerce experience built with React &amp; Spring Boot. Discover 35+ curated products at unbeatable prices.</p>
            </div>
            <div className="footer-col">
              <h4>Shop</h4>
              <ul>
                <li><Link to="/category/Shirts">Shirts</Link></li>
                <li><Link to="/category/Pants">Pants</Link></li>
                <li><Link to="/category/Shoes">Shoes</Link></li>
                <li><Link to="/category/Accessories">Accessories</Link></li>
              </ul>
            </div>
            <div className="footer-col">
              <h4>Company</h4>
              <ul>
                <li><Link to="/about">About Us</Link></li>
                <li><Link to="/contact">Contact</Link></li>
              </ul>
            </div>
            <div className="footer-col">
              <h4>Account</h4>
              <ul>
                <li><Link to="/signin">Sign In</Link></li>
                <li><Link to="/register">Register</Link></li>
                <li><Link to="/cart">Cart</Link></li>
                <li><Link to="/profile">My Orders</Link></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© {new Date().getFullYear()} Amazona. All rights reserved.</p>
          </div>
        </footer>

        {/* ── 24/7 Support Chat Widget ── */}
        <SupportChatWidget />
      </div>
    </BrowserRouter>
  );
}

export default App;

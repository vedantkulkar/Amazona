import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function DashboardScreen(props) {
  const userSignin = useSelector((state) => state.userSignin || {});
  const { userInfo } = userSignin;

  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchSummary = async () => {
    try {
      setLoading(true);
      setError('');
      const headers = userInfo && userInfo.token ? { Authorization: 'Bearer ' + userInfo.token } : {};
      const { data } = await axios.get('/api/orders/summary', { headers });
      setSummary(data);
      setLoading(false);
    } catch (err) {
      setError(err.response && err.response.data.message ? err.response.data.message : err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!userInfo || !userInfo.isAdmin) {
      props.history.push('/signin?redirect=dashboard');
      return;
    }
    fetchSummary();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userInfo]);

  if (loading) {
    return (
      <div className="loading-container" style={{ paddingTop: 'calc(6.4rem + 4rem)' }}>
        <div className="loading-spinner" />
        <p>Loading executive analytics dashboard…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container" style={{ paddingTop: 'calc(6.4rem + 3rem)' }}>
        <div style={{ fontSize: '4rem' }}>⚠️</div>
        <h3>Could not load dashboard analytics</h3>
        <p>{error}</p>
        <button onClick={fetchSummary} className="button primary" style={{ marginTop: '1.6rem' }}>
          🔄 Retry
        </button>
      </div>
    );
  }

  const paymentStats = summary?.paymentStats || {};
  const statusStats = summary?.statusStats || {};
  const demandedProducts = summary?.demandedProducts || [];
  const dailySalesTrend = summary?.dailySalesTrend || [];

  const maxDailySale = Math.max(...dailySalesTrend.map((d) => d.sales || 0), 1000);

  return (
    <div className="dashboard-container" style={{ maxWidth: '120rem', margin: '0 auto', padding: '2rem 1.6rem 6rem' }}>
      {/* ── Executive Header ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.6rem', marginBottom: '2.4rem', borderBottom: '1px solid var(--border)', paddingBottom: '1.6rem' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', padding: '0.4rem 1rem', background: 'rgba(99, 102, 241, 0.12)', border: '1px solid var(--accent)', borderRadius: '20px', color: 'var(--accent-2)', fontSize: '1.15rem', fontWeight: 600, marginBottom: '0.8rem' }}>
            👑 Company Admin Portal
          </div>
          <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '2.8rem', fontWeight: 800, color: 'var(--txt)', margin: 0 }}>
            Executive Business Dashboard
          </h1>
          <p style={{ color: 'var(--txt-3)', fontSize: '1.35rem', marginTop: '0.4rem' }}>
            Real-time analytics for orders, payment methods breakdown, demanded products, and sales performance.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={fetchSummary}
            className="button secondary"
            style={{ padding: '0.9rem 1.6rem', fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}
          >
            🔄 Refresh Data
          </button>
          <Link to="/products" className="button secondary" style={{ padding: '0.9rem 1.6rem', fontSize: '1.25rem' }}>
            👕 Products
          </Link>
          <Link to="/orders" className="button primary" style={{ padding: '0.9rem 1.6rem', fontSize: '1.25rem' }}>
            📦 Orders
          </Link>
        </div>
      </div>

      {/* ── 1. Top KPI Cards Grid ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(22rem, 1fr))', gap: '1.6rem', marginBottom: '3rem' }}>
        {/* Today's Orders */}
        <div style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: '16px', padding: '2rem', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--txt-3)', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
              Today's Orders
            </span>
            <span style={{ fontSize: '2.4rem' }}>📦</span>
          </div>
          <div style={{ fontSize: '3.2rem', fontWeight: 800, color: '#6366f1', margin: '0.8rem 0 0.4rem', fontFamily: 'Outfit, sans-serif' }}>
            {summary?.todayOrdersCount || 0}
          </div>
          <span style={{ fontSize: '1.2rem', color: 'var(--txt-3)' }}>
            Placed today ({new Date().toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })})
          </span>
        </div>

        {/* Today's Revenue */}
        <div style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: '16px', padding: '2rem', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--txt-3)', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
              Today's Revenue
            </span>
            <span style={{ fontSize: '2.4rem' }}>⚡</span>
          </div>
          <div style={{ fontSize: '3.2rem', fontWeight: 800, color: '#10b981', margin: '0.8rem 0 0.4rem', fontFamily: 'Outfit, sans-serif' }}>
            ₹{Number(summary?.todaySales || 0).toLocaleString('en-IN')}
          </div>
          <span style={{ fontSize: '1.2rem', color: 'var(--txt-3)' }}>From paid transactions today</span>
        </div>

        {/* Total Lifetime Sales */}
        <div style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: '16px', padding: '2rem', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--txt-3)', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
              Total Revenue
            </span>
            <span style={{ fontSize: '2.4rem' }}>💎</span>
          </div>
          <div style={{ fontSize: '3.2rem', fontWeight: 800, color: '#38bdf8', margin: '0.8rem 0 0.4rem', fontFamily: 'Outfit, sans-serif' }}>
            ₹{Number(summary?.totalSales || 0).toLocaleString('en-IN')}
          </div>
          <span style={{ fontSize: '1.2rem', color: 'var(--txt-3)' }}>Across {summary?.paidOrdersCount || 0} completed checkouts</span>
        </div>

        {/* Lifetime Orders & Customers */}
        <div style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: '16px', padding: '2rem', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--txt-3)', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
              Total Orders
            </span>
            <span style={{ fontSize: '2.4rem' }}>👥</span>
          </div>
          <div style={{ fontSize: '3.2rem', fontWeight: 800, color: '#f59e0b', margin: '0.8rem 0 0.4rem', fontFamily: 'Outfit, sans-serif' }}>
            {summary?.ordersCount || 0}
          </div>
          <span style={{ fontSize: '1.2rem', color: 'var(--txt-3)' }}>{summary?.usersCount || 0} Registered User Accounts</span>
        </div>

        {/* Average Order Value (AOV) */}
        <div style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: '16px', padding: '2rem', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--txt-3)', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
              Avg. Order Value (AOV)
            </span>
            <span style={{ fontSize: '2.4rem' }}>🎯</span>
          </div>
          <div style={{ fontSize: '3.2rem', fontWeight: 800, color: '#ec4899', margin: '0.8rem 0 0.4rem', fontFamily: 'Outfit, sans-serif' }}>
            ₹{Number(summary?.avgOrderValue || 0).toLocaleString('en-IN')}
          </div>
          <span style={{ fontSize: '1.2rem', color: 'var(--txt-3)' }}>Average spend per paid customer</span>
        </div>
      </div>

      {/* ── 2. Payment Methods & Order Fulfillment Split ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(32rem, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
        {/* Payment Methods Breakdown */}
        <div style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: '16px', padding: '2.2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.8rem' }}>
            <h3 style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--txt)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
              <span>💳</span> Payment Methods Breakdown
            </h3>
            <span style={{ fontSize: '1.2rem', color: 'var(--txt-3)' }}>By Volume &amp; Value</span>
          </div>

          {/* UPI */}
          <div style={{ marginBottom: '1.8rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.6rem', fontSize: '1.35rem' }}>
              <strong>📱 UPI (GPay, PhonePe, Paytm)</strong>
              <span>
                <strong>{paymentStats.upi?.count || 0} orders</strong> ({paymentStats.upi?.percentage || 0}%) • ₹{Number(paymentStats.upi?.sales || 0).toLocaleString('en-IN')}
              </span>
            </div>
            <div style={{ height: '1rem', background: 'rgba(255,255,255,0.06)', borderRadius: '8px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${paymentStats.upi?.percentage || 0}%`, background: 'linear-gradient(90deg, #5f259f, #7c3aed)', borderRadius: '8px', transition: 'width 0.8s ease' }} />
            </div>
          </div>

          {/* NetBanking & Cards */}
          <div style={{ marginBottom: '1.8rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.6rem', fontSize: '1.35rem' }}>
              <strong>🏦 NetBanking &amp; Debit/Credit Card</strong>
              <span>
                <strong>{paymentStats.netbanking?.count || 0} orders</strong> ({paymentStats.netbanking?.percentage || 0}%) • ₹{Number(paymentStats.netbanking?.sales || 0).toLocaleString('en-IN')}
              </span>
            </div>
            <div style={{ height: '1rem', background: 'rgba(255,255,255,0.06)', borderRadius: '8px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${paymentStats.netbanking?.percentage || 0}%`, background: 'linear-gradient(90deg, #3b82f6, #06b6d4)', borderRadius: '8px', transition: 'width 0.8s ease' }} />
            </div>
          </div>

          {/* Cash on Delivery */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.6rem', fontSize: '1.35rem' }}>
              <strong>💵 Cash on Delivery (COD)</strong>
              <span>
                <strong>{paymentStats.cod?.count || 0} orders</strong> ({paymentStats.cod?.percentage || 0}%) • ₹{Number(paymentStats.cod?.sales || 0).toLocaleString('en-IN')}
              </span>
            </div>
            <div style={{ height: '1rem', background: 'rgba(255,255,255,0.06)', borderRadius: '8px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${paymentStats.cod?.percentage || 0}%`, background: 'linear-gradient(90deg, #10b981, #059669)', borderRadius: '8px', transition: 'width 0.8s ease' }} />
            </div>
          </div>
        </div>

        {/* Order Fulfillment & Status Breakdown */}
        <div style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: '16px', padding: '2.2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.8rem' }}>
            <h3 style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--txt)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
              <span>📦</span> Order Lifecycle Status
            </h3>
            <span style={{ fontSize: '1.2rem', color: 'var(--txt-3)' }}>Current Pipeline</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem' }}>
            <div style={{ padding: '1.4rem', background: 'rgba(245, 158, 11, 0.08)', border: '1px solid rgba(245, 158, 11, 0.25)', borderRadius: '12px' }}>
              <span style={{ fontSize: '1.2rem', color: '#f59e0b', fontWeight: 700, display: 'block' }}>⏳ PROCESSING / TRANSIT</span>
              <strong style={{ fontSize: '2.6rem', color: 'var(--txt)', marginTop: '0.4rem', display: 'block' }}>
                {statusStats.processing || 0}
              </strong>
            </div>

            <div style={{ padding: '1.4rem', background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.25)', borderRadius: '12px' }}>
              <span style={{ fontSize: '1.2rem', color: '#10b981', fontWeight: 700, display: 'block' }}>✅ DELIVERED</span>
              <strong style={{ fontSize: '2.6rem', color: 'var(--txt)', marginTop: '0.4rem', display: 'block' }}>
                {statusStats.delivered || 0}
              </strong>
            </div>

            <div style={{ padding: '1.4rem', background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.25)', borderRadius: '12px' }}>
              <span style={{ fontSize: '1.2rem', color: '#ef4444', fontWeight: 700, display: 'block' }}>❌ CANCELLED</span>
              <strong style={{ fontSize: '2.6rem', color: 'var(--txt)', marginTop: '0.4rem', display: 'block' }}>
                {statusStats.canceled || 0}
              </strong>
            </div>

            <div style={{ padding: '1.4rem', background: 'rgba(99, 102, 241, 0.08)', border: '1px solid rgba(99, 102, 241, 0.25)', borderRadius: '12px' }}>
              <span style={{ fontSize: '1.2rem', color: '#818cf8', fontWeight: 700, display: 'block' }}>🔄 RETURNS / REPLACEMENTS</span>
              <strong style={{ fontSize: '2.6rem', color: 'var(--txt)', marginTop: '0.4rem', display: 'block' }}>
                {statusStats.returned || 0}
              </strong>
            </div>
          </div>
        </div>
      </div>

      {/* ── 3. 7-Day Revenue Trend Chart ── */}
      <div style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: '16px', padding: '2.2rem', marginBottom: '3rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h3 style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--txt)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
              <span>📈</span> 7-Day Revenue &amp; Order Volume Trend
            </h3>
            <p style={{ color: 'var(--txt-3)', fontSize: '1.25rem', margin: '0.4rem 0 0 0' }}>
              Daily recorded sales and order volume
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '18rem', gap: '1rem', padding: '1rem 0 0.5rem', borderBottom: '1px solid var(--border)' }}>
          {dailySalesTrend.map((day, idx) => {
            const heightPercent = Math.max(12, Math.round((day.sales / maxDailySale) * 100));
            return (
              <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
                <span style={{ fontSize: '1.1rem', color: 'var(--txt-3)', marginBottom: '0.4rem' }}>
                  {day.sales > 0 ? `₹${(day.sales / 1000).toFixed(1)}k` : '₹0'}
                </span>
                <div
                  title={`${day.date}: ₹${Number(day.sales).toLocaleString('en-IN')} (${day.orders} orders)`}
                  style={{
                    width: '100%',
                    maxWidth: '4.8rem',
                    height: `${heightPercent}%`,
                    background: 'linear-gradient(180deg, var(--accent) 0%, rgba(99, 102, 241, 0.4) 100%)',
                    borderRadius: '8px 8px 0 0',
                    transition: 'all 0.4s ease',
                    position: 'relative',
                  }}
                />
                <span style={{ fontSize: '1.15rem', color: 'var(--txt-2)', marginTop: '0.8rem', fontWeight: 600 }}>
                  {day.date}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── 4. Demanded Products (Top Demand Ranking) ── */}
      <div style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: '16px', padding: '2.2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.8rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--txt)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
              <span>🔥</span> Demanded &amp; Top-Selling Products
            </h3>
            <p style={{ color: 'var(--txt-3)', fontSize: '1.25rem', margin: '0.4rem 0 0 0' }}>
              Ranked by customer order volume and total revenue generated
            </p>
          </div>
          <Link to="/products" className="button secondary" style={{ fontSize: '1.2rem', padding: '0.7rem 1.4rem' }}>
            Manage Full Catalog →
          </Link>
        </div>

        {demandedProducts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--txt-3)' }}>
            <span style={{ fontSize: '3rem', display: 'block', marginBottom: '0.6rem' }}>🛍️</span>
            No order item transactions recorded yet. Once orders are placed, demand rankings will appear here automatically.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="table" style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ textAlign: 'left', padding: '1.2rem' }}>Rank</th>
                  <th style={{ textAlign: 'left', padding: '1.2rem' }}>Product</th>
                  <th style={{ textAlign: 'center', padding: '1.2rem' }}>Units Sold</th>
                  <th style={{ textAlign: 'right', padding: '1.2rem' }}>Revenue Generated</th>
                  <th style={{ textAlign: 'center', padding: '1.2rem' }}>Demand Status</th>
                </tr>
              </thead>
              <tbody>
                {demandedProducts.map((p, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '1.2rem', fontWeight: 700, color: idx === 0 ? '#f59e0b' : idx === 1 ? '#94a3b8' : idx === 2 ? '#b45309' : 'var(--txt-3)' }}>
                      #{idx + 1}
                    </td>
                    <td style={{ padding: '1.2rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
                        {p.image && (
                          <img
                            src={p.image}
                            alt={p.name}
                            style={{ width: '4.4rem', height: '4.4rem', objectFit: 'cover', borderRadius: '8px', border: '1px solid var(--border)' }}
                          />
                        )}
                        <div>
                          <strong style={{ color: 'var(--txt)', fontSize: '1.35rem', display: 'block' }}>{p.name}</strong>
                          {p.product && (
                            <Link to={`/product/${p.product}`} style={{ fontSize: '1.15rem', color: 'var(--accent-2)', textDecoration: 'none' }}>
                              View Product Details ↗
                            </Link>
                          )}
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '1.2rem', textAlign: 'center', fontWeight: 700, fontSize: '1.4rem', color: 'var(--txt)' }}>
                      {p.unitsSold} units
                    </td>
                    <td style={{ padding: '1.2rem', textAlign: 'right', fontWeight: 700, fontSize: '1.4rem', color: '#10b981' }}>
                      ₹{Number(p.revenue).toLocaleString('en-IN')}
                    </td>
                    <td style={{ padding: '1.2rem', textAlign: 'center' }}>
                      <span
                        style={{
                          padding: '0.4rem 1rem',
                          borderRadius: '20px',
                          fontSize: '1.15rem',
                          fontWeight: 600,
                          background:
                            idx === 0
                              ? 'rgba(239, 68, 68, 0.15)'
                              : idx === 1
                              ? 'rgba(245, 158, 11, 0.15)'
                              : 'rgba(99, 102, 241, 0.15)',
                          color: idx === 0 ? '#ef4444' : idx === 1 ? '#f59e0b' : '#818cf8',
                          border: `1px solid ${
                            idx === 0
                              ? 'rgba(239, 68, 68, 0.3)'
                              : idx === 1
                              ? 'rgba(245, 158, 11, 0.3)'
                              : 'rgba(99, 102, 241, 0.3)'
                          }`,
                        }}
                      >
                        {p.demandBadge || '⭐ Trending'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

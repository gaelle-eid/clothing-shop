import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

function Account() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get('/auth/me')
      .then((res) => {
        setUser(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(
          err?.response?.status === 401
            ? 'Please log in to view your account.'
            : 'Could not load account info.'
        );
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p className="filter-loading" style={{ padding: '80px 0', textAlign: 'center' }}>Loading...</p>;
  }

  if (error) {
    return (
      <div className="cart-empty">
        <h2>{error}</h2>
        <Link to="/login" className="shop-now-btn">Log In</Link>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <h1>My Account</h1>

      <div className="order-card" style={{ padding: '24px' }}>
        <p style={{ color: '#999', fontSize: '12px', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '6px' }}>
          Name
        </p>
        <p style={{ marginBottom: '20px' }}>{user.name}</p>

        <p style={{ color: '#999', fontSize: '12px', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '6px' }}>
          Email
        </p>
        <p style={{ marginBottom: '20px' }}>{user.email}</p>

        <p style={{ color: '#999', fontSize: '12px', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '6px' }}>
          Account Balance
        </p>
        <p style={{ fontSize: '24px', fontWeight: 300 }}>€{user.balance.toFixed(2)}</p>
      </div>

      <Link to="/orders" className="shop-now-btn" style={{ display: 'inline-block', marginTop: '25px' }}>
        View Order History
      </Link>
    </div>
  );
}

export default Account;
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get('/orders/')
      .then((res) => {
        setOrders(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(
          err?.response?.status === 401
            ? 'Please log in to view your orders.'
            : 'Could not load your orders.'
        );
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p className="filter-loading" style={{ padding: '80px 0', textAlign: 'center' }}>Loading your orders...</p>;
  }

  if (error) {
    return (
      <div className="cart-empty">
        <h2>{error}</h2>
        {error.includes('log in') ? (
          <Link to="/login" className="shop-now-btn">Log In</Link>
        ) : (
          <Link to="/shop" className="shop-now-btn">Back to Shop</Link>
        )}
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="cart-empty">
        <h2>No Orders Yet</h2>
        <p>You haven't placed any orders yet.</p>
        <Link to="/shop" className="shop-now-btn">Start Shopping</Link>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <h1>Order History</h1>

      {orders.map((order) => (
        <div
          key={order.id}
          className="cart-items"
          style={{ marginBottom: '25px', padding: '20px', border: '1px solid #eee' }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '15px',
              paddingBottom: '10px',
              borderBottom: '1px solid #eee',
            }}
          >
            <div>
              <strong>Order #{order.id}</strong>
              <span style={{ marginLeft: '12px', color: '#999', fontSize: '13px' }}>
                {new Date(order.created_at).toLocaleDateString()}
              </span>
            </div>
            <span style={{ textTransform: 'capitalize', fontSize: '13px', color: '#666' }}>
              {order.status}
            </span>
          </div>

          {order.items.map((item) => (
            <div className="cart-item" key={item.id}>
              <div className="cart-item-details">
                <h3>{item.product_name}</h3>
                <p>€{item.price} × {item.quantity}</p>
              </div>
              <div className="cart-item-total">
                €{(item.price * item.quantity).toFixed(2)}
              </div>
            </div>
          ))}

          <div
            style={{
              textAlign: 'right',
              marginTop: '10px',
              paddingTop: '10px',
              borderTop: '1px solid #eee',
              fontWeight: 500,
            }}
          >
            Total: €{order.total.toFixed(2)}
          </div>
        </div>
      ))}
    </div>
  );
}

export default OrderHistory;
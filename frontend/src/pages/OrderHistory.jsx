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
    <div className="orders-page">
      <h1>Order History</h1>

      {orders.map((order) => (
        <div className="order-card" key={order.id}>
          <div className="order-card-header">
            <div className="order-card-header-left">
              <span className="order-id">Order #{order.id}</span>
              <span className="order-date">
                {new Date(order.created_at).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </span>
            </div>
            <span className={`order-status ${order.status}`}>{order.status}</span>
          </div>

          <div className="order-card-items">
            {order.items.map((item) => (
              <div className="order-line-item" key={item.id}>
                <div>
                  <div className="order-line-item-name">{item.product_name}</div>
                  <div className="order-line-item-meta">
                    €{item.price} × {item.quantity}
                  </div>
                </div>
                <div>€{(item.price * item.quantity).toFixed(2)}</div>
              </div>
            ))}
          </div>

          <div className="order-card-footer">
            Total: €{order.total.toFixed(2)}
          </div>
        </div>
      ))}
    </div>
  );
}

export default OrderHistory;
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';

function OrderConfirmation() {
  const { id } = useParams(); // the order id from the URL, e.g. /order-confirmation/1
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get(`/orders/${id}`)
      .then((res) => {
        setOrder(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError('Could not find that order.');
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <p className="filter-loading" style={{ padding: '80px 0', textAlign: 'center' }}>Loading order...</p>;
  }

  if (error) {
    return (
      <div className="cart-empty">
        <h2>{error}</h2>
        <Link to="/shop" className="shop-now-btn">Back to Shop</Link>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1>Thank You!</h1>
        <p style={{ color: '#666', fontWeight: 300 }}>
          Your order has been placed successfully.
        </p>
      </div>

      <div className="cart-grid">
        <div className="cart-items">
          <h3 style={{ marginBottom: '15px', fontWeight: 400 }}>
            Order #{order.id} — {order.status}
          </h3>

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
        </div>

        <div className="cart-summary">
          <h3>Order Total</h3>
          <div className="summary-row total">
            <span>Total</span>
            <span>€{order.total.toFixed(2)}</span>
          </div>
          <p style={{ fontSize: '12px', color: '#999', marginTop: '15px' }}>
            Placed on {new Date(order.created_at).toLocaleDateString()}
          </p>
          <Link to="/shop" className="shop-now-btn" style={{ display: 'block', marginTop: '20px', textAlign: 'center' }}>
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}

export default OrderConfirmation;
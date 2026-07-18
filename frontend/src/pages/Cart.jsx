import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';

function Cart() {
  const [cartItems, setCartItems] = useState([]);  // real cart rows from the backend, each with a nested product
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [checkingOut, setCheckingOut] = useState(false); // true while checkout request is in flight
  const navigate = useNavigate();

  // Fetch the real cart from the backend
  const fetchCart = () => {
    setLoading(true);
    api
      .get('/cart/')
      .then((res) => {
        setCartItems(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(
          err?.response?.status === 401
            ? 'Please log in to view your cart.'
            : 'Could not load your cart.'
        );
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const cartTotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  // Update quantity via the real PUT /cart/{id} endpoint
  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    api
      .put(`/cart/${itemId}`, { quantity: newQuantity })
      .then(() => fetchCart())  // re-fetch so the UI reflects the real, saved state
      .catch((err) => {
        console.error(err);
        setError('Could not update quantity.');
      });
  };

  // Remove via the real DELETE /cart/{id} endpoint
  const removeFromCart = (itemId) => {
    api
      .delete(`/cart/${itemId}`)
      .then(() => fetchCart())
      .catch((err) => {
        console.error(err);
        setError('Could not remove item.');
      });
  };

  // "Clear cart" - no single backend endpoint for this, so remove each item one by one
  const clearCart = () => {
    Promise.all(cartItems.map((item) => api.delete(`/cart/${item.id}`)))
      .then(() => fetchCart())
      .catch((err) => {
        console.error(err);
        setError('Could not clear cart.');
      });
  };

  // Checkout - calls the real backend, which validates stock, creates the
  // order, decrements stock, and clears the cart, all in one atomic step.
  const handleCheckout = () => {
    setCheckingOut(true);
    api
      .post('/orders/checkout')
      .then((res) => {
        // Success - navigate to a confirmation page showing the new order
        navigate(`/order-confirmation/${res.data.id}`);
      })
      .catch((err) => {
        console.error(err);
        // The backend sends a clear message (e.g. "not enough stock for X")
        // in err.response.data.detail - show that directly if it exists
        const detail = err?.response?.data?.detail;
        setError(detail || 'Checkout failed. Please try again.');
        setCheckingOut(false);
      });
  };

  if (loading) {
    return <p className="filter-loading" style={{ padding: '80px 0', textAlign: 'center' }}>Loading your cart...</p>;
  }

  if (error) {
    return (
      <div className="cart-empty">
        <h2>{error}</h2>
        {error.includes('log in') ? (
          <Link to="/login" className="shop-now-btn">Log In</Link>
        ) : (
          <Link to="/shop" className="shop-now-btn">Start Shopping</Link>
        )}
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="cart-empty">
        <h2>Your Cart is Empty</h2>
        <p>Looks like you haven't added anything to your cart yet.</p>
        <Link to="/shop" className="shop-now-btn">Start Shopping</Link>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <h1>Shopping Cart</h1>
      <div className="cart-grid">
        <div className="cart-items">
          {cartItems.map((item) => (
            <div className="cart-item" key={item.id}>
              <img
                src={item.product.image_url || 'https://via.placeholder.com/100'}
                alt={item.product.name}
              />
              <div className="cart-item-details">
                <h3>{item.product.name}</h3>
                <p>€{item.product.price}</p>
                <div className="cart-item-actions">
                  <div className="quantity-selector">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                      +
                    </button>
                  </div>
                  <button className="remove-btn" onClick={() => removeFromCart(item.id)}>
                    Remove
                  </button>
                </div>
              </div>
              <div className="cart-item-total">
                €{(item.product.price * item.quantity).toFixed(2)}
              </div>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <h3>Order Summary</h3>
          <div className="summary-row">
            <span>Subtotal</span>
            <span>€{cartTotal.toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>Shipping</span>
            <span>{cartTotal >= 200 ? 'Free' : '€10.00'}</span>
          </div>
          <div className="summary-row total">
            <span>Total</span>
            <span>€{(cartTotal >= 200 ? cartTotal : cartTotal + 10).toFixed(2)}</span>
          </div>
          <button className="checkout-btn" onClick={handleCheckout} disabled={checkingOut}>
            {checkingOut ? 'Processing...' : 'Proceed to Checkout'}
          </button>
          <button className="clear-cart-btn" onClick={clearCart}>
            Clear Cart
          </button>
          <Link to="/shop" className="continue-shopping">
            ← Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Cart;
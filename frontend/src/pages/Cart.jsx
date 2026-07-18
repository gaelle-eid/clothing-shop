import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

function Cart() {
  const { cartItems, cartTotal, removeFromCart, updateQuantity, clearCart } = useCart();

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
                src={item.image_url || 'https://via.placeholder.com/100'}
                alt={item.name}
              />
              <div className="cart-item-details">
                <h3>{item.name}</h3>
                <p>€{item.price}</p>
                <div className="cart-item-actions">
                  <div className="quantity-selector">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                  <button
                    className="remove-btn"
                    onClick={() => removeFromCart(item.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
              <div className="cart-item-total">
                €{(item.price * item.quantity).toFixed(2)}
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
          <button className="checkout-btn">Proceed to Checkout</button>
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
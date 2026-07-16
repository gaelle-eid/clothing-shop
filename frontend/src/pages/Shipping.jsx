function Shipping() {
  return (
    <div className="page-container">
      <h1>Shipping Information</h1>
      <p className="subtitle">We deliver your orders with care, anywhere in the world.</p>

      <div className="shipping-info">
        <div className="shipping-card">
          <span className="icon">🚚</span>
          <h3>Free Shipping</h3>
          <p>On all orders over €200. No code needed.</p>
        </div>
        <div className="shipping-card">
          <span className="icon">⏱️</span>
          <h3>Fast Delivery</h3>
          <p>3-5 business days within Europe. 5-7 days for international.</p>
        </div>
        <div className="shipping-card">
          <span className="icon">📦</span>
          <h3>Track Your Order</h3>
          <p>You'll receive a tracking number via email once your order ships.</p>
        </div>
      </div>
    </div>
  );
}
export default Shipping;
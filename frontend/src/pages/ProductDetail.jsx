import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import { useCart } from '../context/CartContext';

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    api
      .get(`/products/${id}`)
      .then((res) => {
        setProduct(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError('Product not found.');
        setLoading(false);
      });
  }, [id]);

const handleAddToCart = () => {
  // addToCart now takes just the product's ID (not the whole object),
  // and it's a real network request to the backend - so we wait for it
  // to succeed before showing the "Added to cart!" confirmation.
  addToCart(product.id, quantity)
    .then(() => {
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 3000);
    })
    .catch((err) => {
      console.error(err);
      // 401 means "not logged in" - the backend requires authentication
      // for cart actions, so show a clear message instead of failing silently
      if (err?.response?.status === 401) {
        setError('Please log in to add items to your cart.');
      }
    });
};

  if (loading) return <p style={{ padding: '60px', textAlign: 'center' }}>Loading...</p>;
  if (error) return <p style={{ padding: '60px', textAlign: 'center', color: 'red' }}>{error}</p>;

  return (
    <div className="home-container" style={{ padding: '60px 50px', display: 'flex', gap: '50px', flexWrap: 'wrap' }}>
      <img
        src={product.image_url || 'https://via.placeholder.com/500'}
        alt={product.name}
        style={{ width: '400px', height: '500px', objectFit: 'cover' }}
      />

      <div style={{ flex: 1, minWidth: '280px' }}>
        <h1 style={{ fontWeight: 200, fontSize: '32px', letterSpacing: '2px', marginBottom: '10px' }}>
          {product.name}
        </h1>
        <p style={{ fontSize: '20px', color: '#999', marginBottom: '20px' }}>€{product.price}</p>
        <p style={{ color: '#666', lineHeight: '1.6', marginBottom: '20px' }}>
          {product.description}
        </p>

        {product.size && <p><strong>Size:</strong> {product.size}</p>}
        {product.color && <p><strong>Color:</strong> {product.color}</p>}
        {product.category && <p><strong>Category:</strong> {product.category}</p>}
        <p><strong>In stock:</strong> {product.stock}</p>

        {/* Quantity Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '20px 0' }}>
          <label style={{ fontWeight: '500' }}>Quantity:</label>
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            disabled={quantity <= 1}
            style={{
              width: '36px',
              height: '36px',
              border: '1px solid #ddd',
              background: '#fff',
              cursor: 'pointer',
              fontSize: '18px',
              borderRadius: '4px'
            }}
          >
            -
          </button>
          <span style={{ fontSize: '18px', minWidth: '30px', textAlign: 'center' }}>{quantity}</span>
          <button
            onClick={() => setQuantity(quantity + 1)}
            disabled={product.stock && quantity >= product.stock}
            style={{
              width: '36px',
              height: '36px',
              border: '1px solid #ddd',
              background: '#fff',
              cursor: 'pointer',
              fontSize: '18px',
              borderRadius: '4px'
            }}
          >
            +
          </button>
        </div>

        <button
          className="about-btn"
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          style={{
            marginTop: '25px',
            opacity: product.stock === 0 ? '0.5' : '1',
            cursor: product.stock === 0 ? 'not-allowed' : 'pointer'
          }}
        >
          {product.stock === 0 ? 'Out of Stock' : 'Add to Cart 🛒'}
        </button>

        {addedToCart && (
          <p style={{ color: '#4a7c59', marginTop: '12px', fontWeight: '500' }}>
            ✅ Added to cart!
          </p>
        )}

        <Link to="/shop" style={{ display: 'inline-block', marginTop: '20px', color: '#666' }}>
          ← Back to Shop
        </Link>
      </div>
    </div>
  );
}

export default ProductDetail;
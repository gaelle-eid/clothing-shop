import { useEffect, useState } from 'react';
import api from '../api/axios';
import { Link } from 'react-router-dom';

function Shop() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get('/products/')
      .then((res) => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError('Could not load products.');
        setLoading(false);
      });
  }, []);

  if (loading) return <p style={{ padding: '60px', textAlign: 'center' }}>Loading products...</p>;
  if (error) return <p style={{ padding: '60px', textAlign: 'center', color: 'red' }}>{error}</p>;

  return (
    <div className="home-container">
      <div className="category-section">
        <h2 className="category-title">SHOP ALL</h2>
      </div>

      <div className="product-grid">
        {products.length === 0 && <p>No products available yet.</p>}

      {products.map((product) => (
  <Link
    to={`/products/${product.id}`}
    className="product-card"
    key={product.id}
    style={{ textDecoration: 'none', color: 'inherit' }}
  >
    <img
      src={product.image_url || 'https://via.placeholder.com/400'}
      alt={product.name}
      className="product-image"
    />
    <div className="product-info">
      <p className="product-name">{product.name}</p>
      <p className="product-price">€{product.price}</p>
    </div>
  </Link>
))}
      </div>
    </div>
  );
}

export default Shop;
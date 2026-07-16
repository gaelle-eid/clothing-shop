import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

function New() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

useEffect(() => {
  api
    .get('/products/')
    .then((res) => {
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      const newThisMonth = res.data.filter(
        (product) => new Date(product.created_at) >= startOfMonth
      );

      const sorted = newThisMonth.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );

      setProducts(sorted);
      setLoading(false);
    })
    .catch((err) => {
      console.error(err);
      setError('Could not load new arrivals.');
      setLoading(false);
    });
}, []);

  return (
    <div className="home-container">
      <div className="category-section">
        <h2 className="category-title">NEW ARRIVALS</h2>
      </div>

      {loading && <p className="filter-loading">Loading...</p>}
      {error && <p className="filter-loading" style={{ color: '#c0392b' }}>{error}</p>}

      <div className="product-grid">
        {!loading && products.length === 0 && (
          <p className="filter-empty">No products yet.</p>
        )}

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

export default New;
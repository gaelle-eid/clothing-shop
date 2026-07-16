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
        // Sort newest first (highest id = most recently created)
        const sorted = [...res.data].sort((a, b) => b.id - a.id);
        setProducts(sorted.slice(0, 8)); // show up to 8 newest
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
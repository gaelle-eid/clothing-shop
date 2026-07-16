import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

function Sale() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get('/products/', { params: { on_sale: true } })
      .then((res) => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError('Could not load sale items.');
        setLoading(false);
      });
  }, []);

  return (
    <div className="home-container">
      <div className="category-section">
        <h2 className="category-title">SALE</h2>
      </div>

      {loading && <p className="filter-loading">Loading...</p>}
      {error && <p className="filter-loading" style={{ color: '#c0392b' }}>{error}</p>}

      <div className="product-grid">
        {!loading && products.length === 0 && (
          <p className="filter-empty">No items on sale right now.</p>
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
            <p className="product-price">
                   {product.original_price && (
                   <span style={{ textDecoration: 'line-through', color: '#bbb', marginRight: '8px' }}>
                   €{product.original_price}
                   </span>
              )}
    <span style={{ color: '#c0392b' }}>€{product.price}</span>
  </p>
</div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Sale;
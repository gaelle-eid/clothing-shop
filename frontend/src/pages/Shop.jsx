import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import { useCart } from '../context/CartContext';

function Shop() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [searchParams] = useSearchParams();
  const { addToCart } = useCart();

  // Read category from URL on page load
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      const formattedCategory = categoryParam.charAt(0).toUpperCase() + categoryParam.slice(1);
      setCategory(formattedCategory);
    }
  }, [searchParams]);

  useEffect(() => {
    setLoading(true);

    const params = {};
    if (search) params.search = search;
    if (category) params.category = category;

    api
      .get('/products/', { params })
      .then((res) => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError('Could not load products.');
        setLoading(false);
      });
  }, [search, category]);

  return (
    <div className="home-container">
      <div className="category-section">
        <h2 className="category-title">
          {category ? category : 'SHOP ALL'}
        </h2>
      </div>

      {/* Search + Filter Bar */}
      <div className="filter-bar">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="filter-search"
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="filter-select"
        >
          <option value="">All Categories</option>
          <option value="Dresses">Dresses</option>
          <option value="Outerwear">Outerwear</option>
          <option value="Accessories">Accessories</option>
        </select>
      </div>

      {loading && <p className="filter-loading">Loading products...</p>}
      {error && <p className="filter-loading" style={{ color: '#c0392b' }}>{error}</p>}

      <div className="product-grid">
        {!loading && products.length === 0 && (
          <p className="filter-empty">No products match your search.</p>
        )}

        {products.map((product) => (
          <div className="product-card" key={product.id}>
            <Link
              to={`/products/${product.id}`}
              style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
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
            <button
              className="quick-add-btn"
              onClick={() => addToCart(product, 1)}
              style={{
                margin: '0 16px 16px 16px',
                padding: '8px',
                width: 'calc(100% - 32px)',
                background: '#1a1a1a',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px',
              }}
            >
              Add to Cart 🛒
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Shop;
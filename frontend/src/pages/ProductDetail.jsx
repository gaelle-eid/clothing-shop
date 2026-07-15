import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

        <button className="about-btn" style={{ marginTop: '25px' }}>
          Add to Cart
        </button>
      </div>
    </div>
  );
}

export default ProductDetail;
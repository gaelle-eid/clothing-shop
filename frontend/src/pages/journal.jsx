import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

function Journal() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get('/posts/')
      .then((res) => {
        setPosts(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError('Could not load journal posts.');
        setLoading(false);
      });
  }, []);

  return (
    <div className="home-container">
      <div className="category-section">
        <h2 className="category-title">JOURNAL</h2>
        <p style={{ color: '#999', fontSize: '14px', fontWeight: 300, marginTop: '10px' }}>
          Stories, style notes, and behind the scenes
        </p>
      </div>

      {loading && <p className="filter-loading">Loading...</p>}
      {error && <p className="filter-loading" style={{ color: '#c0392b' }}>{error}</p>}

      <div className="journal-grid">
        {posts.map((post) => (
          <div className="journal-card" key={post.id}>
            <img src={post.image_url} alt={post.title} className="journal-image" />
            <div className="journal-content">
              <p className="journal-date">{post.date}</p>
              <h3 className="journal-title">{post.title}</h3>
              <p className="journal-excerpt">{post.excerpt}</p>
              <Link to={`/journal/${post.id}`} className="journal-link">Read More →</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Journal;
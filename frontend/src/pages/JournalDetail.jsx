import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';

function JournalDetail() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get(`/posts/${id}`)
      .then((res) => {
        setPost(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError('Post not found.');
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p className="filter-loading">Loading...</p>;
  if (error) return <p className="filter-loading" style={{ color: '#c0392b' }}>{error}</p>;

  return (
    <div className="home-container" style={{ padding: '60px 50px', maxWidth: '800px', margin: '0 auto' }}>
      <p className="journal-date">{post.date}</p>
      <h1 style={{ fontWeight: 200, fontSize: '32px', letterSpacing: '1px', margin: '10px 0 30px' }}>
        {post.title}
      </h1>

      <img
        src={post.image_url}
        alt={post.title}
        style={{ width: '100%', height: '400px', objectFit: 'cover', marginBottom: '30px' }}
      />

      {post.content.split('\n\n').map((paragraph, index) => (
        <p key={index} style={{ color: '#444', lineHeight: '1.8', marginBottom: '20px', fontWeight: 300 }}>
          {paragraph}
        </p>
      ))}
    </div>
  );
}

export default JournalDetail;
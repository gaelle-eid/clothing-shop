import { useState } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import '../App.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();
  const { refreshCartCount } = useCart(); // so the badge switches to THIS user's real cart right away
const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', response.data.access_token);
      refreshCartCount(); // now that we're logged in as this user, load THEIR real cart count
      setMessage('Welcome back.');
      setIsSuccess(true);
      setTimeout(() => navigate('/'), 1500);
    } catch (error) {
      setMessage('Invalid email or password');
      setIsSuccess(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Sign In</h2>
        <p className="auth-subtitle">Welcome back to AMBER</p>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="auth-input"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="auth-input"
          />
          <button type="submit" className="auth-btn">
            SIGN IN
          </button>
        </form>

        {message && (
          <p className={`auth-message ${isSuccess ? 'success' : 'error'}`}>
            {message}
          </p>
        )}

        <p className="auth-footer">
          Don't have an account?{' '}
          <a href="/register" className="auth-link">Create Account</a>
        </p>
      </div>
    </div>
  );
}

export default Login;
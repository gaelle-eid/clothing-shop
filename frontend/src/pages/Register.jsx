import { useState } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import '../App.css';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/auth/register', { name, email, password });
      setMessage('Registration successful. Please login.');
      setIsSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (error) {
      setMessage(error.response?.data?.detail || 'Registration failed');
      setIsSuccess(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Create Account</h2>
        <p className="auth-subtitle">Join AMBER</p>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="auth-input"
          />
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
            CREATE ACCOUNT
          </button>
        </form>

        {message && (
          <p className={`auth-message ${isSuccess ? 'success' : 'error'}`}>
            {message}
          </p>
        )}

        <p className="auth-footer">
          Already have an account?{' '}
          <a href="/login" className="auth-link">Sign In</a>
        </p>
      </div>
    </div>
  );
}

export default Register;
import { useState } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', response.data.access_token);
      setMessage('Login successful!');
      navigate('/');
    } catch (error) {
      setMessage('Invalid email or password');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto' }}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ display: 'block', width: '100%', margin: '10px 0', padding: '8px' }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ display: 'block', width: '100%', margin: '10px 0', padding: '8px' }}
        />
        <button type="submit" style={{ width: '100%', padding: '10px' }}>
          Login
        </button>
      </form>
      <p>{message}</p>
      <p>Don't have an account? <a href="/register">Register</a></p>
    </div>
  );
}

export default Login;
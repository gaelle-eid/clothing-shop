import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';

function App() {
  return (
    <BrowserRouter>
      <nav style={{ padding: '10px', background: '#f0f0f0' }}>
        <Link to="/register" style={{ margin: '10px' }}>Register</Link>
        <Link to="/login" style={{ margin: '10px' }}>Login</Link>
      </nav>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<h2>Welcome to Clothing Shop</h2>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Register from './pages/Register';
import Login from './pages/Login';
import Shop from './pages/Shop';
import './App.css';
import ProductDetail from './pages/ProductDetail';
import OrderConfirmation from './pages/OrderConfirmation';
import Sale from './pages/Sale';
import New from './pages/New';
import Contact from './pages/Contact';
import Journal from './pages/Journal';
import JournalDetail from './pages/JournalDetail';
import Shipping from './pages/Shipping';
import Returns from './pages/Returns';
import SizeGuide from './pages/SizeGuide';
import FAQ from './pages/FAQ';
import OurStory from './pages/OurStory';
import Sustainability from './pages/Sustainability';
import Careers from './pages/Careers';
import Press from './pages/Press';
import Cart from './pages/Cart';
import { useCart } from './context/CartContext';
import ChatWidget from './components/ChatWidget';

function App() {
  // cartCount now comes straight from the real backend cart (via CartContext),
// not from localStorage - this is the number shown in the 🛒 badge
const { cartCount } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [newsletterMsg, setNewsletterMsg] = useState('');
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 500);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNewsletter = (e) => {
    e.preventDefault();
    if (email) {
      setNewsletterMsg('✨ Thank you for subscribing!');
      setEmail('');
      setTimeout(() => setNewsletterMsg(''), 3000);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <BrowserRouter>
      <nav className="navbar">
        <div className="navbar-top">
          <h1 className="navbar-brand">AMBER</h1>

          <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
            <span></span>
            <span></span>
            <span></span>
          </button>

          <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
            <Link to="/new" onClick={() => setMenuOpen(false)}>New</Link>
            <Link to="/shop" onClick={() => setMenuOpen(false)}>Shop All</Link>
            <Link to="/sale" onClick={() => setMenuOpen(false)}>Sale</Link>
            <Link to="/journal" onClick={() => setMenuOpen(false)}>Journal</Link>
            <Link to="/contact" onClick={() => setMenuOpen(false)}>Contacts</Link>
            <div className="nav-right">
              <Link to="/login" onClick={() => setMenuOpen(false)}>Account</Link>
              <Link to="/register" onClick={() => setMenuOpen(false)}>Register</Link>
              <Link to="/cart" className="cart-link" onClick={() => setMenuOpen(false)}>
                🛒
                {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/sale" element={<Sale />} />
        <Route path="/new" element={<New />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/journal" element={<Journal />} />
        <Route path="/journal/:id" element={<JournalDetail />} />
        <Route path="/shipping" element={<Shipping />} />
        <Route path="/returns" element={<Returns />} />
        <Route path="/size-guide" element={<SizeGuide />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/our-story" element={<OurStory />} />
        <Route path="/sustainability" element={<Sustainability />} />
        <Route path="/careers" element={<Careers />} />
        <Route path="/press" element={<Press />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/order-confirmation/:id" element={<OrderConfirmation />} />
        <Route path="/" element={
          <div className="home-container">
            <div className="hero-section">
              <h1 className="hero-title">New Arrivals</h1>
              <p className="hero-subtitle">Discover our latest collection</p>
              <Link to="/shop" className="hero-btn">Shop Now</Link>
            </div>

            <div className="categories-grid">
              <div className="category-card">
                <img src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=400" alt="Dresses" />
                <h3>Dresses</h3>
                <Link to="/shop?category=Dresses" className="category-link">Shop Now →</Link>
              </div>
              <div className="category-card">
                <img src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400" alt="Outerwear" />
                <h3>Outerwear</h3>
                <Link to="/shop?category=Outerwear" className="category-link">Shop Now →</Link>
              </div>
              <div className="category-card">
                <img src="https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400" alt="Accessories" />
                <h3>Accessories</h3>
                <Link to="/shop?category=Accessories" className="category-link">Shop Now →</Link>
              </div>
            </div>

            <div className="category-section">
              <h2 className="category-title">DRESSES</h2>
              <Link to="/shop?category=Dresses" className="category-link">SHOP ALL</Link>
            </div>

            <div className="product-grid">
              <div className="product-card">
                <img 
                  src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=400" 
                  alt="Dress"
                  className="product-image"
                />
                <div className="product-info">
                  <p className="product-name">Silk Midi Dress</p>
                  <p className="product-price">€245</p>
                </div>
              </div>
              <div className="product-card">
                <img 
                  src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400" 
                  alt="Dress"
                  className="product-image"
                />
                <div className="product-info">
                  <p className="product-name">Linen Maxi Dress</p>
                  <p className="product-price">€189</p>
                </div>
              </div>
              <div className="product-card">
                <img 
                  src="https://images.unsplash.com/photo-1581044777550-4cfa60707c03?w=400" 
                  alt="Dress"
                  className="product-image"
                />
                <div className="product-info">
                  <p className="product-name">Cotton Sundress</p>
                  <p className="product-price">€135</p>
                </div>
              </div>
            </div>

            <div className="bestsellers-section">
              <h2 className="section-title">Bestsellers</h2>
              <div className="product-grid" style={{ padding: '0', background: 'transparent' }}>
                <div className="product-card">
                  <img 
                    src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400" 
                    alt="Bestseller"
                    className="product-image"
                  />
                  <div className="product-info">
                    <p className="product-name">Wool Blend Coat</p>
                    <p className="product-price">€320</p>
                  </div>
                </div>
                <div className="product-card">
                  <img 
                    src="https://images.unsplash.com/photo-1445205170230-053b83016050?w=400" 
                    alt="Bestseller"
                    className="product-image"
                  />
                  <div className="product-info">
                    <p className="product-name">Leather Tote Bag</p>
                    <p className="product-price">€275</p>
                  </div>
                </div>
                <div className="product-card">
                  <img 
                    src="https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400" 
                    alt="Bestseller"
                    className="product-image"
                  />
                  <div className="product-info">
                    <p className="product-name">Silk Scarf</p>
                    <p className="product-price">€89</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="about-section">
              <div className="about-content">
                <h2>Our Story</h2>
                <p>
                  AMBER was born from a passion for timeless elegance and sustainable fashion. 
                  We believe in creating pieces that make women feel confident, beautiful, and empowered. 
                  Every garment is thoughtfully designed with quality materials and ethical production.
                </p>
                <a href="#" className="about-btn">Learn More</a>
              </div>
              <img 
                src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600" 
                alt="About us"
                className="about-image"
              />
            </div>

            <div className="testimonials-section">
              <h2 className="section-title">What Our Customers Say</h2>
              <div className="testimonials-grid">
                <div className="testimonial-card">
                  <span>⭐⭐⭐⭐⭐</span>
                  <p>"Absolutely love my new dress! The quality is exceptional and it fits perfectly."</p>
                  <h4>- Sarah M.</h4>
                </div>
                <div className="testimonial-card">
                  <span>⭐⭐⭐⭐⭐</span>
                  <p>"Beautiful designs and fast shipping. Will definitely order again. My new favorite brand."</p>
                  <h4>- Emma R.</h4>
                </div>
                <div className="testimonial-card">
                  <span>⭐⭐⭐⭐⭐</span>
                  <p>"The perfect blend of elegance and comfort. I've never felt more confident in a dress."</p>
                  <h4>- Olivia K.</h4>
                </div>
              </div>
            </div>

            <div className="newsletter-section">
              <h2 className="newsletter-title">Join the AMBER Edit</h2>
              <p className="newsletter-subtitle">
                Subscribe for exclusive updates, early access, and 10% off your first order.
              </p>
              <form className="newsletter-form" onSubmit={handleNewsletter}>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="newsletter-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <button type="submit" className="newsletter-btn">Subscribe</button>
              </form>
              {newsletterMsg && (
                <p style={{ color: '#4a7c59', marginTop: '15px', fontSize: '14px' }}>
                  {newsletterMsg}
                </p>
              )}
            </div>

            <div className="instagram-section">
              <h2 className="section-title">Follow us @AMBER</h2>
              <div className="instagram-grid">
                <img src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=200" alt="Instagram" />
                <img src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=200" alt="Instagram" />
                <img src="https://images.unsplash.com/photo-1581044777550-4cfa60707c03?w=200" alt="Instagram" />
                <img src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=200" alt="Instagram" />
                <img src="https://images.unsplash.com/photo-1445205170230-053b83016050?w=200" alt="Instagram" />
                <img src="https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=200" alt="Instagram" />
              </div>
            </div>
          </div>
        } />
      </Routes>

      <footer className="footer">
        <div className="footer-grid">
          <div className="footer-column">
            <h4>AMBER</h4>
            <p>Timeless elegance for the modern woman.</p>
            <div className="footer-social">
              <a href="#">📷</a>
              <a href="#">🐦</a>
              <a href="#">📌</a>
              <a href="#">📘</a>
            </div>
          </div>
          <div className="footer-column">
            <h4>Shop</h4>
            <Link to="/new">New Arrivals</Link>
            <Link to="/shop?category=Dresses">Dresses</Link>
            <Link to="/shop?category=Outerwear">Outerwear</Link>
            <Link to="/shop?category=Accessories">Accessories</Link>
          </div>
          <div className="footer-column">
            <h4>Help</h4>
            <Link to="/shipping">Shipping</Link>
            <Link to="/returns">Returns</Link>
            <Link to="/size-guide">Size Guide</Link>
            <Link to="/contact">Contact Us</Link>
            <Link to="/faq">FAQ</Link>
          </div>
          <div className="footer-column">
            <h4>About</h4>
            <Link to="/our-story">Our Story</Link>
            <Link to="/sustainability">Sustainability</Link>
            <Link to="/careers">Careers</Link>
            <Link to="/press">Press</Link>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2026 AMBER. All rights reserved.</p>
        </div>
      </footer>

     <button 
        className={`back-to-top ${showBackToTop ? 'visible' : ''}`}
        onClick={scrollToTop}
      >
        ↑
      </button>

      <ChatWidget />
    </BrowserRouter>
  );
}

export default App;
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useCart } from '../context/CartContext';
import '../App.css';
import ReactMarkdown from 'react-markdown'; // all chat widget styles live in App.css (.chat-* classes)

function ChatWidget() {
  const { refreshCartCount } = useCart();
  const navigate = useNavigate(); // lets us jump to a product page when a chat card is clicked

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [history, setHistory] = useState([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);

  // A ref to an invisible element at the bottom of the message list.
  // Scrolling it into view is how we auto-scroll to the newest message.
  const messagesEndRef = useRef(null);

  // Every time messages change (a new one was added), scroll down smoothly
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, sending]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input;
    setInput('');
    setSending(true);

    setMessages((prev) => [...prev, { role: 'user', text: userMessage }]);

    try {
      const res = await api.post('/agent/chat', {
        message: userMessage,
        history: history,
      });

      // Each agent message now carries its own list of product cards
      // (whatever search_products / get_product_details looked up this turn)
      setMessages((prev) => [
        ...prev,
        { role: 'agent', text: res.data.reply, cards: res.data.product_cards || [] },
      ]);
      setHistory(res.data.history);
      refreshCartCount(); // the agent may have just changed the cart - keep the badge in sync
    } catch (err) {
      console.error(err);
      const status = err?.response?.status;
      const text =
        status === 401
          ? 'Please log in to chat with the AMBER Assistant.'
          : 'Sorry, something went wrong. Please try again.';
      setMessages((prev) => [...prev, { role: 'agent', text }]);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="chat-widget-wrapper">
      {isOpen ? (
        <div className="chat-window">
          {/* Header */}
          <div className="chat-header">
            <div>
              <div className="chat-header-title">AMBER Assistant</div>
              <div className="chat-header-subtitle">
                Ask about products, sizing, or your cart
              </div>
            </div>
            <button className="chat-close-btn" onClick={() => setIsOpen(false)}>
              ×
            </button>
          </div>

          {/* Messages */}
          <div className="chat-messages">
            {messages.length === 0 && (
              <div className="chat-empty-state">
                Hi! I'm the AMBER Assistant. Ask me to find something, tell you about a
                product, or add an item to your cart.
              </div>
            )}

            {messages.map((msg, i) => (
              <div key={i} className={`chat-message-row ${msg.role}`}>
                {/* Small monogram avatar, only on agent messages */}
                {msg.role === 'agent' && <div className="chat-avatar">A</div>}

                <div style={{ maxWidth: '80%' }}>
                 <div className={`chat-bubble ${msg.role}`}>
  <ReactMarkdown>{msg.text}</ReactMarkdown>
</div>

                  {/* Clickable product cards, if the agent looked any up this turn */}
                  {msg.cards && msg.cards.length > 0 && (
                    <div className="chat-product-cards">
                      {msg.cards.map((card) => (
                        <div
                          key={card.id}
                          className="chat-product-card"
                          onClick={() => navigate(`/products/${card.id}`)}
                        >
                          <img
                            src={card.image_url || 'https://via.placeholder.com/80'}
                            alt={card.name}
                          />
                          <div className="chat-product-card-info">
                            <div className="chat-product-card-name">{card.name}</div>
                            <div className="chat-product-card-price">€{card.price}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Animated "typing" indicator, shown while waiting for a reply */}
            {sending && (
              <div className="chat-message-row agent">
                <div className="chat-avatar">A</div>
                <span className="chat-typing-bubble">
                  <span className="chat-typing-dot" />
                  <span className="chat-typing-dot" />
                  <span className="chat-typing-dot" />
                </span>
              </div>
            )}

            {/* Invisible anchor - scrolling this into view is how we auto-scroll down */}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSend} className="chat-input-form">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
              className="chat-input"
            />
            <button type="submit" disabled={sending} className="chat-send-btn">
              Send
            </button>
          </form>
        </div>
      ) : (
        <button className="chat-toggle-btn" onClick={() => setIsOpen(true)}>
          {/* Simple line-drawn chat icon, matching the site's minimal aesthetic */}
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
          </svg>
        </button>
      )}
    </div>
  );
}

export default ChatWidget;
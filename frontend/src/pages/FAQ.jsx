import { useState } from 'react';

function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      q: 'How long does shipping take?',
      a: 'Orders are delivered within 3-5 business days within Europe and 5-7 business days for international orders.'
    },
    {
      q: 'Can I return my order?',
      a: 'Yes, we accept returns within 30 days of delivery. Items must be in original condition with tags attached.'
    },
    {
      q: 'Do you ship internationally?',
      a: 'Yes, we ship worldwide. Shipping costs and delivery times vary by location.'
    },
    {
      q: 'How can I track my order?',
      a: 'You\'ll receive a tracking number via email once your order ships. You can also track it in your account.'
    },
    {
      q: 'What payment methods do you accept?',
      a: 'We accept all major credit cards, PayPal, and Apple Pay.'
    }
  ];

  return (
    <div className="page-container">
      <h1>FAQ</h1>
      <p className="subtitle">Frequently asked questions.</p>

      <div className="faq-list">
        {faqs.map((faq, index) => (
          <div className="faq-item" key={index} onClick={() => setOpenIndex(openIndex === index ? null : index)}>
            <div className="question">
              <span>{faq.q}</span>
              <span className={`arrow ${openIndex === index ? 'open' : ''}`}>▾</span>
            </div>
            <div className={`answer ${openIndex === index ? 'open' : ''}`}>
              {faq.a}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
export default FAQ;
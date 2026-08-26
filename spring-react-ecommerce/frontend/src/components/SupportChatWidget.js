import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const FAQ_RESPONSES = [
  {
    keywords: ['order', 'track', 'status', 'where is'],
    answer:
      '📦 You can track all your orders in real-time by going to the Profile / Orders section! Click on any order to view payment status, shipment tracking, and estimated delivery dates.',
    action: { label: 'Go to Orders →', link: '/profile' },
  },
  {
    keywords: ['return', 'replace', 'replacement', 'refund', 'policy', '7 day'],
    answer:
      '🔄 We offer a 7-Day Hassle-Free Return & Replacement policy on all items! If you are not satisfied or received the wrong size, open your order details and click "Return or Replace Item" to get an instant pickup and full refund.',
    action: { label: 'View Orders →', link: '/profile' },
  },
  {
    keywords: ['payment', 'pay', 'upi', 'card', 'cod', 'gpay', 'phonepe', 'bhim'],
    answer:
      '💳 We accept all major payment methods:\n• UPI (Google Pay, PhonePe, Paytm, BHIM)\n• Credit / Debit Cards (Visa, Mastercard, RuPay)\n• NetBanking across 50+ banks\n• Cash on Delivery (COD).',
  },
  {
    keywords: ['delivery', 'shipping', 'time', 'fast', 'free shipping', 'cost'],
    answer:
      '🚚 Orders are processed within 24 hours! Standard domestic delivery takes 2–4 business days. We offer FREE shipping on all orders above ₹1,999!',
  },
  {
    keywords: ['size', 'fit', 'chart', 'measurement', 'small', 'medium', 'large'],
    answer:
      '👕 All apparel adheres to standard international sizing (S, M, L, XL, XXL). For loose/oversized styles, we recommend choosing your regular size. If you receive an improper fit, our 7-day free exchange is available!',
  },
  {
    keywords: ['contact', 'human', 'agent', 'call', 'email', 'phone', 'support', 'help'],
    answer:
      '📞 You can reach our 24/7 Support Team anytime:\n• Email: support@amazona.com\n• Helpline: +1 (800) 555-AMAZONA\n• Live Chat: Right here 24 hours a day, 7 days a week!',
    action: { label: 'Visit Contact Page →', link: '/contact' },
  },
  {
    keywords: ['admin', 'login', 'password', 'reset', 'forgot'],
    answer:
      '🔑 To reset your password, visit the Forgot Password page. For admin access, you can sign in with admin@example.com (password: 1234) to access product and order management.',
    action: { label: 'Reset Password →', link: '/forgot-password' },
  },
];

function getBotReply(userText) {
  const lower = userText.toLowerCase().trim();
  for (const item of FAQ_RESPONSES) {
    if (item.keywords.some((kw) => lower.includes(kw))) {
      return { text: item.answer, action: item.action };
    }
  }
  return {
    text:
      "👋 Hello! I'm the Amazona 24/7 Virtual Assistant. I can help you with Order Tracking, 7-Day Returns & Replacements, Payment Methods, Shipping Times, and Product Inquiries.\n\nHow may I assist you today?",
    action: null,
  };
}

export default function SupportChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text:
        '👋 Welcome to Amazona 24/7 Customer Support! How can we help you today? You can choose a quick topic below or type any question.',
      time: 'Just now',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  // Listen for global custom event to trigger support chat open
  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener('openSupportChat', handleOpen);
    return () => window.removeEventListener('openSupportChat', handleOpen);
  }, []);

  const handleSendMessage = (textToSend) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: text.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      const reply = getBotReply(text);
      const botMsg = {
        id: Date.now() + 1,
        sender: 'bot',
        text: reply.text,
        action: reply.action,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setIsTyping(false);
      setMessages((prev) => [...prev, botMsg]);
    }, 600);
  };

  const handleQuickQuestion = (q) => {
    handleSendMessage(q);
  };

  return (
    <>
      {/* Floating Chat Button */}
      <button
        className="support-chat-launcher"
        onClick={() => setIsOpen(!isOpen)}
        title="24/7 Live Support Chat"
        aria-label="Open 24/7 Support"
      >
        <span className="launcher-icon">{isOpen ? '✕' : '💬'}</span>
        {!isOpen && <span className="launcher-badge">24/7</span>}
      </button>

      {/* Chat Window Modal */}
      {isOpen && (
        <div className="support-chat-modal">
          {/* Header */}
          <div className="support-chat-header">
            <div className="support-chat-header-info">
              <div className="support-agent-avatar">
                <span>🤖</span>
                <span className="online-dot" />
              </div>
              <div>
                <h4>Amazona 24/7 Support</h4>
                <p>● Active Now • Instant AI Help</p>
              </div>
            </div>
            <button className="support-close-btn" onClick={() => setIsOpen(false)}>
              ✕
            </button>
          </div>

          {/* Messages Area */}
          <div className="support-chat-body">
            {messages.map((m) => (
              <div key={m.id} className={`chat-message-row ${m.sender === 'user' ? 'user-row' : 'bot-row'}`}>
                {m.sender === 'bot' && <div className="chat-avatar-small">🤖</div>}
                <div className={`chat-bubble ${m.sender === 'user' ? 'user-bubble' : 'bot-bubble'}`}>
                  <p style={{ whiteSpace: 'pre-line' }}>{m.text}</p>
                  {m.action && (
                    <Link
                      to={m.action.link}
                      onClick={() => setIsOpen(false)}
                      className="chat-action-btn"
                    >
                      {m.action.label}
                    </Link>
                  )}
                  <span className="chat-timestamp">{m.time}</span>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="chat-message-row bot-row">
                <div className="chat-avatar-small">🤖</div>
                <div className="chat-bubble bot-bubble typing-bubble">
                  <span className="dot" />
                  <span className="dot" />
                  <span className="dot" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick FAQ Suggestion Chips */}
          <div className="support-chips-bar">
            <button onClick={() => handleQuickQuestion('Where is my order?')}>📦 Track Order</button>
            <button onClick={() => handleQuickQuestion('What is your return policy?')}>🔄 7-Day Returns</button>
            <button onClick={() => handleQuickQuestion('What payment methods are supported?')}>💳 Payment Methods</button>
            <button onClick={() => handleQuickQuestion('How can I contact support?')}>📞 Speak to Agent</button>
          </div>

          {/* Footer Input */}
          <form
            className="support-chat-footer"
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
          >
            <input
              type="text"
              placeholder="Ask anything (e.g. returns, orders, payments)…"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              autoFocus
            />
            <button type="submit" disabled={!inputText.trim()} className="support-send-btn">
              ➤
            </button>
          </form>
        </div>
      )}
    </>
  );
}

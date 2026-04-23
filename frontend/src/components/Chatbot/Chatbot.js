import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './Chatbot.css';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hi! How can I help you today?", isUser: false }
  ]);
  const [inputText, setInputText] = useState('');
  const [recommendations, setRecommendations] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen && recommendations.length === 0) {
      fetchRecommendations();
    }
  }, [isOpen]);

  const fetchRecommendations = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/faqs/recommendations`);
      setRecommendations(response.data);
    } catch (error) {
      console.error("Error fetching recommendations:", error);
    }
  };

  const handleSendMessage = async (e, quickText = null) => {
    if (e) e.preventDefault();
    const textToSend = quickText || inputText;
    if (!textToSend.trim()) return;

    const userMessage = { text: textToSend, isUser: true };
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    try {
      const response = await axios.get(`${API_BASE_URL}/api/faqs/answer`, {
        params: { question: textToSend }
      });
      
      setTimeout(() => {
        setMessages(prev => [...prev, { text: response.data.answer, isUser: false }]);
        setIsTyping(false);
      }, 1000);

    } catch (error) {
      setTimeout(() => {
        const errorMsg = error.response?.data?.message || "Sorry, I'm having trouble connecting right now.";
        setMessages(prev => [...prev, { text: errorMsg, isUser: false }]);
        setIsTyping(false);
      }, 1000);
    }
  };

  return (
    <div className={`chatbot-container ${isOpen ? 'open' : ''}`}>
      <button className="chatbot-toggle" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? '✕' : '💬'}
      </button>

      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <h4>Uni-Connect Assistant</h4>
            <p>Always here to help</p>
          </div>

          <div className="chatbot-messages">
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.isUser ? 'user' : 'bot'}`}>
                {msg.text}
              </div>
            ))}
            {isTyping && (
              <div className="message bot typing">
                <span>.</span><span>.</span><span>.</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {recommendations.length > 0 && messages.length === 1 && (
            <div className="chatbot-recommendations">
              <p>Common Questions:</p>
              <div className="rec-chips">
                {recommendations.map((rec, i) => (
                  <button key={i} onClick={() => handleSendMessage(null, rec)}>
                    {rec}
                  </button>
                ))}
              </div>
            </div>
          )}

          <form className="chatbot-input" onSubmit={(e) => handleSendMessage(e)}>
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask a question..."
            />
            <button type="submit">➤</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default Chatbot;

import React, { useState, useRef, useEffect, useContext } from 'react';
import { DiaryContext } from '../context/DiaryContext';
import { translations } from '../utils/translations';

const ChatBot = () => {
  const { language } = useContext(DiaryContext);
  const t = translations[language];
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('https://api.deepseek.com/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer sk-9fa09df14a7c4e40ba393b81ad0fa69e'
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            {
              role: 'system',
              content: language === 'zh' 
                ? '你是一个温暖、善解人意的陪伴者。你的任务是倾听用户的想法和感受，给予他们情感支持和安慰。请用温和、理解的语气回应，帮助用户缓解压力和负面情绪。'
                : 'You are a warm, understanding companion. Your role is to listen to users thoughts and feelings, providing emotional support and comfort. Please respond with a gentle, understanding tone to help users relieve stress and negative emotions.'
            },
            ...messages,
            userMessage
          ],
          stream: false
        })
      });

      if (response.ok) {
        const data = await response.json();
        const botMessage = {
          role: 'assistant',
          content: data.choices[0].message.content
        };
        setMessages(prev => [...prev, botMessage]);
      } else {
        throw new Error('API请求失败');
      }
    } catch (error) {
      const errorMessage = {
        role: 'assistant',
        content: language === 'zh' ? '抱歉，我现在无法回复。请稍后再试。' : 'Sorry, I cannot reply right now. Please try again later.'
      };
      setMessages(prev => [...prev, errorMessage]);
    }

    setLoading(false);
  };

  const clearChat = () => {
    setMessages([]);
  };

  return (
    <div className="chatbot">
      <div className="chatbot-header">
        <h3>{language === 'zh' ? '心灵陪伴' : 'Companion'}</h3>
        <button onClick={clearChat} className="clear-btn">
          {language === 'zh' ? '清空' : 'Clear'}
        </button>
      </div>
      
      <div className="chat-messages">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.role}`}>
            <div className="message-content">
              {message.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="message assistant">
            <div className="message-content">
              {language === 'zh' ? '正在思考...' : 'Thinking...'}
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          placeholder={language === 'zh' ? '分享你的想法...' : 'Share your thoughts...'}
          className="chat-input-field"
        />
        <button onClick={sendMessage} disabled={loading} className="send-btn">
          {language === 'zh' ? '发送' : 'Send'}
        </button>
      </div>
    </div>
  );
};

export default ChatBot;
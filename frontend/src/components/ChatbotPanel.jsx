import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPaperPlane, FaRobot, FaUser, FaTimes, FaCommentDots } from 'react-icons/fa';
import axios from 'axios';

function Message({ message, isUser }) {
  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row' : 'flex-row-reverse'} mb-4`}>
      {/* Avatar */}
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1 ${
          isUser ? 'bg-gray-600' : 'bg-accent-primary'
        }`}
      >
        {isUser ? <FaUser size={12} className="text-white" /> : <FaRobot size={12} className="text-white" />}
      </div>

      {/* Bubble */}
      <div
        className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
          isUser
            ? 'bg-white/10 text-gray-200 rounded-tl-md'
            : 'bg-accent-primary text-white rounded-tr-md'
        }`}
      >
        {message}
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex gap-3 flex-row-reverse mb-4">
      <div className="w-8 h-8 rounded-full bg-accent-primary flex items-center justify-center flex-shrink-0 mt-1">
        <FaRobot size={12} className="text-white" />
      </div>
      <div className="bg-accent-primary px-4 py-3 rounded-2xl rounded-tr-md">
        <div className="flex gap-1.5">
          {[0, 0.2, 0.4].map((delay, i) => (
            <span
              key={i}
              className="w-2 h-2 bg-white/70 rounded-full inline-block"
              style={{
                animation: 'pulse 1.4s ease-in-out infinite',
                animationDelay: `${delay}s`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ChatbotPanel({ messages, setMessages }) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading || !input.trim()) return;

    const userMessage = { text: input, isUser: true };
    const userInput = input;
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const apiUrl = '/api/chat';

      const response = await axios.post(
        apiUrl,
        { question: userInput },
        { headers: { 'Content-Type': 'application/json' }, timeout: 25000 }
      );
      const answer = response.data?.answer;
      if (typeof answer !== 'string' || !answer.trim()) {
        throw new Error('Invalid chat response');
      }
      setMessages((prev) => [...prev, { text: answer, isUser: false }]);
    } catch (err) {
      const serverAnswer = err.response?.data?.answer;
      const errorMessage = typeof serverAnswer === 'string' && serverAnswer.trim()
        ? serverAnswer
        : err.code === 'ECONNABORTED'
          ? 'The response took too long. Please try again.'
          : 'The AI assistant is unavailable right now. Please try again shortly or use the contact section.';
      setMessages((prev) => [
        ...prev,
        { text: errorMessage, isUser: false },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* FAB Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, type: 'spring', stiffness: 200 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`chat-launcher fixed bottom-5 right-5 z-[55] w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg transition-all duration-300 ${
          isOpen
            ? 'bg-white/10 border border-white/20'
            : 'bg-accent-primary'
        }`}
        aria-label="Toggle Chatbot"
      >
        {isOpen ? <FaTimes size={20} /> : <FaCommentDots size={20} />}
      </motion.button>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="chat-panel fixed bottom-20 right-4 z-[55] w-[calc(100vw-2rem)] sm:w-[380px] h-[min(520px,75dvh)] glass rounded-xl overflow-hidden flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="p-4 border-b border-white/10 bg-gradient-to-r from-accent-primary/20 to-accent-secondary/20">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-accent-primary flex items-center justify-center">
                  <FaRobot size={14} className="text-white" />
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">Naman's AI Assistant</p>
                  <p className="text-accent-glow/70 text-xs">Ask about my work & experience</p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div
              className="flex-1 overflow-y-auto p-4"
              style={{
                scrollbarWidth: 'thin',
                scrollbarColor: 'rgba(99,102,241,0.2) transparent',
              }}
            >
              {messages.map((msg, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Message message={msg.text} isUser={msg.isUser} />
                </motion.div>
              ))}
              {isLoading && <TypingIndicator />}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-3 border-t border-white/10">
              <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your message..."
                  disabled={isLoading}
                  className="input-glass flex-1 text-sm py-2.5"
                />
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-primary to-accent-secondary flex items-center justify-center text-white disabled:opacity-40 hover:bg-accent-secondary transition-all duration-200 flex-shrink-0"
                  aria-label="Send message"
                >
                  <FaPaperPlane size={14} />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pulse animation keyframes for typing dots */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.4; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </>
  );
}

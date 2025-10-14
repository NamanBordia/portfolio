import React, { useState } from 'react';

const Chat = ({ API_URL }) => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    setLoading(true);
    setError('');

    try {
      console.log('Sending chat question to:', `${API_URL}/api/chat`); // Debug log
      const response = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question }),
      });

      console.log('Chat response status:', response.status); // Debug log
      if (!response.ok) {
        throw new Error(`Failed to get answer: ${response.status}`);
      }

      const data = await response.json();
      console.log('Chat response:', data); // Debug log
      setAnswer(data.answer);
      setQuestion('');
    } catch (err) {
      console.error('Error in chat:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-container">
      <h2>Chat with AI</h2>
      <p>Ask me anything about my experience, skills, or projects!</p>
      
      <form onSubmit={handleSubmit} className="chat-form">
        {error && <div className="error-message">{error}</div>}
        <div className="input-group">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Type your question here..."
            disabled={loading}
          />
          <button type="submit" disabled={loading || !question.trim()}>
            {loading ? 'Thinking...' : 'Ask'}
          </button>
        </div>
      </form>

      {answer && (
        <div className="answer-container">
          <h3>Answer:</h3>
          <p>{answer}</p>
        </div>
      )}
    </div>
  );
};

export default Chat; 
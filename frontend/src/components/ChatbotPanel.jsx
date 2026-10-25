import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { FaPaperPlane, FaRobot, FaUser, FaTimes, FaCommentDots } from 'react-icons/fa';
import axios from 'axios';

function Message({ text, isUser }) {
  return (
    <div className={`chat-message ${isUser ? 'is-user' : ''}`}>
      <span className="chat-avatar" aria-hidden="true">{isUser ? <FaUser /> : <FaRobot />}</span>
      <div className="chat-bubble"><span className="sr-only">{isUser ? 'You: ' : 'Assistant: '}</span>{text}</div>
    </div>
  );
}

export default function ChatbotPanel({ messages, setMessages }) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const dialogRef = useRef(null);
  const launcherRef = useRef(null);
  const inputRef = useRef(null);
  const messagesRef = useRef(null);
  const followLatest = useRef(true);

  const scrollMessages = () => {
    const area = messagesRef.current;
    if (area) area.scrollTop = area.scrollHeight;
  };

  const openChat = () => {
    followLatest.current = true;
    dialogRef.current.showModal();
    setIsOpen(true);
  };

  const closeChat = () => dialogRef.current.close();

  useEffect(() => {
    if (!isOpen) return;
    const dialog = dialogRef.current;
    const viewport = window.visualViewport;
    let frame;
    const syncViewport = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        dialog.style.setProperty('--chat-viewport-height', `${viewport?.height ?? window.innerHeight}px`);
        dialog.style.setProperty('--chat-viewport-width', `${viewport?.width ?? window.innerWidth}px`);
        dialog.style.setProperty('--chat-viewport-top', `${viewport?.offsetTop ?? 0}px`);
        dialog.style.setProperty('--chat-viewport-left', `${viewport?.offsetLeft ?? 0}px`);
        if (document.activeElement === inputRef.current && followLatest.current) scrollMessages();
      });
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    syncViewport();
    viewport?.addEventListener('resize', syncViewport);
    viewport?.addEventListener('scroll', syncViewport);
    window.addEventListener('resize', syncViewport);
    return () => {
      cancelAnimationFrame(frame);
      document.body.style.overflow = previousOverflow;
      viewport?.removeEventListener('resize', syncViewport);
      viewport?.removeEventListener('scroll', syncViewport);
      window.removeEventListener('resize', syncViewport);
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !followLatest.current) return;
    const frame = requestAnimationFrame(scrollMessages);
    return () => cancelAnimationFrame(frame);
  }, [messages, isLoading, isOpen]);

  useEffect(() => {
    const textarea = inputRef.current;
    if (!textarea) return;
    textarea.style.height = '0px';
    textarea.style.height = `${Math.min(textarea.scrollHeight, 104)}px`;
  }, [input, isOpen]);

  const handleSubmit = async event => {
    event.preventDefault();
    if (isLoading || !input.trim()) return;
    const question = input.trim();
    followLatest.current = true;
    setMessages(previous => [...previous, { text: question, isUser: true }]);
    setInput('');
    setIsLoading(true);
    try {
      const response = await axios.post('/api/chat', { question }, {
        headers: { 'Content-Type': 'application/json' }, timeout: 25000,
      });
      const answer = response.data?.answer;
      if (typeof answer !== 'string' || !answer.trim()) throw new Error('Invalid chat response');
      setMessages(previous => [...previous, { text: answer, isUser: false }]);
    } catch (error) {
      const answer = error.response?.data?.answer;
      const text = typeof answer === 'string' && answer.trim()
        ? answer
        : error.code === 'ECONNABORTED'
          ? 'The response took too long. Please try again.'
          : 'The AI assistant is unavailable right now. Please try again shortly or use the contact section.';
      setMessages(previous => [...previous, { text, isUser: false }]);
    } finally {
      setIsLoading(false);
    }
  };

  return createPortal(
    <>
      <button ref={launcherRef} type="button" className="chat-launcher" onClick={openChat} aria-label="Open chat" aria-haspopup="dialog" aria-expanded={isOpen} aria-controls="assistant-chat"><FaCommentDots size={21} /></button>
      <dialog ref={dialogRef} id="assistant-chat" className="chat-dialog" aria-labelledby="assistant-chat-title" onClose={() => {
        setIsOpen(false);
        requestAnimationFrame(() => launcherRef.current?.focus({ preventScroll: true }));
      }} onClick={event => {
        if (event.target === event.currentTarget) closeChat();
      }}>
        <div className="chat-layout">
          <header className="chat-header">
            <span className="chat-header-icon" aria-hidden="true"><FaRobot size={18} /></span>
            <div className="chat-header-copy"><h2 id="assistant-chat-title">Naman's AI Assistant</h2><p>Projects, research &amp; experience</p></div>
            <button type="button" className="chat-close" onClick={closeChat} aria-label="Close chat"><FaTimes size={18} /></button>
          </header>
          <div ref={messagesRef} className="chat-messages" role="log" aria-label="Chat messages" aria-live="polite" aria-relevant="additions text" onScroll={event => {
            const area = event.currentTarget;
            followLatest.current = area.scrollHeight - area.scrollTop - area.clientHeight < 80;
          }}>
            {messages.map((message, index) => <Message key={index} text={message.text} isUser={message.isUser} />)}
            {isLoading && <div className="chat-typing" role="status"><span className="sr-only">Assistant is replying</span><span /><span /><span /></div>}
          </div>
          <form className="chat-composer" onSubmit={handleSubmit}>
            <textarea ref={inputRef} value={input} rows={1} onChange={event => setInput(event.target.value)} onKeyDown={event => {
              if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) handleSubmit(event);
            }} placeholder="Ask me anything..." aria-label="Your message" enterKeyHint="send" />
            <button type="submit" className="chat-send" disabled={isLoading || !input.trim()} aria-label="Send message"><FaPaperPlane size={17} /></button>
          </form>
        </div>
      </dialog>
    </>, document.body,
  );
}

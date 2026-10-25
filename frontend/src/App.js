import React, { useState } from 'react';
import './index.css';

// SPA Section Components
import Navbar from './components/Navbar.jsx';
import HeroSection from './components/HeroSection';
import AboutSection from './components/AboutSection';
import ProjectsSection from './components/ProjectsSection';
import CertificationsSection from './components/CertificationsSection';
import ResearchSection from './components/ResearchSection';
import FooterSection from './components/FooterSection';

// Overlay / Persistent Components
import ResumeOverlay from './components/ResumeOverlay';
import ChatbotPanel from './components/ChatbotPanel';

function App() {
  // Resume overlay state
  const [isResumeOpen, setIsResumeOpen] = useState(false);

  // Chatbot messages — lifted here so history persists across scrolling
  const [chatMessages, setChatMessages] = useState([
    {
      text: "Hi! I'm Naman's AI assistant. How can I help you today?",
      isUser: false,
    },
  ]);

  return (
    <div className="portfolio-shell">
      {/* Navigation */}
      <Navbar onResumeOpen={() => setIsResumeOpen(true)} />

      {/* Main Sectioned Content */}
      <main>
        <HeroSection onResumeOpen={() => setIsResumeOpen(true)} />
        <ProjectsSection />
        <AboutSection />
        <ResearchSection />
        <CertificationsSection />
      </main>

      {/* Footer */}
      <FooterSection />

      {/* Resume Full-Screen Overlay */}
      <ResumeOverlay
        isOpen={isResumeOpen}
        onClose={() => setIsResumeOpen(false)}
      />

      {/* Persistent Chatbot FAB + Panel */}
      <ChatbotPanel
        messages={chatMessages}
        setMessages={setChatMessages}
      />
    </div>
  );
}

export default App;
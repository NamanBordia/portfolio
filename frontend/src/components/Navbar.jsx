import React, { useState } from 'react';
import { FiArrowUpRight, FiMenu, FiX } from 'react-icons/fi';

const items = [{ label: 'Projects', to: 'projects' }, { label: 'Experience', to: 'experience' }, { label: 'Research', to: 'research' }, { label: 'Contact', to: 'contact' }];

export default function Navbar({ onResumeOpen }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <header className="site-header">
      <nav className="page-width nav-inner" aria-label="Main navigation">
        <a href="#hero" className="brand" aria-label="Naman Bordia, home"><span className="brand-mark">nb<span>.</span></span><span className="brand-name">Naman Bordia</span></a>
        <div className="desktop-nav">{items.map(item => <a key={item.to} href={`#${item.to}`}>{item.label}</a>)}<button onClick={onResumeOpen} className="nav-resume">Resume <FiArrowUpRight /></button></div>
        <button className="mobile-toggle" onClick={() => setIsOpen(!isOpen)} aria-label={isOpen ? 'Close navigation' : 'Open navigation'} aria-expanded={isOpen} aria-controls="mobile-navigation">{isOpen ? <FiX /> : <FiMenu />}</button>
      </nav>
      {isOpen && <nav id="mobile-navigation" className="mobile-nav" aria-label="Mobile navigation">{items.map(item => <a key={item.to} href={`#${item.to}`} onClick={() => setIsOpen(false)}>{item.label}</a>)}<button onClick={() => { setIsOpen(false); onResumeOpen(); }}>View resume <FiArrowUpRight /></button></nav>}
    </header>
  );
}

import React from 'react';
import { FiArrowDown, FiArrowUpRight } from 'react-icons/fi';
import { FaGithub, FaLinkedinIn } from 'react-icons/fa';
import { SiLeetcode } from 'react-icons/si';
import profile from '../data/profile.json';
import EmailContact from './EmailContact';

const socialLinks = [
  { label: 'GitHub', icon: FaGithub, href: profile.contact.github },
  { label: 'LinkedIn', icon: FaLinkedinIn, href: profile.contact.linkedin },
  { label: 'LeetCode', icon: SiLeetcode, href: profile.contact.leetcode },
];

export default function HeroSection({ onResumeOpen }) {
  return (
    <section id="hero" className="hero-section" aria-labelledby="hero-title">
      <div className="page-width hero-grid">
        <div className="hero-copy">
          <p className="eyebrow"><span className="status-dot" /> Software development &amp; AI research</p>
          <h1 id="hero-title">Naman <span>Bordia.</span></h1>
          <nav className="hero-socials" aria-label="Professional profiles">
            {socialLinks.map(({ label, icon: Icon, href }) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer">
                <Icon size={17} aria-hidden="true" /> {label} <FiArrowUpRight size={14} aria-hidden="true" />
              </a>
            ))}
          </nav>
          <p className="hero-description">I build full-stack software and reliable AI systems. B.Tech (Hons.) CSE at RV University, specializing in AI & ML.</p>
          <div className="hero-actions">
            <a href="#projects" className="btn-primary">Explore my work <FiArrowDown size={16} /></a>
            <button onClick={onResumeOpen} className="text-link">Resume <FiArrowUpRight size={16} /></button>
            <EmailContact>Email me <FiArrowUpRight size={16} /></EmailContact>
          </div>
        </div>
        <div className="hero-visual">
          <div className="portrait-frame">
            <span className="portrait-index">NB / 01</span>
            <img src="/assets/myimg2.png" alt="Naman Bordia" width="500" height="500" fetchPriority="high" />
            <span className="portrait-location">Bengaluru, India</span>
          </div>
          <div className="portrait-caption"><span>Developer. Researcher. Curious by nature.</span><span className="caption-line" /></div>

        </div>
      </div>
      <div className="page-width highlights" aria-label="Career and research highlights">
        <a href="#experience"><span className="small-label">Industry</span><strong>William O'Neil India</strong><span>Software Development Intern</span></a>
        <a href="#research"><span className="small-label">Research award</span><strong>Best Paper, 1st Place</strong><span>IEEE SSD 2026, Italy</span></a>
        <a href="#research"><span className="small-label">Publication</span><strong>Published in IEEE Xplore</strong><span>Rare event prediction &middot; IEEE RECCAP 2026</span></a>
      </div>
    </section>
  );
}

import React from 'react';
import profile from '../data/profile.json';

export default function AboutSection() {
  return (
    <section id="experience" className="section-space" aria-labelledby="experience-title">
      <div className="page-width compact-background">
        <div id="about" className="about-brief"><p className="eyebrow">A little about me</p><p>I study Computer Science &amp; AI/ML at {profile.education.university} ({profile.education.years}), with a CGPA of {profile.education.cgpa}. I enjoy turning research ideas into dependable software.</p><p className="skills-line"><strong>Working with</strong> Python, React, Flask, SQL, LangGraph, LangChain &amp; RAG.</p></div>
        <div><div className="compact-heading"><div><p className="eyebrow">02 / Experience</p><h2 id="experience-title">Where I've <em>contributed.</em></h2></div></div><div className="experience-list">{profile.experience.map(item => <article key={item.company} className="experience-item"><div className="experience-top"><h3>{item.company}</h3><span>{item.dates}</span></div><p className="experience-company">{item.role} &middot; {item.location}</p><p className="body-copy">{item.summary}</p></article>)}</div></div>
      </div>
    </section>
  );
}

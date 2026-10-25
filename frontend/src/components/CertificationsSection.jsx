import React from 'react';
import { FiCheck } from 'react-icons/fi';
import profile from '../data/profile.json';

export default function CertificationsSection() {
  return <section id="certifications" className="certifications-section" aria-label="Certifications"><div className="page-width"><details className="certifications-disclosure"><summary>Certifications <span>{profile.certifications.length} credentials &middot; View details</span></summary><div className="certification-grid">{profile.certifications.map(item => <article className="certification" key={item.title}><FiCheck size={17} /><div><p className="small-label">{item.from}</p><h3>{item.title}</h3></div></article>)}</div></details></div></section>;
}

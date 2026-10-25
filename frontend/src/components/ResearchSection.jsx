import React from 'react';
import { FiAward } from 'react-icons/fi';
import profile from '../data/profile.json';

export default function ResearchSection() {
  return <section id="research" className="section-space research-section" aria-labelledby="research-title"><div className="page-width"><div className="compact-heading"><div><p className="eyebrow">03 / Publications</p><h2 id="research-title">Research, with <em>results.</em></h2></div></div><div className="publication-grid">{profile.publications.map(publication => <article key={publication.title} className="publication"><div className="publication-meta"><span>{publication.venue}</span><FiAward size={17} /></div><h3>{publication.title}</h3><p>{publication.summary}</p></article>)}</div></div></section>;
}

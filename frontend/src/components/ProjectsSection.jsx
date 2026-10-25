import React, { useState } from 'react';
import { FiArrowUpRight, FiPlus, FiMinus } from 'react-icons/fi';
import { projectsData } from '../data/projects';

const featuredIds = [6, 1, 7];

function Project({ project, featured }) {
  return (
    <article className={featured ? 'featured-project' : 'additional-project'}>
      <div className="project-content">
        <p className="small-label">{project.technologies.slice(0, 3).join(' / ')}</p>
        <h3>{project.title}</h3>
        <p>{project.summary}</p>
      </div>
      <div className="project-links">
        {project.github && <a href={project.github} target="_blank" rel="noopener noreferrer" aria-label={`View source code for ${project.title}`}>Source code <FiArrowUpRight size={15} /></a>}
        {project.demo && <a href={project.demo} target="_blank" rel="noopener noreferrer">Live project <FiArrowUpRight size={15} /></a>}
      </div>
    </article>
  );
}

export default function ProjectsSection() {
  const [showAll, setShowAll] = useState(false);
  const featured = featuredIds.map(id => projectsData.find(project => project.id === id));
  const remaining = projectsData.filter(project => !featuredIds.includes(project.id));
  return (
    <section id="projects" className="section-space projects-section" aria-labelledby="projects-title">
      <div className="page-width">
        <div className="compact-heading"><div><p className="eyebrow">01 / Selected work</p><h2 id="projects-title">A few things I've <em>built.</em></h2></div><span className="section-note">AI, privacy &amp; full-stack engineering</span></div>
        <div className="featured-grid">{featured.map(project => <Project key={project.id} project={project} featured />)}</div>
        <button className="text-link projects-expand" aria-expanded={showAll} aria-controls="additional-projects" onClick={() => setShowAll(!showAll)}>{showAll ? 'Show featured only' : `View all ${projectsData.length} projects`}{showAll ? <FiMinus /> : <FiPlus />}</button>
        <div id="additional-projects" hidden={!showAll} className="additional-projects">{remaining.map(project => <Project key={project.id} project={project} />)}</div>
      </div>
    </section>
  );
}

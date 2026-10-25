import React from 'react';
import { FiArrowUpRight, FiArrowUp, FiPhone } from 'react-icons/fi';
import profile from '../data/profile.json';

export default function FooterSection() {
  return <footer id="contact" className="site-footer"><div className="page-width"><div className="footer-contact"><div><p className="eyebrow">Have something in mind?</p><h2>Let's <em>talk.</em></h2></div><div className="contact-details"><a className="contact-email" href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(profile.contact.email)}`} target="_blank" rel="noopener noreferrer">{profile.contact.email} <FiArrowUpRight /></a><a className="contact-phone" href={`tel:${profile.contact.phone.replaceAll(' ', '')}`}><FiPhone aria-hidden="true" />{profile.contact.phone}</a></div></div><div className="footer-inner"><p>&copy; {new Date().getFullYear()} Naman Bordia &middot; Bengaluru, India</p><div className="footer-socials"><a href={profile.contact.github} target="_blank" rel="noopener noreferrer">GitHub <FiArrowUpRight /></a><a href={profile.contact.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn <FiArrowUpRight /></a><a href={profile.contact.leetcode} target="_blank" rel="noopener noreferrer">LeetCode <FiArrowUpRight /></a></div><a className="back-top" href="#hero">Back to top <FiArrowUp /></a></div></div></footer>;
}

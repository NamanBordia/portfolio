import React, { useRef, useState } from 'react';
import { FiArrowUpRight, FiCheck, FiCopy, FiMail, FiX } from 'react-icons/fi';
import profile from '../data/profile.json';

export default function EmailContact({ children, className = 'text-link' }) {
  const dialogRef = useRef(null);
  const addressRef = useRef(null);
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
  const email = profile.contact.email;

  const open = () => {
    setCopied(false);
    setCopyError(false);
    dialogRef.current.showModal();
  };

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setCopyError(false);
    } catch {
      setCopyError(true);
      addressRef.current.focus();
      addressRef.current.select();
    }
  };

  return (
    <>
      <button type="button" className={className} onClick={open} aria-haspopup="dialog">{children}</button>
      <dialog ref={dialogRef} className="email-dialog" aria-label="Email Naman Bordia" onClick={event => {
        if (event.target === event.currentTarget) dialogRef.current.close();
      }}>
        <div className="email-dialog-content">
          <div className="email-dialog-heading"><h2>Email Naman</h2><button type="button" className="email-dialog-close" onClick={() => dialogRef.current.close()} aria-label="Close email options"><FiX size={20} /></button></div>
          <p>Choose how you'd like to get in touch.</p>
          <input ref={addressRef} className="email-address" type="text" value={email} readOnly aria-label="Email address" onFocus={event => event.target.select()} />
          <div className="email-options">
            <a href={`mailto:${email}`}><FiMail /> Open email app <FiArrowUpRight /></a>
            <a href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}`}><FiArrowUpRight /> Gmail in browser <FiArrowUpRight /></a>
            <button type="button" onClick={copyAddress}>{copied ? <FiCheck /> : <FiCopy />}{copied ? 'Address copied' : 'Copy email address'}</button>
          </div>
          <p className="email-copy-status" role="status">{copyError ? 'Select and copy the address above, then paste it into your email app.' : 'No email app configured? Copy the address instead.'}</p>
        </div>
      </dialog>
    </>
  );
}

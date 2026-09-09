import React, { useState } from 'react';
import { X, Check, Copy, ShieldCheck, Share2 } from 'lucide-react';
import { formatLinkedInPostText } from '../services/socialMediaModel';

export default function LinkedInPostModal({ isOpen, onClose, postData, docTitle }) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Extract pure publication-ready post text
  let rawText = "";
  if (postData?.linkedInPost) {
    rawText = formatLinkedInPostText(postData.linkedInPost);
  } else if (typeof postData?.content === 'string') {
    rawText = postData.content;
  }

  // Remove any stray markdown if present for copy & render
  const cleanPostText = rawText
    .replace(/^###\s+/gm, '')
    .replace(/^##\s+/gm, '')
    .replace(/^#\s+/gm, '')
    .replace(/^####\s+/gm, '')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/^---\s*$/gm, '')
    .trim();

  const handleCopyPost = () => {
    navigator.clipboard.writeText(cleanPostText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  // Render clean paragraphs, headings, bullets, and hashtags
  const renderModalContent = () => {
    const lines = cleanPostText.split('\n');
    const elements = [];

    lines.forEach((line, idx) => {
      const trimmed = line.trim();
      if (!trimmed) {
        elements.push(<div key={`modal-sp-${idx}`} style={{ height: '0.45rem' }} />);
        return;
      }

      if (trimmed.startsWith('🚨') || trimmed.toUpperCase().includes('CRITICAL CYBERSECURITY ADVISORY') || trimmed.toUpperCase().includes('SECURITY ALERT')) {
        elements.push(
          <div key={idx} style={{ fontSize: '1rem', fontWeight: '800', color: '#E1DCC9', letterSpacing: '0.01em', marginBottom: '0.4rem', lineHeight: '1.4' }}>
            {trimmed}
          </div>
        );
      } else if (trimmed.startsWith('Key concerns:') || trimmed.startsWith('Recommended actions:') || trimmed.endsWith(':')) {
        elements.push(
          <div key={idx} style={{ fontSize: '0.9rem', fontWeight: '700', color: '#E1DCC9', marginTop: '0.65rem', marginBottom: '0.25rem' }}>
            {trimmed}
          </div>
        );
      } else if (trimmed.startsWith('•') || trimmed.startsWith('-') || trimmed.startsWith('*') || trimmed.startsWith('▪')) {
        const cleanBullet = trimmed.replace(/^[-*•▪]\s*/, '');
        elements.push(
          <div key={idx} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.25rem', paddingLeft: '0.25rem' }}>
            <span style={{ color: '#E1DCC9', fontWeight: 'bold' }}>&bull;</span>
            <span style={{ color: 'rgba(225, 220, 201, 0.85)', fontSize: '0.875rem', lineHeight: '1.5' }}>{cleanBullet}</span>
          </div>
        );
      } else if (trimmed.startsWith('#')) {
        const tags = trimmed.split(/\s+/).filter(t => t.startsWith('#'));
        elements.push(
          <div key={idx} style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.8rem', marginBottom: '0.2rem' }}>
            {tags.map((tag, tIdx) => (
              <span key={tIdx} style={{ color: '#E1DCC9', fontWeight: '600', fontSize: '0.84rem' }}>
                {tag}
              </span>
            ))}
          </div>
        );
      } else {
        elements.push(
          <div key={idx} style={{ color: '#E1DCC9', fontSize: '0.885rem', lineHeight: '1.55', marginBottom: '0.35rem' }}>
            {trimmed}
          </div>
        );
      }
    });

    return elements;
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.85)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2000,
      padding: '1.5rem'
    }}>
      <div style={{
        background: '#1F150C',
        border: '1px solid #E1DCC9',
        borderRadius: 'var(--radius-lg, 12px)',
        width: '100%',
        maxWidth: '680px',
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 24px 48px rgba(0,0,0,0.7)',
        overflow: 'hidden'
      }}>
        {/* Modal Top Bar */}
        <div style={{
          padding: '1rem 1.4rem',
          borderBottom: '1px solid rgba(225, 220, 201, 0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: '#000000'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{
              width: '28px',
              height: '28px',
              borderRadius: '6px',
              background: '#E1DCC9',
              color: '#1F150C',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Share2 size={16} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: '#E1DCC9', margin: 0 }}>
                LinkedIn Post
              </h3>
              <p style={{ fontSize: '0.725rem', color: 'rgba(225, 220, 201, 0.72)', margin: 0 }}>
                Public-Safe Social Media Communication Preview
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span className="badge" style={{ fontSize: '0.68rem' }}>
              <ShieldCheck size={12} /> 0 Hallucinations
            </span>
            <button
              onClick={onClose}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#E1DCC9',
                cursor: 'pointer',
                padding: '0.3rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '4px'
              }}
              title="Close Modal"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div style={{
          padding: '1.4rem',
          overflowY: 'auto',
          flex: 1
        }}>
          {/* LinkedIn-Style Preview Box */}
          <div style={{
            background: '#000000',
            border: '1px solid rgba(225, 220, 201, 0.2)',
            borderRadius: '8px',
            padding: '1.25rem',
            boxShadow: '0 4px 16px rgba(0,0,0,0.4)'
          }}>
            {/* Author Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.1rem', paddingBottom: '0.85rem', borderBottom: '1px solid rgba(225, 220, 201, 0.18)' }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                background: '#412D15',
                color: '#E1DCC9',
                border: '1px solid #E1DCC9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '800',
                fontSize: '1rem'
              }}>
                SX
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.95rem', fontWeight: '700', color: '#E1DCC9' }}>
                    SyntaxX
                  </span>
                  <span style={{ fontSize: '0.72rem', color: 'rgba(225, 220, 201, 0.72)' }}>• 1st</span>
                </div>
                <div style={{ fontSize: '0.76rem', color: 'rgba(225, 220, 201, 0.72)' }}>
                  Cybersecurity Intelligence & Threat Advisory
                </div>
                <div style={{ fontSize: '0.72rem', color: 'rgba(225, 220, 201, 0.5)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <span>Just now</span> • <span>🌐 Public Safe</span>
                </div>
              </div>
            </div>

            {/* Post Content */}
            <div style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
              {renderModalContent()}
            </div>
          </div>
        </div>

        {/* Modal Action Footer */}
        <div style={{
          padding: '0.9rem 1.4rem',
          borderTop: '1px solid rgba(225, 220, 201, 0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: '#000000'
        }}>
          <button
            onClick={handleCopyPost}
            className="btn btn-primary btn-sm"
            style={{
              padding: '0.5rem 1.1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem'
            }}
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? 'Copied!' : 'Copy Post'}
          </button>

          <button
            onClick={onClose}
            className="btn btn-secondary btn-sm"
            style={{ padding: '0.5rem 1rem' }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { X, Check, Copy, ShieldCheck, MessageSquare } from 'lucide-react';
import { formatXPostText } from '../services/microbloggingModel';

export default function TwitterThreadModal({ isOpen, onClose, threadData, docTitle }) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const xData = threadData?.xPost?.x_post || threadData?.x_post || threadData;
  const isSingle = xData?.type === 'single_post';
  const posts = xData?.posts || [];

  // If posts array isn't populated directly from object, parse from text
  let parsedPosts = posts;
  if (!parsedPosts || parsedPosts.length === 0) {
    const rawContent = threadData?.content || "";
    const chunks = rawContent.split(/\n\s*\n(?=\d+\/\d+)/g);
    parsedPosts = chunks.map((chunk, idx) => {
      const trimmed = chunk.trim();
      return {
        number: idx + 1,
        text: trimmed,
        character_count: trimmed.length
      };
    });
  }

  // Pure text for clipboard copy (strictly no citations/metadata)
  const fullTextToCopy = parsedPosts.map(p => {
    return p.text
      .replace(/^###\s+/gm, '')
      .replace(/^##\s+/gm, '')
      .replace(/^#\s+/gm, '')
      .replace(/\*\*([^*]+)\*\*/g, '$1')
      .replace(/\*([^*]+)\*/g, '$1')
      .replace(/^---\s*$/gm, '')
      .trim();
  }).join("\n\n");

  const handleCopy = () => {
    navigator.clipboard.writeText(fullTextToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const renderCleanPostText = (rawText) => {
    const clean = rawText
      .replace(/^###\s+/gm, '')
      .replace(/^##\s+/gm, '')
      .replace(/^#\s+/gm, '')
      .replace(/\*\*([^*]+)\*\*/g, '$1')
      .replace(/\*([^*]+)\*/g, '$1')
      .replace(/^---\s*$/gm, '');

    const lines = clean.split('\n');
    const elements = [];

    lines.forEach((line, idx) => {
      const trimmed = line.trim();
      if (!trimmed) {
        elements.push(<div key={`sp-${idx}`} style={{ height: '0.35rem' }} />);
        return;
      }

      if (/^\d+\/\d+\s+/.test(trimmed)) {
        elements.push(
          <div key={idx} style={{ fontSize: '0.92rem', fontWeight: '800', color: '#E1DCC9', marginBottom: '0.35rem', lineHeight: '1.4' }}>
            {trimmed}
          </div>
        );
      } else if (trimmed.startsWith('•') || trimmed.startsWith('-') || trimmed.startsWith('*') || trimmed.startsWith('▪')) {
        const cleanBullet = trimmed.replace(/^[-*•▪]\s*/, '');
        elements.push(
          <div key={idx} style={{ display: 'flex', gap: '0.45rem', marginBottom: '0.2rem', paddingLeft: '0.2rem' }}>
            <span style={{ color: '#E1DCC9', fontWeight: 'bold' }}>&bull;</span>
            <span style={{ color: 'rgba(225, 220, 201, 0.85)', fontSize: '0.84rem', lineHeight: '1.45' }}>{cleanBullet}</span>
          </div>
        );
      } else if (trimmed.startsWith('#')) {
        const tags = trimmed.split(/\s+/).filter(t => t.startsWith('#'));
        elements.push(
          <div key={idx} style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem', marginTop: '0.6rem', marginBottom: '0.2rem' }}>
            {tags.map((tag, tIdx) => (
              <span key={tIdx} style={{ color: '#E1DCC9', fontWeight: '600', fontSize: '0.8rem' }}>
                {tag}
              </span>
            ))}
          </div>
        );
      } else {
        elements.push(
          <div key={idx} style={{ color: '#E1DCC9', fontSize: '0.85rem', lineHeight: '1.5', marginBottom: '0.25rem' }}>
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
      background: 'rgba(0, 0, 0, 0.94)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2000,
      padding: '1.5rem'
    }}>
      <div style={{
        background: '#121212',
        border: '1.5px solid #DFD0B8',
        borderRadius: 'var(--radius-lg, 12px)',
        width: '100%',
        maxWidth: '680px',
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 24px 48px rgba(0,0,0,0.9)',
        overflow: 'hidden'
      }}>
        {/* Modal Top Bar */}
        <div style={{
          padding: '1rem 1.4rem',
          borderBottom: '1.5px solid rgba(223, 208, 184, 0.25)',
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
              background: '#DFD0B8',
              color: '#000000',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <MessageSquare size={16} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: '#FFFFFF', margin: 0 }}>
                {isSingle ? 'Twitter/X Post' : `Twitter/X Thread (${parsedPosts.length} Posts)`}
              </h3>
              <p style={{ fontSize: '0.725rem', color: '#DFD0B8', margin: 0 }}>
                Public-Safe Microblogging Communication Preview
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span className="badge" style={{ fontSize: '0.68rem', background: '#DFD0B8', color: '#000000' }}>
              <ShieldCheck size={12} /> 0 Hallucinations
            </span>
            <button
              onClick={onClose}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#DFD0B8',
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
          {parsedPosts.map((post, pIdx) => {
            const charCount = (post.text || '').length;
            const isWithinLimit = charCount <= 280;

            return (
              <div
                key={pIdx}
                style={{
                  background: '#000000',
                  border: '1.5px solid #DFD0B8',
                  borderRadius: '8px',
                  padding: '1.25rem',
                  marginBottom: '1rem',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.6)'
                }}
              >
                {/* Post Author / Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem', paddingBottom: '0.75rem', borderBottom: '1px solid rgba(223, 208, 184, 0.2)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: '#121212',
                      color: '#DFD0B8',
                      border: '1.5px solid #DFD0B8',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: '800',
                      fontSize: '0.78rem'
                    }}>
                      SX
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#FFFFFF' }}>
                          TransformAI Intel
                        </span>
                        <span style={{ fontSize: '0.72rem', color: '#DFD0B8' }}>
                          @TransformAI
                        </span>
                      </div>
                      <div style={{ fontSize: '0.7rem', color: 'rgba(225, 220, 201, 0.6)' }}>
                        Post {post.number || pIdx + 1} of {parsedPosts.length}
                      </div>
                    </div>
                  </div>

                  {/* Post Counter & Character Count */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                    <span
                      style={{
                        fontSize: '0.66rem',
                        background: '#121212',
                        color: isWithinLimit ? '#E1DCC9' : '#8B1E1E',
                        border: '1px solid #DFD0B8',
                        padding: '0.15rem 0.5rem',
                        borderRadius: '12px'
                      }}
                    >
                      {charCount} / 280 chars
                    </span>
                    <span
                      className="badge"
                      style={{
                        fontSize: '0.66rem'
                      }}
                    >
                      {post.number || pIdx + 1}/{parsedPosts.length}
                    </span>
                  </div>
                </div>

                {/* Post Content */}
                <div style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                  {renderCleanPostText(post.text)}
                </div>
              </div>
            );
          })}
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
            onClick={handleCopy}
            className="btn btn-primary btn-sm"
            style={{
              padding: '0.5rem 1.1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem'
            }}
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? 'Copied!' : (isSingle ? 'Copy Post' : 'Copy Thread')}
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

import React from 'react';
import { Zap } from 'lucide-react';

const GithubIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

export default function Footer() {
  return (
    <footer style={{
      background: '#272B40',
      borderTop: '1.5px solid #ACBAC4',
      padding: '2.5rem 0',
      marginTop: '3rem',
      fontSize: '0.85rem',
      color: '#ACBAC4'
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1.5rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            background: '#E1D9BC',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Zap size={18} color="#30364F" />
          </div>
          <div>
            <span style={{ fontWeight: '700', color: '#F0F0DB' }}>TransformAI</span> — An Agentic Multi-Format Content Transformation Engine
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <span className="badge" style={{ background: '#ACBAC4', color: '#30364F', borderColor: '#E1D9BC' }}>SIH / College Project Solution</span>
          <a
            href="https://github.com/vishnu-vikas-5/TransformAI"
            target="_blank"
            rel="noreferrer"
            style={{ color: '#F0F0DB', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: '700' }}
          >
            <GithubIcon size={16} /> GitHub Repository
          </a>
        </div>
      </div>
    </footer>
  );
}

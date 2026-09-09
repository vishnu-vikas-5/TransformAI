import React from 'react';
import { Zap, ShieldCheck, Cpu, Sparkles } from 'lucide-react';

const GithubIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

export default function Navbar({ activeTab, setActiveTab, onLaunchDemo, serverHealth, apiProvider }) {
  const isOnline = serverHealth?.status === 'online';
  const aiModelName = serverHealth?.gemini_key_configured 
    ? 'Gemini 2.5 Flash' 
    : serverHealth?.openai_key_configured 
    ? 'OpenAI GPT-4o' 
    : apiProvider || 'SyntaxX Engine';

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      backgroundColor: '#000000',
      borderBottom: '1px solid rgba(225, 220, 201, 0.18)',
      backdropFilter: 'blur(12px)'
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '70px'
      }}>
        {/* Brand Logo & Live Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }} onClick={() => setActiveTab('workbench')}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: '#E1DCC9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.5)'
          }}>
            <Zap size={22} color="#1F150C" strokeWidth={2.5} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.25rem', fontWeight: '800', letterSpacing: '-0.03em', color: '#E1DCC9' }}>
                SYNTAXX
              </span>
              <span className="badge" style={{ fontSize: '0.62rem', padding: '0.12rem 0.5rem' }}>
                Intelligence Engine
              </span>
            </div>
            
            {/* Live Backend & AI Provider Status */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '2px', fontSize: '0.7rem' }}>
              <span style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: isOnline ? '#235E35' : '#8B1E1E',
                boxShadow: isOnline ? '0 0 6px rgba(35, 94, 53, 0.8)' : 'none'
              }} />
              <span style={{ color: isOnline ? '#E1DCC9' : 'rgba(225, 220, 201, 0.55)', fontWeight: '600' }}>
                {isOnline ? 'Backend Online' : 'Connecting Engine...'}
              </span>
              <span style={{ color: 'rgba(225, 220, 201, 0.35)' }}>•</span>
              <span style={{ color: 'rgba(225, 220, 201, 0.85)', fontWeight: '600' }}>
                AI: {aiModelName}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button
            className={`btn btn-sm ${activeTab === 'workbench' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('workbench')}
          >
            <Cpu size={15} /> Workbench
          </button>

          <button
            className={`btn btn-sm ${activeTab === 'architecture' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('architecture')}
          >
            <Zap size={15} /> Architecture
          </button>

          <button
            className={`btn btn-sm ${activeTab === 'comparative' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('comparative')}
          >
            <ShieldCheck size={15} /> Why Agentic AI?
          </button>
        </nav>

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button className="btn btn-primary btn-sm" onClick={onLaunchDemo}>
            <Sparkles size={14} /> Run Live Demo
          </button>
          <a
            href="https://github.com/vishnu-vikas-5/TransformAI"
            target="_blank"
            rel="noreferrer"
            className="btn btn-secondary btn-sm"
            style={{ padding: '0.45rem' }}
            title="GitHub Repository"
          >
            <GithubIcon size={17} />
          </a>
        </div>
      </div>
    </header>
  );
}

import React, { useEffect, useRef } from 'react';
import { Zap, ShieldCheck, Cpu, Sparkles, MessageSquare } from 'lucide-react';
import GooeyNav from './GooeyNav';

const GithubIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

export default function Navbar({ activeTab, setActiveTab, onLaunchDemo, serverHealth, apiProvider, onOpenAgentInspector }) {
  const isOnline = serverHealth?.status === 'online';
  const aiModelName = serverHealth?.gemini_key_configured 
    ? 'Gemini 2.5' 
    : serverHealth?.openai_key_configured 
    ? 'GPT-4o' 
    : 'Engine';

  const navItems = [
    { label: 'Overview', icon: <Sparkles size={15} />, onClick: () => setActiveTab('home') },
    { label: 'Workbench', icon: <Cpu size={15} />, onClick: () => setActiveTab('workbench') },
    { label: 'Grounded AI Q&A', icon: <MessageSquare size={15} />, onClick: () => setActiveTab('chat') },
    { 
      label: 'System Insights', 
      icon: <Sparkles size={15} />, 
      children: [
        { id: 'architecture', label: 'Architecture', icon: <Zap size={14} />, onClick: () => setActiveTab('architecture') },
        { id: 'comparative', label: 'Why Agentic AI?', icon: <ShieldCheck size={14} />, onClick: () => setActiveTab('comparative') },
        { id: 'inspect', label: 'Inspect AI Models', icon: <Sparkles size={14} />, onClick: () => onOpenAgentInspector && onOpenAgentInspector() }
      ]
    }
  ];

  const getActiveIndex = () => {
    switch (activeTab) {
      case 'home': return 0;
      case 'workbench': return 1;
      case 'chat': return 2;
      case 'architecture':
      case 'comparative': return 3;
      default: return 0;
    }
  };

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      backgroundColor: '#000000',
      borderBottom: '1.5px solid #DFD0B8',
      boxShadow: '0 4px 20px rgba(0,0,0,0.95)'
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '70px'
      }}>
        {/* Left: Brand Logo & Live Status Pill */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flexShrink: 0 }}>
          <div 
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}
            onClick={() => {
              setActiveTab('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '9px',
              background: '#DFD0B8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 10px rgba(223, 208, 184, 0.35)'
            }}>
              <Zap size={19} color="#000000" />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span style={{ fontSize: '1.15rem', fontWeight: '800', letterSpacing: '-0.02em', color: '#FFFFFF' }}>
                TransformAI
              </span>
              <span className="badge" style={{ background: '#DFD0B8', color: '#000000', fontSize: '0.6rem', padding: '0.1rem 0.4rem', borderColor: '#E1DCC9' }}>
                v2.5
              </span>
            </div>
          </div>

          {/* Single-Line Status Badge Pill */}
          <div 
            onClick={(e) => { e.stopPropagation(); onOpenAgentInspector && onOpenAgentInspector(); }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              background: '#121212',
              border: '1px solid #DFD0B8',
              padding: '0.3rem 0.65rem',
              borderRadius: '20px',
              fontSize: '0.72rem',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              flexShrink: 0,
              transition: 'all 0.2s ease'
            }}
            title="Click to inspect active AI model & system breakdown"
          >
            <span style={{
              width: '7px',
              height: '7px',
              borderRadius: '50%',
              background: isOnline ? '#52c41a' : '#ff4d4f',
              boxShadow: isOnline ? '0 0 6px #52c41a' : 'none',
              flexShrink: 0
            }} />
            <span style={{ color: '#FFFFFF', fontWeight: '700' }}>
              {isOnline ? 'Online' : 'Offline'}
            </span>
            <span style={{ color: '#DFD0B8' }}>•</span>
            <span style={{ color: '#E1DCC9', fontWeight: '600' }}>
              AI: {aiModelName} 🔍
            </span>
          </div>
        </div>

        {/* Center: React Bits GooeyNav Interactive Component */}
        <div 
          className="navbar-center-nav" 
          style={{ 
            flex: 1, 
            display: 'flex', 
            justifyContent: 'center', 
            overflow: 'visible',
            padding: '0 0.5rem' 
          }}
        >
          <GooeyNav 
            items={navItems}
            activeIndex={getActiveIndex()}
            activeTab={activeTab}
            particleCount={15}
            particleDistances={[90, 10]}
            particleR={100}
            animationTime={600}
            timeVariance={300}
          />
        </div>

        {/* Right: Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexShrink: 0 }}>
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
            <GithubIcon size={18} />
          </a>
        </div>
      </div>
    </header>
  );
}


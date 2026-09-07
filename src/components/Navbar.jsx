import React, { useState, useEffect, useRef } from 'react';
import { Zap, ShieldCheck, Cpu, Sparkles, BookOpen, MessageSquare, ChevronDown } from 'lucide-react';

const GithubIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

export default function Navbar({ activeTab, setActiveTab, onLaunchDemo, serverHealth, apiProvider, onOpenAgentInspector }) {
  const [openDropdown, setOpenDropdown] = useState(null); // 'tools' | 'architecture' | null
  const navRef = useRef(null);

  const isOnline = serverHealth?.status === 'online';
  const aiModelName = serverHealth?.gemini_key_configured 
    ? 'Gemini 2.5' 
    : serverHealth?.openai_key_configured 
    ? 'GPT-4o' 
    : 'Engine';

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDropdown = (name) => {
    setOpenDropdown(prev => prev === name ? null : name);
  };

  const isToolsActive = activeTab === 'summary' || activeTab === 'chat';
  const isSystemActive = activeTab === 'architecture' || activeTab === 'comparative';

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      backgroundColor: '#30364F',
      borderBottom: '1.5px solid #ACBAC4',
      boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '70px'
      }}>
        {/* Left: Brand Logo & Live Status Pill */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div 
            style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer' }}
            onClick={() => { setActiveTab('workbench'); setOpenDropdown(null); }}
          >
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: '#E1D9BC',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)'
            }}>
              <Zap size={20} color="#30364F" />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ fontSize: '1.2rem', fontWeight: '800', letterSpacing: '-0.02em', color: '#F0F0DB' }}>
                TransformAI
              </span>
              <span className="badge" style={{ background: '#ACBAC4', color: '#30364F', fontSize: '0.6rem', padding: '0.1rem 0.4rem' }}>
                v2.5
              </span>
            </div>
          </div>

          {/* Compact Live Status Badge Pill */}
          <div 
            onClick={(e) => { e.stopPropagation(); onOpenAgentInspector && onOpenAgentInspector(); }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              background: '#272B40',
              border: '1px solid #ACBAC4',
              padding: '0.3rem 0.65rem',
              borderRadius: '20px',
              fontSize: '0.72rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            title="Click to inspect active AI model & system breakdown"
          >
            <span style={{
              width: '7px',
              height: '7px',
              borderRadius: '50%',
              background: isOnline ? '#52c41a' : '#ff4d4f',
              boxShadow: isOnline ? '0 0 6px #52c41a' : 'none'
            }} />
            <span style={{ color: isOnline ? '#F0F0DB' : '#ACBAC4', fontWeight: '700' }}>
              {isOnline ? 'Backend Online' : 'Backend Offline'}
            </span>
            <span style={{ color: '#ACBAC4' }}>•</span>
            <span style={{ color: '#E1D9BC', fontWeight: '700' }}>
              AI: {aiModelName} 🔍
            </span>
          </div>
        </div>

        {/* Center: Organized Navigation Dropdown Menus */}
        <nav ref={navRef} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', position: 'relative' }}>
          
          {/* 1. Workbench Button (Direct Main Link) */}
          <button
            className={`btn btn-sm ${activeTab === 'workbench' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => { setActiveTab('workbench'); setOpenDropdown(null); }}
            style={{ padding: '0.5rem 0.85rem' }}
          >
            <Cpu size={15} /> Workbench
          </button>

          {/* 2. Intelligence Tools Dropdown */}
          <div style={{ position: 'relative' }}>
            <button
              className={`btn btn-sm ${isToolsActive ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => toggleDropdown('tools')}
              style={{
                padding: '0.5rem 0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                borderColor: openDropdown === 'tools' ? '#E1D9BC' : undefined
              }}
            >
              <BookOpen size={15} /> Intelligence Tools <ChevronDown size={14} style={{ transform: openDropdown === 'tools' ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
            </button>

            {openDropdown === 'tools' && (
              <div style={{
                position: 'absolute',
                top: 'calc(100% + 8px)',
                left: 0,
                width: '250px',
                background: '#272B40',
                border: '1.5px solid #ACBAC4',
                borderRadius: 'var(--radius-md)',
                boxShadow: '0 12px 30px rgba(0,0,0,0.5)',
                padding: '0.5rem',
                zIndex: 110,
                display: 'flex',
                flexDirection: 'column',
                gap: '0.35rem'
              }}>
                <button
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.75rem',
                    padding: '0.65rem 0.75rem',
                    background: activeTab === 'summary' ? '#30364F' : 'transparent',
                    border: 'none',
                    borderRadius: 'var(--radius-sm)',
                    color: '#F0F0DB',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'background 0.2s'
                  }}
                  onClick={() => { setActiveTab('summary'); setOpenDropdown(null); }}
                >
                  <BookOpen size={18} color="#E1D9BC" style={{ marginTop: '2px', flexShrink: 0 }} />
                  <div>
                    <div style={{ fontWeight: '700', fontSize: '0.85rem', color: '#F0F0DB' }}>Full Document Summary</div>
                    <div style={{ fontSize: '0.72rem', color: '#ACBAC4' }}>360° PDF Master Briefing & Search</div>
                  </div>
                </button>

                <button
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.75rem',
                    padding: '0.65rem 0.75rem',
                    background: activeTab === 'chat' ? '#30364F' : 'transparent',
                    border: 'none',
                    borderRadius: 'var(--radius-sm)',
                    color: '#F0F0DB',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'background 0.2s'
                  }}
                  onClick={() => { setActiveTab('chat'); setOpenDropdown(null); }}
                >
                  <MessageSquare size={18} color="#E1D9BC" style={{ marginTop: '2px', flexShrink: 0 }} />
                  <div>
                    <div style={{ fontWeight: '700', fontSize: '0.85rem', color: '#F0F0DB' }}>Ask Grounded AI</div>
                    <div style={{ fontSize: '0.72rem', color: '#ACBAC4' }}>Grounded Interactive Q&A Assistant</div>
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* 3. System & AI Architecture Dropdown */}
          <div style={{ position: 'relative' }}>
            <button
              className={`btn btn-sm ${isSystemActive ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => toggleDropdown('architecture')}
              style={{
                padding: '0.5rem 0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                borderColor: openDropdown === 'architecture' ? '#E1D9BC' : undefined
              }}
            >
              <Zap size={15} /> System & AI <ChevronDown size={14} style={{ transform: openDropdown === 'architecture' ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
            </button>

            {openDropdown === 'architecture' && (
              <div style={{
                position: 'absolute',
                top: 'calc(100% + 8px)',
                right: 0,
                width: '260px',
                background: '#272B40',
                border: '1.5px solid #ACBAC4',
                borderRadius: 'var(--radius-md)',
                boxShadow: '0 12px 30px rgba(0,0,0,0.5)',
                padding: '0.5rem',
                zIndex: 110,
                display: 'flex',
                flexDirection: 'column',
                gap: '0.35rem'
              }}>
                <button
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.75rem',
                    padding: '0.65rem 0.75rem',
                    background: 'transparent',
                    border: 'none',
                    borderRadius: 'var(--radius-sm)',
                    color: '#F0F0DB',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'background 0.2s'
                  }}
                  onClick={() => { onOpenAgentInspector && onOpenAgentInspector(); setOpenDropdown(null); }}
                >
                  <Sparkles size={18} color="#E1D9BC" style={{ marginTop: '2px', flexShrink: 0 }} />
                  <div>
                    <div style={{ fontWeight: '700', fontSize: '0.85rem', color: '#F0F0DB' }}>Inspect AI & 9-Agents</div>
                    <div style={{ fontSize: '0.72rem', color: '#ACBAC4' }}>Prompts, Temperature & Models</div>
                  </div>
                </button>

                <button
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.75rem',
                    padding: '0.65rem 0.75rem',
                    background: activeTab === 'architecture' ? '#30364F' : 'transparent',
                    border: 'none',
                    borderRadius: 'var(--radius-sm)',
                    color: '#F0F0DB',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'background 0.2s'
                  }}
                  onClick={() => { setActiveTab('architecture'); setOpenDropdown(null); }}
                >
                  <Zap size={18} color="#E1D9BC" style={{ marginTop: '2px', flexShrink: 0 }} />
                  <div>
                    <div style={{ fontWeight: '700', fontSize: '0.85rem', color: '#F0F0DB' }}>Agent Architecture</div>
                    <div style={{ fontSize: '0.72rem', color: '#ACBAC4' }}>DAG Parallel Pipeline Visualizer</div>
                  </div>
                </button>

                <button
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.75rem',
                    padding: '0.65rem 0.75rem',
                    background: activeTab === 'comparative' ? '#30364F' : 'transparent',
                    border: 'none',
                    borderRadius: 'var(--radius-sm)',
                    color: '#F0F0DB',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'background 0.2s'
                  }}
                  onClick={() => { setActiveTab('comparative'); setOpenDropdown(null); }}
                >
                  <ShieldCheck size={18} color="#E1D9BC" style={{ marginTop: '2px', flexShrink: 0 }} />
                  <div>
                    <div style={{ fontWeight: '700', fontSize: '0.85rem', color: '#F0F0DB' }}>Why Agentic AI?</div>
                    <div style={{ fontSize: '0.72rem', color: '#ACBAC4' }}>Single Prompt vs Multi-Agent ROI</div>
                  </div>
                </button>
              </div>
            )}
          </div>

        </nav>

        {/* Right: Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button className="btn btn-primary btn-sm" onClick={onLaunchDemo}>
            <Sparkles size={15} /> Run Live Demo
          </button>
          <a
            href="https://github.com/vishnu-vikas-5/TransformAI"
            target="_blank"
            rel="noreferrer"
            className="btn btn-secondary btn-sm"
            style={{ padding: '0.5rem' }}
            title="GitHub Repository"
          >
            <GithubIcon size={18} />
          </a>
        </div>
      </div>
    </header>
  );
}


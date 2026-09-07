import React from 'react';
import { Zap, ShieldCheck, Cpu, Sparkles, BookOpen, MessageSquare } from 'lucide-react';

const GithubIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

export default function Navbar({ activeTab, setActiveTab, onLaunchDemo, serverHealth, apiProvider, onOpenAgentInspector }) {
  const isOnline = serverHealth?.status === 'online';
  const aiModelName = serverHealth?.gemini_key_configured 
    ? 'Gemini 2.5 Flash API' 
    : serverHealth?.openai_key_configured 
    ? 'OpenAI GPT-4o API' 
    : apiProvider || 'TransformAI Engine';

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      backgroundColor: '#30364F',
      borderBottom: '1.5px solid #ACBAC4'
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '70px'
      }}>
        {/* Brand Logo & Live Backend Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }} onClick={() => setActiveTab('workbench')}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: '#E1D9BC',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)'
          }}>
            <Zap size={22} color="#30364F" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.25rem', fontWeight: '800', letterSpacing: '-0.02em', color: '#F0F0DB' }}>
                TransformAI
              </span>
              <span className="badge" style={{ background: '#ACBAC4', color: '#30364F', borderColor: '#E1D9BC', fontSize: '0.65rem', padding: '0.15rem 0.5rem' }}>
                Agentic Engine
              </span>
            </div>
            
            {/* Live Backend & AI Provider Status Bar (Clickable Inspector) */}
            <div 
              onClick={(e) => { e.stopPropagation(); onOpenAgentInspector && onOpenAgentInspector(); }}
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '2px', fontSize: '0.7rem', cursor: 'pointer' }}
              title="Click to inspect active AI model & agent prompts"
            >
              <span style={{
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                background: isOnline ? '#52c41a' : '#ff4d4f',
                boxShadow: isOnline ? '0 0 6px #52c41a' : 'none'
              }} />
              <span style={{ color: isOnline ? '#F0F0DB' : '#ACBAC4', fontWeight: '700' }}>
                {isOnline ? 'FastAPI Backend Online' : 'Connecting Backend...'}
              </span>
              <span style={{ color: '#ACBAC4' }}>•</span>
              <span style={{ color: '#E1D9BC', fontWeight: '700', textDecoration: 'underline' }}>
                AI: {aiModelName} (Inspect 🔍)
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <button
            className={`btn btn-sm ${activeTab === 'workbench' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('workbench')}
          >
            <Cpu size={15} /> Workbench
          </button>

          <button
            className={`btn btn-sm ${activeTab === 'summary' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('summary')}
          >
            <BookOpen size={15} /> Full Summary
          </button>

          <button
            className={`btn btn-sm ${activeTab === 'chat' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('chat')}
          >
            <MessageSquare size={15} /> Ask NotebookLM AI
          </button>

          <button
            className="btn btn-secondary btn-sm"
            onClick={onOpenAgentInspector}
            title="View full AI Model & Agent system breakdown"
          >
            <Sparkles size={14} color="#E1D9BC" /> Inspect AI
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

import React from 'react';
import { Cpu, GitBranch, Zap, FileText, Mail, Share2, HelpCircle } from 'lucide-react';
import { AGENT_ROSTER } from '../data/mockData';

export default function ArchitectureSection() {
  return (
    <div id="architecture" style={{ padding: '3.5rem 0' }}>
      <div className="container">

        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 3rem auto' }}>
          <span className="badge" style={{ marginBottom: '0.75rem' }}>
            <Zap size={13} /> System Architecture
          </span>
          <h2 style={{ fontSize: '2.2rem', marginBottom: '0.75rem', color: '#E1DCC9' }}>
            Agentic AI Multi-Layer Pipeline
          </h2>
          <p style={{ color: 'rgba(225, 220, 201, 0.72)', fontSize: '1rem', lineHeight: '1.6' }}>
            SyntaxX replaces fragile single-prompt LLM calls with a decoupled Directed Acyclic Graph (DAG) anchored by a canonical Core Content Intelligence layer and managed by an AI Master Orchestrator.
          </p>
        </div>

        {/* Architecture Flow Diagram Box */}
        <div className="glass-panel" style={{ padding: '2rem', marginBottom: '3rem', background: '#1F150C', borderColor: 'rgba(225, 220, 201, 0.18)' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#E1DCC9' }}>
            <GitBranch size={20} color="#E1DCC9" /> System Flowchart & Orchestration Lifecycle
          </h3>

          <div style={{
            background: '#000000',
            padding: '2rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid rgba(225, 220, 201, 0.18)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem',
            alignItems: 'center'
          }}>
            {/* Step 1: User & Input Ingestion */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', width: '100%', maxWidth: '800px', background: '#1F150C', padding: '1rem 1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(225, 220, 201, 0.25)' }}>
              <div style={{ background: '#E1DCC9', color: '#1F150C', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800' }}>1</div>
              <div style={{ flex: 1 }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#E1DCC9' }}>Source Ingestion & Artefact Selection</h4>
                <p style={{ fontSize: '0.8rem', color: 'rgba(225, 220, 201, 0.72)' }}>Ingest PDF/DOCX/TXT/URL & explicit multi-select target formats (Human-in-the-Loop)</p>
              </div>
            </div>

            <div style={{ width: '2px', height: '22px', background: '#E1DCC9' }} />

            {/* Step 2: AI Master Orchestrator & Core Content Intelligence */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', width: '100%', maxWidth: '800px', background: '#412D15', padding: '1rem 1.5rem', borderRadius: 'var(--radius-md)', border: '2px solid #E1DCC9' }}>
              <div style={{ background: '#E1DCC9', color: '#1F150C', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800' }}>2</div>
              <div style={{ flex: 1 }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: '800', color: '#E1DCC9' }}>AI Master Orchestrator & Core Content Intelligence</h4>
                <p style={{ fontSize: '0.8rem', color: '#E1DCC9' }}>Entity extraction, claims graph construction, canonical intelligence layer, & dependency routing</p>
              </div>
            </div>

            <div style={{ width: '2px', height: '22px', background: '#E1DCC9' }} />

            {/* Step 3: Parallel Domain Agents */}
            <div style={{ width: '100%', maxWidth: '800px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem' }}>
              <div style={{ background: '#1F150C', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(225, 220, 201, 0.2)', textAlign: 'center' }}>
                <FileText size={18} color="#E1DCC9" style={{ marginBottom: '0.2rem' }} />
                <h5 style={{ fontSize: '0.8rem', color: '#E1DCC9' }}>Summary Agent</h5>
              </div>
              <div style={{ background: '#1F150C', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(225, 220, 201, 0.2)', textAlign: 'center' }}>
                <Mail size={18} color="#E1DCC9" style={{ marginBottom: '0.2rem' }} />
                <h5 style={{ fontSize: '0.8rem', color: '#E1DCC9' }}>Email Agent</h5>
              </div>
              <div style={{ background: '#1F150C', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(225, 220, 201, 0.2)', textAlign: 'center' }}>
                <Share2 size={18} color="#E1DCC9" style={{ marginBottom: '0.2rem' }} />
                <h5 style={{ fontSize: '0.8rem', color: '#E1DCC9' }}>Social Agent</h5>
              </div>
              <div style={{ background: '#1F150C', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(225, 220, 201, 0.2)', textAlign: 'center' }}>
                <HelpCircle size={18} color="#E1DCC9" style={{ marginBottom: '0.2rem' }} />
                <h5 style={{ fontSize: '0.8rem', color: '#E1DCC9' }}>FAQ Agent</h5>
              </div>
            </div>

            <div style={{ width: '2px', height: '22px', background: '#E1DCC9' }} />

            {/* Step 4: Validation Agent Audit */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', width: '100%', maxWidth: '800px', background: '#E1DCC9', padding: '1rem 1.5rem', borderRadius: 'var(--radius-md)', border: '2px solid #E1DCC9' }}>
              <div style={{ background: '#1F150C', color: '#E1DCC9', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800' }}>4</div>
              <div style={{ flex: 1 }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: '800', color: '#1F150C' }}>Validation & Quality Agent Audit</h4>
                <p style={{ fontSize: '0.8rem', color: '#1F150C', fontWeight: '500' }}>Factual grounding verification against source embeddings, zero hallucination rejection, and tone alignment</p>
              </div>
            </div>
          </div>
        </div>

        {/* Specialized Agents Roster */}
        <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', textAlign: 'center', color: '#E1DCC9' }}>
          Specialized Agent Domain Roster
        </h3>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.25rem'
        }}>
          {AGENT_ROSTER.map((agent, idx) => (
            <div key={idx} className="glass-panel glass-panel-hover" style={{ padding: '1.25rem', background: '#1F150C', borderColor: 'rgba(225, 220, 201, 0.18)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span className="badge">{agent.badge}</span>
                <Cpu size={18} color="#E1DCC9" />
              </div>
              <h4 style={{ fontSize: '1.05rem', fontWeight: '700', marginBottom: '0.25rem', color: '#E1DCC9' }}>{agent.name}</h4>
              <p style={{ fontSize: '0.785rem', color: '#E1DCC9', marginBottom: '0.5rem', fontWeight: '700' }}>{agent.role}</p>
              <p style={{ fontSize: '0.8rem', color: 'rgba(225, 220, 201, 0.72)', lineHeight: '1.4' }}>{agent.description}</p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

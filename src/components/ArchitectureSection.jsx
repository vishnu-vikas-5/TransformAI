import React from 'react';
import { Cpu, GitBranch, Zap, FileText, Video, Share2, ShieldAlert, Layers, PieChart } from 'lucide-react';
import { AGENT_ROSTER } from '../data/mockData';

export default function ArchitectureSection() {
  return (
    <div id="architecture" style={{ padding: '3rem 0' }}>
      <div className="container">

        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 3rem auto' }}>
          <span className="badge" style={{ marginBottom: '0.75rem', background: '#DFD0B8', color: '#000000', borderColor: '#E1DCC9' }}>
            <Zap size={14} /> System Architecture
          </span>
          <h2 style={{ fontSize: '2.2rem', marginBottom: '0.75rem', color: '#FFFFFF' }}>
            Agentic AI Multi-Layer Pipeline
          </h2>
          <p style={{ color: '#E1DCC9', fontSize: '1rem', lineHeight: '1.6', opacity: 0.9 }}>
            TransformAI replaces fragile single-prompt LLM calls with a decoupled Directed Acyclic Graph (DAG) managed by an AI Master Orchestrator.
          </p>
        </div>

        {/* Architecture Flow Diagram Box */}
        <div className="glass-panel" style={{ padding: '2rem', marginBottom: '3rem', background: '#121212', borderColor: '#DFD0B8' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#FFFFFF' }}>
            <GitBranch size={20} color="#DFD0B8" /> System Flowchart & Orchestration Lifecycle
          </h3>

          <div style={{
            background: '#000000',
            padding: '2rem',
            borderRadius: 'var(--radius-md)',
            border: '1.5px solid #DFD0B8',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
            alignItems: 'center'
          }}>
            {/* Step 1: User & Input Ingestion */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', width: '100%', maxWidth: '850px', background: '#121212', padding: '1rem 1.5rem', borderRadius: 'var(--radius-md)', border: '1.5px solid #DFD0B8' }}>
              <div style={{ background: '#DFD0B8', color: '#000000', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700' }}>1</div>
              <div style={{ flex: 1 }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#FFFFFF' }}>User Ingestion & Target Selection</h4>
                <p style={{ fontSize: '0.8rem', color: '#E1DCC9', opacity: 0.9 }}>Upload PDF/DOCX/TXT/URL & explicit multi-select target formats (Human-in-the-Loop)</p>
              </div>
            </div>

            <div style={{ width: '2px', height: '24px', background: '#DFD0B8' }} />

            {/* Step 2: AI Orchestrator */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', width: '100%', maxWidth: '850px', background: '#DFD0B8', padding: '1rem 1.5rem', borderRadius: 'var(--radius-md)', border: '2px solid #E1DCC9' }}>
              <div style={{ background: '#000000', color: '#FFFFFF', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700' }}>2</div>
              <div style={{ flex: 1 }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#000000' }}>AI Orchestrator / Master Agent</h4>
                <p style={{ fontSize: '0.8rem', color: '#000000' }}>Syntax parsing, entity extraction, task graph construction, & dependency routing</p>
              </div>
            </div>

            <div style={{ width: '2px', height: '24px', background: '#DFD0B8' }} />

            {/* Step 3: Parallel Specialized Domain Agents */}
            <div style={{ width: '100%', maxWidth: '850px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.6rem' }}>
              <div style={{ background: '#121212', padding: '0.65rem 0.4rem', borderRadius: 'var(--radius-sm)', border: '1.5px solid #DFD0B8', textAlign: 'center' }}>
                <FileText size={18} color="#DFD0B8" style={{ marginBottom: '0.2rem' }} />
                <h5 style={{ fontSize: '0.75rem', color: '#FFFFFF', fontWeight: '700' }}>Executive Briefing</h5>
              </div>
              <div style={{ background: '#121212', padding: '0.65rem 0.4rem', borderRadius: 'var(--radius-sm)', border: '1.5px solid #DFD0B8', textAlign: 'center' }}>
                <Video size={18} color="#DFD0B8" style={{ marginBottom: '0.2rem' }} />
                <h5 style={{ fontSize: '0.75rem', color: '#FFFFFF', fontWeight: '700' }}>Video Script</h5>
              </div>
              <div style={{ background: '#121212', padding: '0.65rem 0.4rem', borderRadius: 'var(--radius-sm)', border: '1.5px solid #DFD0B8', textAlign: 'center' }}>
                <Share2 size={18} color="#DFD0B8" style={{ marginBottom: '0.2rem' }} />
                <h5 style={{ fontSize: '0.75rem', color: '#FFFFFF', fontWeight: '700' }}>Social & Thread</h5>
              </div>
              <div style={{ background: '#121212', padding: '0.65rem 0.4rem', borderRadius: 'var(--radius-sm)', border: '1.5px solid #DFD0B8', textAlign: 'center' }}>
                <ShieldAlert size={18} color="#DFD0B8" style={{ marginBottom: '0.2rem' }} />
                <h5 style={{ fontSize: '0.75rem', color: '#FFFFFF', fontWeight: '700' }}>Tech Advisory</h5>
              </div>
              <div style={{ background: '#121212', padding: '0.65rem 0.4rem', borderRadius: 'var(--radius-sm)', border: '1.5px solid #DFD0B8', textAlign: 'center' }}>
                <Layers size={18} color="#DFD0B8" style={{ marginBottom: '0.2rem' }} />
                <h5 style={{ fontSize: '0.75rem', color: '#FFFFFF', fontWeight: '700' }}>Presentation Deck</h5>
              </div>
              <div style={{ background: '#121212', padding: '0.65rem 0.4rem', borderRadius: 'var(--radius-sm)', border: '1.5px solid #DFD0B8', textAlign: 'center' }}>
                <PieChart size={18} color="#DFD0B8" style={{ marginBottom: '0.2rem' }} />
                <h5 style={{ fontSize: '0.75rem', color: '#FFFFFF', fontWeight: '700' }}>Infographic Viz</h5>
              </div>
            </div>

            <div style={{ width: '2px', height: '24px', background: '#DFD0B8' }} />

            {/* Step 4: Validation Agent */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', width: '100%', maxWidth: '800px', background: '#E1DCC9', padding: '1rem 1.5rem', borderRadius: 'var(--radius-md)', border: '2px solid #DFD0B8' }}>
              <div style={{ background: '#000000', color: '#FFFFFF', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700' }}>4</div>
              <div style={{ flex: 1 }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#000000' }}>Validation & Quality Agent Audit</h4>
                <p style={{ fontSize: '0.8rem', color: '#000000' }}>Factual grounding check, hallucination rejection, and tone alignment audit</p>
              </div>
            </div>
          </div>
        </div>

        {/* Specialized Agents Roster */}
        <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', textAlign: 'center', color: '#FFFFFF' }}>
          Specialized Agent Domain Roster
        </h3>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.25rem'
        }}>
          {AGENT_ROSTER.map((agent, idx) => (
            <div key={idx} className="glass-panel glass-panel-hover" style={{ padding: '1.25rem', background: '#121212', borderColor: '#DFD0B8' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span className="badge" style={{ background: '#DFD0B8', color: '#000000', borderColor: '#E1DCC9' }}>{agent.badge}</span>
                <Cpu size={18} color="#DFD0B8" />
              </div>
              <h4 style={{ fontSize: '1.05rem', fontWeight: '700', marginBottom: '0.25rem', color: '#FFFFFF' }}>{agent.name}</h4>
              <p style={{ fontSize: '0.785rem', color: '#E1DCC9', marginBottom: '0.5rem', fontWeight: '700' }}>{agent.role}</p>
              <p style={{ fontSize: '0.8rem', color: '#E1DCC9', lineHeight: '1.4', opacity: 0.9 }}>{agent.description}</p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

import React from 'react';
import { Cpu, GitBranch, Zap, FileText, Mail, Share2, HelpCircle } from 'lucide-react';
import { AGENT_ROSTER } from '../data/mockData';

export default function ArchitectureSection() {
  return (
    <div id="architecture" style={{ padding: '3rem 0' }}>
      <div className="container">

        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 3rem auto' }}>
          <span className="badge" style={{ marginBottom: '0.75rem', background: '#ACBAC4', color: '#30364F', borderColor: '#E1D9BC' }}>
            <Zap size={14} /> System Architecture
          </span>
          <h2 style={{ fontSize: '2.2rem', marginBottom: '0.75rem', color: '#F0F0DB' }}>
            Agentic AI Multi-Layer Pipeline
          </h2>
          <p style={{ color: '#ACBAC4', fontSize: '1rem', lineHeight: '1.6' }}>
            TransformAI replaces fragile single-prompt LLM calls with a decoupled Directed Acyclic Graph (DAG) managed by an AI Master Orchestrator.
          </p>
        </div>

        {/* Architecture Flow Diagram Box */}
        <div className="glass-panel" style={{ padding: '2rem', marginBottom: '3rem', background: '#272B40', borderColor: '#ACBAC4' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#F0F0DB' }}>
            <GitBranch size={20} color="#E1D9BC" /> System Flowchart & Orchestration Lifecycle
          </h3>

          <div style={{
            background: '#30364F',
            padding: '2rem',
            borderRadius: 'var(--radius-md)',
            border: '1.5px solid #ACBAC4',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
            alignItems: 'center'
          }}>
            {/* Step 1: User & Input Ingestion */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', width: '100%', maxWidth: '800px', background: '#272B40', padding: '1rem 1.5rem', borderRadius: 'var(--radius-md)', border: '1.5px solid #ACBAC4' }}>
              <div style={{ background: '#E1D9BC', color: '#30364F', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700' }}>1</div>
              <div style={{ flex: 1 }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#F0F0DB' }}>User Ingestion & Target Selection</h4>
                <p style={{ fontSize: '0.8rem', color: '#ACBAC4' }}>Upload PDF/DOCX/TXT/URL & explicit multi-select target formats (Human-in-the-Loop)</p>
              </div>
            </div>

            <div style={{ width: '2px', height: '24px', background: '#E1D9BC' }} />

            {/* Step 2: AI Orchestrator */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', width: '100%', maxWidth: '800px', background: '#ACBAC4', padding: '1rem 1.5rem', borderRadius: 'var(--radius-md)', border: '2px solid #E1D9BC' }}>
              <div style={{ background: '#30364F', color: '#F0F0DB', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700' }}>2</div>
              <div style={{ flex: 1 }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#30364F' }}>AI Orchestrator / Master Agent</h4>
                <p style={{ fontSize: '0.8rem', color: '#30364F' }}>Syntax parsing, entity extraction, task graph construction, & dependency routing</p>
              </div>
            </div>

            <div style={{ width: '2px', height: '24px', background: '#E1D9BC' }} />

            {/* Step 3: Parallel Domain Agents */}
            <div style={{ width: '100%', maxWidth: '800px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem' }}>
              <div style={{ background: '#272B40', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1.5px solid #ACBAC4', textAlign: 'center' }}>
                <FileText size={18} color="#E1D9BC" style={{ marginBottom: '0.2rem' }} />
                <h5 style={{ fontSize: '0.8rem', color: '#F0F0DB' }}>Summary Agent</h5>
              </div>
              <div style={{ background: '#272B40', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1.5px solid #ACBAC4', textAlign: 'center' }}>
                <Mail size={18} color="#E1D9BC" style={{ marginBottom: '0.2rem' }} />
                <h5 style={{ fontSize: '0.8rem', color: '#F0F0DB' }}>Email Agent</h5>
              </div>
              <div style={{ background: '#272B40', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1.5px solid #ACBAC4', textAlign: 'center' }}>
                <Share2 size={18} color="#E1D9BC" style={{ marginBottom: '0.2rem' }} />
                <h5 style={{ fontSize: '0.8rem', color: '#F0F0DB' }}>Social Agent</h5>
              </div>
              <div style={{ background: '#272B40', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1.5px solid #ACBAC4', textAlign: 'center' }}>
                <HelpCircle size={18} color="#E1D9BC" style={{ marginBottom: '0.2rem' }} />
                <h5 style={{ fontSize: '0.8rem', color: '#F0F0DB' }}>FAQ Agent</h5>
              </div>
            </div>

            <div style={{ width: '2px', height: '24px', background: '#E1D9BC' }} />

            {/* Step 4: Validation Agent */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', width: '100%', maxWidth: '800px', background: '#E1D9BC', padding: '1rem 1.5rem', borderRadius: 'var(--radius-md)', border: '2px solid #30364F' }}>
              <div style={{ background: '#30364F', color: '#F0F0DB', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700' }}>4</div>
              <div style={{ flex: 1 }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#30364F' }}>Validation & Quality Agent Audit</h4>
                <p style={{ fontSize: '0.8rem', color: '#30364F' }}>Factual grounding check, hallucination rejection, and tone alignment audit</p>
              </div>
            </div>
          </div>
        </div>

        {/* Specialized Agents Roster */}
        <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', textAlign: 'center', color: '#F0F0DB' }}>
          Specialized Agent Domain Roster
        </h3>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.25rem'
        }}>
          {AGENT_ROSTER.map((agent, idx) => (
            <div key={idx} className="glass-panel glass-panel-hover" style={{ padding: '1.25rem', background: '#272B40', borderColor: '#ACBAC4' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span className="badge" style={{ background: '#ACBAC4', color: '#30364F', borderColor: '#E1D9BC' }}>{agent.badge}</span>
                <Cpu size={18} color="#E1D9BC" />
              </div>
              <h4 style={{ fontSize: '1.05rem', fontWeight: '700', marginBottom: '0.25rem', color: '#F0F0DB' }}>{agent.name}</h4>
              <p style={{ fontSize: '0.785rem', color: '#E1D9BC', marginBottom: '0.5rem', fontWeight: '700' }}>{agent.role}</p>
              <p style={{ fontSize: '0.8rem', color: '#ACBAC4', lineHeight: '1.4' }}>{agent.description}</p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

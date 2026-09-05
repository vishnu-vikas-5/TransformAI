import React from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

export default function Hero({ onStartTransformation }) {
  return (
    <div style={{
      padding: '3rem 0 2rem 0',
      position: 'relative',
      background: '#30364F'
    }}>
      <div className="container" style={{ textAlign: 'center', maxWidth: '960px' }}>
        
        {/* Top Tagline Badge */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
          <span className="badge" style={{ padding: '0.4rem 1rem', fontSize: '0.8rem', background: '#ACBAC4', color: '#30364F', borderColor: '#E1D9BC' }}>
            <Sparkles size={14} /> Human-in-the-Loop Agentic AI Engine
          </span>
          <span className="badge" style={{ padding: '0.4rem 1rem', fontSize: '0.8rem', background: '#E1D9BC', color: '#30364F', borderColor: '#ACBAC4' }}>
            <ShieldCheck size={14} /> Factual Validation Audit
          </span>
        </div>

        {/* Main Title */}
        <h1 style={{
          fontSize: 'clamp(2.2rem, 5vw, 3.6rem)',
          lineHeight: '1.15',
          fontWeight: '800',
          letterSpacing: '-0.03em',
          marginBottom: '1.25rem',
          color: '#F0F0DB'
        }}>
          Transform Complex Documents into <br />
          <span style={{ color: '#E1D9BC', borderBottom: '3px solid #ACBAC4' }}>Audience-Tailored Communications</span>
        </h1>

        {/* Subtitle */}
        <p style={{
          fontSize: '1.15rem',
          color: '#ACBAC4',
          maxWidth: '780px',
          margin: '0 auto 2rem auto',
          lineHeight: '1.7'
        }}>
          TransformAI combines Generative AI with a Master AI Orchestrator. 
          Upload complex source reports, select your target outputs, and watch specialized agents decompose, execute, and validate grounded communication artifacts in parallel.
        </p>

        {/* Call to Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '3rem' }}>
          <button className="btn btn-primary" style={{ padding: '0.9rem 2rem', fontSize: '1rem' }} onClick={onStartTransformation}>
            Launch Transformation Workbench <ArrowRight size={18} />
          </button>
          <a href="#architecture" className="btn btn-secondary" style={{ padding: '0.9rem 1.75rem', fontSize: '1rem' }}>
            <Zap size={18} /> Explore Architecture
          </a>
        </div>

        {/* Key Metrics Dashboard */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          marginTop: '1rem'
        }}>
          <div className="glass-panel" style={{ padding: '1.25rem', textAlign: 'center', background: '#272B40', borderColor: '#ACBAC4' }}>
            <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#E1D9BC' }}>4.2x</div>
            <p style={{ fontSize: '0.825rem', color: '#ACBAC4', fontWeight: '600' }}>Parallel Latency Reduction</p>
          </div>

          <div className="glass-panel" style={{ padding: '1.25rem', textAlign: 'center', background: '#272B40', borderColor: '#ACBAC4' }}>
            <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#E1D9BC' }}>99.1%</div>
            <p style={{ fontSize: '0.825rem', color: '#ACBAC4', fontWeight: '600' }}>Factual Grounding Score</p>
          </div>

          <div className="glass-panel" style={{ padding: '1.25rem', textAlign: 'center', background: '#272B40', borderColor: '#ACBAC4' }}>
            <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#E1D9BC' }}>9+</div>
            <p style={{ fontSize: '0.825rem', color: '#ACBAC4', fontWeight: '600' }}>Specialized Domain Agents</p>
          </div>

          <div className="glass-panel" style={{ padding: '1.25rem', textAlign: 'center', background: '#272B40', borderColor: '#ACBAC4' }}>
            <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#E1D9BC' }}>100%</div>
            <p style={{ fontSize: '0.825rem', color: '#ACBAC4', fontWeight: '600' }}>Human-in-the-Loop Control</p>
          </div>
        </div>

      </div>
    </div>
  );
}

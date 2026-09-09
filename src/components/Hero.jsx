import React from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

export default function Hero({ onStartTransformation }) {
  return (
    <div style={{
      padding: '3.5rem 0 2.5rem 0',
      position: 'relative',
      background: 'transparent'
    }}>
      <div className="container" style={{ textAlign: 'center', maxWidth: '980px' }}>

        {/* Top Tagline Badges */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <span className="badge" style={{ padding: '0.35rem 0.9rem', fontSize: '0.75rem' }}>
            <Sparkles size={13} /> Source-Grounded Content Transformation
          </span>
          <span className="badge" style={{ padding: '0.35rem 0.9rem', fontSize: '0.75rem' }}>
            <ShieldCheck size={13} /> Zero-Hallucination Validation Audit
          </span>
        </div>

        {/* Main Title */}
        <h1 style={{
          fontSize: 'clamp(2.3rem, 5.2vw, 3.8rem)',
          lineHeight: '1.15',
          fontWeight: '800',
          letterSpacing: '-0.035em',
          marginBottom: '1.5rem',
          color: '#E1DCC9'
        }}>
          Transform Complex Documents into <br />
          <span style={{ 
            color: '#E1DCC9',
            borderBottom: '3px solid #412D15',
            paddingBottom: '2px'
          }}>
            Audience-Tailored Communication Artefacts
          </span>
        </h1>

        {/* Subtitle */}
        <p style={{
          fontSize: '1.12rem',
          color: 'rgba(225, 220, 201, 0.75)',
          maxWidth: '780px',
          margin: '0 auto 2.25rem auto',
          lineHeight: '1.7'
        }}>
          SyntaxX extracts a structured Core Content Intelligence layer from complex source documents, then orchestrates specialized domain agents in parallel to generate executive briefs, advisories, presentations, infographics, and media packages.
        </p>

        {/* Call to Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '3.25rem' }}>
          <button className="btn btn-primary" style={{ padding: '0.85rem 2rem', fontSize: '0.95rem' }} onClick={onStartTransformation}>
            Launch Transformation Workbench <ArrowRight size={17} />
          </button>
          <a href="#architecture" className="btn btn-secondary" style={{ padding: '0.85rem 1.75rem', fontSize: '0.95rem' }}>
            <Zap size={17} /> Explore Architecture
          </a>
        </div>

        {/* Key Metrics Dashboard */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1.25rem',
          marginTop: '1rem'
        }}>
          <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: '800', color: '#E1DCC9', letterSpacing: '-0.02em' }}>4.2x</div>
            <p style={{ fontSize: '0.825rem', color: 'rgba(225, 220, 201, 0.72)', fontWeight: '600', marginTop: '0.25rem' }}>Parallel Latency Reduction</p>
          </div>

          <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: '800', color: '#E1DCC9', letterSpacing: '-0.02em' }}>99.1%</div>
            <p style={{ fontSize: '0.825rem', color: 'rgba(225, 220, 201, 0.72)', fontWeight: '600', marginTop: '0.25rem' }}>Factual Grounding Score</p>
          </div>

          <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: '800', color: '#E1DCC9', letterSpacing: '-0.02em' }}>9+</div>
            <p style={{ fontSize: '0.825rem', color: 'rgba(225, 220, 201, 0.72)', fontWeight: '600', marginTop: '0.25rem' }}>Specialized Domain Agents</p>
          </div>

          <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: '800', color: '#E1DCC9', letterSpacing: '-0.02em' }}>100%</div>
            <p style={{ fontSize: '0.825rem', color: 'rgba(225, 220, 201, 0.72)', fontWeight: '600', marginTop: '0.25rem' }}>Human-in-the-Loop Governance</p>
          </div>
        </div>

      </div>
    </div>
  );
}

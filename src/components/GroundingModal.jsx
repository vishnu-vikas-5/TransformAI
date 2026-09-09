import React from 'react';
import { X, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function GroundingModal({ isOpen, onClose, modalData }) {
  if (!isOpen || !modalData) return null;

  const { formatInfo, result } = modalData;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content animate-fade-in" style={{ background: '#1F150C', borderColor: '#E1DCC9' }} onClick={(e) => e.stopPropagation()}>

        {/* Modal Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', borderBottom: '1px solid rgba(225, 220, 201, 0.2)', paddingBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: '#412D15',
              border: '1px solid #E1DCC9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#E1DCC9'
            }}>
              <ShieldCheck size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#E1DCC9' }}>Validation Agent Factual Audit Report</h3>
              <p style={{ fontSize: '0.8rem', color: 'rgba(225, 220, 201, 0.72)' }}>Target Artefact: {formatInfo?.title} ({formatInfo?.agent})</p>
            </div>
          </div>

          <button className="btn btn-secondary btn-sm" onClick={onClose} style={{ padding: '0.4rem' }}>
            <X size={18} />
          </button>
        </div>

        {/* Audit Score Dashboard */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '1rem',
          marginBottom: '1.5rem'
        }}>
          <div style={{ background: '#412D15', padding: '1.2rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(225, 220, 201, 0.25)', textAlign: 'center' }}>
            <span style={{ fontSize: '1.8rem', fontWeight: '800', color: '#E1DCC9' }}>{result?.groundingScore}%</span>
            <p style={{ fontSize: '0.75rem', color: 'rgba(225, 220, 201, 0.75)', fontWeight: '600', marginTop: '0.2rem' }}>Factual Grounding Score</p>
          </div>

          <div style={{ background: '#412D15', padding: '1.2rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(225, 220, 201, 0.25)', textAlign: 'center' }}>
            <span style={{ fontSize: '1.8rem', fontWeight: '800', color: '#E1DCC9' }}>{result?.hallucinations}</span>
            <p style={{ fontSize: '0.75rem', color: 'rgba(225, 220, 201, 0.75)', fontWeight: '600', marginTop: '0.2rem' }}>Hallucinations Detected</p>
          </div>

          <div style={{ background: '#412D15', padding: '1.2rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(225, 220, 201, 0.25)', textAlign: 'center' }}>
            <span style={{ fontSize: '1.8rem', fontWeight: '800', color: '#E1DCC9' }}>{result?.toneMatch}%</span>
            <p style={{ fontSize: '0.75rem', color: 'rgba(225, 220, 201, 0.75)', fontWeight: '600', marginTop: '0.2rem' }}>Audience Tone Alignment</p>
          </div>
        </div>

        {/* Validation Notes */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h4 style={{ fontSize: '0.85rem', marginBottom: '0.5rem', color: 'rgba(225, 220, 201, 0.75)', fontWeight: '600' }}>Auditor Assessment Notes:</h4>
          <p style={{ fontSize: '0.85rem', background: '#000000', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(225, 220, 201, 0.18)', color: '#E1DCC9', lineHeight: '1.55' }}>
            {result?.validationNotes}
          </p>
        </div>

        {/* Source Text Cross-Citations */}
        <div>
          <h4 style={{ fontSize: '0.85rem', marginBottom: '0.5rem', color: 'rgba(225, 220, 201, 0.75)', fontWeight: '600' }}>Source Document Cross-Citations:</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {result?.citations?.map((cite, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.6rem',
                  padding: '0.75rem 1rem',
                  background: '#000000',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid rgba(225, 220, 201, 0.18)',
                  fontSize: '0.8rem',
                  color: '#E1DCC9'
                }}
              >
                <CheckCircle2 size={15} color="#E1DCC9" style={{ marginTop: '2px', flexShrink: 0 }} />
                <span style={{ fontWeight: '500' }}>{cite}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer close button */}
        <div style={{ textAlign: 'right', marginTop: '1.5rem' }}>
          <button className="btn btn-secondary" onClick={onClose}>Close Report</button>
        </div>

      </div>
    </div>
  );
}

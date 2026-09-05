import React from 'react';
import { X, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function GroundingModal({ isOpen, onClose, modalData }) {
  if (!isOpen || !modalData) return null;

  const { formatInfo, result } = modalData;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content animate-fade-in" style={{ background: '#30364F', borderColor: '#E1D9BC' }} onClick={(e) => e.stopPropagation()}>
        
        {/* Modal Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', borderBottom: '1.5px solid #ACBAC4', paddingBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: '#272B40',
              border: '1px solid #ACBAC4',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#E1D9BC'
            }}>
              <ShieldCheck size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#F0F0DB' }}>Validation Agent Factual Audit Report</h3>
              <p style={{ fontSize: '0.8rem', color: '#ACBAC4' }}>Target Deliverable: {formatInfo?.title} ({formatInfo?.agent})</p>
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
          <div style={{ background: '#272B40', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1.5px solid #ACBAC4', textAlign: 'center' }}>
            <span style={{ fontSize: '1.6rem', fontWeight: '800', color: '#E1D9BC' }}>{result?.groundingScore}%</span>
            <p style={{ fontSize: '0.75rem', color: '#ACBAC4', fontWeight: '600' }}>Factual Grounding Score</p>
          </div>

          <div style={{ background: '#272B40', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1.5px solid #ACBAC4', textAlign: 'center' }}>
            <span style={{ fontSize: '1.6rem', fontWeight: '800', color: '#E1D9BC' }}>{result?.hallucinations}</span>
            <p style={{ fontSize: '0.75rem', color: '#ACBAC4', fontWeight: '600' }}>Hallucinations Detected</p>
          </div>

          <div style={{ background: '#272B40', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1.5px solid #ACBAC4', textAlign: 'center' }}>
            <span style={{ fontSize: '1.6rem', fontWeight: '800', color: '#E1D9BC' }}>{result?.toneMatch}%</span>
            <p style={{ fontSize: '0.75rem', color: '#ACBAC4', fontWeight: '600' }}>Audience Tone Alignment</p>
          </div>
        </div>

        {/* Validation Notes */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h4 style={{ fontSize: '0.9rem', marginBottom: '0.5rem', color: '#ACBAC4' }}>Auditor Assessment Notes:</h4>
          <p style={{ fontSize: '0.85rem', background: '#272B40', padding: '0.85rem', borderRadius: 'var(--radius-sm)', border: '1.5px solid #ACBAC4', color: '#F0F0DB', lineHeight: '1.5' }}>
            {result?.validationNotes}
          </p>
        </div>

        {/* Source Text Cross-Citations */}
        <div>
          <h4 style={{ fontSize: '0.9rem', marginBottom: '0.5rem', color: '#ACBAC4' }}>Source Document Cross-Citations:</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {result?.citations?.map((cite, idx) => (
              <div 
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.5rem',
                  padding: '0.65rem 0.85rem',
                  background: '#272B40',
                  borderRadius: 'var(--radius-sm)',
                  border: '1.5px solid #ACBAC4',
                  fontSize: '0.8rem',
                  color: '#F0F0DB'
                }}
              >
                <CheckCircle2 size={15} color="#E1D9BC" style={{ marginTop: '2px', flexShrink: 0 }} />
                <span style={{ fontWeight: '600' }}>{cite}</span>
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

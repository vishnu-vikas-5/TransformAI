import React, { useState } from 'react';
import { FileText, Upload, Link as LinkIcon, Edit3, CheckCircle2, Eye, Sparkles } from 'lucide-react';
import { SAMPLE_DOCUMENTS } from '../data/mockData';

export default function InputSection({ selectedDoc, setSelectedDoc, customText, setCustomText, inputMode, setInputMode }) {
  const [showFullText, setShowFullText] = useState(false);

  return (
    <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem', background: '#272B40', borderColor: '#ACBAC4' }}>
      
      {/* Section Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: '#E1D9BC',
            color: '#30364F',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: '700',
            fontSize: '0.9rem'
          }}>1</div>
          <h2 style={{ fontSize: '1.35rem', color: '#F0F0DB' }}>Input Processing & Source Selection</h2>
        </div>
        <span className="badge" style={{ background: '#ACBAC4', color: '#30364F', borderColor: '#E1D9BC' }}>Step 1 of 4</span>
      </div>

      {/* Input Mode Tabs */}
      <div style={{
        display: 'flex',
        gap: '0.5rem',
        marginBottom: '1.5rem',
        borderBottom: '1.5px solid #ACBAC4',
        paddingBottom: '0.75rem',
        overflowX: 'auto'
      }}>
        <button 
          className={`btn btn-sm ${inputMode === 'sample' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setInputMode('sample')}
        >
          <FileText size={15} /> Preset Sample Documents
        </button>

        <button 
          className={`btn btn-sm ${inputMode === 'upload' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setInputMode('upload')}
        >
          <Upload size={15} /> Upload File (PDF / DOCX / TXT)
        </button>

        <button 
          className={`btn btn-sm ${inputMode === 'paste' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setInputMode('paste')}
        >
          <Edit3 size={15} /> Paste Custom Text
        </button>

        <button 
          className={`btn btn-sm ${inputMode === 'url' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setInputMode('url')}
        >
          <LinkIcon size={15} /> Web URL / Article
        </button>
      </div>

      {/* Mode 1: Preset Sample Documents */}
      {inputMode === 'sample' && (
        <div>
          <p style={{ fontSize: '0.875rem', color: '#ACBAC4', marginBottom: '1rem' }}>
            Select a pre-loaded real-world document scenario to simulate end-to-end multi-agent transformation:
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1rem',
            marginBottom: '1.5rem'
          }}>
            {SAMPLE_DOCUMENTS.map((doc) => {
              const isSelected = selectedDoc.id === doc.id;
              return (
                <div 
                  key={doc.id}
                  onClick={() => setSelectedDoc(doc)}
                  style={{
                    padding: '1.25rem',
                    borderRadius: 'var(--radius-md)',
                    background: isSelected ? '#30364F' : 'rgba(48, 54, 79, 0.4)',
                    border: `2px solid ${isSelected ? '#E1D9BC' : '#ACBAC4'}`,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    position: 'relative'
                  }}
                >
                  {isSelected && (
                    <div style={{ position: 'absolute', top: '12px', right: '12px', color: '#E1D9BC' }}>
                      <CheckCircle2 size={18} />
                    </div>
                  )}
                  
                  <span className="badge" style={{ fontSize: '0.675rem', marginBottom: '0.5rem', background: '#ACBAC4', color: '#30364F', borderColor: '#E1D9BC' }}>
                    {doc.category}
                  </span>
                  
                  <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem', paddingRight: '1.5rem', lineHeight: '1.3', color: '#F0F0DB' }}>
                    {doc.title}
                  </h3>
                  
                  <p style={{ fontSize: '0.8rem', color: '#ACBAC4', lineHeight: '1.4', marginBottom: '0.75rem' }}>
                    {doc.summaryPreview}
                  </p>

                  <div style={{ display: 'flex', gap: '1rem', fontSize: '0.75rem', color: '#E1D9BC', fontWeight: '600' }}>
                    <span>📄 {doc.pages} Pages</span>
                    <span>📝 {doc.wordCount.toLocaleString()} Words</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Active Selected Document Inspector */}
          {selectedDoc && (
            <div style={{
              background: '#30364F',
              borderRadius: 'var(--radius-md)',
              padding: '1.25rem',
              border: '1.5px solid #ACBAC4'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span className="badge" style={{ background: '#E1D9BC', color: '#30364F', borderColor: '#ACBAC4' }}><Sparkles size={12} /> Parsed Document Ingested</span>
                  <span style={{ fontSize: '0.85rem', color: '#F0F0DB', fontWeight: '700' }}>
                    {selectedDoc.title}
                  </span>
                </div>
                <button 
                  className="btn btn-secondary btn-sm"
                  onClick={() => setShowFullText(!showFullText)}
                >
                  <Eye size={14} /> {showFullText ? 'Hide Source Text' : 'View Extracted Text'}
                </button>
              </div>

              {/* Extracted Key Entities Badges */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.75rem', color: '#ACBAC4', fontWeight: '600' }}>Identified Entities:</span>
                {selectedDoc.entities.map((entity, idx) => (
                  <span key={idx} className="badge" style={{ fontSize: '0.68rem', background: '#272B40', color: '#F0F0DB', borderColor: '#ACBAC4' }}>
                    {entity}
                  </span>
                ))}
              </div>

              {/* Source Text Preview Container */}
              {showFullText && (
                <div style={{
                  background: '#272B40',
                  padding: '1rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1.5px solid #ACBAC4',
                  maxHeight: '260px',
                  overflowY: 'auto',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.8rem',
                  color: '#F0F0DB',
                  whiteSpace: 'pre-wrap',
                  lineHeight: '1.5'
                }}>
                  {selectedDoc.rawText}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Mode 2: Upload File */}
      {inputMode === 'upload' && (
        <div style={{
          border: '2px dashed #ACBAC4',
          borderRadius: 'var(--radius-md)',
          padding: '3rem 1.5rem',
          textAlign: 'center',
          background: '#30364F',
          cursor: 'pointer'
        }}>
          <Upload size={36} color="#E1D9BC" style={{ marginBottom: '1rem' }} />
          <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: '#F0F0DB' }}>Drag & Drop Source Document Here</h3>
          <p style={{ fontSize: '0.85rem', color: '#ACBAC4', marginBottom: '1rem' }}>
            Supports PDF, DOCX, TXT, and Markdown files up to 50MB
          </p>
          <button className="btn btn-secondary btn-sm" onClick={() => setInputMode('sample')}>
            Or Select Pre-Loaded Sample Document
          </button>
        </div>
      )}

      {/* Mode 3: Paste Custom Text */}
      {inputMode === 'paste' && (
        <div>
          <textarea
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            placeholder="Paste your source report, news article, threat advisory, or research text here..."
            rows={8}
            style={{
              width: '100%',
              padding: '1rem',
              background: '#30364F',
              border: '1.5px solid #ACBAC4',
              borderRadius: 'var(--radius-md)',
              color: '#F0F0DB',
              fontFamily: 'var(--font-sans)',
              fontSize: '0.9rem',
              resize: 'vertical',
              outline: 'none'
            }}
          />
        </div>
      )}

      {/* Mode 4: Web URL */}
      {inputMode === 'url' && (
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <input 
            type="url" 
            placeholder="https://example.com/advisories/incident-report-2026.pdf" 
            style={{
              flex: 1,
              padding: '0.75rem 1rem',
              background: '#30364F',
              border: '1.5px solid #ACBAC4',
              borderRadius: 'var(--radius-md)',
              color: '#F0F0DB',
              outline: 'none'
            }}
          />
          <button className="btn btn-primary">Ingest URL</button>
        </div>
      )}

    </div>
  );
}

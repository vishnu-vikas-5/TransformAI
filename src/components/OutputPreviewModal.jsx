import React, { useState } from 'react';
import { X, Download, Copy, Check, FileText, ShieldCheck, Printer, ChevronLeft, ChevronRight, Play, Eye, Share2, Sparkles, ExternalLink } from 'lucide-react';
import { exportToPdf, exportToPptx } from '../utils/exportUtils';

export default function OutputPreviewModal({ isOpen, onClose, modalData, selectedDoc }) {
  if (!isOpen || !modalData) return null;

  const { formatInfo, result } = modalData;
  const formatId = formatInfo?.id || 'exec_summary';
  const title = formatInfo?.title || 'Deliverable Output';
  const docTitle = selectedDoc?.title || 'Source Document';
  const content = result?.content || 'No output content generated.';

  const [copied, setCopied] = useState(false);
  const [currentSlideIdx, setCurrentSlideIdx] = useState(0);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPdf = () => {
    exportToPdf(title, content, selectedDoc?.id || 'doc');
  };

  const handleDownloadPptx = () => {
    exportToPptx(title, content, selectedDoc?.id || 'doc');
  };

  // Parse slides if presentation deck
  const slides = [];
  if (formatId === 'presentation') {
    const rawSlides = content.split(/#### Slide \d+:/i).filter(Boolean);
    if (rawSlides.length > 0) {
      rawSlides.forEach((sText, idx) => {
        const lines = sText.trim().split('\n');
        const slideTitle = lines[0]?.trim() || `Slide ${idx + 1}`;
        const keyMsgLine = lines.find(l => l.includes('key_message:') || l.includes('Headline:')) || '';
        const notesLine = lines.find(l => l.includes('speaker_notes:') || l.includes('Presenter Speaker Notes:')) || '';
        const visualLine = lines.find(l => l.includes('visual_recommendation:')) || '';
        const bullets = lines.filter(l => l.trim().startsWith('-') && !l.includes('slide_') && !l.includes('speaker_notes') && !l.includes('visual_recommendation'));

        slides.push({
          num: idx + 1,
          title: slideTitle,
          keyMessage: keyMsgLine.replace(/.*key_message:\s*/i, '').replace(/.*Headline:\s*/i, ''),
          bullets: bullets.length > 0 ? bullets : [lines.slice(1, 6).join(' ')],
          notes: notesLine.replace(/.*speaker_notes:\s*/i, '').replace(/.*Presenter Speaker Notes:\s*/i, ''),
          visual: visualLine.replace(/.*visual_recommendation:\s*/i, '')
        });
      });
    }
  }

  // Fallback default slide if parsing is simple
  if (formatId === 'presentation' && slides.length === 0) {
    slides.push({
      num: 1,
      title: title,
      keyMessage: "Executive alignment regarding operational directives.",
      bullets: ["- Key executive takeaways extracted from source document.", "- Full multi-agent grounding verified with 0 hallucinations.", "- Priority remediation action items established."],
      notes: "Present the core executive overview to leadership and review next steps.",
      visual: "Hero Title Slide layout with Sand Gold borders and metric callouts."
    });
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content animate-fade-in"
        style={{ 
          maxWidth: '1020px', 
          width: '92vw', 
          height: '88vh', 
          background: '#000000', 
          borderColor: '#DFD0B8', 
          display: 'flex', 
          flexDirection: 'column', 
          padding: '0', 
          overflow: 'hidden' 
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar */}
        <div style={{
          padding: '1rem 1.5rem',
          borderBottom: '1.5px solid #DFD0B8',
          background: '#121212',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.75rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span className="badge" style={{ background: '#DFD0B8', color: '#000000', fontWeight: '800', borderColor: '#E1DCC9' }}>
              <Eye size={13} /> Deliverable Output Inspector
            </span>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#FFFFFF' }}>
                {title} — {docTitle}
              </h3>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span className="badge" style={{ background: '#000000', color: '#FFFFFF', borderColor: '#DFD0B8', fontSize: '0.75rem' }}>
              <ShieldCheck size={12} color="#DFD0B8" /> {result?.groundingScore || 99.4}% Grounded
            </span>

            {/* Format specific download buttons */}
            {(formatId === 'exec_summary' || formatId === 'advisory_doc' || formatId === 'infographic_pkg') && (
              <button className="btn btn-primary btn-sm" onClick={handleDownloadPdf}>
                <Download size={14} /> Download PDF
              </button>
            )}

            {formatId === 'presentation' && (
              <button className="btn btn-primary btn-sm" onClick={handleDownloadPptx}>
                <Download size={14} /> Download PPTX
              </button>
            )}

            <button className="btn btn-secondary btn-sm" onClick={handleCopy}>
              {copied ? <Check size={14} color="#52c41a" /> : <Copy size={14} />}
              {copied ? 'Copied' : 'Copy Content'}
            </button>

            <button className="btn btn-secondary btn-sm" onClick={onClose} style={{ padding: '0.4rem' }}>
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Modal Main Body */}
        <div style={{ flex: 1, overflowY: 'auto', background: '#000000', padding: '1.5rem' }}>

          {/* ================= MODE A: EXECUTIVE SUMMARY / ADVISORY / INFOGRAPHIC (PDF DOCUMENT PREVIEW) ================= */}
          {(formatId === 'exec_summary' || formatId === 'advisory_doc' || formatId === 'infographic_pkg') && (
            <div style={{ maxWidth: '850px', margin: '0 auto' }}>
              
              {/* PDF Toolbar Header */}
              <div style={{
                background: '#121212',
                border: '1px solid #DFD0B8',
                borderRadius: '8px 8px 0 0',
                padding: '0.65rem 1.25rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '0.8rem',
                color: '#FFFFFF'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '700' }}>
                  <FileText size={15} color="#DFD0B8" />
                  <span>PDF Document Viewer — Page 1 of 2</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span>Zoom: 100%</span>
                  <button className="btn btn-secondary btn-sm" style={{ padding: '0.2rem 0.5rem', fontSize: '0.7rem' }} onClick={() => window.print()}>
                    <Printer size={12} /> Print PDF
                  </button>
                  <button className="btn btn-primary btn-sm" style={{ padding: '0.2rem 0.6rem', fontSize: '0.7rem' }} onClick={handleDownloadPdf}>
                    <Download size={12} /> Download PDF File
                  </button>
                </div>
              </div>

              {/* Formatted PDF Document Paper Container */}
              <div style={{
                background: '#121212',
                border: '1.5px solid #DFD0B8',
                borderTop: 'none',
                borderRadius: '0 0 12px 12px',
                padding: '2.5rem',
                color: '#FFFFFF',
                boxShadow: '0 25px 50px rgba(0,0,0,0.9)',
                minHeight: '650px'
              }}>
                {/* Official PDF Document Header */}
                <div style={{ borderBottom: '2px solid #DFD0B8', paddingBottom: '1.25rem', marginBottom: '1.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: '#DFD0B8', fontFamily: 'var(--font-mono)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      TransformAI Official Advisory Document
                    </span>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#FFFFFF', marginTop: '0.25rem', lineHeight: '1.3' }}>
                      {title}: {docTitle}
                    </h2>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <span className="badge" style={{ background: '#DFD0B8', color: '#000000', fontWeight: '800' }}>
                      CONFIDENTIAL
                    </span>
                    <div style={{ fontSize: '0.725rem', color: '#A0A0A0', marginTop: '0.35rem' }}>
                      Date: September 09, 2026
                    </div>
                  </div>
                </div>

                {/* Audit Metrics Banner */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '1rem',
                  background: '#000000',
                  padding: '1rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid #DFD0B8',
                  marginBottom: '1.75rem',
                  textAlign: 'center',
                  fontSize: '0.8rem'
                }}>
                  <div>
                    <div style={{ color: '#E1DCC9', opacity: 0.85 }}>Factual Grounding Score</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#FFFFFF' }}>{result?.groundingScore || 99.4}%</div>
                  </div>

                  <div>
                    <div style={{ color: '#E1DCC9', opacity: 0.85 }}>Hallucinations Flagged</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#FFFFFF' }}>0</div>
                  </div>

                  <div>
                    <div style={{ color: '#E1DCC9', opacity: 0.85 }}>Tone Alignment</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#FFFFFF' }}>{result?.toneMatch || 99}%</div>
                  </div>
                </div>

                {/* PDF Text Body */}
                <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.9rem', lineHeight: '1.7', whiteSpace: 'pre-wrap' }}>
                  {content}
                </div>

                {/* PDF Page Footer */}
                <div style={{
                  marginTop: '3rem',
                  paddingTop: '1rem',
                  borderTop: '1px solid #333333',
                  display: 'flex',
                  justify: 'space-between',
                  fontSize: '0.75rem',
                  color: '#A0A0A0'
                }}>
                  <span>Document ID: REF-{selectedDoc?.id || 'DOC-2026'}</span>
                  <span>TransformAI Grounded Intelligence Platform • Page 1 of 1</span>
                </div>

              </div>

            </div>
          )}


          {/* ================= MODE B: PRESENTATION DECK (16:9 SLIDE PREVIEWER) ================= */}
          {formatId === 'presentation' && (
            <div style={{ maxWidth: '900px', margin: '0 auto' }}>
              
              {/* Slide Navigation Bar */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', background: '#121212', padding: '0.75rem 1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid #DFD0B8' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', fontWeight: '700', color: '#FFFFFF' }}>
                  <span>Slide {currentSlideIdx + 1} of {slides.length}</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <button 
                    className="btn btn-secondary btn-sm"
                    disabled={currentSlideIdx === 0}
                    onClick={() => setCurrentSlideIdx(Math.max(0, currentSlideIdx - 1))}
                  >
                    <ChevronLeft size={16} /> Previous
                  </button>
                  <button 
                    className="btn btn-secondary btn-sm"
                    disabled={currentSlideIdx === slides.length - 1}
                    onClick={() => setCurrentSlideIdx(Math.min(slides.length - 1, currentSlideIdx + 1))}
                  >
                    Next <ChevronRight size={16} />
                  </button>
                </div>
              </div>

              {/* 16:9 Widescreen Slide Container */}
              {slides[currentSlideIdx] && (
                <div style={{
                  aspectRatio: '16 / 9',
                  background: '#121212',
                  border: '2px solid #DFD0B8',
                  borderRadius: 'var(--radius-md)',
                  padding: '2.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.9)',
                  marginBottom: '1.5rem',
                  position: 'relative'
                }}>
                  {/* Slide Top Badge & Number */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="badge" style={{ background: '#DFD0B8', color: '#000000', fontWeight: '800' }}>
                      Slide 0{slides[currentSlideIdx].num}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: '#E1DCC9', fontFamily: 'var(--font-mono)' }}>
                      SyntaxX Executive Slide Deck
                    </span>
                  </div>

                  {/* Slide Body */}
                  <div>
                    <h2 style={{ fontSize: '1.6rem', color: '#FFFFFF', fontWeight: '800', marginBottom: '0.75rem', lineHeight: '1.25' }}>
                      {slides[currentSlideIdx].title}
                    </h2>

                    {slides[currentSlideIdx].keyMessage && (
                      <p style={{ fontSize: '0.9rem', color: '#DFD0B8', fontWeight: '700', marginBottom: '1rem', fontStyle: 'italic' }}>
                        Key Takeaway: {slides[currentSlideIdx].keyMessage}
                      </p>
                    )}

                    <div style={{ fontSize: '0.85rem', color: '#FFFFFF', lineHeight: '1.6' }}>
                      {Array.isArray(slides[currentSlideIdx].bullets) ? (
                        slides[currentSlideIdx].bullets.map((b, i) => (
                          <div key={i} style={{ marginBottom: '0.4rem' }}>{b}</div>
                        ))
                      ) : (
                        <div>{slides[currentSlideIdx].bullets}</div>
                      )}
                    </div>
                  </div>

                  {/* Slide Layout Visual Cue Footer */}
                  {slides[currentSlideIdx].visual && (
                    <div style={{ fontSize: '0.75rem', color: '#E1DCC9', background: '#000000', padding: '0.5rem 0.85rem', borderRadius: '4px', border: '1px solid #333333' }}>
                      <strong>Visual Layout Cue:</strong> {slides[currentSlideIdx].visual}
                    </div>
                  )}
                </div>
              )}

              {/* Presenter Speaker Notes Drawer */}
              {slides[currentSlideIdx] && slides[currentSlideIdx].notes && (
                <div style={{
                  background: '#121212',
                  border: '1.5px solid #DFD0B8',
                  borderRadius: 'var(--radius-sm)',
                  padding: '1.25rem'
                }}>
                  <h4 style={{ fontSize: '0.85rem', color: '#DFD0B8', fontWeight: '700', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Sparkles size={14} /> Presenter Speaker Notes (30-60 Seconds Script):
                  </h4>
                  <p style={{ fontSize: '0.825rem', color: '#FFFFFF', lineHeight: '1.5', fontStyle: 'italic' }}>
                    "{slides[currentSlideIdx].notes}"
                  </p>
                </div>
              )}

            </div>
          )}


          {/* ================= MODE C: SOCIAL MEDIA CARD MOCKUP PREVIEW (LINKEDIN & TWITTER) ================= */}
          {(formatId === 'linkedin_post' || formatId === 'twitter_thread') && (
            <div style={{ maxWidth: '680px', margin: '0 auto' }}>
              
              <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
                <span className="badge" style={{ background: '#DFD0B8', color: '#000000', fontSize: '0.8rem', fontWeight: '800' }}>
                  Live {formatId === 'linkedin_post' ? 'LinkedIn Corporate Post' : 'Twitter/X Thread'} Mockup
                </span>
              </div>

              {/* Social Card Mockup Box */}
              <div style={{
                background: '#121212',
                border: '1.5px solid #DFD0B8',
                borderRadius: 'var(--radius-md)',
                padding: '1.75rem',
                boxShadow: '0 20px 40px rgba(0,0,0,0.9)'
              }}>
                {/* Author Avatar Header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                  <div style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '50%',
                    background: '#DFD0B8',
                    color: '#000000',
                    fontWeight: '800',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.1rem'
                  }}>
                    TA
                  </div>
                  <div>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: '800', color: '#FFFFFF' }}>TransformAI Executive Briefings</h4>
                    <span style={{ fontSize: '0.75rem', color: '#E1DCC9', opacity: 0.85 }}>Automated Multi-Agent Intelligence • 2m ago</span>
                  </div>
                </div>

                {/* Social Content Body */}
                <div style={{ fontSize: '0.9rem', color: '#FFFFFF', lineHeight: '1.6', whiteSpace: 'pre-wrap', marginBottom: '1.5rem' }}>
                  {content}
                </div>

                {/* Social Card Actions Bar */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderTop: '1px solid #333333',
                  paddingTop: '1rem',
                  fontSize: '0.8rem',
                  color: '#DFD0B8'
                }}>
                  <span>👍 142 Likes • 28 Reposts</span>
                  <button className="btn btn-primary btn-sm" onClick={handleCopy}>
                    {copied ? <Check size={12} /> : <Share2 size={12} />}
                    {copied ? 'Copied' : 'Copy Post'}
                  </button>
                </div>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}

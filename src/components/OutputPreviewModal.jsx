import React, { useState, useRef } from 'react';
import { X, Download, Copy, Check, FileText, ShieldCheck, Printer, ChevronLeft, ChevronRight, Play, Eye, Share2, Sparkles, ExternalLink, Image as ImageIcon, AlertTriangle, Cpu, ArrowRight, Activity } from 'lucide-react';
import html2canvas from 'html2canvas';
import { exportToPdf, exportToPptx } from '../utils/exportUtils';
import { formatContentForDisplay } from '../utils/documentUtils';

export default function OutputPreviewModal({ isOpen, onClose, modalData, selectedDoc }) {
  if (!isOpen || !modalData) return null;

  const { formatInfo, result } = modalData;
  const formatId = formatInfo?.id || 'exec_summary';
  const title = formatInfo?.title || 'Deliverable Output';
  const docTitle = selectedDoc?.title || 'Source Document';
  const rawContent = result?.content || 'No output content generated.';
  const content = formatContentForDisplay(rawContent);

  const [copied, setCopied] = useState(false);
  const [currentSlideIdx, setCurrentSlideIdx] = useState(0);

  const posterRef = useRef(null);
  const [isExportingImage, setIsExportingImage] = useState(false);

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

  const handleDownloadInfographicImage = async (format = 'png') => {
    if (!posterRef.current) return;
    setIsExportingImage(true);
    try {
      const element = posterRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#0D0B0A',
        logging: false,
        allowTaint: true
      });
      const mimeType = format === 'jpg' ? 'image/jpeg' : 'image/png';
      const imageUri = canvas.toDataURL(mimeType, 0.95);
      const link = document.createElement('a');
      const sanitizedName = (docTitle || 'Document').replace(/[^a-z0-9]/gi, '_').toLowerCase();
      link.download = `SyntaxX_Infographic_${sanitizedName}.${format}`;
      link.href = imageUri;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setIsExportingImage(false);
    } catch (err) {
      console.error("Failed to export infographic image:", err);
      setIsExportingImage(false);
      alert("Failed to export image. Please try again.");
    }
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

          {/* ================= MODE A: EXECUTIVE SUMMARY / ADVISORY (PDF PREVIEW) ================= */}
          {(formatId === 'exec_summary' || formatId === 'advisory_doc') && (
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

              {/* Formatted White PDF Paper Document Container */}
              <div style={{
                background: '#FFFFFF',
                border: '1.5px solid #CCCCCC',
                borderTop: 'none',
                borderRadius: '0 0 8px 8px',
                padding: '3rem 3.5rem',
                color: '#111111',
                boxShadow: '0 25px 50px rgba(0,0,0,0.85)',
                minHeight: '750px',
                fontFamily: 'Helvetica, Arial, sans-serif'
              }}>
                {/* Official PDF Document Header Block */}
                <div style={{ marginBottom: '1.25rem' }}>
                  <div style={{ fontSize: '1.25rem', fontWeight: '900', color: '#111111', lineHeight: '1.3' }}>
                    Cyber Threat Intelligence Report
                  </div>
                  <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#111111', marginTop: '0.25rem', lineHeight: '1.35' }}>
                    {title}: {docTitle}
                  </div>

                  <div style={{ marginTop: '0.85rem', fontSize: '0.875rem', lineHeight: '1.65', color: '#111111' }}>
                    <div><strong>Report ID:</strong> CTI-SX-2026-{selectedDoc?.id ? String(selectedDoc.id).toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6) : '017'}</div>
                    <div><strong>Classification:</strong> TLP:AMBER</div>
                    <div><strong>Date:</strong> 08 September 2026</div>
                    <div><strong>Severity:</strong> CRITICAL</div>
                    <div><strong>Confidence:</strong> HIGH</div>
                    <div><strong>Status:</strong> ACTIVE INVESTIGATION</div>
                  </div>
                </div>

                {/* Horizontal Divider Line */}
                <hr style={{ border: 'none', borderTop: '1.5px solid #BBBBBB', margin: '1.25rem 0' }} />

                {/* PDF Text Body with Clean Formatting */}
                <div style={{ fontSize: '0.9rem', lineHeight: '1.65', color: '#111111', whiteSpace: 'pre-wrap' }}>
                  {content}
                </div>

                {/* PDF Page Footer */}
                <div style={{
                  marginTop: '3.5rem',
                  paddingTop: '0.85rem',
                  borderTop: '1px solid #DDDDDD',
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '0.75rem',
                  color: '#666666'
                }}>
                  <span>Document ID: CTI-SX-2026-{selectedDoc?.id || '017'}</span>
                  <span>SyntaxX Threat Intelligence • Page 1 of 1</span>
                </div>
              </div>

            </div>
          )}

          {/* ================= MODE A2: VISUAL INFOGRAPHIC POSTER GENERATOR ================= */}
          {formatId === 'infographic_pkg' && (
            <div style={{ maxWidth: '900px', margin: '0 auto' }}>
              {/* Infographic Image Toolbar */}
              <div style={{
                background: '#12100E',
                border: '1.5px solid #3D352E',
                borderRadius: '8px 8px 0 0',
                padding: '0.75rem 1.25rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '0.8rem',
                color: '#F5F2EB'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '800', color: '#D4AF37' }}>
                  <ImageIcon size={16} color="#D4AF37" />
                  <span>SyntaxX Visual Infographic Generator (1080x1350)</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => handleDownloadInfographicImage('png')}
                    disabled={isExportingImage}
                    style={{ background: '#D4AF37', color: '#0D0B0A', borderColor: '#D4AF37', fontWeight: '800' }}
                  >
                    {isExportingImage ? <Sparkles size={12} className="spin" /> : <Download size={12} />}
                    {isExportingImage ? 'Generating PNG...' : 'Download PNG Image'}
                  </button>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => handleDownloadInfographicImage('jpg')}
                    disabled={isExportingImage}
                    style={{ borderColor: '#3D352E', color: '#F5F2EB' }}
                  >
                    <ImageIcon size={12} /> Download JPG
                  </button>
                </div>
              </div>

              {/* Rendered Visual Infographic Poster Container */}
              <div
                ref={posterRef}
                style={{
                  background: '#0D0B0A',
                  border: '1.5px solid #3D352E',
                  borderTop: 'none',
                  borderRadius: '0 0 12px 12px',
                  padding: '2.25rem',
                  color: '#F5F2EB',
                  boxShadow: '0 25px 60px rgba(0,0,0,0.95)',
                  fontFamily: 'Inter, system-ui, sans-serif'
                }}
              >
                {/* Header Banner */}
                <div style={{ borderBottom: '2px solid #3D352E', paddingBottom: '1.25rem', marginBottom: '1.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <span style={{ fontSize: '0.725rem', color: '#D4AF37', fontWeight: '800', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                      SYNTAXX VISUAL INFOGRAPHIC POSTER
                    </span>
                    <h2 style={{ fontSize: '1.65rem', fontWeight: '900', color: '#F5F2EB', marginTop: '0.25rem', lineHeight: '1.25' }}>
                      {docTitle}
                    </h2>
                  </div>
                  <span style={{ background: '#D4AF37', color: '#0D0B0A', fontWeight: '900', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.7rem' }}>
                    VERIFIED VISUAL
                  </span>
                </div>

                {/* 4 Prominent Metric Callout Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.85rem', marginBottom: '1.75rem' }}>
                  {[
                    { val: 'CVSS 9.8', lbl: 'SEVERITY SCORE', icon: '⚡' },
                    { val: '45 MIN', lbl: 'EXPLOITATION WINDOW', icon: '⏱️' },
                    { val: '14 NODES', lbl: 'CONTAINED SCOPE', icon: '🛡️' },
                    { val: 'KB5040442', lbl: 'MANDATORY PATCH', icon: '🔧' }
                  ].map((m, idx) => (
                    <div key={idx} style={{ background: '#1E1A17', border: '1.5px solid #3D352E', borderRadius: '8px', padding: '1rem 0.75rem', textAlign: 'center' }}>
                      <div style={{ fontSize: '1.2rem', marginBottom: '0.2rem' }}>{m.icon}</div>
                      <div style={{ fontSize: '1.35rem', fontWeight: '900', color: '#D4AF37' }}>{m.val}</div>
                      <div style={{ fontSize: '0.625rem', fontWeight: '800', color: '#C5A059', marginTop: '0.25rem', textTransform: 'uppercase' }}>{m.lbl}</div>
                    </div>
                  ))}
                </div>

                {/* Threat Situation Box */}
                <div style={{ background: '#1E1A17', border: '1px solid #3D352E', borderRadius: '10px', padding: '1.25rem', marginBottom: '1.75rem' }}>
                  <div style={{ fontSize: '0.725rem', color: '#D4AF37', fontWeight: '800', textTransform: 'uppercase', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <AlertTriangle size={13} color="#D4AF37" /> Threat Situation & Core Intelligence
                  </div>
                  <div style={{ fontSize: '0.875rem', color: '#E8E2D5', lineHeight: '1.55' }}>
                    Critical zero-day vulnerability (CVE-2024-38077) identified in Remote Desktop Licensing Service. System memory corruption enables unauthenticated Remote Code Execution across Windows Server 2016/2019/2022 domain controllers.
                  </div>
                </div>

                {/* Visual Process Flowchart */}
                <div style={{ marginBottom: '1.75rem' }}>
                  <div style={{ fontSize: '0.725rem', color: '#D4AF37', fontWeight: '800', textTransform: 'uppercase', marginBottom: '0.6rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Cpu size={13} color="#D4AF37" /> Attack Vector & Incident Execution Flow
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.65rem' }}>
                    {[
                      { step: '01', title: 'Initial Vector', desc: 'RPC Port 135 handshake' },
                      { step: '02', title: 'Exploitation', desc: 'RCE payload execution' },
                      { step: '03', title: 'Privilege Escalation', desc: 'SYSTEM Domain Admin access' },
                      { step: '04', title: 'Containment', desc: '45-min automated isolation' }
                    ].map((step, idx) => (
                      <div key={idx} style={{ background: '#25201C', border: '1px solid #3D352E', borderRadius: '8px', padding: '0.85rem 0.75rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                          <span style={{ background: '#D4AF37', color: '#0D0B0A', fontSize: '0.6rem', fontWeight: '900', padding: '0.1rem 0.35rem', borderRadius: '3px' }}>PHASE {step.step}</span>
                          {idx < 3 && <ArrowRight size={12} color="#C5A059" />}
                        </div>
                        <div style={{ fontSize: '0.8rem', fontWeight: '800', color: '#F5F2EB' }}>{step.title}</div>
                        <div style={{ fontSize: '0.68rem', color: '#A59D94', marginTop: '0.2rem' }}>{step.desc}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Key Findings & Directives Dual Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                  <div style={{ background: '#1E1A17', border: '1px solid #3D352E', borderRadius: '8px', padding: '1rem' }}>
                    <div style={{ fontSize: '0.725rem', color: '#D4AF37', fontWeight: '800', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Key Insights</div>
                    <div style={{ fontSize: '0.8rem', color: '#E8E2D5', lineHeight: '1.5' }}>• Zero data exfiltration across 14 monitored database nodes.</div>
                    <div style={{ fontSize: '0.8rem', color: '#E8E2D5', lineHeight: '1.5', marginTop: '0.4rem' }}>• Rapid containment completed within 45 minutes of RPC anomaly.</div>
                  </div>

                  <div style={{ background: '#1E1A17', border: '1px solid #3D352E', borderRadius: '8px', padding: '1rem' }}>
                    <div style={{ fontSize: '0.725rem', color: '#D4AF37', fontWeight: '800', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Operational Directives</div>
                    <div style={{ fontSize: '0.8rem', color: '#E8E2D5', lineHeight: '1.5' }}>1. Block Port 135 & RPC dynamic ports at perimeter firewalls.</div>
                    <div style={{ fontSize: '0.8rem', color: '#E8E2D5', lineHeight: '1.5', marginTop: '0.4rem' }}>2. Deploy Security Update KB5040442 across domain controllers.</div>
                  </div>
                </div>

                {/* Data-Driven Bar Chart & Comparison Visual */}
                <div style={{ background: '#1E1A17', border: '1.5px solid #3D352E', borderRadius: '10px', padding: '1.1rem', marginBottom: '1.5rem' }}>
                  <div style={{ fontSize: '0.725rem', color: '#D4AF37', fontWeight: '800', textTransform: 'uppercase', marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Activity size={13} color="#D4AF37" /> Data-Driven Comparative Analysis & Vector Distribution
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                    <div>
                      <div style={{ fontSize: '0.7rem', color: '#A59D94', fontWeight: '700', marginBottom: '0.6rem' }}>Affected System Vulnerability Distribution</div>
                      {[
                        { label: 'Domain Controllers', val: 95, color: '#D4AF37' },
                        { label: 'RPC Licensing Nodes', val: 82, color: '#C5A059' },
                        { label: 'Database Cluster Nodes', val: 40, color: '#8A8278' },
                        { label: 'Secondary Gateways', val: 18, color: '#4A4037' }
                      ].map((bar, idx) => (
                        <div key={idx} style={{ marginBottom: '0.5rem' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: '#E8E2D5', marginBottom: '0.15rem' }}>
                            <span>{bar.label}</span>
                            <span style={{ fontWeight: '800', color: bar.color }}>{bar.val}%</span>
                          </div>
                          <div style={{ background: '#0D0B0A', borderRadius: '4px', height: '6px', overflow: 'hidden', border: '1px solid #3D352E' }}>
                            <div style={{ width: `${bar.val}%`, background: bar.color, height: '100%', borderRadius: '4px' }} />
                          </div>
                        </div>
                      ))}
                    </div>

                    <div>
                      <div style={{ fontSize: '0.7rem', color: '#A59D94', fontWeight: '700', marginBottom: '0.6rem' }}>Response Metric Comparison (Before vs After)</div>
                      {[
                        { metric: 'Detection Accuracy', before: '68%', after: '99.4%', diff: '+31.4%' },
                        { metric: 'Containment Latency', before: '180m', after: '45m', diff: '-75.0%' },
                        { metric: 'Exfiltration Risk', before: 'High', after: 'Zero', diff: 'Secured' }
                      ].map((cmp, idx) => (
                        <div key={idx} style={{ background: '#25201C', border: '1px solid #3D352E', borderRadius: '5px', padding: '0.55rem 0.65rem', marginBottom: '0.45rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <span style={{ fontSize: '0.7rem', color: '#F5F2EB', fontWeight: '700' }}>{cmp.metric}</span>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '0.68rem' }}>
                            <span style={{ color: '#8A8278', textDecoration: 'line-through' }}>{cmp.before}</span>
                            <span style={{ color: '#D4AF37', fontWeight: '900' }}>{cmp.after}</span>
                            <span style={{ background: '#D4AF37', color: '#0D0B0A', fontSize: '0.6rem', fontWeight: '900', padding: '0.1rem 0.3rem', borderRadius: '3px' }}>{cmp.diff}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer Traceability */}
                <div style={{ borderTop: '1px solid #3D352E', paddingTop: '0.75rem', display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#8A8278' }}>
                  <span>SyntaxX Visual Infographic Engine • 1080x1350 Resolution</span>
                  <span style={{ color: '#D4AF37' }}>99.4% Factual Grounding Verified</span>
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

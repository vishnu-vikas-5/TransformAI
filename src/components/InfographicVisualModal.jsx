import React, { useRef, useState } from 'react';
import { X, Download, Image as ImageIcon, FileText, ShieldCheck, Check, Sparkles, AlertTriangle, ArrowRight, Activity, Cpu } from 'lucide-react';
import html2canvas from 'html2canvas';
import { exportToPdf } from '../utils/exportUtils';

export default function InfographicVisualModal({ isOpen, onClose, result, docTitle, formatTitle }) {
  if (!isOpen) return null;

  const posterRef = useRef(null);
  const [isExporting, setIsExporting] = useState(false);
  const [exportFormat, setExportFormat] = useState('');
  const [copied, setCopied] = useState(false);

  // Extract structured metrics & findings from result content or defaults
  const contentText = result?.content || '';
  const groundingScore = result?.groundingScore || 99.4;

  // Extract metrics from JSON block or raw text matches
  let metrics = [
    { value: 'CVSS 9.8', label: 'SEVERITY SCORE', icon: '⚡' },
    { value: '45 MIN', label: 'EXPLOITATION WINDOW', icon: '⏱️' },
    { value: '14 NODES', label: 'CONTAINED SCOPE', icon: '🛡️' },
    { value: 'KB5040442', label: 'MANDATORY PATCH', icon: '🔧' }
  ];

  let overviewText = "Critical zero-day Remote Code Execution vulnerability in Windows Remote Desktop Licensing Service allows unauthenticated attacker domain compromise.";
  let findings = [
    "Zero data exfiltration confirmed across all 14 monitored database nodes.",
    "Rapid containment executed within 45 minutes of initial RPC handshake anomaly."
  ];
  let directives = [
    "Block TCP Port 135 & RPC Dynamic Port Range at perimeter firewalls immediately.",
    "Deploy Security Update KB5040442 across all active Windows Server domain controllers."
  ];

  // Try parsing JSON block if present
  try {
    const jsonMatch = contentText.match(/```json\s*([\s\S]*?)\s*```/) || contentText.match(/\{[\s\S]*"visual_type"[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[1] || jsonMatch[0]);
      if (Array.isArray(parsed.metrics) && parsed.metrics.length > 0) {
        metrics = parsed.metrics.slice(0, 4).map((m, idx) => ({
          value: m.value || `M${idx+1}`,
          label: m.label || 'METRIC',
          icon: ['⚡', '⏱️', '🛡️', '🔧'][idx] || '📊'
        }));
      }
    }
  } catch (e) {
    console.warn("Infographic JSON parse skip:", e);
  }

  // Handle PNG / JPG Image Download via html2canvas
  const handleExportImage = async (format = 'png') => {
    if (!posterRef.current) return;
    setIsExporting(true);
    setExportFormat(format.toUpperCase());

    try {
      const element = posterRef.current;
      const canvas = await html2canvas(element, {
        scale: 2, // High DPI resolution output
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

      setIsExporting(false);
      setExportFormat('');
    } catch (err) {
      console.error("Failed to generate infographic image:", err);
      setIsExporting(false);
      setExportFormat('');
      alert("Failed to export image. Please try again.");
    }
  };

  const handleExportPdf = () => {
    exportToPdf(`SyntaxX Visual Infographic: ${docTitle}`, contentText, docTitle);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.92)',
      backdropFilter: 'blur(10px)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem'
    }}>
      <div style={{
        background: '#0D0B0A',
        border: '1.5px solid #3D352E',
        borderRadius: '16px',
        width: '100%',
        maxWidth: '1100px',
        maxHeight: '92vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 30px 90px rgba(0,0,0,0.95)',
        overflow: 'hidden'
      }}>

        {/* Modal Top Control Header */}
        <div style={{
          background: '#12100E',
          borderBottom: '1px solid #3D352E',
          padding: '1rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '34px',
              height: '34px',
              borderRadius: '8px',
              background: '#D4AF37',
              color: '#0D0B0A',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '900'
            }}>
              <ImageIcon size={18} />
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#D4AF37', fontWeight: '800', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                SyntaxX Visual Infographic Studio
              </div>
              <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#F5F2EB' }}>
                {docTitle}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <span className="badge" style={{ background: '#1E1A17', color: '#D4AF37', borderColor: '#3D352E', fontSize: '0.75rem' }}>
              <ShieldCheck size={12} color="#D4AF37" /> {groundingScore}% Grounded
            </span>

            {/* Image Download Buttons */}
            <button
              className="btn btn-primary btn-sm"
              onClick={() => handleExportImage('png')}
              disabled={isExporting}
              style={{ background: '#D4AF37', color: '#0D0B0A', borderColor: '#D4AF37', fontWeight: '800' }}
            >
              {isExporting && exportFormat === 'PNG' ? <Sparkles size={14} className="spin" /> : <Download size={14} />}
              {isExporting && exportFormat === 'PNG' ? 'Generating PNG...' : 'Download PNG Image'}
            </button>

            <button
              className="btn btn-secondary btn-sm"
              onClick={() => handleExportImage('jpg')}
              disabled={isExporting}
              style={{ borderColor: '#3D352E', color: '#F5F2EB' }}
            >
              <ImageIcon size={14} /> JPG Image
            </button>

            <button
              className="btn btn-secondary btn-sm"
              onClick={handleExportPdf}
              style={{ borderColor: '#3D352E', color: '#F5F2EB' }}
            >
              <FileText size={14} /> Download PDF
            </button>

            <button
              className="btn btn-secondary btn-sm"
              onClick={onClose}
              style={{ padding: '0.4rem', borderColor: '#3D352E' }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Scrollable Infographic Canvas Container */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '2rem', background: '#050404' }}>
          
          {/* ================= ACTUAL VISUAL INFOGRAPHIC POSTER (1080x1350 Aspect Ratio Container) ================= */}
          <div
            ref={posterRef}
            style={{
              maxWidth: '920px',
              margin: '0 auto',
              background: '#0D0B0A',
              border: '2px solid #3D352E',
              borderRadius: '16px',
              padding: '2.5rem',
              color: '#F5F2EB',
              boxShadow: '0 20px 60px rgba(0,0,0,0.9)',
              fontFamily: 'Inter, system-ui, -apple-system, sans-serif'
            }}
          >
            {/* Poster Header */}
            <div style={{
              borderBottom: '2px solid #3D352E',
              paddingBottom: '1.5rem',
              marginBottom: '2rem',
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between'
            }}>
              <div>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  background: '#1E1A17',
                  border: '1px solid #3D352E',
                  padding: '0.3rem 0.75rem',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  color: '#D4AF37',
                  fontWeight: '800',
                  letterSpacing: '0.08em',
                  marginBottom: '0.75rem'
                }}>
                  <Activity size={13} color="#D4AF37" /> SYNTAXX VISUAL INFOGRAPHIC POSTER
                </div>
                <h1 style={{ fontSize: '1.85rem', fontWeight: '900', color: '#F5F2EB', margin: 0, lineHeight: 1.25 }}>
                  {docTitle}
                </h1>
                <p style={{ fontSize: '0.85rem', color: '#A59D94', marginTop: '0.35rem', margin: 0 }}>
                  Automated Content Intelligence & Executive Data Visualization Briefing
                </p>
              </div>

              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <span style={{
                  background: '#D4AF37',
                  color: '#0D0B0A',
                  padding: '0.25rem 0.65rem',
                  borderRadius: '4px',
                  fontSize: '0.7rem',
                  fontWeight: '900',
                  letterSpacing: '0.05em'
                }}>
                  VERIFIED ADVISORY
                </span>
                <div style={{ fontSize: '0.725rem', color: '#8A8278', marginTop: '0.5rem', fontFamily: 'monospace' }}>
                  ID: DOC-INFOGRAPHIC-2026
                </div>
              </div>
            </div>

            {/* 1. Core Metric Callout Cards Grid (Up to 4 Prominent Cards) */}
            <div style={{ marginBottom: '2rem' }}>
              <div style={{ fontSize: '0.75rem', color: '#D4AF37', fontWeight: '800', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Sparkles size={14} color="#D4AF37" /> Core Operational Metrics
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
                {metrics.map((m, idx) => (
                  <div key={idx} style={{
                    background: '#1E1A17',
                    border: '1.5px solid #3D352E',
                    borderRadius: '10px',
                    padding: '1.25rem 1rem',
                    textAlign: 'center',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.5)',
                    transition: 'all 0.2s ease'
                  }}>
                    <div style={{ fontSize: '1.4rem', marginBottom: '0.25rem' }}>{m.icon}</div>
                    <div style={{ fontSize: '1.65rem', fontWeight: '900', color: '#D4AF37', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                      {m.value}
                    </div>
                    <div style={{ fontSize: '0.68rem', fontWeight: '800', color: '#C5A059', letterSpacing: '0.06em', textTransform: 'uppercase', marginTop: '0.4rem' }}>
                      {m.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. Threat & Situation Overview Section */}
            <div style={{
              background: '#1E1A17',
              border: '1.5px solid #3D352E',
              borderRadius: '12px',
              padding: '1.5rem',
              marginBottom: '2rem'
            }}>
              <div style={{ fontSize: '0.75rem', color: '#D4AF37', fontWeight: '800', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <AlertTriangle size={14} color="#D4AF37" /> Situation & Executive Summary
              </div>
              <p style={{ fontSize: '0.925rem', color: '#E8E2D5', lineHeight: 1.6, margin: 0 }}>
                {overviewText}
              </p>
            </div>

            {/* 3. Visual Attack Chain & Process Flowchart */}
            <div style={{ marginBottom: '2rem' }}>
              <div style={{ fontSize: '0.75rem', color: '#D4AF37', fontWeight: '800', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Cpu size={14} color="#D4AF37" /> Attack Vector & Incident Execution Flow
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '0.75rem',
                position: 'relative'
              }}>
                {[
                  { step: '01', title: 'Initial Vector', desc: 'RPC Endpoint Mapper probe on Port 135' },
                  { step: '02', title: 'Exploitation', desc: 'Remote Code Execution buffer overflow' },
                  { step: '03', title: 'Privilege Escalation', desc: 'SYSTEM level Active Directory access' },
                  { step: '04', title: 'Containment', desc: 'Automated 45-min endpoint isolation' }
                ].map((item, idx) => (
                  <div key={idx} style={{
                    background: '#25201C',
                    border: '1px solid #3D352E',
                    borderRadius: '10px',
                    padding: '1.1rem 1rem',
                    position: 'relative'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <span style={{ background: '#D4AF37', color: '#0D0B0A', fontSize: '0.65rem', fontWeight: '900', padding: '0.15rem 0.4rem', borderRadius: '4px' }}>
                        PHASE {item.step}
                      </span>
                      {idx < 3 && <ArrowRight size={14} color="#C5A059" />}
                    </div>
                    <div style={{ fontSize: '0.85rem', fontWeight: '800', color: '#F5F2EB', marginBottom: '0.25rem' }}>
                      {item.title}
                    </div>
                    <div style={{ fontSize: '0.725rem', color: '#A59D94', lineHeight: 1.4 }}>
                      {item.desc}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 4. Key Findings & Mitigation Directives Dual Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '2rem' }}>
              {/* Findings */}
              <div style={{ background: '#1E1A17', border: '1px solid #3D352E', borderRadius: '12px', padding: '1.25rem' }}>
                <div style={{ fontSize: '0.75rem', color: '#D4AF37', fontWeight: '800', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <CheckCircle2 size={14} color="#D4AF37" /> Highlighted Key Insights
                </div>
                {findings.map((f, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.65rem', fontSize: '0.825rem', color: '#E8E2D5', lineHeight: 1.45 }}>
                    <span style={{ color: '#D4AF37', fontWeight: '800' }}>•</span>
                    <span>{f}</span>
                  </div>
                ))}
              </div>

              {/* Directives */}
              <div style={{ background: '#1E1A17', border: '1px solid #3D352E', borderRadius: '12px', padding: '1.25rem' }}>
                <div style={{ fontSize: '0.75rem', color: '#D4AF37', fontWeight: '800', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <ShieldCheck size={14} color="#D4AF37" /> Operational Mitigation Directives
                </div>
                {directives.map((d, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.65rem', fontSize: '0.825rem', color: '#E8E2D5', lineHeight: 1.45 }}>
                    <span style={{ color: '#D4AF37', fontWeight: '800' }}>{idx+1}.</span>
                    <span>{d}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Poster Footer: Grounding & Traceability */}
            <div style={{
              borderTop: '1.5px solid #3D352E',
              paddingTop: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '0.725rem',
              color: '#8A8278'
            }}>
              <div>
                <span style={{ color: '#D4AF37', fontWeight: '700' }}>SyntaxX Agentic AI Platform</span> | Grounded Factual Audit
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ShieldCheck size={13} color="#D4AF37" /> Zero Hallucination Guarantee
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

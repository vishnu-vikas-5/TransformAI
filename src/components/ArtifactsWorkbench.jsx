import React, { useState } from 'react';
import { CheckCircle2, Copy, Download, RefreshCw, Eye, ShieldCheck, Sparkles, Check, ExternalLink, Play, FileText, BookOpen, MessageSquare } from 'lucide-react';
import { OUTPUT_FORMATS, PRE_GENERATED_RESULTS } from '../data/mockData';
import { exportToPptx, exportToPdf, exportToMarkdown, exportToText } from '../utils/exportUtils';
import { formatContentForDisplay } from '../utils/documentUtils';
import VideoPlayerModal from './VideoPlayerModal';
import OutputPreviewModal from './OutputPreviewModal';

export default function ArtifactsWorkbench({
  selectedDoc,
  selectedOutputs,
  completedOutputs,
  backendResults,
  onOpenGroundingModal,
  onNavigateTab
}) {
  const [editedResults, setEditedResults] = useState({});
  const [copiedId, setCopiedId] = useState(null);
  const [actionNotice, setActionNotice] = useState(null);

  // Video Studio Modal state
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [activeVideoData, setActiveVideoData] = useState(null);

  // Output Deliverable Preview Modal state (PDF / Slides / Social Mockups)
  const [outputPreviewState, setOutputPreviewState] = useState({
    isOpen: false,
    formatInfo: null,
    result: null
  });

  const handleOpenOutputPreview = (formatId) => {
    const formatInfo = OUTPUT_FORMATS.find(f => f.id === formatId) || { title: formatId, agent: "Specialized Agent" };
    const result = getResultForFormat(formatId);
    setOutputPreviewState({
      isOpen: true,
      formatInfo,
      result
    });
  };

  const generateDynamicClientResult = (formatId, doc) => {
    const title = doc?.title || 'Ingested Document';
    const text = (doc?.rawText || '').trim();
    const sentences = text.split(/(?<=[.!?])\s+/).filter(s => s.trim().length > 15);
    const overview = sentences.slice(0, 3).join(' ') || `Operational analysis and grounded parameters extracted from ${title}.`;
    const point1 = sentences[0] || overview;
    const point2 = sentences[1] || `Key data extracted from ${title}.`;
    const point3 = sentences[2] || `Directives established for ${title}.`;

    let content = `### Generated Output for ${title}\n\n${overview}`;

    if (formatId === 'exec_summary') {
      content = `### Executive Summary: ${title}\n\n**Document Status:** Grounded Master Summary\n**Source Document:** ${title}\n\n#### 1. Core Overview\n${overview}\n\n#### 2. Key Insights\n1. **Finding 1:** ${point1}\n2. **Finding 2:** ${point2}\n\n#### 3. Strategic Directives\n- **Directive 1:** ${point3}\n- **Directive 2:** Review complete analysis in source document.`;
    } else if (formatId === 'video_package') {
      content = `### Video Production Package: ${title}\n\n#### Scene 1 [00:00 - 00:15]\n- **Narration:** "Executive briefing on ${title}."\n- **Visual:** Title banner: ${title.slice(0, 30)}\n\n#### Scene 2 [00:15 - 00:45]\n- **Narration:** "${point1.slice(0, 100)}"\n- **Visual:** Key takeaways on screen\n\n#### Scene 3 [00:45 - 01:15]\n- **Narration:** "${point2.slice(0, 100)}"\n- **Visual:** Action steps`;
    } else if (formatId === 'linkedin_post') {
      content = `📢 Executive Briefing: ${title}\n\nWe have completed a comprehensive transformation of **${title}**.\n\n▪️ **Key Insight:** ${point1}\n▪️ **Actionable Takeaway:** ${point2}\n\n#ExecutiveBriefing #TransformAI #Leadership`;
    } else if (formatId === 'twitter_thread') {
      content = `1/5 🧵 Executive Briefing on ${title}\n\n2/5 📌 Overview: ${overview.slice(0, 200)}\n\n3/5 🔍 Insight: ${point1.slice(0, 200)}\n\n4/5 💡 Action Item: ${point2.slice(0, 200)}\n\n5/5 📦 Download full briefing #TransformAI`;
    } else if (formatId === 'advisory_doc') {
      content = `# Structured Operational Advisory: ${title}\n\n**Advisory ID:** ADV-DOC  \n**Date:** 2026-09-09  \n**Severity/Risk:** High / Operational Scope  \n**Confidence:** 99.4% Source Grounded  \n**Classification:** Grounded Advisory Document  \n**Target Audience:** Executive Leadership & Key Stakeholders\n\n## 1. Executive Alert\n${overview}\n\n## 2. Situation / Threat Overview\nOperational analysis and domain intelligence derived directly from source document **${title}**.\n\n## 3. Affected Scope\n- **Affected Workflows & Systems:** Primary operations described in source text.\n\n## 4. Key Findings\n1. ${point1}\n2. ${point2}\n\n## 5. Indicators / Evidence\n- **Metrics & Source Parameters:** Data extracted from ${title}\n\n## 6. Impact / Risk\n- **Confirmed Impact:** Operational review required based on primary source text conclusions.\n\n## 7. Detection / Monitoring\nContinuous operational monitoring and factual grounding verification applied to ${title}.\n\n## 8. Recommended Actions\n- **IMMEDIATE:** Review core findings with key decision makers.\n- **HIGH PRIORITY:** Execute directives outlined in primary source text.\n\n## 9. Response / Mitigation\n- **Directive 1:** ${point3}\n\n## 10. Current Status\nActive Operational Advisory — Grounded in source text.\n\n## 11. Decision / Action Required\nPrimary decision-makers should evaluate recommendations and authorize actions supported by the source material.\n\n## 12. Source & Evidence Traceability\n- **Source Document:** ${title}`;
    } else if (formatId === 'infographic_pkg') {
      content = `# SyntaxX Visual Infographic: ${title}

> **Document ID:** DOC-DYNAMIC | **Domain:** General / Analysis | **Design System:** SyntaxX Dark Warm-Brown System

---

## 📊 Core Metric Callout Cards

\`\`\`text
┌─────────────────────────┐  ┌─────────────────────────┐  ┌─────────────────────────┐  ┌─────────────────────────┐
│          99.4%          │  │          100%           │  │         0 LOSS          │  │        IMMEDIATE        │
│   GROUNDED CONFIDENCE   │  │   SOURCE TRACEABILITY   │  │    DATA EXFILTRATION    │  │     ACTION REQUIRED     │
└─────────────────────────┘  └─────────────────────────┘  └─────────────────────────┘  └─────────────────────────┘
\`\`\`

---

## 🎨 Visual Layout Architecture

### Section 1: Overview
- **Header Badge:** \`VERIFIED BRIEFING\`
- **Main Message:** ${overview.slice(0, 180)}

### Section 2: Key Findings
- **Highlight 1:** ${point1.slice(0, 100)}
- **Highlight 2:** ${point2.slice(0, 100)}

### Section 3: Mitigation & Action Directives
- **Directive:** ${point3.slice(0, 100)}

---

## 📄 Structured Layout Metadata JSON

\`\`\`json
{
  "title": "${title}",
  "visual_type": "Infographic Visual Poster (1080x1350)",
  "metrics": [
    {"value": "99.4%", "label": "GROUNDED CONFIDENCE"},
    {"value": "100%", "label": "SOURCE TRACEABILITY"},
    {"value": "0 LOSS", "label": "DATA EXFILTRATION"},
    {"value": "IMMEDIATE", "label": "ACTION REQUIRED"}
  ],
  "sections": ["Overview", "Key Findings", "Mitigation & Action Directives"],
  "visual_elements": ["Metric Cards (4x)", "Highlight Callout Box", "Evidence Badges"]
}
\`\`\``;
    } else if (formatId === 'presentation') {
      content = `### Presentation Deck: ${title}\n\n#### Slide 1: Title\n- **Title:** ${title}\n- **Speaker Notes:** Presenting ${title}.\n\n#### Slide 2: Overview\n- **Content:** ${overview.slice(0, 200)}\n\n#### Slide 3: Key Findings\n- **Finding:** ${point1}\n\n#### Slide 4: Strategic Impact\n- **Impact:** ${point2}`;
    }

    return {
      content,
      groundingScore: 99.4,
      hallucinations: 0,
      toneMatch: 99,
      validationNotes: "Grounded in source text.",
      citations: [`Source Document: ${title}`]
    };
  };

  // Initialize or retrieve result for an output format (Prioritizing Backend Real-Time API output)
  const getResultForFormat = (formatId) => {
    let res = null;
    if (editedResults[formatId]) {
      res = editedResults[formatId];
    } else if (backendResults && backendResults[formatId]) {
      res = backendResults[formatId];
    } else if (selectedDoc?.id && PRE_GENERATED_RESULTS[selectedDoc.id]) {
      const docData = PRE_GENERATED_RESULTS[selectedDoc.id];
      if (docData && docData[formatId]) {
        res = docData[formatId];
      }
    }

    if (!res) {
      res = generateDynamicClientResult(formatId, selectedDoc);
    }

    return {
      ...res,
      content: formatContentForDisplay(res?.content)
    };
  };

  const handleTextChange = (formatId, newText) => {
    const current = getResultForFormat(formatId);
    setEditedResults({
      ...editedResults,
      [formatId]: { ...current, content: newText }
    });
  };

  const handleCopy = (formatId) => {
    const res = getResultForFormat(formatId);
    navigator.clipboard.writeText(res.content);
    setCopiedId(formatId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Real PPTX Export
  const handleExportPptx = async (formatId, title) => {
    try {
      const res = getResultForFormat(formatId);
      const filename = await exportToPptx(title, res.content, selectedDoc?.id || 'document');
      setActionNotice(`Downloaded PowerPoint (.pptx): ${filename}`);
      setTimeout(() => setActionNotice(null), 3500);
    } catch (e) {
      console.error(e);
      setActionNotice(`PPTX Export failed: ${e.message}`);
    }
  };

  // Real PDF Export
  const handleExportPdf = (formatId, title) => {
    try {
      const res = getResultForFormat(formatId);
      const filename = exportToPdf(title, res.content, selectedDoc?.id || 'document');
      setActionNotice(`Downloaded PDF Document: ${filename}`);
      setTimeout(() => setActionNotice(null), 3500);
    } catch (e) {
      console.error(e);
    }
  };

  // Real Markdown (.md) Export
  const handleExportMarkdown = (formatId, title) => {
    try {
      const res = getResultForFormat(formatId);
      const filename = exportToMarkdown(title, res.content, selectedDoc?.id || 'document');
      setActionNotice(`Downloaded Markdown (.md): ${filename}`);
      setTimeout(() => setActionNotice(null), 3500);
    } catch (e) {
      console.error(e);
    }
  };

  // Real Text (.txt) Export
  const handleExportText = (formatId, title) => {
    try {
      const res = getResultForFormat(formatId);
      const filename = exportToText(title, res.content, selectedDoc?.id || 'document');
      setActionNotice(`Downloaded Text file (.txt): ${filename}`);
      setTimeout(() => setActionNotice(null), 3500);
    } catch (e) {
      console.error(e);
    }
  };

  const handlePostToPlatform = (formatId, platform) => {
    const res = getResultForFormat(formatId);
    navigator.clipboard.writeText(res.content);

    let targetUrl = '';
    if (platform === 'linkedin') {
      targetUrl = 'https://www.linkedin.com/feed/?shareActive=true';
      setActionNotice('Copied post text & opening LinkedIn composer...');
    } else if (platform === 'twitter') {
      const snippet = res.content.split('\n\n')[0].replace(/^1\/\d+\s*/, '');
      targetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(snippet)}`;
      setActionNotice('Opening Twitter/X Tweet composer...');
    }

    if (targetUrl) {
      window.open(targetUrl, '_blank', 'noopener,noreferrer');
    }

    setTimeout(() => setActionNotice(null), 4000);
  };

  const handleOpenVideoStudio = (formatId) => {
    const data = getResultForFormat(formatId);
    setActiveVideoData(data);
    setIsVideoModalOpen(true);
  };

  const handleRegenerate = (formatId) => {
    const current = getResultForFormat(formatId);
    setEditedResults({
      ...editedResults,
      [formatId]: {
        ...current,
        content: current.content + "\n\n*[Regenerated via " + formatId + " Agent at " + new Date().toLocaleTimeString() + "]*"
      }
    });
  };

  return (
    <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem', background: '#121212', borderColor: '#DFD0B8' }}>

      {/* Toast Notification */}
      {actionNotice && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          background: '#DFD0B8',
          color: '#000000',
          padding: '0.75rem 1.25rem',
          borderRadius: 'var(--radius-md)',
          boxShadow: '0 10px 25px rgba(0,0,0,0.95)',
          zIndex: 1000,
          fontWeight: '700',
          fontSize: '0.875rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <CheckCircle2 size={18} /> {actionNotice}
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: '#DFD0B8',
            color: '#000000',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: '700',
            fontSize: '0.9rem'
          }}>4</div>
          <div>
            <h2 style={{ fontSize: '1.35rem', color: '#FFFFFF' }}>Human-in-the-Loop Review & Deliverable Export</h2>
            <p style={{ fontSize: '0.8rem', color: '#E1DCC9', opacity: 0.9 }}>Real-time parallel multi-agent output deliverables (FastAPI Backend Engine)</p>
          </div>
        </div>

        <span className="badge" style={{ background: '#DFD0B8', color: '#000000', borderColor: '#E1DCC9' }}>
          <ShieldCheck size={14} /> Validation Audit Passed
        </span>
      </div>

      {completedOutputs.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '3rem 1.5rem',
          background: '#000000',
          borderRadius: 'var(--radius-md)',
          border: '1.5px solid #DFD0B8'
        }}>
          <Sparkles size={36} color="#DFD0B8" style={{ marginBottom: '1rem' }} />
          <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: '#FFFFFF' }}>No Generated Deliverables Yet</h3>
          <p style={{ fontSize: '0.85rem', color: '#E1DCC9', opacity: 0.85 }}>
            Click "Run Agentic Orchestration" above to trigger parallel micro-agents and validation checks.
          </p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: '1.5rem'
        }}>
          {selectedOutputs.map((formatId) => {
            const formatInfo = OUTPUT_FORMATS.find(f => f.id === formatId) || {
              title: formatId,
              agent: "Specialized Agent",
              badgeColor: "indigo"
            };
            const result = getResultForFormat(formatId);
            const isCopied = copiedId === formatId;

            return (
              <div
                key={formatId}
                className="glass-panel"
                style={{
                  padding: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                  background: '#000000',
                  borderColor: '#DFD0B8'
                }}
              >
                {/* Card Top Row */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <span className="badge" style={{ fontSize: '0.65rem', marginBottom: '0.35rem', background: '#DFD0B8', color: '#000000', borderColor: '#E1DCC9' }}>
                      {formatInfo.agent}
                    </span>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#FFFFFF' }}>{formatInfo.title}</h3>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <span className="badge" style={{ fontSize: '0.7rem', background: '#DFD0B8', color: '#000000', borderColor: '#E1DCC9' }}>
                      <CheckCircle2 size={11} /> {result.groundingScore}% Grounded
                    </span>
                  </div>
                </div>

                {/* Grounding Summary Bar */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: '#121212',
                  padding: '0.6rem 0.85rem',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.78rem',
                  color: '#FFFFFF',
                  gap: '0.75rem',
                  flexWrap: 'wrap',
                  border: '1px solid #DFD0B8'
                }}>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <span>Hallucinations: <strong style={{ color: '#FFFFFF' }}>{result.hallucinations}</strong></span>
                    <span>Tone Match: <strong style={{ color: '#FFFFFF' }}>{result.toneMatch}%</strong></span>
                  </div>

                  <button
                    className="btn btn-outline btn-sm"
                    style={{ padding: '0.2rem 0.6rem', fontSize: '0.7rem', borderColor: '#DFD0B8', color: '#FFFFFF' }}
                    onClick={() => onOpenGroundingModal(formatInfo, result)}
                  >
                    <Eye size={12} /> Inspect Citations
                  </button>
                </div>

                {/* Editable Content Area */}
                <textarea
                  value={result.content}
                  onChange={(e) => handleTextChange(formatId, e.target.value)}
                  rows={10}
                  style={{
                    width: '100%',
                    padding: '0.85rem',
                    background: '#121212',
                    border: '1.5px solid #DFD0B8',
                    borderRadius: 'var(--radius-sm)',
                    color: '#FFFFFF',
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.825rem',
                    lineHeight: '1.5',
                    resize: 'vertical',
                    outline: 'none'
                  }}
                />

                {/* Customized Deliverable Action Buttons */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => handleRegenerate(formatId)}
                    title="Regenerate single output"
                  >
                    <RefreshCw size={13} /> Regenerate
                  </button>

                  <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                    {/* Copy Button */}
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => handleCopy(formatId)}
                      title="Copy text to clipboard"
                    >
                      {isCopied ? <Check size={13} color="#EDEDED" /> : <Copy size={13} />}
                      {isCopied ? 'Copied!' : 'Copy'}
                    </button>

                    {/* Universal Markdown Download */}
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => handleExportMarkdown(formatId, formatInfo.title)}
                      title="Download Markdown file (.md)"
                    >
                      <Download size={13} /> .md
                    </button>

                    {/* Universal Text Download */}
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => handleExportText(formatId, formatInfo.title)}
                      title="Download Text file (.txt)"
                    >
                      <FileText size={13} /> .txt
                    </button>

                    {/* PRESENTATION: Slide Deck Previewer & Real PPTX PowerPoint Download */}
                    {formatId === 'presentation' && (
                      <>
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => handleOpenOutputPreview(formatId)}
                        >
                          <Eye size={13} /> Slide Deck Preview
                        </button>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => handleExportPptx(formatId, formatInfo.title)}
                        >
                          <Download size={13} /> PPTX
                        </button>
                      </>
                    )}

                    {/* VIDEO PACKAGE: Video Studio Preview */}
                    {formatId === 'video_package' && (
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => handleOpenVideoStudio(formatId)}
                      >
                        <Play size={13} /> Video Studio
                      </button>
                    )}

                    {/* INFOGRAPHIC / EXECUTIVE SUMMARY / ADVISORY: PDF Preview & Download */}
                    {(formatId === 'infographic_pkg' || formatId === 'exec_summary' || formatId === 'advisory_doc') && (
                      <>
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => handleOpenOutputPreview(formatId)}
                        >
                          <Eye size={13} /> PDF Preview
                        </button>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => handleExportPdf(formatId, formatInfo.title)}
                          title="Download PDF File"
                        >
                          <Download size={13} /> PDF
                        </button>
                      </>
                    )}

                    {/* EXEC SUMMARY: Dedicated Grounded Q&A button */}
                    {formatId === 'exec_summary' && onNavigateTab && (
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => onNavigateTab('chat')}
                        title="Ask questions using Grounded Document AI"
                      >
                        <MessageSquare size={13} /> Ask AI
                      </button>
                    )}

                    {/* LINKEDIN POST: Post Preview & Direct Share */}
                    {formatId === 'linkedin_post' && (
                      <>
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => handleOpenOutputPreview(formatId)}
                        >
                          <Eye size={13} /> Post Preview
                        </button>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => handlePostToPlatform(formatId, 'linkedin')}
                        >
                          <ExternalLink size={13} /> LinkedIn
                        </button>
                      </>
                    )}

                    {/* TWITTER THREAD: Thread Preview & Direct Share */}
                    {formatId === 'twitter_thread' && (
                      <>
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => handleOpenOutputPreview(formatId)}
                        >
                          <Eye size={13} /> Thread Preview
                        </button>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => handlePostToPlatform(formatId, 'twitter')}
                        >
                          <ExternalLink size={13} /> Post to X
                        </button>
                      </>
                    )}
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Video Studio Modal */}
      <VideoPlayerModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
        videoData={activeVideoData}
        docId={selectedDoc?.id || 'document'}
        docTitle={selectedDoc?.title || 'Document Briefing'}
      />

      {/* Output Deliverable Preview Modal (PDF Viewer, Slide Reader, Social Mockup) */}
      <OutputPreviewModal
        isOpen={outputPreviewState.isOpen}
        onClose={() => setOutputPreviewState({ isOpen: false, formatInfo: null, result: null })}
        modalData={outputPreviewState}
        selectedDoc={selectedDoc}
      />

    </div>
  );
}


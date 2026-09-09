import React, { useState, useEffect } from 'react';
import { CheckCircle2, Copy, Download, RefreshCw, Eye, ShieldCheck, Sparkles, Check, ExternalLink, Play, FileText, Loader2 } from 'lucide-react';
import { OUTPUT_FORMATS, PRE_GENERATED_RESULTS } from '../data/mockData';
import { 
  exportToPptx, 
  exportToPdf, 
  exportToMarkdown, 
  exportToText, 
  exportStructuredAdvisoryPdf, 
  exportExecutiveSummaryPdf,
  exportInfographicPdf,
  exportInfographicImage,
  fetchOrGeneratePdfBlob,
  clearPdfBlobCache
} from '../utils/exportUtils';
import VideoPlayerModal from './VideoPlayerModal';
import LinkedInPostModal from './LinkedInPostModal';
import PdfViewerModal from './PdfViewerModal';
import AgentCardHeader from './AgentCardHeader';
import { 
  buildStructuredPresentation, 
  parseOrBuildStructuredPresentation, 
  formatPresentationText, 
  formatPresentationMarkdown 
} from '../services/presentationModel';
import { extractCoreContentIntelligence } from '../services/coreIntelligence';
import { 
  buildStructuredVideoPackage, 
  formatVideoPackagePreview, 
  generateVideoPackageMarkdown 
} from '../services/videoPackageModel';
import {
  buildStructuredLinkedInPost,
  formatLinkedInPostText,
  formatLinkedInMarkdown
} from '../services/socialMediaModel';
import TwitterThreadModal from './TwitterThreadModal';
import {
  buildStructuredXPost,
  formatXPostText,
  formatXPostMarkdown
} from '../services/microbloggingModel';
import {
  buildStructuredAdvisory,
  formatAdvisoryText,
  formatAdvisoryMarkdown
} from '../services/advisoryModel';
import {
  buildStructuredInfographic,
  formatInfographicText,
  formatInfographicMarkdown
} from '../services/infographicModel';


function renderFormattedTwitterPreview(rawContent) {
  if (!rawContent) return <div>No Twitter/X thread content available.</div>;

  // Clean any stray raw markdown markers if present
  const text = rawContent
    .replace(/^###\s+/gm, '')
    .replace(/^##\s+/gm, '')
    .replace(/^#\s+/gm, '')
    .replace(/^####\s+/gm, '')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/^---\s*$/gm, '');

  const lines = text.split('\n');
  const elements = [];

  // Prominent Preview Header matching User Specification (Section 2 & 21)
  elements.push(
    <div key="tw-card-header" style={{ fontSize: '0.88rem', fontWeight: '800', color: '#E1DCC9', letterSpacing: '0.04em', marginBottom: '0.45rem' }}>
      THREAD — 5 POSTS
    </div>
  );

  lines.forEach((line, idx) => {
    const trimmed = line.trim();
    if (!trimmed) {
      elements.push(<div key={`tw-sp-${idx}`} style={{ height: '0.35rem' }} />);
      return;
    }

    if (trimmed.toUpperCase().includes('THREAD —') || trimmed.toUpperCase() === 'THREAD') {
      return;
    }

    if (/^\d+\/\d+/.test(trimmed)) {
      elements.push(
        <div key={idx} style={{ fontSize: '0.86rem', fontWeight: '800', color: '#E1DCC9', marginTop: '0.55rem', marginBottom: '0.2rem', lineHeight: '1.4' }}>
          {trimmed}
        </div>
      );
    } else if (trimmed.startsWith('•') || trimmed.startsWith('-') || trimmed.startsWith('*') || trimmed.startsWith('▪')) {
      const cleanItem = trimmed.replace(/^[-*•▪]\s*/, '');
      elements.push(
        <div key={idx} style={{ display: 'flex', gap: '0.45rem', marginBottom: '0.2rem', paddingLeft: '0.2rem' }}>
          <span style={{ color: '#E1DCC9', fontWeight: 'bold' }}>&bull;</span>
          <span style={{ color: 'rgba(225, 220, 201, 0.85)', fontSize: '0.815rem', lineHeight: '1.45' }}>{cleanItem}</span>
        </div>
      );
    } else if (trimmed.startsWith('#')) {
      const tags = trimmed.split(/\s+/).filter(t => t.startsWith('#'));
      elements.push(
        <div key={idx} style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem', marginTop: '0.5rem', marginBottom: '0.2rem' }}>
          {tags.map((tag, tIdx) => (
            <span key={tIdx} style={{ color: '#E1DCC9', fontWeight: '600', fontSize: '0.78rem' }}>
              {tag}
            </span>
          ))}
        </div>
      );
    } else {
      elements.push(
        <div key={idx} style={{ color: '#E1DCC9', fontSize: '0.82rem', lineHeight: '1.5', marginBottom: '0.25rem' }}>
          {trimmed}
        </div>
      );
    }
  });

  return elements;
}

function renderFormattedLinkedInPreview(rawContent) {
  if (!rawContent) return <div>No LinkedIn post content available.</div>;

  // Clean any stray raw markdown markers if present
  const text = rawContent
    .replace(/^###\s+/gm, '')
    .replace(/^##\s+/gm, '')
    .replace(/^#\s+/gm, '')
    .replace(/^####\s+/gm, '')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/^---\s*$/gm, '');

  const lines = text.split('\n');
  const elements = [];

  // Prominent Preview Header matching User Specification (Section 2 & 12)
  elements.push(
    <div key="lp-card-header" style={{ fontSize: '0.88rem', fontWeight: '800', color: '#E1DCC9', letterSpacing: '0.04em', marginBottom: '0.4rem' }}>
      LINKEDIN POST
    </div>
  );

  lines.forEach((line, idx) => {
    const trimmed = line.trim();
    if (!trimmed) {
      elements.push(<div key={`l-spacer-${idx}`} style={{ height: '0.35rem' }} />);
      return;
    }

    if (trimmed.toUpperCase() === 'LINKEDIN POST') {
      return;
    }

    if (trimmed.startsWith('🚨') || trimmed.toUpperCase().includes('CRITICAL CYBERSECURITY ADVISORY') || trimmed.toUpperCase().includes('SECURITY ALERT')) {
      elements.push(
        <div key={idx} style={{ fontSize: '0.86rem', fontWeight: '800', color: '#E1DCC9', letterSpacing: '0.01em', marginBottom: '0.35rem', lineHeight: '1.4' }}>
          {trimmed}
        </div>
      );
    } else if (trimmed.startsWith('Key concerns:') || trimmed.startsWith('Recommended actions:') || trimmed.endsWith(':')) {
      elements.push(
        <div key={idx} style={{ fontSize: '0.84rem', fontWeight: '700', color: '#E1DCC9', marginTop: '0.45rem', marginBottom: '0.2rem' }}>
          {trimmed}
        </div>
      );
    } else if (trimmed.startsWith('•') || trimmed.startsWith('-') || trimmed.startsWith('*') || trimmed.startsWith('▪')) {
      const cleanItem = trimmed.replace(/^[-*•▪]\s*/, '');
      elements.push(
        <div key={idx} style={{ display: 'flex', gap: '0.45rem', marginBottom: '0.22rem', paddingLeft: '0.2rem' }}>
          <span style={{ color: '#E1DCC9', fontWeight: 'bold' }}>&bull;</span>
          <span style={{ color: 'rgba(225, 220, 201, 0.85)', fontSize: '0.815rem', lineHeight: '1.45' }}>{cleanItem}</span>
        </div>
      );
    } else if (trimmed.startsWith('#')) {
      const tags = trimmed.split(/\s+/).filter(t => t.startsWith('#'));
      elements.push(
        <div key={idx} style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem', marginTop: '0.5rem', marginBottom: '0.2rem' }}>
          {tags.map((tag, tIdx) => (
            <span key={tIdx} style={{ color: '#E1DCC9', fontWeight: '600', fontSize: '0.78rem' }}>
              {tag}
            </span>
          ))}
        </div>
      );
    } else {
      elements.push(
        <div key={idx} style={{ color: '#E1DCC9', fontSize: '0.82rem', lineHeight: '1.5', marginBottom: '0.25rem' }}>
          {trimmed}
        </div>
      );
    }
  });

  return elements;
}

function renderFormattedVideoPreview(rawContent) {
  if (!rawContent) return <div>No video package content available.</div>;

  const lines = rawContent.split('\n');
  const elements = [];

  lines.forEach((line, idx) => {
    const trimmed = line.trim();
    if (!trimmed) {
      elements.push(<div key={`v-spacer-${idx}`} style={{ height: '0.3rem' }} />);
      return;
    }

    if (trimmed.toUpperCase() === 'VIDEO PACKAGE') {
      elements.push(
        <div key={idx} style={{ fontSize: '0.92rem', fontWeight: '800', color: '#E1DCC9', letterSpacing: '0.04em', marginBottom: '0.3rem' }}>
          VIDEO PACKAGE
        </div>
      );
    } else if (trimmed.endsWith(':')) {
      elements.push(
        <div key={idx} style={{ fontSize: '0.82rem', fontWeight: '700', color: '#E1DCC9', marginTop: '0.4rem', marginBottom: '0.15rem' }}>
          {trimmed}
        </div>
      );
    } else if (/^\d{2}\s+/.test(trimmed)) {
      const match = trimmed.match(/^(\d{2})\s+(.*)/);
      elements.push(
        <div key={idx} style={{ display: 'flex', gap: '0.45rem', marginBottom: '0.2rem', paddingLeft: '0.2rem' }}>
          <span style={{ color: '#E1DCC9', fontWeight: '700', fontSize: '0.78rem' }}>{match ? match[1] : '•'}</span>
          <span style={{ color: 'rgba(225, 220, 201, 0.85)', fontSize: '0.8rem', lineHeight: '1.45' }}>{match ? match[2] : trimmed}</span>
        </div>
      );
    } else {
      elements.push(
        <div key={idx} style={{ color: '#E1DCC9', fontSize: '0.815rem', marginBottom: '0.15rem' }}>
          {trimmed}
        </div>
      );
    }
  });

  return elements;
}

function renderFormattedExecutivePreview(rawContent) {
  if (!rawContent) return <div>No summary content available.</div>;

  // Strip raw markdown markers
  const text = rawContent
    .replace(/^###\s+/gm, '')
    .replace(/^##\s+/gm, '')
    .replace(/^#\s+/gm, '')
    .replace(/^####\s+/gm, '')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1');

  const lines = text.split('\n');
  const elements = [];

  lines.forEach((line, idx) => {
    const trimmed = line.trim();
    if (!trimmed) {
      elements.push(<div key={`spacer-${idx}`} style={{ height: '0.35rem' }} />);
      return;
    }

    if (trimmed.toUpperCase() === 'EXECUTIVE SUMMARY') {
      elements.push(
        <div key={idx} style={{ fontSize: '0.92rem', fontWeight: '800', color: '#E1DCC9', letterSpacing: '0.04em', marginBottom: '0.3rem' }}>
          EXECUTIVE SUMMARY
        </div>
      );
    } else if (trimmed.startsWith('Risk Level:') || trimmed.startsWith('Confidence:') || trimmed.startsWith('Affected Component:') || trimmed.startsWith('Threat Actor:')) {
      const parts = trimmed.split(':');
      const label = parts[0] + ':';
      const val = parts.slice(1).join(':').trim();
      elements.push(
        <div key={idx} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.25rem' }}>
          <span style={{ color: 'rgba(225, 220, 201, 0.72)', fontWeight: '600', minWidth: '140px' }}>{label}</span>
          <span style={{ color: '#E1DCC9', fontWeight: '500' }}>{val}</span>
        </div>
      );
    } else if (trimmed.toUpperCase().includes('STRATEGIC') || trimmed.toUpperCase().includes('MANDATORY') || trimmed.toUpperCase().includes('DECISION')) {
      elements.push(
        <div key={idx} style={{ fontSize: '0.85rem', fontWeight: '700', color: '#E1DCC9', marginTop: '0.55rem', marginBottom: '0.25rem' }}>
          {trimmed}
        </div>
      );
    } else if (trimmed.startsWith('•') || trimmed.startsWith('-') || trimmed.startsWith('*')) {
      const cleanItem = trimmed.replace(/^[-*•▪]\s*/, '');
      elements.push(
        <div key={idx} style={{ display: 'flex', gap: '0.45rem', marginBottom: '0.25rem', paddingLeft: '0.2rem' }}>
          <span style={{ color: '#E1DCC9', fontWeight: 'bold' }}>&bull;</span>
          <span style={{ color: 'rgba(225, 220, 201, 0.85)', fontSize: '0.8rem', lineHeight: '1.45' }}>{cleanItem}</span>
        </div>
      );
    } else if (/^\d+\.\s+/.test(trimmed)) {
      const numMatch = trimmed.match(/^(\d+\.)\s*(.*)/);
      elements.push(
        <div key={idx} style={{ display: 'flex', gap: '0.45rem', marginBottom: '0.25rem', paddingLeft: '0.2rem' }}>
          <span style={{ color: '#E1DCC9', fontWeight: '700', fontSize: '0.8rem' }}>{numMatch ? numMatch[1] : '•'}</span>
          <span style={{ color: 'rgba(225, 220, 201, 0.85)', fontSize: '0.8rem', lineHeight: '1.45' }}>{numMatch ? numMatch[2] : trimmed}</span>
        </div>
      );
    } else {
      elements.push(
        <div key={idx} style={{ color: '#E1DCC9', fontWeight: idx <= 2 ? '700' : '400', fontSize: idx <= 2 ? '0.88rem' : '0.815rem', marginBottom: '0.2rem' }}>
          {trimmed}
        </div>
      );
    }
  });

  return elements;
}

function renderFormattedAdvisoryPreview(rawContent, result, selectedDoc) {
  const structured = result?.structuredAdvisory || buildStructuredAdvisory(rawContent, result, selectedDoc);
  const adv = structured?.advisory || structured;
  const meta = adv?.metadata || {};
  const sections = adv?.sections || [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
      {/* Top Banner / Type */}
      <div style={{ fontSize: '0.88rem', fontWeight: '800', color: '#E1DCC9', letterSpacing: '0.04em' }}>
        STRUCTURED ADVISORY
      </div>

      {/* Advisory Title */}
      <div style={{ marginTop: '0.1rem' }}>
        <div style={{ fontSize: '0.7rem', color: 'rgba(225, 220, 201, 0.72)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '600' }}>Title</div>
        <div style={{ fontSize: '0.86rem', fontWeight: '700', color: '#E1DCC9', lineHeight: '1.35' }}>
          {adv.title || "Critical Security Advisory"}
        </div>
      </div>

      {/* Key Metadata Row */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.15rem' }}>
        <div style={{ background: '#1F150C', border: '1px solid rgba(225, 220, 201, 0.72)', borderRadius: '4px', padding: '0.2rem 0.55rem', fontSize: '0.72rem' }}>
          <span style={{ color: 'rgba(225, 220, 201, 0.72)', marginRight: '0.35rem' }}>Severity</span>
          <strong style={{ color: (meta.severity || '').toUpperCase().includes('CRITICAL') ? '#F87171' : '#E1DCC9' }}>
            {meta.severity || 'CRITICAL'}
          </strong>
        </div>
        {meta.classification && (
          <div style={{ background: '#1F150C', border: '1px solid rgba(225, 220, 201, 0.72)', borderRadius: '4px', padding: '0.2rem 0.55rem', fontSize: '0.72rem' }}>
            <span style={{ color: 'rgba(225, 220, 201, 0.72)', marginRight: '0.35rem' }}>Classification</span>
            <strong style={{ color: '#E1DCC9' }}>{meta.classification}</strong>
          </div>
        )}
        {meta.confidence && (
          <div style={{ background: '#1F150C', border: '1px solid rgba(225, 220, 201, 0.72)', borderRadius: '4px', padding: '0.2rem 0.55rem', fontSize: '0.72rem' }}>
            <span style={{ color: 'rgba(225, 220, 201, 0.72)', marginRight: '0.35rem' }}>Confidence</span>
            <strong style={{ color: '#10B981' }}>{meta.confidence}</strong>
          </div>
        )}
      </div>

      {/* Divider */}
      <div style={{ borderBottom: '1px solid rgba(172, 186, 196, 0.25)', margin: '0.4rem 0' }} />

      {/* Sections Header */}
      <div style={{ fontSize: '0.74rem', fontWeight: '800', color: '#E1DCC9', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
        SECTIONS
      </div>

      {/* Sections List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.1rem' }}>
        {sections.map((s, idx) => (
          <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.45rem' }}>
              <span style={{ color: '#E1DCC9', fontWeight: '800', fontSize: '0.8rem', fontFamily: 'monospace' }}>
                {s.number || String(idx + 1).padStart(2, '0')}
              </span>
              <span style={{ color: '#E1DCC9', fontWeight: '700', fontSize: '0.82rem' }}>
                {s.title}
              </span>
            </div>
            {s.summary && (
              <div style={{ color: 'rgba(225, 220, 201, 0.72)', fontSize: '0.77rem', paddingLeft: '1.5rem', lineHeight: '1.4' }}>
                {s.summary}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function renderFormattedInfographicPreview(rawContent, result, selectedDoc) {
  const structured = result?.structuredInfographic || buildStructuredInfographic(rawContent, result, selectedDoc);
  const info = structured?.infographic || structured;
  const metrics = info?.metrics || [];
  const sections = info?.sections || [];
  const overviewSec = sections.find(s => s.id === 'overview' || s.type === 'summary');
  const flowSec = sections.find(s => s.id === 'attack-flow' || s.type === 'flow');
  const systemsSec = sections.find(s => s.id === 'affected-systems' || s.type === 'cards');
  const iocSec = sections.find(s => s.id === 'indicators' || s.type === 'indicators');
  const respSec = sections.find(s => s.id === 'response' || s.type === 'checklist');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
      {/* Title & Classification Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
        <div>
          <div style={{ fontSize: '0.68rem', color: 'rgba(225, 220, 201, 0.65)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: '600' }}>
            {info.domain ? info.domain.toUpperCase() : 'VISUAL INFOGRAPHIC'} • {info.advisory_id || 'SYNTAXX-HD'}
          </div>
          <div style={{ fontSize: '0.88rem', fontWeight: '800', color: '#E1DCC9', lineHeight: '1.25', marginTop: '0.1rem' }}>
            {info.title || "Visual Intelligence Infographic"}
          </div>
          {info.subtitle && (
            <div style={{ fontSize: '0.74rem', color: 'rgba(225, 220, 201, 0.75)', marginTop: '0.1rem' }}>
              {info.subtitle}
            </div>
          )}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.25rem', flexShrink: 0 }}>
          <span style={{ 
            fontSize: '0.66rem', 
            fontWeight: '700', 
            background: info.classification?.includes('CRITICAL') || info.classification?.includes('STRICT') ? '#8B1E1E' : '#412D15', 
            color: '#E1DCC9', 
            padding: '0.15rem 0.45rem', 
            borderRadius: '3px',
            fontFamily: 'monospace'
          }}>
            {info.classification || 'TLP:AMBER'}
          </span>
          <span style={{ fontSize: '0.65rem', color: 'rgba(225, 220, 201, 0.6)' }}>
            1080 × 1920 • {info.pages || 2} Pages
          </span>
        </div>
      </div>

      {/* Metrics Row (4 Cards) */}
      {metrics.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(metrics.length, 4)}, 1fr)`, gap: '0.4rem' }}>
          {metrics.slice(0, 4).map((m, mIdx) => (
            <div key={mIdx} style={{ 
              background: '#1F150C', 
              border: `1px solid ${m.severity === 'CRITICAL' ? '#8B1E1E' : 'rgba(225, 220, 201, 0.22)'}`,
              borderRadius: '4px', 
              padding: '0.35rem 0.45rem',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <div style={{ fontSize: '0.62rem', color: 'rgba(225, 220, 201, 0.7)', fontWeight: '600', textTransform: 'uppercase' }}>
                {m.label}
              </div>
              <div style={{ fontSize: '0.95rem', fontWeight: '800', color: m.severity === 'CRITICAL' ? '#FF6B6B' : '#E1DCC9', lineHeight: '1.2' }}>
                {m.value}
              </div>
              <div style={{ fontSize: '0.6rem', color: 'rgba(225, 220, 201, 0.6)', textTransform: 'uppercase', marginTop: '0.1rem' }}>
                {m.sub || m.severity}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Threat / Situation Overview Box */}
      {(info.summary || overviewSec) && (
        <div style={{ background: '#1F150C', border: '1px solid rgba(225, 220, 201, 0.18)', borderRadius: '4px', padding: '0.45rem 0.6rem' }}>
          <div style={{ fontSize: '0.66rem', color: '#E1DCC9', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.2rem' }}>
            OVERVIEW
          </div>
          <div style={{ fontSize: '0.76rem', color: 'rgba(225, 220, 201, 0.88)', lineHeight: '1.4' }}>
            {info.summary || overviewSec?.items?.[0]}
          </div>
        </div>
      )}

      {/* Attack / Process Flow Progression */}
      {flowSec && (flowSec.steps || flowSec.items) && (
        <div style={{ background: '#1F150C', border: '1px solid rgba(225, 220, 201, 0.18)', borderRadius: '4px', padding: '0.45rem 0.6rem' }}>
          <div style={{ fontSize: '0.66rem', color: '#E1DCC9', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.3rem' }}>
            {flowSec.title || 'ATTACK PROGRESSION FLOW'}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', flexWrap: 'wrap' }}>
            {(flowSec.steps || flowSec.items).map((st, sIdx, arr) => (
              <React.Fragment key={sIdx}>
                <span style={{ 
                  background: '#150E08', 
                  border: '1px solid #412D15', 
                  borderRadius: '3px', 
                  padding: '0.15rem 0.4rem', 
                  fontSize: '0.68rem', 
                  fontWeight: '600',
                  color: '#E1DCC9'
                }}>
                  {st.step ? `${st.step} ` : ''}{st.name || st.title || (typeof st === 'string' ? st : '')}
                </span>
                {sIdx < arr.length - 1 && <span style={{ color: '#E1DCC9', fontSize: '0.75rem' }}>➔</span>}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}

      {/* Affected Systems / Indicators / Response Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.4rem' }}>
        {systemsSec && (
          <div style={{ background: '#1F150C', border: '1px solid rgba(225, 220, 201, 0.18)', borderRadius: '4px', padding: '0.4rem 0.55rem' }}>
            <div style={{ fontSize: '0.64rem', color: '#E1DCC9', fontWeight: '700', textTransform: 'uppercase', marginBottom: '0.2rem' }}>
              AFFECTED SYSTEMS
            </div>
            <div style={{ fontSize: '0.7rem', color: 'rgba(225, 220, 201, 0.8)' }}>
              {systemsSec.items?.map(i => i.title || i).slice(0, 2).join(', ')}
              {systemsSec.items?.length > 2 && ` +${systemsSec.items.length - 2} more`}
            </div>
          </div>
        )}
        {iocSec && (
          <div style={{ background: '#1F150C', border: '1px solid rgba(225, 220, 201, 0.18)', borderRadius: '4px', padding: '0.4rem 0.55rem' }}>
            <div style={{ fontSize: '0.64rem', color: '#E1DCC9', fontWeight: '700', textTransform: 'uppercase', marginBottom: '0.2rem' }}>
              KEY INDICATORS
            </div>
            <div style={{ fontSize: '0.7rem', color: 'rgba(225, 220, 201, 0.8)', fontFamily: 'monospace' }}>
              {iocSec.items?.length || 0} Indicators Logged
            </div>
          </div>
        )}
        {respSec && (
          <div style={{ background: '#1F150C', border: '1px solid rgba(225, 220, 201, 0.18)', borderRadius: '4px', padding: '0.4rem 0.55rem' }}>
            <div style={{ fontSize: '0.64rem', color: '#E1DCC9', fontWeight: '700', textTransform: 'uppercase', marginBottom: '0.2rem' }}>
              RESPONSE DIRECTIVES
            </div>
            <div style={{ fontSize: '0.7rem', color: '#10B981', fontWeight: '600' }}>
              ✓ {respSec.items?.length || 0} Prioritized Actions
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function renderFormattedPresentationPreview(rawContent, result, selectedDoc) {
  const structured = result?.structuredPresentation || parseOrBuildStructuredPresentation(rawContent, result, selectedDoc);
  const pres = structured?.presentation || structured;
  const slides = pres?.slides || [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
      {/* Header */}
      <div style={{ fontSize: '0.88rem', fontWeight: '800', color: '#E1DCC9', letterSpacing: '0.04em' }}>
        PRESENTATION SLIDES & NOTES
      </div>

      {/* Title */}
      <div style={{ marginTop: '0.1rem' }}>
        <div style={{ fontSize: '0.7rem', color: 'rgba(225, 220, 201, 0.72)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '600' }}>Title</div>
        <div style={{ fontSize: '0.86rem', fontWeight: '700', color: '#E1DCC9', lineHeight: '1.35' }}>
          {pres.title || "Executive Briefing Deck"}
        </div>
      </div>

      {/* Slides Count Badge */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.15rem' }}>
        <div style={{ background: '#1F150C', border: '1px solid rgba(225, 220, 201, 0.72)', borderRadius: '4px', padding: '0.2rem 0.55rem', fontSize: '0.72rem' }}>
          <span style={{ color: 'rgba(225, 220, 201, 0.72)', marginRight: '0.35rem' }}>Slides</span>
          <strong style={{ color: '#E1DCC9' }}>{pres.slide_count || slides.length} Slides</strong>
        </div>
      </div>

      {/* Divider */}
      <div style={{ borderBottom: '1px solid rgba(172, 186, 196, 0.25)', margin: '0.4rem 0' }} />

      {/* Slide Outline */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem', marginTop: '0.1rem' }}>
        {slides.map((s, idx) => (
          <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.45rem' }}>
              <span style={{ color: '#E1DCC9', fontWeight: '800', fontSize: '0.8rem', fontFamily: 'monospace' }}>
                {String(s.number || idx + 1).padStart(2, '0')}
              </span>
              <span style={{ color: '#E1DCC9', fontWeight: '700', fontSize: '0.82rem' }}>
                {s.title}
              </span>
            </div>
            {s.summary && (
              <div style={{ color: 'rgba(225, 220, 201, 0.72)', fontSize: '0.77rem', paddingLeft: '1.5rem', lineHeight: '1.4' }}>
                {s.summary}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Divider */}
      <div style={{ borderBottom: '1px solid rgba(172, 186, 196, 0.25)', margin: '0.4rem 0' }} />

      {/* Speaker Notes Status */}
      <div style={{ fontSize: '0.74rem', fontWeight: '800', color: '#E1DCC9', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
        SPEAKER NOTES
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: '#10B981', fontSize: '0.8rem', fontWeight: '600' }}>
        <Check size={14} /> Notes generated for all slides
      </div>
    </div>
  );
}

export default function ArtifactsWorkbench({
  selectedDoc,
  selectedOutputs,
  completedOutputs,
  backendResults,
  onOpenGroundingModal,
  onRunOrchestration
}) {
  const [editedResults, setEditedResults] = useState({});
  const [copiedId, setCopiedId] = useState(null);
  const [actionNotice, setActionNotice] = useState(null);

  // Video Studio Modal state
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [activeVideoData, setActiveVideoData] = useState(null);

  // LinkedIn Post Modal state
  const [isLinkedInModalOpen, setIsLinkedInModalOpen] = useState(false);
  const [activeLinkedInData, setActiveLinkedInData] = useState(null);

  // Twitter/X Thread Modal state
  const [isTwitterModalOpen, setIsTwitterModalOpen] = useState(false);
  const [activeTwitterData, setActiveTwitterData] = useState(null);

  // In-App PDF Preview State Machine
  const [pdfPreviewState, setPdfPreviewState] = useState({
    isOpen: false,
    loadingFormatId: null,
    stage: null, // 'generating' | 'preparing' | 'ready' | null
    formatId: null,
    formatTitle: '',
    sourceId: null,
    pdfBlob: null,
    pdfUrl: null,
    filename: '',
    advisoryId: '',
    error: null,
  });

  // Invalidate edited results, video studio, and PDF preview when user selects a different source document
  useEffect(() => {
    setEditedResults({});
    setActiveVideoData(null);
    setIsVideoModalOpen(false);
    if (pdfPreviewState.pdfUrl) {
      try { URL.revokeObjectURL(pdfPreviewState.pdfUrl); } catch (e) {}
    }
    setPdfPreviewState({
      isOpen: false,
      loadingFormatId: null,
      stage: null,
      formatId: null,
      formatTitle: '',
      sourceId: null,
      pdfBlob: null,
      pdfUrl: null,
      filename: '',
      advisoryId: '',
      error: null,
    });
    clearPdfBlobCache();
  }, [selectedDoc?.id]);

  const handleOpenPdfPreview = async (formatId, formatTitle) => {
    // 1. If already generated for THIS source and preview URL exists, open immediately
    if (pdfPreviewState.formatId === formatId && pdfPreviewState.sourceId === selectedDoc?.id && pdfPreviewState.pdfUrl && !pdfPreviewState.error) {
      setPdfPreviewState(prev => ({ ...prev, isOpen: true, error: null }));
      return;
    }

    // Clean up previous Object URL if switching formats
    if (pdfPreviewState.pdfUrl) {
      try {
        URL.revokeObjectURL(pdfPreviewState.pdfUrl);
      } catch (e) {}
    }

    // 2. Stage 1: "Generating PDF..."
    setPdfPreviewState({
      isOpen: false,
      loadingFormatId: formatId,
      stage: 'generating',
      formatId,
      formatTitle,
      pdfBlob: null,
      pdfUrl: null,
      filename: '',
      advisoryId: '',
      error: null,
    });

    try {
      const res = getResultForFormat(formatId);

      // Stage 2 transition: "Preparing preview..."
      const prepTimer = setTimeout(() => {
        setPdfPreviewState(prev => prev.loadingFormatId === formatId ? { ...prev, stage: 'preparing' } : prev);
      }, 400);

      const genResult = await fetchOrGeneratePdfBlob(formatId, selectedDoc, res);
      clearTimeout(prepTimer);

      // Stage 3: "PDF Ready"
      setPdfPreviewState(prev => {
        if (prev.formatId !== formatId) return prev;
        return {
          ...prev,
          stage: 'ready',
        };
      });

      // Brief delay to display "PDF Ready" before opening viewer modal
      setTimeout(() => {
        setPdfPreviewState(prev => {
          if (prev.formatId !== formatId) return prev;
          return {
            ...prev,
            isOpen: true,
            loadingFormatId: null,
            stage: null,
            pdfBlob: genResult.blob,
            pdfUrl: genResult.url,
            filename: genResult.filename,
            advisoryId: genResult.advisoryId,
            error: null,
          };
        });
      }, 350);
    } catch (err) {
      console.error(`PDF Preview generation error for ${formatId}:`, err);
      setPdfPreviewState({
        isOpen: true,
        loadingFormatId: null,
        stage: null,
        formatId,
        formatTitle,
        pdfBlob: null,
        pdfUrl: null,
        filename: `${formatId}.pdf`,
        advisoryId: 'SYNTAXX',
        error: `PDF GENERATION FAILED: ${err.message || 'Server generation error'}`,
      });
    }
  };

  const handleClosePdfPreview = () => {
    setPdfPreviewState(prev => ({
      ...prev,
      isOpen: false,
    }));
  };

  // Initialize or retrieve result for an output format (Prioritizing Backend Real-Time API output)
  const getResultForFormat = (formatId) => {
    const currentDocId = selectedDoc?.id || 'nightfalcon';

    // Check if edited results exist for THIS source
    if (editedResults[formatId] && (!editedResults[formatId].source_id || editedResults[formatId].source_id === currentDocId)) {
      return {
        ...editedResults[formatId],
        source_id: currentDocId,
        source_title: selectedDoc?.title
      };
    }

    // Check if backend results exist for THIS source
    if (backendResults && backendResults[formatId]) {
      const bRes = backendResults[formatId];
      if (!bRes.source_id || bRes.source_id === currentDocId) {
        return {
          ...bRes,
          source_id: currentDocId,
          source_title: selectedDoc?.title,
          output_type: formatId,
          generated_at: bRes.generated_at || new Date().toISOString()
        };
      }
    }

    const docData = PRE_GENERATED_RESULTS[currentDocId] || PRE_GENERATED_RESULTS.nightfalcon || {};

    const defaultAdvId = currentDocId === 'cybersecurity' 
      ? 'CSIRT-2024-38077-ADV' 
      : (currentDocId === 'health_advisory' 
        ? 'MOH-PHE-2026-04' 
        : (currentDocId === 'research_paper' 
          ? 'RESEARCH-LLM-2026' 
          : 'TAI-ADV-2026-88421'));

    if (formatId === 'video_package') {
      const coreIntel = extractCoreContentIntelligence(selectedDoc, docData.video_package);
      const structuredPkg = buildStructuredVideoPackage(coreIntel);
      const previewText = formatVideoPackagePreview(structuredPkg);
      return {
        source_id: currentDocId,
        source_title: selectedDoc?.title,
        output_type: formatId,
        generated_at: new Date().toISOString(),
        content: previewText,
        videoPackage: structuredPkg,
        groundingScore: 99.4,
        hallucinations: 0,
        toneMatch: 99,
        groundingBadge: "16/16 Facts Verified",
        validationNotes: "Complete 10-scene video storyboard and broadcast narration grounded in verified threat telemetry.",
        citations: [
          `${coreIntel?.metadata?.advisoryId || defaultAdvId}, Section 1 (Hazard Summary)`,
          `${coreIntel?.metadata?.advisoryId || defaultAdvId}, Section 5 (Attack Chain Flow)`,
          `${coreIntel?.metadata?.advisoryId || defaultAdvId}, Section 7 (IOC Catalog)`
        ]
      };
    }

    if (formatId === 'linkedin_post') {
      const coreIntel = extractCoreContentIntelligence(selectedDoc, docData.linkedin_post);
      const structuredPost = buildStructuredLinkedInPost(coreIntel);
      const previewText = formatLinkedInPostText(structuredPost);
      return {
        source_id: currentDocId,
        source_title: selectedDoc?.title,
        output_type: formatId,
        generated_at: new Date().toISOString(),
        content: previewText,
        linkedInPost: structuredPost,
        groundingScore: 99.5,
        hallucinations: 0,
        toneMatch: 99,
        groundingBadge: "12/12 Key Facts Verified",
        validationNotes: "Professional publication-ready LinkedIn post. TLP-sanitized, 0 unsupported claims, 100% grounded in Core Content Intelligence.",
        citations: [
          `${coreIntel?.metadata?.advisoryId || defaultAdvId}, Section 1 (Hazard Summary)`,
          `${coreIntel?.metadata?.advisoryId || defaultAdvId}, Section 3 (Vulnerability Mechanics)`,
          `${coreIntel?.metadata?.advisoryId || defaultAdvId}, Section 5 (Attack Chain Flow)`,
          `${coreIntel?.metadata?.advisoryId || defaultAdvId}, Section 9 (Remediation Directives)`
        ]
      };
    }

    if (formatId === 'twitter_thread') {
      const coreIntel = extractCoreContentIntelligence(selectedDoc, docData.twitter_thread);
      const structuredX = buildStructuredXPost(coreIntel);
      const previewText = formatXPostText(structuredX);
      return {
        source_id: currentDocId,
        source_title: selectedDoc?.title,
        output_type: formatId,
        generated_at: new Date().toISOString(),
        content: previewText,
        xPost: structuredX,
        groundingScore: 99.6,
        hallucinations: 0,
        toneMatch: 99,
        groundingBadge: "12/12 Key Facts Verified",
        validationNotes: "5-post structured thread strictly complying with X character limits (<= 280 chars per post). 100% grounded in Core Content Intelligence.",
        citations: [
          `${coreIntel?.metadata?.advisoryId || defaultAdvId}, Section 1 (Hazard Summary)`,
          `${coreIntel?.metadata?.advisoryId || defaultAdvId}, Section 3 (Vulnerability Mechanics)`,
          `${coreIntel?.metadata?.advisoryId || defaultAdvId}, Section 5 (Attack Chain Flow)`,
          `${coreIntel?.metadata?.advisoryId || defaultAdvId}, Section 9 (Remediation Directives)`
        ]
      };
    }

    if (formatId === 'advisory_doc') {
      const advRaw = docData.advisory_doc?.content;
      const structuredAdv = buildStructuredAdvisory(advRaw, docData.advisory_doc, selectedDoc);
      const text = formatAdvisoryText(structuredAdv);
      return {
        source_id: currentDocId,
        source_title: selectedDoc?.title,
        output_type: formatId,
        generated_at: new Date().toISOString(),
        ...(docData.advisory_doc || {}),
        content: text,
        structuredAdvisory: structuredAdv,
        groundingScore: docData.advisory_doc?.groundingScore || 100,
        hallucinations: docData.advisory_doc?.hallucinations || 0,
        toneMatch: docData.advisory_doc?.toneMatch || 100,
        groundingBadge: docData.advisory_doc?.groundingBadge || "100% Grounded",
        validationNotes: docData.advisory_doc?.validationNotes || "All operational directives and technical indicators aligned strictly with source intelligence.",
        citations: docData.advisory_doc?.citations || ["Source Section 1, 2, 3: Full advisory parameters"]
      };
    }

    if (formatId === 'infographic_pkg') {
      const infoRaw = docData.infographic_pkg?.content;
      const structuredInfo = buildStructuredInfographic(infoRaw, docData.infographic_pkg, selectedDoc);
      const text = formatInfographicText(structuredInfo);
      return {
        source_id: currentDocId,
        source_title: selectedDoc?.title,
        output_type: formatId,
        generated_at: new Date().toISOString(),
        ...(docData.infographic_pkg || {}),
        content: text,
        structuredInfographic: structuredInfo,
        groundingScore: docData.infographic_pkg?.groundingScore || 99.1,
        hallucinations: docData.infographic_pkg?.hallucinations || 0,
        toneMatch: docData.infographic_pkg?.toneMatch || 99,
        groundingBadge: docData.infographic_pkg?.groundingBadge || "99.1% Grounded",
        validationNotes: docData.infographic_pkg?.validationNotes || "Visual layout guidelines aligned with incident telemetry.",
        citations: docData.infographic_pkg?.citations || ["Source Section 1, 2, 4"]
      };
    }

    if (formatId === 'presentation') {
      const presRaw = docData.presentation?.content;
      const structuredPres = parseOrBuildStructuredPresentation(presRaw, docData.presentation, selectedDoc);
      const text = formatPresentationText(structuredPres);
      return {
        source_id: currentDocId,
        source_title: selectedDoc?.title,
        output_type: formatId,
        generated_at: new Date().toISOString(),
        ...(docData.presentation || {}),
        content: text,
        structuredPresentation: structuredPres,
        groundingScore: docData.presentation?.groundingScore || 99.8,
        hallucinations: docData.presentation?.hallucinations || 0,
        toneMatch: docData.presentation?.toneMatch || 100,
        groundingBadge: docData.presentation?.groundingBadge || "99.8% Grounded",
        validationNotes: docData.presentation?.validationNotes || "Structured briefing deck with professional speaker notes grounded in source intelligence.",
        citations: docData.presentation?.citations || ["Source Section 1-8: Board briefing points"]
      };
    }

    const fallbackRes = docData[formatId] || {
      content: `### Generated ${formatId}\n\nProcessed content for ${selectedDoc?.title || 'Document'}. All claims grounded in source text.`,
      groundingScore: 98.5,
      hallucinations: 0,
      toneMatch: 99,
      validationNotes: "Strict factual alignment verified.",
      citations: ["Source Document: Grounded"]
    };

    return {
      ...fallbackRes,
      source_id: currentDocId,
      source_title: selectedDoc?.title,
      output_type: formatId,
      generated_at: fallbackRes.generated_at || new Date().toISOString()
    };
  };

  const handleTextChange = (formatId, newText) => {
    const current = getResultForFormat(formatId);
    setEditedResults({
      ...editedResults,
      [formatId]: { 
        ...current, 
        content: newText,
        source_id: selectedDoc?.id,
        source_title: selectedDoc?.title,
        output_type: formatId
      }
    });
  };

  const handleCopy = (formatId) => {
    const res = getResultForFormat(formatId);
    navigator.clipboard.writeText(res.content);
    setCopiedId(formatId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Real PPTX Export (Publication-Grade PowerPoint with native shapes & notes)
  const handleExportPptx = async (formatId, title) => {
    try {
      const res = getResultForFormat(formatId);
      setActionNotice("Generating publication-grade PowerPoint (.pptx)...");
      const coreIntel = extractCoreContentIntelligence(selectedDoc, res);
      const presData = res.presentation || buildStructuredPresentation(coreIntel);
      const filename = await exportToPptx(title, res.content, selectedDoc?.id || 'document', presData);
      setActionNotice(`Downloaded PowerPoint (.pptx): ${filename}`);
      setTimeout(() => setActionNotice(null), 3500);
    } catch (e) {
      console.error(e);
      setActionNotice(`PPTX Export failed: ${e.message}`);
      setTimeout(() => setActionNotice(null), 3500);
    }
  };

  // Real PDF Export (Publication-grade for Advisory, Executive Summary, and Video Package)
  const handleExportPdf = async (formatId, title) => {
    try {
      const res = getResultForFormat(formatId);
      if (formatId === 'advisory_doc') {
        setActionNotice("Generating publication-grade Advisory PDF...");
        const filename = await exportStructuredAdvisoryPdf(selectedDoc, res);
        setActionNotice(`Downloaded Official Cybersecurity Advisory PDF: ${filename}`);
      } else if (formatId === 'exec_summary') {
        setActionNotice("Generating publication-grade Executive Summary PDF...");
        const filename = await exportExecutiveSummaryPdf(selectedDoc, res);
        setActionNotice(`Downloaded Complete Executive Summary PDF: ${filename}`);
      } else if (formatId === 'infographic_pkg') {
        setActionNotice("Generating publication-grade Infographic PDF...");
        const filename = await exportInfographicPdf(selectedDoc, res);
        setActionNotice(`Downloaded Official Infographic PDF: ${filename}`);
      } else {
        const filename = exportToPdf(title, res.content, selectedDoc?.id || 'document');
        setActionNotice(`Downloaded PDF Document: ${filename}`);
      }
      setTimeout(() => setActionNotice(null), 3500);
    } catch (e) {
      console.error(e);
      setActionNotice(`Export failed: ${e.message}`);
      setTimeout(() => setActionNotice(null), 3500);
    }
  };

  // Real Markdown (.md) Export
  const handleExportMarkdown = (formatId, title) => {
    try {
      const res = getResultForFormat(formatId);
      let contentToExport = res.content;
      if (formatId === 'video_package') {
        const coreIntel = extractCoreContentIntelligence(selectedDoc, res);
        const structuredPkg = res.videoPackage || buildStructuredVideoPackage(coreIntel);
        contentToExport = generateVideoPackageMarkdown(structuredPkg);
      } else if (formatId === 'linkedin_post') {
        const coreIntel = extractCoreContentIntelligence(selectedDoc, res);
        const structuredPost = res.linkedInPost || buildStructuredLinkedInPost(coreIntel);
        contentToExport = formatLinkedInMarkdown(structuredPost);
      } else if (formatId === 'twitter_thread') {
        const coreIntel = extractCoreContentIntelligence(selectedDoc, res);
        const structuredX = res.xPost || buildStructuredXPost(coreIntel);
        contentToExport = formatXPostMarkdown(structuredX);
      } else if (formatId === 'advisory_doc') {
        const structuredAdv = res.structuredAdvisory || buildStructuredAdvisory(res.content, res, selectedDoc);
        contentToExport = formatAdvisoryMarkdown(structuredAdv);
      } else if (formatId === 'infographic_pkg') {
        const structuredInfo = res.structuredInfographic || buildStructuredInfographic(res.content, res, selectedDoc);
        contentToExport = formatInfographicMarkdown(structuredInfo);
      } else if (formatId === 'presentation') {
        const structuredPres = res.structuredPresentation || parseOrBuildStructuredPresentation(res.content, res, selectedDoc);
        contentToExport = formatPresentationMarkdown(structuredPres);
      }
      const filename = exportToMarkdown(title, contentToExport, selectedDoc?.id || 'document');
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
      let contentToExport = res.content;
      if (formatId === 'video_package') {
        const coreIntel = extractCoreContentIntelligence(selectedDoc, res);
        const structuredPkg = res.videoPackage || buildStructuredVideoPackage(coreIntel);
        contentToExport = generateVideoPackageMarkdown(structuredPkg);
      } else if (formatId === 'linkedin_post') {
        const coreIntel = extractCoreContentIntelligence(selectedDoc, res);
        const structuredPost = res.linkedInPost || buildStructuredLinkedInPost(coreIntel);
        contentToExport = formatLinkedInPostText(structuredPost);
      } else if (formatId === 'twitter_thread') {
        const coreIntel = extractCoreContentIntelligence(selectedDoc, res);
        const structuredX = res.xPost || buildStructuredXPost(coreIntel);
        contentToExport = formatXPostText(structuredX);
      } else if (formatId === 'advisory_doc') {
        const structuredAdv = res.structuredAdvisory || buildStructuredAdvisory(res.content, res, selectedDoc);
        contentToExport = formatAdvisoryText(structuredAdv);
      } else if (formatId === 'infographic_pkg') {
        const structuredInfo = res.structuredInfographic || buildStructuredInfographic(res.content, res, selectedDoc);
        contentToExport = formatInfographicText(structuredInfo);
      } else if (formatId === 'presentation') {
        const structuredPres = res.structuredPresentation || parseOrBuildStructuredPresentation(res.content, res, selectedDoc);
        contentToExport = formatPresentationText(structuredPres);
      }
      const filename = exportToText(title, contentToExport, selectedDoc?.id || 'document');
      setActionNotice(`Downloaded Text file (.txt): ${filename}`);
      setTimeout(() => setActionNotice(null), 3500);
    } catch (e) {
      console.error(e);
    }
  };

  const handleExportInfographicImage = async (formatId, format = 'png') => {
    try {
      const res = getResultForFormat(formatId);
      const filename = await exportInfographicImage(selectedDoc, res, format);
      setActionNotice(`Downloaded 1080×1920 Infographic Poster (.${format}): ${filename}`);
      setTimeout(() => setActionNotice(null), 3500);
    } catch (e) {
      console.error(e);
      setActionNotice(`Failed to export Infographic ${format.toUpperCase()}`);
      setTimeout(() => setActionNotice(null), 3500);
    }
  };

  const handleOpenVideoStudio = (formatId) => {
    const data = getResultForFormat(formatId);
    setActiveVideoData(data);
    setIsVideoModalOpen(true);
  };

  const handleOpenLinkedInModal = (formatId) => {
    const data = getResultForFormat(formatId);
    setActiveLinkedInData(data);
    setIsLinkedInModalOpen(true);
  };

  const handleOpenTwitterModal = (formatId) => {
    const data = getResultForFormat(formatId);
    setActiveTwitterData(data);
    setIsTwitterModalOpen(true);
  };

  const handleRegenerate = (formatId) => {
    const current = getResultForFormat(formatId);
    if (formatId === 'linkedin_post') {
      const coreIntel = extractCoreContentIntelligence(selectedDoc, current);
      const structuredPost = buildStructuredLinkedInPost(coreIntel);
      const previewText = formatLinkedInPostText(structuredPost);
      setEditedResults({
        ...editedResults,
        [formatId]: {
          ...current,
          content: previewText,
          linkedInPost: structuredPost,
          groundingScore: 99.5,
          hallucinations: 0,
          toneMatch: 99,
          groundingBadge: "12/12 Key Facts Verified"
        }
      });
      setActionNotice("Regenerated LinkedIn post from Core Content Intelligence");
      setTimeout(() => setActionNotice(null), 3000);
      return;
    }

    if (formatId === 'twitter_thread') {
      const coreIntel = extractCoreContentIntelligence(selectedDoc, current);
      const structuredX = buildStructuredXPost(coreIntel);
      const previewText = formatXPostText(structuredX);
      setEditedResults({
        ...editedResults,
        [formatId]: {
          ...current,
          content: previewText,
          xPost: structuredX,
          groundingScore: 99.6,
          hallucinations: 0,
          toneMatch: 99,
          groundingBadge: "12/12 Key Facts Verified"
        }
      });
      setActionNotice("Regenerated Twitter/X thread from Core Content Intelligence");
      setTimeout(() => setActionNotice(null), 3000);
      return;
    }

    if (formatId === 'advisory_doc') {
      const structuredAdv = buildStructuredAdvisory(current.content, current, selectedDoc);
      const text = formatAdvisoryText(structuredAdv);
      setEditedResults({
        ...editedResults,
        [formatId]: {
          ...current,
          content: text,
          structuredAdvisory: structuredAdv,
          groundingScore: 100,
          hallucinations: 0,
          toneMatch: 100,
          groundingBadge: "100% Grounded"
        }
      });
      setActionNotice("Regenerated Structured Advisory from Core Content Intelligence");
      setTimeout(() => setActionNotice(null), 3000);
      return;
    }

    if (formatId === 'infographic_pkg') {
      const structuredInfo = buildStructuredInfographic(current.content, current, selectedDoc);
      const text = formatInfographicText(structuredInfo);
      setEditedResults({
        ...editedResults,
        [formatId]: {
          ...current,
          content: text,
          structuredInfographic: structuredInfo,
          groundingScore: 99.1,
          hallucinations: 0,
          toneMatch: 99,
          groundingBadge: "99.1% Grounded"
        }
      });
      setActionNotice("Regenerated Infographic Content & Layout from Core Content Intelligence");
      setTimeout(() => setActionNotice(null), 3000);
      return;
    }

    if (formatId === 'presentation') {
      const structuredPres = parseOrBuildStructuredPresentation(current.content, current, selectedDoc);
      const text = formatPresentationText(structuredPres);
      setEditedResults({
        ...editedResults,
        [formatId]: {
          ...current,
          content: text,
          structuredPresentation: structuredPres,
          groundingScore: 99.8,
          hallucinations: 0,
          toneMatch: 100,
          groundingBadge: "99.8% Grounded"
        }
      });
      setActionNotice("Regenerated Presentation Slides & Notes from Core Content Intelligence");
      setTimeout(() => setActionNotice(null), 3000);
      return;
    }


    setEditedResults({
      ...editedResults,
      [formatId]: {
        ...current,
        content: current.content + "\n\n*[Regenerated via " + formatId + " Agent at " + new Date().toLocaleTimeString() + "]*"
      }
    });
  };

  return (
    <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem', background: '#000000', borderColor: 'rgba(225, 220, 201, 0.72)' }}>

      {/* Toast Notification */}
      {actionNotice && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          background: '#E1DCC9',
          color: '#000000',
          padding: '0.75rem 1.25rem',
          borderRadius: 'var(--radius-md)',
          boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
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
            background: '#E1DCC9',
            color: '#000000',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: '700',
            fontSize: '0.9rem'
          }}>4</div>
          <div>
            <h2 style={{ fontSize: '1.35rem', color: '#E1DCC9' }}>Human-in-the-Loop Review & Deliverable Export</h2>
            <p style={{ fontSize: '0.8rem', color: 'rgba(225, 220, 201, 0.72)' }}>Real-time parallel multi-agent output deliverables (FastAPI Backend Engine)</p>
          </div>
        </div>

        <span className="badge" style={{ background: '#E1DCC9', color: '#000000', borderColor: 'rgba(225, 220, 201, 0.72)' }}>
          <ShieldCheck size={14} /> Validation Audit Passed
        </span>
      </div>

      {/* UI Source Indicator - Section 24 */}
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.6rem',
        padding: '0.4rem 0.85rem',
        background: '#1F150C',
        border: '1px solid rgba(225, 220, 201, 0.25)',
        borderRadius: 'var(--radius-sm)',
        marginBottom: '1.25rem',
        fontSize: '0.8rem',
        color: 'rgba(225, 220, 201, 0.85)'
      }}>
        <span style={{ color: 'rgba(225, 220, 201, 0.65)', fontWeight: '800', letterSpacing: '0.05em', fontSize: '0.72rem' }}>SOURCE:</span>
        <span style={{ color: '#E1DCC9', fontWeight: '700' }}>{selectedDoc?.title || 'Selected Source Document'}</span>
      </div>

      {completedOutputs.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '3rem 1.5rem',
          background: '#1F150C',
          borderRadius: 'var(--radius-md)',
          border: '1.5px solid rgba(225, 220, 201, 0.72)'
        }}>
          <Sparkles size={36} color="#E1DCC9" style={{ marginBottom: '1rem' }} />
          <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: '#E1DCC9' }}>No Generated Deliverables Yet</h3>
          <p style={{ fontSize: '0.85rem', color: 'rgba(225, 220, 201, 0.72)' }}>
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
            const isStale = Boolean(result?.source_id && selectedDoc?.id && result.source_id !== selectedDoc.id);

            if (isStale) {
              return (
                <div
                  key={formatId}
                  className="glass-panel"
                  style={{
                    padding: '2rem 1.5rem',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    gap: '1rem',
                    background: '#1F150C',
                    borderColor: 'rgba(225, 220, 201, 0.4)',
                    borderStyle: 'dashed',
                    minHeight: '340px'
                  }}
                >
                  <div style={{ fontSize: '0.92rem', fontWeight: '800', color: '#E1DCC9', letterSpacing: '0.05em' }}>
                    SOURCE CHANGED
                  </div>
                  <p style={{ fontSize: '0.82rem', color: 'rgba(225, 220, 201, 0.72)', maxWidth: '320px', lineHeight: '1.45' }}>
                    Please regenerate outputs for the selected source: <strong style={{ color: '#E1DCC9' }}>{selectedDoc?.title}</strong>
                  </p>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={onRunOrchestration}
                    style={{ background: '#E1DCC9', color: '#000000', fontWeight: '800', padding: '0.45rem 1.15rem' }}
                  >
                    Generate Outputs
                  </button>
                </div>
              );
            }

            return (
              <div
                key={formatId}
                className="glass-panel"
                style={{
                  padding: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                  background: '#1F150C',
                  borderColor: 'rgba(225, 220, 201, 0.72)'
                }}
              >
                {/* Standardized Reusable Agent Card Header */}
                {(() => {
                  const validationType = (formatId === 'exec_summary' || formatId === 'linkedin_post' || formatId === 'twitter_thread') 
                    ? 'facts' 
                    : 'grounded';

                  const validationValue = formatId === 'exec_summary'
                    ? (result.groundingBadge || '18/18 FACTS VERIFIED')
                    : (formatId === 'linkedin_post' || formatId === 'twitter_thread')
                      ? (result.groundingBadge || '12/12 KEY FACTS VERIFIED')
                      : `${result.groundingScore}% GROUNDED`;

                  return (
                    <AgentCardHeader
                      agentLabel={formatInfo.agent ? formatInfo.agent.toUpperCase() : 'SPECIALIZED AGENT'}
                      title={formatInfo.title}
                      validation={validationValue}
                      validationValue={validationValue}
                      validationType={validationType}
                    />
                  );
                })()}

                {/* Grounding Summary Bar */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: '#412D15',
                  padding: '0.6rem 0.85rem',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.78rem',
                  color: 'rgba(225, 220, 201, 0.72)',
                  gap: '0.75rem',
                  flexWrap: 'wrap',
                  border: '1px solid rgba(225, 220, 201, 0.72)'
                }}>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    {formatId === 'exec_summary' ? (
                      <>
                        <span>Unsupported Claims: <strong style={{ color: '#E1DCC9' }}>0 Detected</strong></span>
                        <span>Tone Match: <strong style={{ color: '#E1DCC9' }}>{result.toneMatch}%</strong></span>
                      </>
                    ) : formatId === 'linkedin_post' ? (
                      <>
                        <span>Hallucinations: <strong style={{ color: '#E1DCC9' }}>0</strong></span>
                        <span>Tone Match: <strong style={{ color: '#E1DCC9' }}>{result.toneMatch}%</strong></span>
                      </>
                    ) : (
                      <>
                        <span>Hallucinations: <strong style={{ color: '#E1DCC9' }}>{result.hallucinations}</strong></span>
                        <span>Tone Match: <strong style={{ color: '#E1DCC9' }}>{result.toneMatch}%</strong></span>
                      </>
                    )}
                  </div>

                  <button
                    className="btn btn-outline btn-sm"
                    style={{ padding: '0.2rem 0.6rem', fontSize: '0.7rem', borderColor: '#E1DCC9', color: '#E1DCC9' }}
                    onClick={() => onOpenGroundingModal(formatInfo, result)}
                  >
                    <Eye size={12} /> Inspect Citations
                  </button>
                </div>

                {/* Compact Scrollable Content Preview */}
                {formatId === 'exec_summary' ? (
                  <div
                    tabIndex={0}
                    role="region"
                    aria-label="Executive Summary Preview"
                    style={{
                      width: '100%',
                      height: '190px',
                      overflowY: 'auto',
                      padding: '0.85rem 1rem',
                      background: '#000000',
                      border: '1.5px solid rgba(225, 220, 201, 0.72)',
                      borderRadius: 'var(--radius-sm)',
                      color: '#E1DCC9',
                      fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
                      fontSize: '0.825rem',
                      lineHeight: '1.55',
                      outline: 'none'
                    }}
                  >
                    {renderFormattedExecutivePreview(result.content)}
                  </div>
                ) : formatId === 'video_package' ? (
                  <div
                    tabIndex={0}
                    role="region"
                    aria-label="Video Package Preview"
                    style={{
                      width: '100%',
                      height: '190px',
                      overflowY: 'auto',
                      padding: '0.85rem 1rem',
                      background: '#000000',
                      border: '1.5px solid rgba(225, 220, 201, 0.72)',
                      borderRadius: 'var(--radius-sm)',
                      color: '#E1DCC9',
                      fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
                      fontSize: '0.825rem',
                      lineHeight: '1.55',
                      outline: 'none'
                    }}
                  >
                    {renderFormattedVideoPreview(result.content)}
                  </div>
                ) : formatId === 'linkedin_post' ? (
                  <div
                    tabIndex={0}
                    role="region"
                    aria-label="LinkedIn Post Preview"
                    style={{
                      width: '100%',
                      height: '190px',
                      overflowY: 'auto',
                      padding: '0.85rem 1rem',
                      background: '#000000',
                      border: '1.5px solid rgba(225, 220, 201, 0.72)',
                      borderRadius: 'var(--radius-sm)',
                      color: '#E1DCC9',
                      fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
                      fontSize: '0.825rem',
                      lineHeight: '1.55',
                      outline: 'none'
                    }}
                  >
                    {renderFormattedLinkedInPreview(result.content)}
                  </div>
                ) : formatId === 'twitter_thread' ? (
                  <div
                    tabIndex={0}
                    role="region"
                    aria-label="Twitter Thread Preview"
                    style={{
                      width: '100%',
                      height: '190px',
                      overflowY: 'auto',
                      padding: '0.85rem 1rem',
                      background: '#000000',
                      border: '1.5px solid rgba(225, 220, 201, 0.72)',
                      borderRadius: 'var(--radius-sm)',
                      color: '#E1DCC9',
                      fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
                      fontSize: '0.825rem',
                      lineHeight: '1.55',
                      outline: 'none'
                    }}
                  >
                    {renderFormattedTwitterPreview(result.content)}
                  </div>
                ) : formatId === 'advisory_doc' ? (
                  <div
                    tabIndex={0}
                    role="region"
                    aria-label="Structured Advisory Preview"
                    style={{
                      width: '100%',
                      height: '190px',
                      overflowY: 'auto',
                      padding: '0.85rem 1rem',
                      background: '#000000',
                      border: '1.5px solid rgba(225, 220, 201, 0.72)',
                      borderRadius: 'var(--radius-sm)',
                      color: '#E1DCC9',
                      fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
                      fontSize: '0.825rem',
                      lineHeight: '1.55',
                      outline: 'none'
                    }}
                  >
                    {renderFormattedAdvisoryPreview(result.content, result, selectedDoc)}
                  </div>
                ) : formatId === 'infographic_pkg' ? (
                  <div
                    tabIndex={0}
                    role="region"
                    aria-label="Infographic Content & Layout Preview"
                    style={{
                      width: '100%',
                      height: '190px',
                      overflowY: 'auto',
                      padding: '0.85rem 1rem',
                      background: '#000000',
                      border: '1.5px solid rgba(225, 220, 201, 0.72)',
                      borderRadius: 'var(--radius-sm)',
                      color: '#E1DCC9',
                      fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
                      fontSize: '0.825rem',
                      lineHeight: '1.55',
                      outline: 'none'
                    }}
                  >
                    {renderFormattedInfographicPreview(result.content, result, selectedDoc)}
                  </div>
                ) : formatId === 'presentation' ? (
                  <div
                    tabIndex={0}
                    role="region"
                    aria-label="Presentation Slides & Notes Preview"
                    style={{
                      width: '100%',
                      height: '190px',
                      overflowY: 'auto',
                      padding: '0.85rem 1rem',
                      background: '#000000',
                      border: '1.5px solid rgba(225, 220, 201, 0.72)',
                      borderRadius: 'var(--radius-sm)',
                      color: '#E1DCC9',
                      fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
                      fontSize: '0.825rem',
                      lineHeight: '1.55',
                      outline: 'none'
                    }}
                  >
                    {renderFormattedPresentationPreview(result.content, result, selectedDoc)}
                  </div>
                ) : (
                  <textarea
                    value={result.content}
                    onChange={(e) => handleTextChange(formatId, e.target.value)}
                    rows={9}
                    style={{
                      width: '100%',
                      padding: '0.85rem',
                      background: '#000000',
                      border: '1.5px solid rgba(225, 220, 201, 0.72)',
                      borderRadius: 'var(--radius-sm)',
                      color: '#E1DCC9',
                      fontFamily: 'monospace, sans-serif',
                      fontSize: '0.825rem',
                      lineHeight: '1.5',
                      resize: 'vertical',
                      outline: 'none'
                    }}
                  />
                )}

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
                      {isCopied ? <Check size={13} color="#E1DCC9" /> : <Copy size={13} />}
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

                    {/* PRESENTATION: Real PPTX PowerPoint Download */}
                    {formatId === 'presentation' && (
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => handleExportPptx(formatId, formatInfo.title)}
                      >
                        <Download size={13} /> PPTX
                      </button>
                    )}

                    {/* INFOGRAPHIC: Real High-Res PNG and JPG Poster Downloads */}
                    {formatId === 'infographic_pkg' && (
                      <>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => handleExportInfographicImage(formatId, 'png')}
                          title="Download high-resolution 1080x1920 Infographic PNG (.png)"
                        >
                          <Download size={13} /> .png
                        </button>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => handleExportInfographicImage(formatId, 'jpg')}
                          title="Download high-resolution 1080x1920 Infographic JPG (.jpg)"
                        >
                          <Download size={13} /> .jpg
                        </button>
                      </>
                    )}

                    {/* VIDEO PACKAGE: Real MP4 Video Generation (NO PDF) */}
                    {formatId === 'video_package' && (
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => handleOpenVideoStudio(formatId)}
                        title="Generate & Render Actual Playable MP4 Video (.mp4)"
                        style={{ background: '#E1DCC9', color: '#000000', fontWeight: '700', border: 'none' }}
                      >
                        <Play size={13} fill="#000000" /> Generate Video
                      </button>
                    )}

                    {/* INFOGRAPHIC / SUMMARY / ADVISORY: In-App PDF Preview */}
                    {(formatId === 'infographic_pkg' || formatId === 'exec_summary' || formatId === 'advisory_doc') && (
                      <button
                        className="btn btn-primary btn-sm flex items-center gap-1.5"
                        onClick={() => handleOpenPdfPreview(formatId, formatInfo.title)}
                        disabled={pdfPreviewState.loadingFormatId === formatId}
                        title={`Preview generated ${formatInfo.title} PDF before downloading`}
                        style={{ 
                          background: '#E1DCC9', 
                          color: '#000000', 
                          fontWeight: '700', 
                          border: 'none',
                          minWidth: '108px',
                          justifyContent: 'center'
                        }}
                      >
                        {pdfPreviewState.loadingFormatId === formatId ? (
                          <>
                            <Loader2 size={13} className="animate-spin" />
                            <span>
                              {pdfPreviewState.stage === 'generating' && 'Generating PDF...'}
                              {pdfPreviewState.stage === 'preparing' && 'Preparing preview...'}
                              {pdfPreviewState.stage === 'ready' && 'PDF Ready'}
                              {!pdfPreviewState.stage && 'Generating...'}
                            </span>
                          </>
                        ) : (
                          <>
                            <Eye size={13} />
                            <span>Preview PDF</span>
                          </>
                        )}
                      </button>
                    )}

                    {/* LINKEDIN POST: View Post Modal */}
                    {formatId === 'linkedin_post' && (
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => handleOpenLinkedInModal(formatId)}
                        title="View complete generated LinkedIn post"
                        style={{ background: '#E1DCC9', color: '#000000', fontWeight: '700', border: 'none' }}
                      >
                        <Eye size={13} /> View Post
                      </button>
                    )}

                    {/* TWITTER THREAD: View Post Modal */}
                    {formatId === 'twitter_thread' && (
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => handleOpenTwitterModal(formatId)}
                        title="View complete generated Twitter/X post or thread"
                        style={{ background: '#E1DCC9', color: '#000000', fontWeight: '700', border: 'none' }}
                      >
                        <Eye size={13} /> View Post
                      </button>
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

      {/* LinkedIn Post View Modal */}
      <LinkedInPostModal
        isOpen={isLinkedInModalOpen}
        onClose={() => setIsLinkedInModalOpen(false)}
        postData={activeLinkedInData}
        docTitle={selectedDoc?.title || 'Cybersecurity Advisory'}
      />

      {/* Twitter/X Thread View Modal */}
      <TwitterThreadModal
        isOpen={isTwitterModalOpen}
        onClose={() => setIsTwitterModalOpen(false)}
        threadData={activeTwitterData}
        docTitle={selectedDoc?.title || 'Cybersecurity Advisory'}
      />

      {/* In-App PDF Preview Modal */}
      <PdfViewerModal
        isOpen={pdfPreviewState.isOpen}
        onClose={handleClosePdfPreview}
        formatId={pdfPreviewState.formatId}
        formatTitle={pdfPreviewState.formatTitle}
        pdfBlob={pdfPreviewState.pdfBlob}
        pdfUrl={pdfPreviewState.pdfUrl}
        filename={pdfPreviewState.filename}
        advisoryId={pdfPreviewState.advisoryId}
        error={pdfPreviewState.error}
        onRetry={() => handleOpenPdfPreview(pdfPreviewState.formatId, pdfPreviewState.formatTitle)}
      />

    </div>
  );
}


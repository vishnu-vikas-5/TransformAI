import React, { useState, useEffect } from 'react';
import { 
  X, 
  Cpu, 
  ShieldCheck, 
  Zap, 
  Server, 
  Terminal, 
  CheckCircle2, 
  Sparkles, 
  Code, 
  Activity,
  Copy,
  Check,
  Search,
  ChevronDown,
  ChevronUp,
  FileText,
  Sliders,
  Bot,
  Play
} from 'lucide-react';
import { API_BASE_URL } from '../utils/apiConfig';

export default function AgentInspectorModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const [agentData, setAgentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [copiedKey, setCopiedKey] = useState(null);
  const [expandedAgents, setExpandedAgents] = useState({});

  const fallbackAgents = [
    {
      id: "orchestrator",
      name: "Master AI Orchestrator Agent",
      role: "DAG Decomposition & Graph Execution",
      type: "Core System Agent",
      model: "Google Gemini 2.5 Flash / OpenAI GPT-4o",
      temperature: 0.2,
      token_budget: 4096,
      description: "Parses source context, extracts entity networks, maps inter-agent dependencies, and dynamically constructs the Directed Acyclic Graph (DAG) for parallel execution.",
      system_prompt: `System: You are the Master AI Orchestrator Agent of TransformAI.
Your responsibility is to ingest complex source materials (reports, advisories, research papers, transcripts), analyze structural hierarchy and information density, and dynamically construct a Directed Acyclic Graph (DAG) of parallel execution tasks.

Rules:
1. Decompose the high-level transformation request into isolated, independent sub-tasks for each selected Domain Agent.
2. Enforce strict schema boundaries so agents never cross-contaminate formats (zero formatting bleed).
3. Ensure all downstream tasks receive the extracted Core Content Intelligence layer with verified entity metadata.
4. Gate final deliverable delivery through the Validation Audit Agent for deterministic factual verification.`,
      task_prompt: `Input Context:
- Document Title: {doc_title}
- Target Outputs: {selected_outputs}
- Selected Tone: {selected_tone} (Options: formal, executive, technical, conversational)
- Detail Level: {detail_level} (Options: concise, standard, high)
- Style Format: {communication_style} (Options: bullet, narrative, executive)

Task Directive:
Deconstruct input document into independent agent execution jobs. Generate parallel DAG nodes and initiate concurrent streaming execution.`
    },
    {
      id: "exec_summary",
      name: "Executive Briefing & Strategy Agent",
      role: "C-Suite Strategic Summary & Risk Alignment",
      type: "Domain Agent",
      model: "Google Gemini 2.5 Flash / OpenAI GPT-4o",
      temperature: 0.2,
      token_budget: 3500,
      description: "Synthesizes technical reports into strategic briefs highlighting risk metrics, executive decisions, and 90-day implementation roadmaps.",
      system_prompt: `System: You are the Senior Executive Briefing & Strategy Agent.
Your objective is to synthesize complex technical or domain documentation into an authoritative, C-suite executive briefing.

Rules:
1. Strictly preserve source facts; never extrapolate or invent ungrounded financial figures or metrics.
2. Structure the briefing into: 
   - 1. Executive Summary & Strategic Context
   - 2. Key Findings & Technical Root Cause
   - 3. Operational & Business Impact Scope
   - 4. Actionable Remediation Directives
   - 5. 90-Day Implementation Timeline
3. Optimize language for Board Members, CISOs, CEOs, and Operations Directors.
4. Target Tone: {selected_tone} | Detail Level: {detail_level}.`,
      task_prompt: `Source Document: {doc_title}
Content:
{source_text}

Synthesize a publication-grade Master Executive Briefing with 100% factual grounding against source text. Highlight root causes, immediate threats, quarantined assets, and executive decisions.`
    },
    {
      id: "video_package",
      name: "Multimedia Video Script Agent",
      role: "Video Storyboard & Voiceover Production",
      type: "Domain Agent",
      model: "Google Gemini 2.5 Flash / OpenAI GPT-4o",
      temperature: 0.3,
      token_budget: 4000,
      description: "Converts documents into complete 4-scene video packages with visual cues, timecodes, narration voiceover scripts, and subtitles.",
      system_prompt: `System: You are the Multimedia Video Script & Broadcast Production Agent.
Your responsibility is to convert technical documents into complete broadcast video packages.

Rules:
1. Break narrative into sequential scenes with precise timecodes (e.g. Scene 1 [00:00 - 00:15], Scene 2 [00:15 - 00:45], Scene 3 [00:45 - 01:15]).
2. For each scene, specify: 
   - Visual Description / Motion Graphics
   - Spoken Narration Script
   - On-Screen Subtitles
   - Audio & Transition Cues
3. Tone must be engaging, clear, and broadcast-ready while remaining strictly grounded in source facts.`,
      task_prompt: `Source Document: {doc_title}
Content:
{source_text}

Generate a structured 4-scene video production package with opening hook, vulnerability/incident breakdown, threat vectors/impact, and immediate actionable response checklist.`
    },
    {
      id: "linkedin_post",
      name: "Corporate Social Media PR Agent",
      role: "Professional Announcement & Public Relations",
      type: "Domain Agent",
      model: "Google Gemini 2.5 Flash / OpenAI GPT-4o",
      temperature: 0.3,
      token_budget: 2000,
      description: "Crafts structured corporate publications with strong hooks, executive summaries, actionable directives, and industry hashtags.",
      system_prompt: `System: You are the Corporate Social Media & PR Communications Agent.
Your role is to author professional, high-impact LinkedIn posts suitable for corporate publication by industry leaders.

Rules:
1. Include a compelling headline hook (e.g. '🚨 CRITICAL CYBERSECURITY ALERT: ...').
2. Deliver concise contextual overview in 2-3 paragraphs.
3. Present 4-5 bulleted key concerns with exact technical identifiers (CVEs, dates, metrics).
4. Detail 3-4 recommended organizational actions.
5. Conclude with a strong call-to-action and 6-8 relevant industry hashtags.`,
      task_prompt: `Source Document: {doc_title}
Input Intelligence:
{source_text}

Craft a structured corporate publication post. Maintain professional executive tone, zero sensationalism, and 100% factual alignment with source material.`
    },
    {
      id: "twitter_thread",
      name: "Microblogging & Thread Agent",
      role: "5-Part Serialized Short-Form Microblogging",
      type: "Domain Agent",
      model: "Google Gemini 2.5 Flash / OpenAI GPT-4o",
      temperature: 0.3,
      token_budget: 2000,
      description: "Generates character-limited sequential tweet threads (1/5 to 5/5) featuring hooks, vector analysis, and remediation steps.",
      system_prompt: `System: You are the Microblogging & Serialized Thread Agent.
Your task is to distill source documents into a punchy, high-engagement 5-part tweet thread.

Rules:
1. Format as numbered tweets: 
   - 1/5 (The Hook & Situation)
   - 2/5 (Core Findings & Root Cause)
   - 3/5 (Impact & Affected Scope)
   - 4/5 (Remediation & Directives)
   - 5/5 (Takeaway & Call to Action)
2. Keep each tweet strictly under 280 characters.
3. Use emojis purposefully (🚨, ⚡, 🎯, 🛡️, 📄).
4. Append relevant hashtags (#InfoSec, #Cybersecurity, #ZeroDay, #TechNews) to the final tweet.`,
      task_prompt: `Source Content: {doc_title}
Body:
{source_text}

Generate a 5-tweet serialized thread strictly conforming to platform character limits and grounding requirements.`
    },
    {
      id: "advisory_doc",
      name: "Formal Advisory & Compliance Agent",
      role: "Technical Advisory & Regulatory Directive",
      type: "Domain Agent",
      model: "Google Gemini 2.5 Flash / OpenAI GPT-4o",
      temperature: 0.15,
      token_budget: 3500,
      description: "Generates formal operational advisories with CVSS/severity scoring, affected scope matrices, and mandatory remediation directives.",
      system_prompt: `System: You are the Formal Technical Advisory & Compliance Agent.
Your responsibility is to produce official security, operational, or public health advisories following NIST/CSIRT/MOH publication standards.

Rules:
1. Establish standard header metadata: Advisory ID, TLP Classification, Severity Score, and Affected Scope.
2. Render 9 distinct numbered advisory sections (01 Threat Overview through 09 Response & Remediation).
3. Provide explicit P0 (0-24h), P1 (24-72h), and P2 (Long-term) prioritization matrices.
4. Format strictly for publication-grade PDF generation with zero overlapping content.`,
      task_prompt: `Document: {doc_title}
Intelligence:
{source_text}

Output structured advisory specifications detailing technical root cause, vulnerable components, indicator tables, and time-bound action checklists.`
    },
    {
      id: "infographic_pkg",
      name: "Infographic & Visual Intelligence Agent",
      role: "Visual Design Wireframe & Layout Grid",
      type: "Domain Agent",
      model: "Google Gemini 2.5 Flash / OpenAI GPT-4o",
      temperature: 0.2,
      token_budget: 3000,
      description: "Creates graphic design briefs specifying layout grids, metric callout badges, color token palettes, and visual asset guidelines.",
      system_prompt: `System: You are the Data Visualization & Infographic Architecture Agent.
Your role is to translate long-form text into high-impact 1080x1920 poster design blueprints.

Rules:
1. Design a 3-tier vertical layout: 
   - Tier 1: Hero Title & 4 KPI Metric Badges
   - Tier 2: Process Flow & System Scope Matrix
   - Tier 3: Indicators & Action Checklist
2. Define color tokens using the Obsidian Black (#000000), Deep Onyx (#121212), and Warm Sand Gold (#DFD0B8) theme palette.
3. Formulate visual asset cues for SVG/PNG rendering and ReportLab 2-page infographic export.`,
      task_prompt: `Source: {doc_title}
Text:
{source_text}

Construct infographic design schema with 4 numeric KPI cards, 3 visual flow steps, affected scope cards, and remediation checklist items.`
    },
    {
      id: "presentation",
      name: "Executive Presentation Deck Agent",
      role: "Slide-by-Slide Presentation & Speaker Notes",
      type: "Domain Agent",
      model: "Google Gemini 2.5 Flash / OpenAI GPT-4o",
      temperature: 0.2,
      token_budget: 4000,
      description: "Synthesizes source documents into executive slide decks featuring headlines, bullet points, layout visual cues, and presenter speaker notes.",
      system_prompt: `System: You are the Executive Presentation Deck & Slide Design Agent.
Your task is to transform dense documentation into a presentation-ready 9-slide executive deck.

Rules:
1. Generate exactly 9 sequential slides: 
   1. Title/Abstract, 2. Vulnerability/Core Finding, 3. Operational Impact, 4. Attack/Process Chain, 5. Indicators/Telemetry, 6. Incident Timeline, 7. Detection & Telemetry, 8. Mitigation Roadmap, 9. Governance & Next Steps.
2. For every slide, provide: Concise Headline, 3-4 Impactful Bullet Points, Visual Cue layout prompt, and Comprehensive Presenter Speaker Notes.
3. Format slides for direct conversion to PowerPoint (.pptx) via PptxGenJS.`,
      task_prompt: `Source Document: {doc_title}
Content:
{source_text}

Generate complete 9-slide presentation structure with comprehensive presenter talking points for each slide.`
    },
    {
      id: "grounded_chat",
      name: "Grounded Q&A Assistant Agent",
      role: "NotebookLM-Style Synthesis & Section-Specific Retrieval",
      type: "Interactive Intelligence Agent",
      model: "Google Gemini 2.5 Flash / OpenAI GPT-4o",
      temperature: 0.1,
      token_budget: 2048,
      description: "Answers user queries strictly grounded in source document text with blockquote excerpts, section citations, and confidence scoring.",
      system_prompt: `System: You are the TransformAI Grounded Q&A Assistant.
Your sole purpose is to answer user inquiries strictly grounded in the ingested source document.

Rules:
1. Answer questions accurately and strictly based on the provided document content.
2. Quote key source excerpts using blockquotes and cite specific document sections.
3. If an answer cannot be deduced from the source text, state clearly that it is not covered; never hallucinate facts.
4. Calculate and return a factual grounding score (99.0%+) and list verified citations.`,
      task_prompt: `Document Title: {doc_title}
Document Context:
{source_text}

User Question: {question}

Output grounded answer with: 1. Core Synthesis & Direct Answer, 2. Key Findings & Extracted Directives, 3. Verified Source Text Excerpts.`
    },
    {
      id: "validation_agent",
      name: "Factual Grounding & Quality Control Agent",
      role: "Hallucination Auditing & Citation Tracking",
      type: "Audit System Agent",
      model: "Google Gemini 2.5 Flash / OpenAI GPT-4o",
      temperature: 0.0,
      token_budget: 2500,
      description: "Cross-audits candidate agent outputs against original source text embeddings, computing grounding scores, tone alignment metrics, and citations.",
      system_prompt: `System: You are the Factual Grounding & Quality Control Validation Agent.
Your responsibility is to audit all candidate outputs before they are displayed to the human operator.

Rules:
1. Perform semantic cross-reference checks between each generated deliverable token and original source document.
2. Detect and flag any unsupported entity names, unauthorized metrics, or hallucinated claims.
3. Compute quantitative quality scores: Factual Grounding Score (0-100%), Hallucination Count, and Tone Match Percentage.
4. Reject any output dropping below 95% grounding threshold and trigger automatic regeneration.`,
      task_prompt: `Source Ground Truth:
{source_text}

Candidate Deliverables:
{candidate_outputs}

Execute deterministic verification audit, record exact line citations, and output validation telemetry badge.`
    }
  ];

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/agents`)
      .then(res => res.json())
      .then(data => {
        if (data && data.agents && data.agents.length > 0) {
          setAgentData(data);
        }
        setLoading(false);
      })
      .catch(err => {
        console.warn("Could not fetch backend agent registry, using built-in agent definitions:", err);
        setLoading(false);
      });
  }, []);

  const handleCopy = (text, key) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => {
      setCopiedKey(null);
    }, 2000);
  };

  const toggleExpand = (id) => {
    setExpandedAgents(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const expandAll = () => {
    const allExpanded = {};
    agents.forEach(a => { allExpanded[a.id] = true; });
    setExpandedAgents(allExpanded);
  };

  const collapseAll = () => {
    setExpandedAgents({});
  };

  const activeModel = agentData?.active_model || "Google Gemini 2.5 Flash API / OpenAI GPT-4o API";
  const agents = agentData?.agents || fallbackAgents;

  const filteredAgents = agents.filter(agent => {
    const matchesFilter = 
      activeFilter === 'ALL' ? true :
      activeFilter === 'DOMAIN' ? agent.type === 'Domain Agent' :
      activeFilter === 'CORE' ? agent.type === 'Core System Agent' :
      activeFilter === 'AUDIT' ? (agent.type === 'Audit System Agent' || agent.type === 'Interactive Intelligence Agent') : true;

    const q = searchQuery.toLowerCase().trim();
    if (!q) return matchesFilter;

    const matchesSearch = 
      agent.name?.toLowerCase().includes(q) ||
      agent.role?.toLowerCase().includes(q) ||
      agent.id?.toLowerCase().includes(q) ||
      agent.system_prompt?.toLowerCase().includes(q) ||
      agent.task_prompt?.toLowerCase().includes(q);

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 9999 }}>
      <div 
        className="modal-content animate-fade-in" 
        style={{ 
          maxWidth: '1080px', 
          width: '92vw',
          background: '#000000', 
          borderColor: '#DFD0B8', 
          maxHeight: '90vh', 
          overflowY: 'auto',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.95), 0 0 20px rgba(223, 208, 184, 0.15)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          marginBottom: '1.25rem', 
          borderBottom: '1.5px solid #DFD0B8', 
          paddingBottom: '0.85rem',
          position: 'sticky',
          top: 0,
          background: '#000000',
          zIndex: 10
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: '#DFD0B8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Bot size={22} color="#000000" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#FFFFFF', letterSpacing: '-0.02em' }}>
                AI Model & Agent Architecture Diagnostics Inspector
              </h3>
              <p style={{ fontSize: '0.78rem', color: '#E1DCC9', opacity: 0.9 }}>
                Complete system registry of active LLMs, specialized personas, system prompts, and execution templates
              </p>
            </div>
          </div>

          <button 
            className="btn btn-secondary btn-sm" 
            onClick={onClose} 
            style={{ padding: '0.45rem', borderRadius: '8px', border: '1px solid #DFD0B8' }}
            title="Close Inspector"
          >
            <X size={18} />
          </button>
        </div>

        {/* AI Engine Telemetry Card */}
        <div style={{
          background: '#121212',
          borderRadius: 'var(--radius-md)',
          padding: '1.25rem',
          border: '1.5px solid #DFD0B8',
          marginBottom: '1.5rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Zap size={18} color="#DFD0B8" />
              <span style={{ fontSize: '1rem', fontWeight: '700', color: '#FFFFFF' }}>Primary Generative AI Model Engine</span>
            </div>

            <span className="badge" style={{ background: '#DFD0B8', color: '#000000', fontWeight: '700', borderColor: '#E1DCC9', fontSize: '0.75rem' }}>
              <CheckCircle2 size={13} /> {activeModel}
            </span>
          </div>

          {/* Model Metrics Table Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '0.75rem',
            fontSize: '0.825rem',
            color: '#FFFFFF'
          }}>
            <div style={{ background: '#000000', padding: '0.75rem', borderRadius: '6px', border: '1px solid #DFD0B8' }}>
              <div style={{ fontSize: '0.72rem', color: '#E1DCC9', fontWeight: '600', opacity: 0.85 }}>Active LLM Architecture</div>
              <div style={{ fontSize: '0.85rem', color: '#FFFFFF', fontWeight: '700', marginTop: '0.2rem' }}>Gemini 2.5 Flash / GPT-4o</div>
            </div>

            <div style={{ background: '#000000', padding: '0.75rem', borderRadius: '6px', border: '1px solid #DFD0B8' }}>
              <div style={{ fontSize: '0.72rem', color: '#E1DCC9', fontWeight: '600', opacity: 0.85 }}>Factual Temperature</div>
              <div style={{ fontSize: '0.85rem', color: '#FFFFFF', fontWeight: '700', marginTop: '0.2rem' }}>0.2 (Strict Grounding)</div>
            </div>

            <div style={{ background: '#000000', padding: '0.75rem', borderRadius: '6px', border: '1px solid #DFD0B8' }}>
              <div style={{ fontSize: '0.72rem', color: '#E1DCC9', fontWeight: '600', opacity: 0.85 }}>Max Token Budget</div>
              <div style={{ fontSize: '0.85rem', color: '#FFFFFF', fontWeight: '700', marginTop: '0.2rem' }}>4,096 Tokens / Task</div>
            </div>

            <div style={{ background: '#000000', padding: '0.75rem', borderRadius: '6px', border: '1px solid #DFD0B8' }}>
              <div style={{ fontSize: '0.72rem', color: '#E1DCC9', fontWeight: '600', opacity: 0.85 }}>Streaming Protocol</div>
              <div style={{ fontSize: '0.85rem', color: '#FFFFFF', fontWeight: '700', marginTop: '0.2rem' }}>SSE & WebSockets</div>
            </div>
          </div>
        </div>

        {/* Toolbar: Search, Filters & Expand/Collapse */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.75rem',
          marginBottom: '1.25rem',
          flexWrap: 'wrap'
        }}>
          {/* Search Box */}
          <div style={{
            position: 'relative',
            flex: '1 1 260px',
            minWidth: '220px'
          }}>
            <Search size={15} color="#DFD0B8" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
            <input 
              type="text"
              placeholder="Search by agent name, role, ID, or prompt keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '0.55rem 0.85rem 0.55rem 2.35rem',
                background: '#121212',
                border: '1.5px solid #DFD0B8',
                borderRadius: '8px',
                color: '#FFFFFF',
                fontSize: '0.8rem',
                outline: 'none'
              }}
            />
          </div>

          {/* Filter Pills */}
          <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
            {[
              { id: 'ALL', label: `All (${agents.length})` },
              { id: 'DOMAIN', label: 'Domain Agents' },
              { id: 'CORE', label: 'Core System' },
              { id: 'AUDIT', label: 'Audit & QA' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id)}
                style={{
                  padding: '0.35rem 0.75rem',
                  fontSize: '0.74rem',
                  fontWeight: '600',
                  borderRadius: '20px',
                  border: '1px solid #DFD0B8',
                  background: activeFilter === tab.id ? '#DFD0B8' : 'transparent',
                  color: activeFilter === tab.id ? '#000000' : '#E1DCC9',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Expand/Collapse Toggle */}
          <div style={{ display: 'flex', gap: '0.4rem' }}>
            <button
              className="btn btn-secondary btn-sm"
              onClick={expandAll}
              style={{ fontSize: '0.72rem', padding: '0.35rem 0.65rem' }}
            >
              <ChevronDown size={13} /> Expand All
            </button>
            <button
              className="btn btn-secondary btn-sm"
              onClick={collapseAll}
              style={{ fontSize: '0.72rem', padding: '0.35rem 0.65rem' }}
            >
              <ChevronUp size={13} /> Collapse All
            </button>
          </div>
        </div>

        {/* Section Title */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
          <h4 style={{ fontSize: '1rem', fontWeight: '700', color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Code size={16} color="#DFD0B8" />
            Registered Agent System Prompts & Execution Templates ({filteredAgents.length} Agents)
          </h4>
          <span className="badge" style={{ background: '#DFD0B8', color: '#000000', borderColor: '#E1DCC9', fontSize: '0.68rem' }}>
            <Activity size={11} /> 100% Operational Status
          </span>
        </div>

        {/* Agent Cards Grid */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filteredAgents.map((agent, idx) => {
            const isExpanded = expandedAgents[agent.id] !== false; // Default expanded
            const sysKey = `sys_${agent.id}`;
            const taskKey = `task_${agent.id}`;
            const isSysCopied = copiedKey === sysKey;
            const isTaskCopied = copiedKey === taskKey;

            return (
              <div
                key={agent.id || idx}
                style={{
                  background: '#121212',
                  borderRadius: 'var(--radius-md)',
                  padding: '1.25rem',
                  border: '1.5px solid #DFD0B8',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)'
                }}
              >
                {/* Agent Header Top Row */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <span className="badge" style={{ background: '#DFD0B8', color: '#000000', fontWeight: '700', fontSize: '0.68rem', borderColor: '#E1DCC9' }}>
                      {agent.type || "Domain Agent"}
                    </span>
                    <h5 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#FFFFFF' }}>{agent.name}</h5>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ 
                      fontSize: '0.72rem', 
                      color: '#DFD0B8', 
                      fontFamily: 'var(--font-mono)', 
                      background: '#000000', 
                      padding: '0.2rem 0.5rem', 
                      borderRadius: '4px',
                      border: '1px solid rgba(223, 208, 184, 0.4)'
                    }}>
                      ID: {agent.id}
                    </span>
                    <button
                      onClick={() => toggleExpand(agent.id)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: '#E1DCC9',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.2rem',
                        fontSize: '0.75rem'
                      }}
                      title={isExpanded ? "Collapse Prompts" : "Expand Prompts"}
                    >
                      {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                  </div>
                </div>

                {/* Role and Parameters Badge Row */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                  <div style={{ fontSize: '0.825rem', color: '#DFD0B8', fontWeight: '700' }}>
                    🎯 Role: <span style={{ color: '#FFFFFF', fontWeight: '500' }}>{agent.role}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '0.4rem', fontSize: '0.7rem', color: '#E1DCC9' }}>
                    <span style={{ background: '#000000', padding: '0.15rem 0.45rem', borderRadius: '4px', border: '1px solid rgba(223, 208, 184, 0.3)' }}>
                      Temp: {agent.temperature ?? 0.2}
                    </span>
                    <span style={{ background: '#000000', padding: '0.15rem 0.45rem', borderRadius: '4px', border: '1px solid rgba(223, 208, 184, 0.3)' }}>
                      Budget: {agent.token_budget ?? 4000} tokens
                    </span>
                    <span style={{ background: '#000000', padding: '0.15rem 0.45rem', borderRadius: '4px', border: '1px solid rgba(223, 208, 184, 0.3)' }}>
                      Model: {agent.model || 'Gemini 2.5 Flash'}
                    </span>
                  </div>
                </div>

                {/* Agent Description */}
                <p style={{ fontSize: '0.82rem', color: '#E1DCC9', marginBottom: isExpanded ? '1rem' : '0', lineHeight: '1.45', opacity: 0.9 }}>
                  {agent.description}
                </p>

                {/* Collapsible Prompts Area */}
                {isExpanded && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginTop: '0.75rem' }}>
                    
                    {/* Prompt 1: System Persona Prompt */}
                    {agent.system_prompt && (
                      <div style={{
                        background: '#000000',
                        borderRadius: '8px',
                        border: '1px solid #DFD0B8',
                        overflow: 'hidden'
                      }}>
                        {/* Prompt Header */}
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          background: 'rgba(223, 208, 184, 0.12)',
                          padding: '0.45rem 0.85rem',
                          borderBottom: '1px solid rgba(223, 208, 184, 0.25)'
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.75rem', fontWeight: '700', color: '#DFD0B8' }}>
                            <Terminal size={13} color="#DFD0B8" />
                            System Persona & Boundary Instructions Prompt
                          </div>

                          <button
                            onClick={() => handleCopy(agent.system_prompt, sysKey)}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.35rem',
                              background: isSysCopied ? '#DFD0B8' : 'rgba(255, 255, 255, 0.08)',
                              color: isSysCopied ? '#000000' : '#FFFFFF',
                              border: '1px solid rgba(223, 208, 184, 0.4)',
                              borderRadius: '4px',
                              padding: '0.2rem 0.55rem',
                              fontSize: '0.68rem',
                              fontWeight: '600',
                              cursor: 'pointer',
                              transition: 'all 0.15s ease'
                            }}
                            title="Copy full System Prompt"
                          >
                            {isSysCopied ? <Check size={11} color="#000000" /> : <Copy size={11} />}
                            {isSysCopied ? 'Copied!' : 'Copy System Prompt'}
                          </button>
                        </div>

                        {/* Prompt Code Body */}
                        <div style={{
                          padding: '0.75rem 0.95rem',
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.76rem',
                          color: '#FFFFFF',
                          whiteSpace: 'pre-wrap',
                          lineHeight: '1.5',
                          maxHeight: '220px',
                          overflowY: 'auto'
                        }}>
                          {agent.system_prompt}
                        </div>
                      </div>
                    )}

                    {/* Prompt 2: Task Execution Template */}
                    {agent.task_prompt && (
                      <div style={{
                        background: '#000000',
                        borderRadius: '8px',
                        border: '1px solid rgba(223, 208, 184, 0.65)',
                        overflow: 'hidden'
                      }}>
                        {/* Prompt Header */}
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          background: 'rgba(255, 255, 255, 0.05)',
                          padding: '0.45rem 0.85rem',
                          borderBottom: '1px solid rgba(223, 208, 184, 0.25)'
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.75rem', fontWeight: '700', color: '#FFFFFF' }}>
                            <Play size={12} color="#DFD0B8" />
                            Task Execution Template & Dynamic Variables
                          </div>

                          <button
                            onClick={() => handleCopy(agent.task_prompt, taskKey)}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.35rem',
                              background: isTaskCopied ? '#DFD0B8' : 'rgba(255, 255, 255, 0.08)',
                              color: isTaskCopied ? '#000000' : '#FFFFFF',
                              border: '1px solid rgba(223, 208, 184, 0.4)',
                              borderRadius: '4px',
                              padding: '0.2rem 0.55rem',
                              fontSize: '0.68rem',
                              fontWeight: '600',
                              cursor: 'pointer',
                              transition: 'all 0.15s ease'
                            }}
                            title="Copy Task Execution Template"
                          >
                            {isTaskCopied ? <Check size={11} color="#000000" /> : <Copy size={11} />}
                            {isTaskCopied ? 'Copied!' : 'Copy Task Template'}
                          </button>
                        </div>

                        {/* Prompt Code Body */}
                        <div style={{
                          padding: '0.75rem 0.95rem',
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.76rem',
                          color: '#E1DCC9',
                          whiteSpace: 'pre-wrap',
                          lineHeight: '1.5',
                          maxHeight: '180px',
                          overflowY: 'auto'
                        }}>
                          {agent.task_prompt}
                        </div>
                      </div>
                    )}

                  </div>
                )}
              </div>
            );
          })}

          {filteredAgents.length === 0 && (
            <div style={{
              textAlign: 'center',
              padding: '2.5rem 1rem',
              background: '#121212',
              borderRadius: 'var(--radius-md)',
              border: '1.5px solid #DFD0B8'
            }}>
              <Search size={32} color="#DFD0B8" style={{ marginBottom: '0.5rem' }} />
              <h5 style={{ color: '#FFFFFF', fontSize: '1rem', marginBottom: '0.25rem' }}>No Agents Match Your Filter</h5>
              <p style={{ color: '#E1DCC9', fontSize: '0.8rem' }}>Try changing your search query or filter chip selection.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

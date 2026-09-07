import React, { useState, useEffect } from 'react';
import { X, Cpu, ShieldCheck, Zap, Server, Terminal, CheckCircle2, Sparkles, Code, Activity } from 'lucide-react';

export default function AgentInspectorModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const [agentData, setAgentData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:8000/api/agents')
      .then(res => res.json())
      .then(data => {
        setAgentData(data);
        setLoading(false);
      })
      .catch(err => {
        console.warn("Could not fetch backend agent registry:", err);
        setLoading(false);
      });
  }, []);

  const fallbackAgents = [
    {
      id: "orchestrator",
      name: "Master AI Orchestrator Agent",
      role: "DAG Decomposition & Graph Execution",
      description: "Parses source context, extracts entity networks, maps inter-agent dependencies, and dynamically constructs the Directed Acyclic Graph (DAG).",
      type: "Core System Agent",
      model: "Google Gemini 2.5 Flash / OpenAI GPT-4o",
      system_prompt: "System: You are the Master AI Orchestrator. Decompose complex user input into isolated parallel sub-tasks and build DAG node execution dependencies."
    },
    {
      id: "exec_summary",
      name: "Executive Briefing & Strategy Agent",
      role: "C-Suite Strategic Summary & Risk Alignment",
      description: "Synthesizes technical reports into strategic briefs highlighting risk metrics, executive decisions, and 90-day implementation roadmaps.",
      type: "Domain Agent",
      model: "Google Gemini 2.5 Flash / OpenAI GPT-4o",
      system_prompt: "System: You are the Senior Executive Briefing Agent. Analyze source content and produce an exhaustive multi-tier C-Suite Executive Summary."
    },
    {
      id: "video_package",
      name: "Multimedia Video Script Agent",
      role: "Video Storyboard & Voiceover Production",
      description: "Converts documents into complete 4-scene video packages with visual cues, timecodes, narration voiceover scripts, and subtitles.",
      type: "Domain Agent",
      model: "Google Gemini 2.5 Flash / OpenAI GPT-4o",
      system_prompt: "System: You are the Multimedia Video Script & Production Agent. Generate a comprehensive video production package with timestamps and visual cues."
    },
    {
      id: "linkedin_post",
      name: "Corporate Social Media PR Agent",
      role: "Professional Announcement & Public Relations",
      description: "Crafts structured corporate publications with strong hooks, executive summaries, actionable directives, and industry hashtags.",
      type: "Domain Agent",
      model: "Google Gemini 2.5 Flash / OpenAI GPT-4o",
      system_prompt: "System: You are the Corporate Social Media Agent. Craft a professional, engaging LinkedIn post suitable for corporate publication."
    },
    {
      id: "twitter_thread",
      name: "Microblogging & Thread Agent",
      role: "5-Part Serialized Short-Form Microblogging",
      description: "Generates character-limited sequential tweet threads (1/5 to 5/5) featuring hooks, vector analysis, and remediation steps.",
      type: "Domain Agent",
      model: "Google Gemini 2.5 Flash / OpenAI GPT-4o",
      system_prompt: "System: You are the Microblogging Agent. Generate a sequence of character-optimized tweets (1/5 to 5/5) with hashtags."
    },
    {
      id: "advisory_doc",
      name: "Formal Advisory & Compliance Agent",
      role: "Technical Advisory & Regulatory Directive",
      description: "Generates formal operational advisories with CVSS/severity scoring, affected scope matrices, and mandatory remediation directives.",
      type: "Domain Agent",
      model: "Google Gemini 2.5 Flash / OpenAI GPT-4o",
      system_prompt: "System: You are the Formal Technical Advisory Agent. Produce an authoritative formal advisory document with severity ratings and compliance checklists."
    },
    {
      id: "infographic_pkg",
      name: "Infographic & Data Viz Agent",
      role: "Visual Design Wireframe & Layout Grid",
      description: "Creates graphic design briefs specifying layout grids, metric callout badges, color token palettes, and visual asset guidelines.",
      type: "Domain Agent",
      model: "Google Gemini 2.5 Flash / OpenAI GPT-4o",
      system_prompt: "System: You are the Data Visualization & Infographic Agent. Produce a detailed visual design brief including layout grid architecture."
    },
    {
      id: "presentation",
      name: "Executive Presentation Deck Agent",
      role: "Slide-by-Slide Presentation & Speaker Notes",
      description: "Synthesizes source documents into executive slide decks featuring headlines, bullet points, layout visual cues, and presenter speaker notes.",
      type: "Domain Agent",
      model: "Google Gemini 2.5 Flash / OpenAI GPT-4o",
      system_prompt: "System: You are the Executive Presentation Deck Agent. Build a complete slide-by-slide deck with visual cues and speaker notes."
    },
    {
      id: "validation_agent",
      name: "Factual Grounding & Quality Control Agent",
      role: "Hallucination Auditing & Citation Tracking",
      description: "Cross-audits candidate agent outputs against original source text embeddings, computing grounding scores, tone alignment metrics, and citations.",
      type: "Audit System Agent",
      model: "Google Gemini 2.5 Flash / OpenAI GPT-4o",
      system_prompt: "System: Audit candidate deliverables against original source text embeddings. Flag hallucinated tokens and compute grounding score."
    }
  ];

  const activeModel = agentData?.active_model || "Google Gemini 2.5 Flash API / OpenAI GPT-4o API";
  const agents = agentData?.agents || fallbackAgents;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content animate-fade-in" 
        style={{ maxWidth: '960px', background: '#30364F', borderColor: '#E1D9BC', maxHeight: '90vh', overflowY: 'auto' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', borderBottom: '1.5px solid #ACBAC4', paddingBottom: '0.85rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Cpu size={24} color="#E1D9BC" />
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#F0F0DB' }}>AI Model & Agent Architecture Diagnostics Inspector</h3>
              <p style={{ fontSize: '0.78rem', color: '#ACBAC4' }}>Comprehensive system registry of active LLMs, domain prompts, and execution parameters</p>
            </div>
          </div>

          <button className="btn btn-secondary btn-sm" onClick={onClose} style={{ padding: '0.4rem' }}>
            <X size={18} />
          </button>
        </div>

        {/* AI Engine Telemetry Card */}
        <div style={{
          background: '#272B40',
          borderRadius: 'var(--radius-md)',
          padding: '1.25rem',
          border: '1.5px solid #E1D9BC',
          marginBottom: '1.5rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Zap size={18} color="#E1D9BC" />
              <span style={{ fontSize: '1rem', fontWeight: '700', color: '#F0F0DB' }}>Primary Generative AI Model Engine</span>
            </div>

            <span className="badge" style={{ background: '#E1D9BC', color: '#30364F', fontWeight: '700' }}>
              <CheckCircle2 size={13} /> {activeModel}
            </span>
          </div>

          {/* Model Metrics Table Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
            fontSize: '0.825rem',
            color: '#ACBAC4'
          }}>
            <div style={{ background: '#30364F', padding: '0.75rem', borderRadius: '6px', border: '1px solid #ACBAC4' }}>
              <div style={{ fontSize: '0.75rem', color: '#E1D9BC', fontWeight: '600' }}>Active LLM Model</div>
              <div style={{ fontSize: '0.9rem', color: '#F0F0DB', fontWeight: '700', marginTop: '0.25rem' }}>Gemini 2.5 Flash / GPT-4o</div>
            </div>

            <div style={{ background: '#30364F', padding: '0.75rem', borderRadius: '6px', border: '1px solid #ACBAC4' }}>
              <div style={{ fontSize: '0.75rem', color: '#E1D9BC', fontWeight: '600' }}>Factual Temperature</div>
              <div style={{ fontSize: '0.9rem', color: '#F0F0DB', fontWeight: '700', marginTop: '0.25rem' }}>0.2 (Strict Grounding)</div>
            </div>

            <div style={{ background: '#30364F', padding: '0.75rem', borderRadius: '6px', border: '1px solid #ACBAC4' }}>
              <div style={{ fontSize: '0.75rem', color: '#E1D9BC', fontWeight: '600' }}>Max Token Budget</div>
              <div style={{ fontSize: '0.9rem', color: '#F0F0DB', fontWeight: '700', marginTop: '0.25rem' }}>4,096 Tokens / Task</div>
            </div>

            <div style={{ background: '#30364F', padding: '0.75rem', borderRadius: '6px', border: '1px solid #ACBAC4' }}>
              <div style={{ fontSize: '0.75rem', color: '#E1D9BC', fontWeight: '600' }}>Streaming Protocol</div>
              <div style={{ fontSize: '0.9rem', color: '#F0F0DB', fontWeight: '700', marginTop: '0.25rem' }}>SSE & WebSockets</div>
            </div>
          </div>
        </div>

        {/* Section Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <h4 style={{ fontSize: '1.05rem', fontWeight: '700', color: '#F0F0DB' }}>
            Registered AI Multi-Agent System Nodes ({agents.length} Total Agents)
          </h4>
          <span className="badge" style={{ background: '#ACBAC4', color: '#30364F' }}>
            <Activity size={12} /> All Agents Operational
          </span>
        </div>

        {/* Agent Cards Grid */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {agents.map((agent, idx) => (
            <div
              key={agent.id || idx}
              style={{
                background: '#272B40',
                borderRadius: 'var(--radius-md)',
                padding: '1.15rem',
                border: '1.5px solid #ACBAC4'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span className="badge" style={{ background: '#E1D9BC', color: '#30364F', fontWeight: '700', fontSize: '0.7rem' }}>
                    {agent.type || "Specialized Agent"}
                  </span>
                  <h5 style={{ fontSize: '1rem', fontWeight: '700', color: '#F0F0DB' }}>{agent.name}</h5>
                </div>

                <span style={{ fontSize: '0.75rem', color: '#E1D9BC', fontFamily: 'var(--font-mono)' }}>
                  ID: {agent.id}
                </span>
              </div>

              <div style={{ fontSize: '0.825rem', color: '#E1D9BC', fontWeight: '600', marginBottom: '0.4rem' }}>
                Role Function: {agent.role}
              </div>

              <p style={{ fontSize: '0.8rem', color: '#ACBAC4', marginBottom: '0.75rem', lineHeight: '1.4' }}>
                {agent.description}
              </p>

              {agent.system_prompt && (
                <div style={{
                  background: '#30364F',
                  padding: '0.65rem 0.85rem',
                  borderRadius: '6px',
                  border: '1px solid #ACBAC4',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.75rem',
                  color: '#F0F0DB',
                  whiteSpace: 'pre-wrap',
                  lineHeight: '1.4'
                }}>
                  <span style={{ color: '#E1D9BC', fontWeight: '700' }}>System Prompt Instruction: </span>
                  {agent.system_prompt}
                </div>
              )}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

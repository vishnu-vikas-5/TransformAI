import React from 'react';
import { Cpu, Play, CheckCircle2, Loader2, GitBranch, ArrowRight, ShieldCheck, Terminal, Sparkles, Server, Database, Layers, ArrowDown } from 'lucide-react';
import { OUTPUT_FORMATS } from '../data/mockData';

export default function OrchestratorVisualizer({
  isExecuting,
  executionProgress,
  onRunOrchestration,
  selectedOutputs,
  completedOutputs,
  apiProvider,
  serverHealth
}) {

  const isOnline = serverHealth?.status === 'online';
  const activeAiName = serverHealth?.gemini_key_configured 
    ? 'Google Gemini 2.5 Flash' 
    : serverHealth?.openai_key_configured 
    ? 'OpenAI GPT-4o' 
    : apiProvider || 'SyntaxX Engine';

  return (
    <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem', background: '#1F150C', borderColor: 'rgba(225, 220, 201, 0.18)' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: '#E1DCC9',
            color: '#1F150C',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: '800',
            fontSize: '0.9rem'
          }}>3</div>
          <div>
            <h2 style={{ fontSize: '1.35rem', color: '#E1DCC9', letterSpacing: '-0.02em' }}>AI Orchestration & Core Content Intelligence</h2>
            <p style={{ fontSize: '0.8rem', color: 'rgba(225, 220, 201, 0.72)' }}>Extracts the canonical structured intelligence layer and decomposes intent across parallel domain agents</p>
          </div>
        </div>

        <button
          className={`btn ${isExecuting ? 'btn-secondary btn-disabled' : 'btn-primary'}`}
          onClick={onRunOrchestration}
          style={{ padding: '0.75rem 1.6rem', fontSize: '0.92rem' }}
        >
          {isExecuting ? (
            <>
              <Loader2 size={17} className="spin" style={{ animation: 'spin 1s linear infinite' }} />
              Synthesizing Artefacts... ({executionProgress}%)
            </>
          ) : (
            <>
              <Play size={17} /> Run Agentic Orchestration
            </>
          )}
        </button>
      </div>

      {/* Live Backend & AI Model Indicator Banner */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: '#000000',
        border: '1px solid rgba(225, 220, 201, 0.18)',
        borderRadius: 'var(--radius-md)',
        padding: '0.8rem 1.25rem',
        marginBottom: '1.75rem',
        fontSize: '0.825rem',
        color: '#E1DCC9',
        flexWrap: 'wrap',
        gap: '0.75rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Server size={16} color="#E1DCC9" />
          <span>
            <strong>Python FastAPI Engine:</strong>{' '}
            <span style={{ color: isOnline ? '#E1DCC9' : 'rgba(225, 220, 201, 0.5)', fontWeight: '700' }}>
              {isOnline ? '● Online (Port 8000)' : '● Connecting / Fallback Mode'}
            </span>
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Sparkles size={16} color="#E1DCC9" />
          <span>
            <strong>Active Intelligence Provider:</strong>{' '}
            <span style={{ color: '#E1DCC9', fontWeight: '700' }}>{activeAiName}</span>
          </span>
        </div>

        <div style={{ fontSize: '0.7rem', color: '#E1DCC9', background: '#412D15', padding: '0.2rem 0.6rem', borderRadius: '20px', border: '1px solid rgba(225, 220, 201, 0.25)', fontWeight: '700' }}>
          ⚡ SSE Multi-Agent Stream
        </div>
      </div>

      {/* ======================================================== */}
      {/* 10. VISUAL CENTERPIECE: CORE CONTENT INTELLIGENCE        */}
      {/* ONE SOURCE → ONE STRUCTURED INTELLIGENCE LAYER → OUTPUTS */}
      {/* ======================================================== */}
      <div style={{
        background: '#000000',
        borderRadius: 'var(--radius-md)',
        padding: '1.75rem',
        border: '1.5px solid #E1DCC9',
        marginBottom: '1.75rem',
        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.6)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
            <span className="badge" style={{ fontSize: '0.68rem', letterSpacing: '0.06em' }}>
              Architectural Centerpiece
            </span>
          </div>
          <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#E1DCC9', letterSpacing: '0.04em' }}>
            CORE CONTENT INTELLIGENCE ARCHITECTURE
          </h3>
          <p style={{ fontSize: '0.78rem', color: 'rgba(225, 220, 201, 0.75)', letterSpacing: '0.08em', fontWeight: '600', textTransform: 'uppercase' }}>
            ONE SOURCE &nbsp;→&nbsp; ONE STRUCTURED INTELLIGENCE LAYER &nbsp;→&nbsp; MANY COMMUNICATION ARTEFACTS
          </p>
        </div>

        {/* 3-Tier Centerpiece Diagram */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1.25rem',
          alignItems: 'center',
          position: 'relative'
        }}>
          {/* Tier 1: SOURCE */}
          <div style={{
            background: '#E1DCC9',
            border: '2px solid #E1DCC9',
            borderRadius: 'var(--radius-md)',
            padding: '1.25rem',
            textAlign: 'center',
            color: '#1F150C'
          }}>
            <div style={{ fontSize: '0.7rem', fontWeight: '800', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.35rem', color: '#412D15' }}>
              Input Layer
            </div>
            <h4 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#000000', marginBottom: '0.35rem' }}>
              SOURCE DOCUMENT
            </h4>
            <p style={{ fontSize: '0.75rem', color: '#1F150C', lineHeight: '1.35', fontWeight: '500' }}>
              Complex Technical Report, Incident Advisory, or Research Paper
            </p>
          </div>

          {/* Tier 2: CORE CONTENT INTELLIGENCE (Centerpiece Focal Card) */}
          <div style={{
            background: '#412D15',
            border: '2px solid #E1DCC9',
            borderRadius: 'var(--radius-md)',
            padding: '1.35rem',
            textAlign: 'center',
            color: '#E1DCC9',
            boxShadow: '0 4px 20px rgba(65, 45, 21, 0.6)'
          }}>
            <div style={{ fontSize: '0.7rem', fontWeight: '800', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.35rem', color: '#E1DCC9' }}>
              Canonical Intelligence
            </div>
            <h4 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#E1DCC9', marginBottom: '0.5rem', letterSpacing: '-0.01em' }}>
              CORE CONTENT INTELLIGENCE
            </h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', justifyContent: 'center' }}>
              <span style={{ fontSize: '0.65rem', background: '#1F150C', color: '#E1DCC9', padding: '0.15rem 0.5rem', borderRadius: '4px', border: '1px solid rgba(225, 220, 201, 0.25)', fontWeight: '600' }}>
                Normalized Facts
              </span>
              <span style={{ fontSize: '0.65rem', background: '#1F150C', color: '#E1DCC9', padding: '0.15rem 0.5rem', borderRadius: '4px', border: '1px solid rgba(225, 220, 201, 0.25)', fontWeight: '600' }}>
                Entities & CVEs
              </span>
              <span style={{ fontSize: '0.65rem', background: '#1F150C', color: '#E1DCC9', padding: '0.15rem 0.5rem', borderRadius: '4px', border: '1px solid rgba(225, 220, 201, 0.25)', fontWeight: '600' }}>
                Grounding Traceability
              </span>
            </div>
          </div>

          {/* Tier 3: OUTPUTS */}
          <div style={{
            background: '#1F150C',
            border: '2px solid #E1DCC9',
            borderRadius: 'var(--radius-md)',
            padding: '1.25rem',
            textAlign: 'center',
            color: '#E1DCC9'
          }}>
            <div style={{ fontSize: '0.7rem', fontWeight: '800', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.35rem', color: 'rgba(225, 220, 201, 0.72)' }}>
              Parallel Delivery
            </div>
            <h4 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#E1DCC9', marginBottom: '0.35rem' }}>
              COMMUNICATION ARTEFACTS
            </h4>
            <p style={{ fontSize: '0.75rem', color: 'rgba(225, 220, 201, 0.75)', lineHeight: '1.35', fontWeight: '500' }}>
              Executive PDF • Advisory PDF • PPTX • Infographic • Video • Social Thread
            </p>
          </div>
        </div>
      </div>

      {/* Orchestration DAG Visualizer */}
      <div style={{
        background: '#1F150C',
        borderRadius: 'var(--radius-md)',
        padding: '1.5rem',
        border: '1px solid rgba(225, 220, 201, 0.18)',
        marginBottom: '1.5rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <GitBranch size={17} color="#E1DCC9" />
            <span style={{ fontSize: '0.9rem', fontWeight: '700', color: '#E1DCC9' }}>
              Execution Graph (Directed Acyclic Graph)
            </span>
          </div>
          <span className="badge">
            {isExecuting ? 'Parallel Processing Active' : completedOutputs.length > 0 ? 'Workflow Completed' : 'Ready'}
          </span>
        </div>

        {/* Graph Nodes Flow */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          flexWrap: 'wrap',
          justifyContent: 'center',
          padding: '0.75rem 0'
        }}>
          {/* Node 1: Master Orchestrator */}
          <div style={{
            background: '#000000',
            border: '1.5px solid #E1DCC9',
            borderRadius: 'var(--radius-md)',
            padding: '1rem 1.25rem',
            textAlign: 'center',
            minWidth: '170px'
          }}>
            <Cpu size={22} color="#E1DCC9" style={{ marginBottom: '0.35rem' }} />
            <h4 style={{ fontSize: '0.85rem', fontWeight: '700', color: '#E1DCC9' }}>Master Orchestrator</h4>
            <span style={{ fontSize: '0.7rem', color: 'rgba(225, 220, 201, 0.7)' }}>Intent Decomposition</span>
          </div>

          <ArrowRight size={18} color="#E1DCC9" />

          {/* Node 2: Specialized Parallel Agents */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1, minWidth: '260px' }}>
            {selectedOutputs.map((id, index) => {
              const formatInfo = OUTPUT_FORMATS.find(f => f.id === id);
              const isDone = completedOutputs.includes(id);

              return (
                <div
                  key={id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.65rem 1rem',
                    borderRadius: 'var(--radius-sm)',
                    background: isDone ? '#412D15' : isExecuting ? '#1F150C' : '#000000',
                    border: `1px solid ${isDone ? '#E1DCC9' : 'rgba(225, 220, 201, 0.25)'}`,
                    transition: 'all 0.3s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '0.72rem', color: '#E1DCC9', fontFamily: 'var(--font-mono)', fontWeight: '700' }}>
                      Task 0{index + 1}
                    </span>
                    <span style={{ fontSize: '0.825rem', fontWeight: '700', color: '#E1DCC9' }}>
                      {formatInfo?.agent}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    {isDone ? (
                      <span className="badge" style={{ fontSize: '0.62rem', padding: '0.12rem 0.45rem' }}>
                        <CheckCircle2 size={11} /> Done
                      </span>
                    ) : isExecuting ? (
                      <span style={{ fontSize: '0.65rem', background: '#412D15', color: '#E1DCC9', padding: '0.15rem 0.5rem', borderRadius: '12px', border: '1px solid #E1DCC9', display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontWeight: '600' }}>
                        <Loader2 size={11} className="spin" style={{ animation: 'spin 1s linear infinite' }} /> Executing
                      </span>
                    ) : (
                      <span style={{ fontSize: '0.65rem', background: 'transparent', color: 'rgba(225, 220, 201, 0.5)', padding: '0.15rem 0.5rem', borderRadius: '12px', border: '1px solid rgba(225, 220, 201, 0.2)' }}>
                        Queued
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <ArrowRight size={18} color="#E1DCC9" />

          {/* Node 3: Validation Agent */}
          <div style={{
            background: '#000000',
            border: '1.5px solid #E1DCC9',
            borderRadius: 'var(--radius-md)',
            padding: '1rem 1.25rem',
            textAlign: 'center',
            minWidth: '170px'
          }}>
            <ShieldCheck size={22} color="#E1DCC9" style={{ marginBottom: '0.35rem' }} />
            <h4 style={{ fontSize: '0.85rem', fontWeight: '700', color: '#E1DCC9' }}>Validation Agent</h4>
            <span style={{ fontSize: '0.7rem', color: 'rgba(225, 220, 201, 0.7)' }}>Factual Grounding Audit</span>
          </div>
        </div>
      </div>

      {/* Live Log Console */}
      <div style={{
        background: '#000000',
        borderRadius: 'var(--radius-sm)',
        padding: '0.85rem 1rem',
        border: '1px solid rgba(225, 220, 201, 0.18)',
        fontFamily: 'var(--font-mono)',
        fontSize: '0.78rem',
        color: '#E1DCC9'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#E1DCC9', fontWeight: '700', marginBottom: '0.35rem' }}>
          <Terminal size={13} /> SyntaxX Parallel Execution Log:
        </div>
        <div style={{ color: 'rgba(225, 220, 201, 0.85)' }}>
          {isExecuting ? (
            `> [ORCHESTRATOR] Ingested document -> Extracted Core Content Intelligence -> Decomposing ${selectedOutputs.length} parallel tasks... Progress: ${executionProgress}%`
          ) : completedOutputs.length > 0 ? (
            `> [SUCCESS] Master Orchestrator complete. All ${selectedOutputs.length} communication artefacts synthesized and audited by Validation Agent.`
          ) : (
            `> [IDLE] Ready. Click "Run Agentic Orchestration" to execute parallel pipeline.`
          )}
        </div>
      </div>

    </div>
  );
}

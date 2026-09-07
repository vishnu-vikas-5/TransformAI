import React from 'react';
import { Cpu, Play, CheckCircle2, Loader2, GitBranch, ArrowRight, ShieldCheck, Terminal, Sparkles, Server } from 'lucide-react';
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
    ? 'Google Gemini 2.5 Flash API (Live AI)' 
    : serverHealth?.openai_key_configured 
    ? 'OpenAI GPT-4o API (Live AI)' 
    : apiProvider || 'TransformAI Engine';

  return (
    <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem', background: '#272B40', borderColor: '#ACBAC4' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
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
          }}>3</div>
          <div>
            <h2 style={{ fontSize: '1.35rem', color: '#F0F0DB' }}>AI Orchestrator & Task Decomposition Engine</h2>
            <p style={{ fontSize: '0.8rem', color: '#ACBAC4' }}>Master Agent creates task DAG & executes domain agents in parallel</p>
          </div>
        </div>

        <button
          className={`btn ${isExecuting ? 'btn-secondary btn-disabled' : 'btn-primary'}`}
          onClick={onRunOrchestration}
          style={{ padding: '0.8rem 1.75rem', fontSize: '0.95rem' }}
        >
          {isExecuting ? (
            <>
              <Loader2 size={18} className="spin" style={{ animation: 'spin 1s linear infinite' }} />
              Orchestrating Agents... ({executionProgress}%)
            </>
          ) : (
            <>
              <Play size={18} /> Run Agentic Orchestration
            </>
          )}
        </button>
      </div>

      {/* Live Backend & AI Model Indicator Banner */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: '#30364F',
        border: '1.5px solid #ACBAC4',
        borderRadius: 'var(--radius-md)',
        padding: '0.85rem 1.25rem',
        marginBottom: '1.5rem',
        fontSize: '0.85rem',
        color: '#F0F0DB',
        flexWrap: 'wrap',
        gap: '0.75rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <Server size={18} color="#E1D9BC" />
          <span>
            <strong>Python FastAPI Backend:</strong>{' '}
            <span style={{ color: isOnline ? '#52c41a' : '#ff4d4f', fontWeight: '800' }}>
              {isOnline ? '● Online (http://localhost:8000)' : '● Connecting / Offline'}
            </span>
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <Sparkles size={18} color="#E1D9BC" />
          <span>
            <strong>Active LLM Provider:</strong>{' '}
            <span style={{ color: '#E1D9BC', fontWeight: '800' }}>{activeAiName}</span>
          </span>
        </div>

        <div style={{ fontSize: '0.75rem', color: '#ACBAC4', background: '#272B40', padding: '0.25rem 0.65rem', borderRadius: '20px', border: '1px solid #ACBAC4', fontWeight: '700' }}>
          ⚡ SSE Real-Time Stream Active
        </div>
      </div>

      {/* Orchestration DAG Visualizer */}
      <div style={{
        background: '#30364F',
        borderRadius: 'var(--radius-md)',
        padding: '1.5rem',
        border: '1.5px solid #ACBAC4',
        marginBottom: '1.5rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <GitBranch size={18} color="#E1D9BC" />
            <span style={{ fontSize: '0.9rem', fontWeight: '700', color: '#F0F0DB' }}>
              Execution Graph (Directed Acyclic Graph)
            </span>
          </div>
          <span className="badge" style={{ background: '#ACBAC4', color: '#30364F', borderColor: '#E1D9BC' }}>
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
          padding: '1rem 0'
        }}>
          {/* Node 1: Master Orchestrator */}
          <div style={{
            background: '#272B40',
            border: '2px solid #E1D9BC',
            borderRadius: 'var(--radius-md)',
            padding: '1rem 1.25rem',
            textAlign: 'center',
            minWidth: '170px'
          }}>
            <Cpu size={24} color="#E1D9BC" style={{ marginBottom: '0.35rem' }} />
            <h4 style={{ fontSize: '0.85rem', fontWeight: '700', color: '#F0F0DB' }}>Master Orchestrator</h4>
            <span style={{ fontSize: '0.7rem', color: '#ACBAC4' }}>Decomposing Intent</span>
          </div>

          <ArrowRight size={20} color="#ACBAC4" />

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
                    background: isDone ? '#272B40' : isExecuting ? '#30364F' : '#272B40',
                    border: `1.5px solid ${isDone ? '#E1D9BC' : '#ACBAC4'}`,
                    transition: 'all 0.3s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '0.725rem', color: '#ACBAC4', fontFamily: 'var(--font-mono)', fontWeight: '700' }}>
                      Task 0{index + 1}
                    </span>
                    <span style={{ fontSize: '0.825rem', fontWeight: '700', color: '#F0F0DB' }}>
                      {formatInfo?.agent}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    {isDone ? (
                      <span className="badge" style={{ fontSize: '0.65rem', background: '#E1D9BC', color: '#30364F' }}>
                        <CheckCircle2 size={11} /> Done
                      </span>
                    ) : isExecuting ? (
                      <span className="badge" style={{ fontSize: '0.65rem', background: '#ACBAC4', color: '#30364F' }}>
                        <Loader2 size={11} className="spin" style={{ animation: 'spin 1s linear infinite' }} /> Executing
                      </span>
                    ) : (
                      <span className="badge" style={{ fontSize: '0.65rem', background: '#30364F', color: '#F0F0DB' }}>
                        Queued
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <ArrowRight size={20} color="#ACBAC4" />

          {/* Node 3: Validation Agent */}
          <div style={{
            background: '#272B40',
            border: '2px solid #E1D9BC',
            borderRadius: 'var(--radius-md)',
            padding: '1rem 1.25rem',
            textAlign: 'center',
            minWidth: '170px'
          }}>
            <ShieldCheck size={24} color="#E1D9BC" style={{ marginBottom: '0.35rem' }} />
            <h4 style={{ fontSize: '0.85rem', fontWeight: '700', color: '#F0F0DB' }}>Validation Agent</h4>
            <span style={{ fontSize: '0.7rem', color: '#ACBAC4' }}>Factual Grounding Check</span>
          </div>
        </div>

      </div>

      {/* Live Log */}
      <div style={{
        background: '#30364F',
        borderRadius: 'var(--radius-sm)',
        padding: '0.85rem 1rem',
        border: '1.5px solid #ACBAC4',
        fontFamily: 'var(--font-mono)',
        fontSize: '0.785rem',
        color: '#F0F0DB'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#E1D9BC', fontWeight: '700', marginBottom: '0.35rem' }}>
          <Terminal size={13} /> Live Orchestration Output Stream:
        </div>
        <div>
          {isExecuting ? (
            `> [ORCHESTRATOR] Ingested document -> Decomposing ${selectedOutputs.length} parallel micro-tasks... Progress: ${executionProgress}%`
          ) : completedOutputs.length > 0 ? (
            `> [SUCCESS] Master Orchestrator complete. All ${selectedOutputs.length} outputs generated & validated by Validation Agent.`
          ) : (
            `> [IDLE] Ready. Click "Run Agentic Orchestration" to execute parallel pipeline.`
          )}
        </div>
      </div>

    </div>
  );
}

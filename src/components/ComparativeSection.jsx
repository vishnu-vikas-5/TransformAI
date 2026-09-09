import React from 'react';
import { ShieldCheck, Check } from 'lucide-react';
import { COMPARATIVE_DATA } from '../data/mockData';

export default function ComparativeSection() {
  return (
    <div id="comparative" style={{ padding: '3.5rem 0', background: '#000000' }}>
      <div className="container">

        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 3rem auto' }}>
          <span className="badge" style={{ marginBottom: '0.75rem' }}>
            <ShieldCheck size={13} /> Comparative Analysis
          </span>
          <h2 style={{ fontSize: '2.2rem', marginBottom: '0.75rem', color: '#E1DCC9' }}>
            Why Agentic AI Outperforms Single-Prompt LLMs
          </h2>
          <p style={{ color: 'rgba(225, 220, 201, 0.72)', fontSize: '1rem', lineHeight: '1.6' }}>
            Traditional single-prompt LLM calls force one mega-prompt to generate multiple outputs in a shared context, leading to formatting bleed, context degradation, and high hallucination rates. SyntaxX uses decoupled domain agents anchored by a Core Content Intelligence layer.
          </p>
        </div>

        {/* Matrix Table */}
        <div className="glass-panel" style={{ overflowX: 'auto', padding: '1rem', background: '#1F150C', borderColor: 'rgba(225, 220, 201, 0.18)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '700px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(225, 220, 201, 0.25)' }}>
                <th style={{ padding: '1rem', fontSize: '0.85rem', color: '#E1DCC9' }}>Evaluation Metric / Capability</th>
                <th style={{ padding: '1rem', fontSize: '0.85rem', color: 'rgba(225, 220, 201, 0.72)' }}>Traditional Manual Creation</th>
                <th style={{ padding: '1rem', fontSize: '0.85rem', color: 'rgba(225, 220, 201, 0.72)' }}>Single-Prompt LLM Workflow</th>
                <th style={{ padding: '1rem', fontSize: '0.85rem', color: '#1F150C', background: '#E1DCC9', fontWeight: '800' }}>SyntaxX Agentic Engine</th>
              </tr>
            </thead>
            <tbody>
              {COMPARATIVE_DATA.map((row, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid rgba(225, 220, 201, 0.08)' }}>
                  <td style={{ padding: '1rem', fontWeight: '700', fontSize: '0.875rem', color: '#E1DCC9' }}>{row.feature}</td>
                  <td style={{ padding: '1rem', fontSize: '0.825rem', color: 'rgba(225, 220, 201, 0.72)' }}>{row.manual}</td>
                  <td style={{ padding: '1rem', fontSize: '0.825rem', color: 'rgba(225, 220, 201, 0.72)' }}>{row.singleLlm}</td>
                  <td style={{ padding: '1rem', fontSize: '0.85rem', fontWeight: '700', color: '#E1DCC9', background: '#412D15' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Check size={16} color="#E1DCC9" /> {row.transformAi}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}

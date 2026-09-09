import React from 'react';
import { ShieldCheck, Check } from 'lucide-react';
import { COMPARATIVE_DATA } from '../data/mockData';

export default function ComparativeSection() {
  return (
    <div id="comparative" style={{ padding: '3rem 0', background: '#000000' }}>
      <div className="container">

        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 3rem auto' }}>
          <span className="badge" style={{ marginBottom: '0.75rem', background: '#DFD0B8', color: '#000000', borderColor: '#E1DCC9' }}>
            <ShieldCheck size={14} /> Comparative Analysis
          </span>
          <h2 style={{ fontSize: '2.2rem', marginBottom: '0.75rem', color: '#FFFFFF' }}>
            Why Agentic AI Outperforms Single-Prompt LLMs
          </h2>
          <p style={{ color: '#E1DCC9', fontSize: '1rem', lineHeight: '1.6', opacity: 0.9 }}>
            Traditional single-prompt LLM calls force one prompt to generate multiple outputs in a shared context, leading to formatting bleed, context degradation, and high hallucination rates.
          </p>
        </div>

        {/* Matrix Table */}
        <div className="glass-panel" style={{ overflowX: 'auto', padding: '1rem', background: '#121212', borderColor: '#DFD0B8' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '700px' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #DFD0B8' }}>
                <th style={{ padding: '1rem', fontSize: '0.9rem', color: '#FFFFFF' }}>Evaluation Metric / Feature</th>
                <th style={{ padding: '1rem', fontSize: '0.9rem', color: '#E1DCC9', opacity: 0.9 }}>Traditional Manual Creation</th>
                <th style={{ padding: '1rem', fontSize: '0.9rem', color: '#E1DCC9', opacity: 0.9 }}>Single-Prompt LLM Workflow</th>
                <th style={{ padding: '1rem', fontSize: '0.9rem', color: '#000000', background: '#DFD0B8', fontWeight: '800' }}>TransformAI Agentic Engine</th>
              </tr>
            </thead>
            <tbody>
              {COMPARATIVE_DATA.map((row, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #222222' }}>
                  <td style={{ padding: '1rem', fontWeight: '700', fontSize: '0.875rem', color: '#FFFFFF' }}>{row.feature}</td>
                  <td style={{ padding: '1rem', fontSize: '0.825rem', color: '#E1DCC9', opacity: 0.85 }}>{row.manual}</td>
                  <td style={{ padding: '1rem', fontSize: '0.825rem', color: '#E1DCC9', opacity: 0.85 }}>{row.singleLlm}</td>
                  <td style={{ padding: '1rem', fontSize: '0.85rem', fontWeight: '700', color: '#FFFFFF', background: '#000000' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Check size={16} color="#DFD0B8" /> {row.transformAi}
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

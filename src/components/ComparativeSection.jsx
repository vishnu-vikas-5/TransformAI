import React from 'react';
import { ShieldCheck, Check } from 'lucide-react';
import { COMPARATIVE_DATA } from '../data/mockData';

export default function ComparativeSection() {
  return (
    <div id="comparative" style={{ padding: '3rem 0', background: '#30364F' }}>
      <div className="container">
        
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 3rem auto' }}>
          <span className="badge" style={{ marginBottom: '0.75rem', background: '#ACBAC4', color: '#30364F', borderColor: '#E1D9BC' }}>
            <ShieldCheck size={14} /> Comparative Analysis
          </span>
          <h2 style={{ fontSize: '2.2rem', marginBottom: '0.75rem', color: '#F0F0DB' }}>
            Why Agentic AI Outperforms Single-Prompt LLMs
          </h2>
          <p style={{ color: '#ACBAC4', fontSize: '1rem', lineHeight: '1.6' }}>
            Traditional single-prompt LLM calls force one prompt to generate multiple outputs in a shared context, leading to formatting bleed, context degradation, and high hallucination rates.
          </p>
        </div>

        {/* Matrix Table */}
        <div className="glass-panel" style={{ overflowX: 'auto', padding: '1rem', background: '#272B40', borderColor: '#ACBAC4' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '700px' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #ACBAC4' }}>
                <th style={{ padding: '1rem', fontSize: '0.9rem', color: '#F0F0DB' }}>Evaluation Metric / Feature</th>
                <th style={{ padding: '1rem', fontSize: '0.9rem', color: '#ACBAC4' }}>Traditional Manual Creation</th>
                <th style={{ padding: '1rem', fontSize: '0.9rem', color: '#ACBAC4' }}>Single-Prompt LLM Workflow</th>
                <th style={{ padding: '1rem', fontSize: '0.9rem', color: '#30364F', background: '#E1D9BC', fontWeight: '800' }}>TransformAI Agentic Engine</th>
              </tr>
            </thead>
            <tbody>
              {COMPARATIVE_DATA.map((row, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #30364F' }}>
                  <td style={{ padding: '1rem', fontWeight: '700', fontSize: '0.875rem', color: '#F0F0DB' }}>{row.feature}</td>
                  <td style={{ padding: '1rem', fontSize: '0.825rem', color: '#ACBAC4' }}>{row.manual}</td>
                  <td style={{ padding: '1rem', fontSize: '0.825rem', color: '#ACBAC4' }}>{row.singleLlm}</td>
                  <td style={{ padding: '1rem', fontSize: '0.85rem', fontWeight: '700', color: '#F0F0DB', background: '#30364F' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Check size={16} color="#E1D9BC" /> {row.transformAi}
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

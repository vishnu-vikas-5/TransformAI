import React from 'react';
import { CheckSquare, Square, FileText, Video, Share2, MessageSquare, ShieldAlert, PieChart, Layers } from 'lucide-react';
import { OUTPUT_FORMATS } from '../data/mockData';

const ICON_MAP = {
  FileText: FileText,
  Video: Video,
  Share2: Share2,
  MessageSquare: MessageSquare,
  ShieldAlert: ShieldAlert,
  PieChart: PieChart,
  Layers: Layers
};

export default function OutputSelector({
  selectedOutputs,
  setSelectedOutputs,
  selectedTone,
  setSelectedTone,
  detailLevel,
  setDetailLevel,
  communicationStyle,
  setCommunicationStyle
}) {

  const toggleOutput = (id) => {
    if (selectedOutputs.includes(id)) {
      if (selectedOutputs.length === 1) return; // keep at least 1 selected
      setSelectedOutputs(selectedOutputs.filter(item => item !== id));
    } else {
      setSelectedOutputs([...selectedOutputs, id]);
    }
  };

  const selectAll = () => {
    setSelectedOutputs(OUTPUT_FORMATS.map(f => f.id));
  };

  return (
    <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem', background: '#121212', borderColor: '#DFD0B8' }}>

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
          }}>2</div>
          <div>
            <h2 style={{ fontSize: '1.35rem', color: '#FFFFFF' }}>Requirement & Target Output Selection</h2>
            <p style={{ fontSize: '0.8rem', color: '#E1DCC9', opacity: 0.9 }}>Select one or multiple desired output deliverables to generate from the source content</p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button className="btn btn-secondary btn-sm" onClick={selectAll}>Select All Deliverables</button>
          <span className="badge" style={{ background: '#DFD0B8', color: '#000000', borderColor: '#E1DCC9' }}>Step 2 of 4</span>
        </div>
      </div>

      {/* Target Format Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '1rem',
        marginBottom: '1.75rem'
      }}>
        {OUTPUT_FORMATS.map((format) => {
          const isSelected = selectedOutputs.includes(format.id);
          const IconComp = ICON_MAP[format.icon] || FileText;

          return (
            <div
              key={format.id}
              id={`output-selector-${format.id}`}
              onClick={() => toggleOutput(format.id)}
              style={{
                padding: '1.25rem',
                borderRadius: 'var(--radius-md)',
                background: isSelected ? '#000000' : 'rgba(0, 0, 0, 0.6)',
                border: `2px solid ${isSelected ? '#DFD0B8' : '#222222'}`,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                gap: '1rem',
                alignItems: 'flex-start'
              }}
            >
              <div style={{ marginTop: '2px', color: isSelected ? '#DFD0B8' : '#FFFFFF' }}>
                {isSelected ? <CheckSquare size={20} /> : <Square size={20} />}
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <IconComp size={16} color="#DFD0B8" />
                    <h3 style={{ fontSize: '0.975rem', fontWeight: '700', color: '#FFFFFF' }}>{format.title}</h3>
                  </div>
                  <span className="badge" style={{ fontSize: '0.65rem', background: '#DFD0B8', color: '#000000', borderColor: '#E1DCC9' }}>
                    {format.agent.replace(' Agent', '')}
                  </span>
                </div>

                <p style={{ fontSize: '0.785rem', color: '#E1DCC9', lineHeight: '1.35', marginBottom: '0.5rem', opacity: 0.9 }}>
                  {format.description}
                </p>

                <span style={{ fontSize: '0.725rem', color: '#FFFFFF', fontWeight: '600' }}>
                  Target Audience: {format.audience}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

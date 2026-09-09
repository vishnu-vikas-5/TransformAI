import React from 'react';
import { CheckSquare, Square, FileText, Video, Share2, MessageSquare, ShieldAlert, PieChart, Layers, Settings2 } from 'lucide-react';
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
          }}>2</div>
          <div>
            <h2 style={{ fontSize: '1.35rem', color: '#E1DCC9', letterSpacing: '-0.02em' }}>Target Output & Artefact Selection</h2>
            <p style={{ fontSize: '0.8rem', color: 'rgba(225, 220, 201, 0.72)' }}>Select target communication artefacts to synthesize in parallel from the core intelligence layer</p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button className="btn btn-secondary btn-sm" onClick={selectAll}>Select All Artefacts</button>
          <span className="badge">Step 2 of 4</span>
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
              onClick={() => toggleOutput(format.id)}
              style={{
                padding: '1.25rem',
                borderRadius: 'var(--radius-md)',
                background: isSelected ? '#412D15' : '#1F150C',
                border: `1.5px solid ${isSelected ? '#E1DCC9' : 'rgba(225, 220, 201, 0.18)'}`,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                gap: '1rem',
                alignItems: 'flex-start'
              }}
            >
              <div style={{ marginTop: '2px', color: '#E1DCC9' }}>
                {isSelected ? <CheckSquare size={20} /> : <Square size={20} />}
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                    <IconComp size={16} color="#E1DCC9" />
                    <h3 style={{ fontSize: '0.975rem', fontWeight: '700', color: '#E1DCC9' }}>{format.title}</h3>
                  </div>
                  <span className="badge" style={{ fontSize: '0.62rem', padding: '0.12rem 0.45rem' }}>
                    {format.agent.replace(' Agent', '')}
                  </span>
                </div>

                <p style={{ fontSize: '0.785rem', color: 'rgba(225, 220, 201, 0.72)', lineHeight: '1.4', marginBottom: '0.5rem' }}>
                  {format.description}
                </p>

                <span style={{ fontSize: '0.725rem', color: '#E1DCC9', fontWeight: '600' }}>
                  Target Audience: {format.audience}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Configurable Parameters Section */}
      <div style={{
        background: '#1F150C',
        borderRadius: 'var(--radius-md)',
        padding: '1.25rem',
        border: '1px solid rgba(225, 220, 201, 0.2)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: '#E1DCC9' }}>
          <Settings2 size={16} />
          <h4 style={{ fontSize: '0.9rem', fontWeight: '700' }}>Synthesis Configuration Parameters</h4>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.25rem'
        }}>
          {/* Parameter 1: Communication Tone */}
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', marginBottom: '0.4rem', color: 'rgba(225, 220, 201, 0.72)' }}>
              Target Tone
            </label>
            <select
              value={selectedTone}
              onChange={(e) => setSelectedTone(e.target.value)}
              style={{
                width: '100%',
                padding: '0.6rem 0.75rem',
                background: '#000000',
                border: '1px solid rgba(225, 220, 201, 0.25)',
                borderRadius: 'var(--radius-sm)',
                color: '#E1DCC9',
                fontFamily: 'var(--font-sans)',
                fontSize: '0.825rem',
                outline: 'none'
              }}
            >
              <option value="formal">Strategic & Executive (Formal)</option>
              <option value="actionable">Actionable & Urgent (Operational)</option>
              <option value="public">Public Engagement (Social / Media)</option>
              <option value="technical">Technical & Precise (Engineering)</option>
            </select>
          </div>

          {/* Parameter 2: Level of Detail */}
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', marginBottom: '0.4rem', color: 'rgba(225, 220, 201, 0.72)' }}>
              Level of Detail
            </label>
            <select
              value={detailLevel}
              onChange={(e) => setDetailLevel(e.target.value)}
              style={{
                width: '100%',
                padding: '0.6rem 0.75rem',
                background: '#000000',
                border: '1px solid rgba(225, 220, 201, 0.25)',
                borderRadius: 'var(--radius-sm)',
                color: '#E1DCC9',
                fontFamily: 'var(--font-sans)',
                fontSize: '0.825rem',
                outline: 'none'
              }}
            >
              <option value="high">Comprehensive & Detailed</option>
              <option value="medium">Balanced Standard</option>
              <option value="concise">Concise & High-Level Briefing</option>
            </select>
          </div>

          {/* Parameter 3: Content Style */}
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', marginBottom: '0.4rem', color: 'rgba(225, 220, 201, 0.72)' }}>
              Communication Style
            </label>
            <select
              value={communicationStyle}
              onChange={(e) => setCommunicationStyle(e.target.value)}
              style={{
                width: '100%',
                padding: '0.6rem 0.75rem',
                background: '#000000',
                border: '1px solid rgba(225, 220, 201, 0.25)',
                borderRadius: 'var(--radius-sm)',
                color: '#E1DCC9',
                fontFamily: 'var(--font-sans)',
                fontSize: '0.825rem',
                outline: 'none'
              }}
            >
              <option value="bullet">Structured Bulleted & Modular</option>
              <option value="narrative">Conversational & Story-Driven</option>
              <option value="directive">Direct Policy & Actionable</option>
            </select>
          </div>
        </div>
      </div>

    </div>
  );
}

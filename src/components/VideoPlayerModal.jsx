import React, { useState, useEffect } from 'react';
import { X, Play, Pause, Volume2, VolumeX, SkipForward, Film, Download, FileText } from 'lucide-react';
import { exportToPptx, exportToPdf } from '../utils/exportUtils';

export default function VideoPlayerModal({ isOpen, onClose, videoData, docId }) {
  if (!isOpen || !videoData) return null;

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentScene, setCurrentScene] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  const scenes = [
    {
      id: 1,
      time: "00:00 - 00:15",
      title: "Opening Hook & Alert",
      visual: "Warning Flash over Enterprise Network Topology",
      narration: "A critical zero-day vulnerability designated CVE-2024-38077 has been discovered in Windows Remote Desktop Licensing services. Here is what your security team needs to know right now.",
      subtitle: "[Critical Zero-Day Alert: CVE-2024-38077 | CVSS 9.8]",
      graphic: "CVE-2024-38077 ALERT"
    },
    {
      id: 2,
      time: "00:15 - 00:45",
      title: "Threat Infiltration Vector",
      visual: "Port 135 Packet Handsaw & LockBit 4.0 Payload Staging",
      narration: "Unauthenticated attackers are exploiting heap buffer overflows over Port 135 to gain full SYSTEM privileges. Intrusion to ransomware staging can occur in under 45 minutes.",
      subtitle: "[Intrusion Vector: Port 135 / RPC | Threat: SYSTEM Privilege Takeover]",
      graphic: "Port 135 / RPC Infiltration"
    },
    {
      id: 3,
      time: "00:45 - 01:15",
      title: "Actionable Remediation Protocol",
      visual: "Terminal Patch Execution & Firewall Port Blocking",
      narration: "Immediate action is required: Block Port 135 at your perimeter firewall, apply Microsoft KB5040442, and enforce hardware MFA across domain admin sessions.",
      subtitle: "[Action Steps: 1. Block Port 135 | 2. Patch KB5040442 | 3. Enforce MFA]",
      graphic: "Firewall Block & KB5040442 Patch"
    },
    {
      id: 4,
      time: "00:15 - 01:30",
      title: "Outro & Advisory Download",
      visual: "Company Security Operations Logo & Advisory Link",
      narration: "Stay secure. Download the complete technical advisory and incident response checklist at security.company.com.",
      subtitle: "[Read Full Advisory: security.company.com]",
      graphic: "Security Operations Center"
    }
  ];

  const scene = scenes[currentScene];

  // Speech synthesis voiceover narration
  useEffect(() => {
    if (isPlaying && 'speechSynthesis' in window && !isMuted) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(scene.narration);
      utterance.rate = 1.0;
      utterance.onend = () => {
        if (currentScene < scenes.length - 1) {
          setCurrentScene(prev => prev + 1);
        } else {
          setIsPlaying(false);
        }
      };
      window.speechSynthesis.speak(utterance);
    } else {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    }
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [isPlaying, currentScene, isMuted]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleNextScene = () => {
    if (currentScene < scenes.length - 1) {
      setCurrentScene(currentScene + 1);
    } else {
      setCurrentScene(0);
    }
  };

  const handleExportPptx = () => {
    exportToPptx("Video Storyboard & Script Deck", videoData.content, docId);
  };

  const handleExportPdf = () => {
    exportToPdf("Video Production Package", videoData.content, docId);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content animate-fade-in" style={{ maxWidth: '900px', background: '#30364F', borderColor: '#E1D9BC' }} onClick={(e) => e.stopPropagation()}>
        
        {/* Modal Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '1.5px solid #ACBAC4', paddingBottom: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Film size={22} color="#E1D9BC" />
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#F0F0DB' }}>Video Package Preview Studio</h3>
              <p style={{ fontSize: '0.75rem', color: '#ACBAC4' }}>Interactive scene playback with voiceover synthesis & subtitles</p>
            </div>
          </div>

          <button className="btn btn-secondary btn-sm" onClick={onClose} style={{ padding: '0.4rem' }}>
            <X size={18} />
          </button>
        </div>

        {/* 16:9 Video Canvas Screen */}
        <div style={{
          width: '100%',
          aspectRatio: '16/9',
          background: '#272B40',
          borderRadius: 'var(--radius-md)',
          border: '2px solid #E1D9BC',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.4)',
          marginBottom: '1.25rem',
          overflow: 'hidden'
        }}>
          {/* Top Scene Bar */}
          <div style={{ position: 'absolute', top: '16px', left: '16px', right: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="badge" style={{ fontSize: '0.7rem', background: '#ACBAC4', color: '#30364F', borderColor: '#E1D9BC' }}>
              Scene {scene.id} of {scenes.length}: {scene.time}
            </span>
            <span style={{ fontSize: '0.75rem', color: '#F0F0DB', background: '#30364F', padding: '0.2rem 0.6rem', borderRadius: '4px', border: '1px solid #ACBAC4', fontWeight: '700' }}>
              {scene.title}
            </span>
          </div>

          {/* Center Motion Graphic Preview */}
          <div style={{ textAlign: 'center', margin: 'auto' }}>
            <div style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '0.5rem', color: '#E1D9BC', letterSpacing: '-0.02em' }}>
              {scene.graphic}
            </div>
            <p style={{ fontSize: '0.85rem', color: '#F0F0DB', maxWidth: '500px', margin: '0 auto', background: '#30364F', padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid #ACBAC4', fontWeight: '600' }}>
              Visual Cue: {scene.visual}
            </p>
          </div>

          {/* Subtitles Overlay */}
          <div style={{
            position: 'absolute',
            bottom: '16px',
            left: '24px',
            right: '24px',
            background: '#30364F',
            border: '1.5px solid #E1D9BC',
            borderRadius: '8px',
            padding: '0.6rem 1rem',
            textAlign: 'center',
            fontSize: '0.875rem',
            fontWeight: '600',
            color: '#F0F0DB'
          }}>
            {scene.subtitle}
          </div>
        </div>

        {/* Video Controls Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: '#272B40',
          padding: '0.85rem 1.25rem',
          borderRadius: 'var(--radius-md)',
          marginBottom: '1.25rem',
          border: '1.5px solid #ACBAC4'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button className="btn btn-primary btn-sm" onClick={togglePlay}>
              {isPlaying ? <Pause size={16} /> : <Play size={16} />}
              {isPlaying ? 'Pause Voiceover' : 'Play Voiceover'}
            </button>

            <button className="btn btn-secondary btn-sm" onClick={handleNextScene}>
              <SkipForward size={15} /> Next Scene
            </button>

            <button className="btn btn-secondary btn-sm" onClick={() => setIsMuted(!isMuted)}>
              {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
            </button>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {scenes.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => setCurrentScene(idx)}
                style={{
                  padding: '0.3rem 0.6rem',
                  fontSize: '0.75rem',
                  borderRadius: '4px',
                  border: '1px solid #E1D9BC',
                  background: currentScene === idx ? '#E1D9BC' : '#30364F',
                  color: currentScene === idx ? '#30364F' : '#F0F0DB',
                  cursor: 'pointer',
                  fontWeight: '700'
                }}
              >
                S{s.id}
              </button>
            ))}
          </div>
        </div>

        {/* Download Deliverables Bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.85rem', color: '#ACBAC4', fontWeight: '700' }}>
            Download Real Media Deliverables:
          </span>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button className="btn btn-primary btn-sm" onClick={handleExportPptx}>
              <Download size={14} /> Download Presentation Deck (.pptx)
            </button>

            <button className="btn btn-secondary btn-sm" onClick={handleExportPdf}>
              <FileText size={14} /> Download PDF Brief (.pdf)
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

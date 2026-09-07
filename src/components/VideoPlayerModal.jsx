import React, { useState, useEffect, useRef } from 'react';
import { X, Play, Pause, Volume2, VolumeX, SkipForward, Film, Download, FileText, Video } from 'lucide-react';
import { exportToPptx, exportToPdf, exportToMarkdown, exportToText, downloadBlob } from '../utils/exportUtils';

export function parseScenesFromMarkdown(content, docTitle = "Document Briefing") {
  if (!content) return [];

  // Match Markdown sections starting with #### Scene or ### Scene or Scene N
  const rawBlocks = content.split(/####\s*|###\s*/).filter(b => b.toLowerCase().includes('scene') || b.toLowerCase().includes('visual') || b.toLowerCase().includes('narration'));
  
  if (rawBlocks.length > 0) {
    const parsed = rawBlocks.map((block, idx) => {
      const lines = block.split('\n').map(l => l.trim()).filter(Boolean);
      const headerLine = lines[0] || `Scene ${idx + 1}`;
      
      const timeMatch = headerLine.match(/\[(.*?)\]/);
      const timeStr = timeMatch ? timeMatch[1] : `00:${(idx * 15).toString().padStart(2, '0')} - 00:${((idx + 1) * 15).toString().padStart(2, '0')}`;
      const titleStr = headerLine.replace(/\[.*?\]/, '').replace(/^Scene\s*\d+[:\s\-]*/i, '').trim() || `Scene ${idx + 1}`;
      
      let visual = `Dynamic Motion Graphic & Key Metrics`;
      let narration = `Briefing regarding ${docTitle}. Key insights synthesized by TransformAI.`;
      let subtitle = `[${titleStr}]`;
      let graphic = titleStr.toUpperCase();

      lines.slice(1).forEach(line => {
        if (line.toLowerCase().includes('visual:')) {
          visual = line.replace(/.*visual:\s*/i, '').replace(/\*\*/g, '');
        } else if (line.toLowerCase().includes('narration:')) {
          narration = line.replace(/.*narration:\s*/i, '').replace(/\*\*/g, '');
        } else if (line.toLowerCase().includes('subtitle:')) {
          subtitle = line.replace(/.*subtitle:\s*/i, '').replace(/\*\*/g, '');
        }
      });

      return {
        id: idx + 1,
        time: timeStr,
        title: titleStr,
        visual,
        narration: narration || visual,
        subtitle: subtitle || `[${titleStr}]`,
        graphic: graphic.slice(0, 32)
      };
    });

    if (parsed.length > 0) return parsed;
  }

  // Dynamic Fallback Generator tailored to source document text
  const cleanLines = (content || "").split('\n').map(l => l.replace(/[#*`-]/g, '').trim()).filter(l => l.length > 15);
  return [
    {
      id: 1,
      time: "00:00 - 00:15",
      title: "Executive Introduction & Alert",
      visual: "Motion Graphic Banner over Abstract Grid Pattern",
      narration: cleanLines[0] || `Critical operational briefing regarding ${docTitle}.`,
      subtitle: `[Executive Overview: ${docTitle.slice(0, 35)}]`,
      graphic: docTitle.slice(0, 25).toUpperCase()
    },
    {
      id: 2,
      time: "00:15 - 00:45",
      title: "Core Technical Analysis",
      visual: "System Topology & Operational Metric Overlay",
      narration: cleanLines[1] || `Key operational vectors and findings extracted from submitted content.`,
      subtitle: `[Core Analysis & Operational Vectors]`,
      graphic: "TECHNICAL VECTORS"
    },
    {
      id: 3,
      time: "00:45 - 01:15",
      title: "Strategic Action Directives",
      visual: "Numbered Remediation Protocol & Directive Diagram",
      narration: cleanLines[2] || `Actionable recommendations: Review parameters and execute compliance protocols.`,
      subtitle: `[Remediation Directives & Action Plan]`,
      graphic: "ACTION DIRECTIVES"
    },
    {
      id: 4,
      time: "01:15 - 01:30",
      title: "Summary & Advisory Outro",
      visual: "Security Operations Center Logo & Resource Link",
      narration: cleanLines[3] || `Thank you for reviewing. Download full advisory and detailed reports in the workbench.`,
      subtitle: `[Download Full Advisory Deck]`,
      graphic: "OPERATIONS SUMMARY"
    }
  ];
}

export default function VideoPlayerModal({ isOpen, onClose, videoData, docId, docTitle = "Document" }) {
  if (!isOpen || !videoData) return null;

  const scenes = parseScenesFromMarkdown(videoData.content, docTitle);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentScene, setCurrentScene] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingStatus, setRecordingStatus] = useState(null);
  
  const canvasRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const recordedChunksRef = useRef([]);

  const scene = scenes[currentScene] || scenes[0];

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

  // HTML5 Canvas Motion Graphic Animation Rendering
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let tick = 0;

    const render = () => {
      tick += 0.04;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Background Slate Gradient
      const grad = ctx.createRadialGradient(canvas.width/2, canvas.height/2, 50, canvas.width/2, canvas.height/2, canvas.width);
      grad.addColorStop(0, '#30364F');
      grad.addColorStop(1, '#272B40');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Animated Dot Grid Pattern
      ctx.fillStyle = 'rgba(172, 186, 196, 0.15)';
      for (let x = 20; x < canvas.width; x += 40) {
        for (let y = 20; y < canvas.height; y += 40) {
          const radius = 1.5 + Math.sin(tick + (x + y) * 0.01) * 0.5;
          ctx.beginPath();
          ctx.arc(x, y, Math.max(0.5, radius), 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Top Header Pill
      ctx.fillStyle = '#E1D9BC';
      ctx.fillRect(40, 30, canvas.width - 80, 4);

      // Scene Title & Badge
      ctx.fillStyle = '#ACBAC4';
      ctx.font = 'bold 18px sans-serif';
      ctx.fillText(`SCENE ${scene.id} OF ${scenes.length}: ${scene.time}`, 40, 70);

      ctx.fillStyle = '#F0F0DB';
      ctx.font = 'bold 28px sans-serif';
      ctx.fillText(scene.title, 40, 110);

      // Central Graphic Card Box
      ctx.fillStyle = 'rgba(48, 54, 79, 0.85)';
      ctx.strokeStyle = '#E1D9BC';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(40, 140, canvas.width - 80, 300, 16);
      ctx.fill();
      ctx.stroke();

      // Pulsing Motion Text
      const textY = 240 + Math.sin(tick * 2) * 6;
      ctx.fillStyle = '#E1D9BC';
      ctx.font = '800 42px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(scene.graphic, canvas.width / 2, textY);

      // Visual Cue Subtext
      ctx.fillStyle = '#ACBAC4';
      ctx.font = '600 20px sans-serif';
      ctx.fillText(`Visual Cue: ${scene.visual.slice(0, 70)}`, canvas.width / 2, textY + 50);
      ctx.textAlign = 'left';

      // Live Audio Waveform Visualizer
      if (isPlaying) {
        ctx.fillStyle = '#E1D9BC';
        const bars = 24;
        const startX = canvas.width / 2 - (bars * 12) / 2;
        for (let i = 0; i < bars; i++) {
          const barH = 10 + Math.abs(Math.sin(tick * 4 + i * 0.3)) * 40;
          ctx.fillRect(startX + i * 12, 380 - barH / 2, 6, barH);
        }
      }

      // Bottom Subtitles Bar Box
      ctx.fillStyle = '#272B40';
      ctx.strokeStyle = '#ACBAC4';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(40, 470, canvas.width - 80, 80, 12);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#F0F0DB';
      ctx.font = '600 20px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(scene.subtitle, canvas.width / 2, 518);
      ctx.textAlign = 'left';

      animationFrameId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationFrameId);
  }, [currentScene, scene, isPlaying]);

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

  // Download Recorded Video (.webm / .mp4) via MediaRecorder & canvas stream
  const handleDownloadVideo = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      setIsRecording(true);
      setRecordingStatus("Recording scene animation...");
      recordedChunksRef.current = [];

      const stream = canvas.captureStream(30);
      
      const candidateTypes = [
        'video/webm;codecs=vp9',
        'video/webm',
        'video/mp4;codecs=avc1.42E01E',
        'video/mp4'
      ];
      const selectedMime = candidateTypes.find(t => typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported(t)) || '';
      
      const recorderOptions = selectedMime ? { mimeType: selectedMime } : undefined;
      const recorder = new MediaRecorder(stream, recorderOptions);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          recordedChunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
        const cleanTitle = (docTitle || "video").toLowerCase().replace(/[^a-z0-9]+/g, '_');
        const filename = `${docId}_${cleanTitle}_package.webm`;
        downloadBlob(blob, filename);

        setIsRecording(false);
        setRecordingStatus(`Downloaded ${filename}!`);
        setTimeout(() => setRecordingStatus(null), 4000);
      };

      recorder.start();
      setIsPlaying(true);

      // Record 6 seconds of animation or full scenes
      setTimeout(() => {
        if (recorder.state !== 'inactive') {
          recorder.stop();
          setIsPlaying(false);
        }
      }, 6000);

    } catch (err) {
      console.error("Video recording error:", err);
      setIsRecording(false);
      // Fallback: Export text script
      exportToText("Video Package Script", videoData.content, docId);
    }
  };

  const handleExportPptx = async () => {
    await exportToPptx("Video Storyboard & Script Deck", videoData.content, docId);
  };

  const handleExportPdf = () => {
    exportToPdf("Video Production Package", videoData.content, docId);
  };

  const handleExportMd = () => {
    exportToMarkdown("Video Production Package Script", videoData.content, docId);
  };

  const handleExportTxt = () => {
    exportToText("Video Production Package Script", videoData.content, docId);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content animate-fade-in" style={{ maxWidth: '920px', background: '#30364F', borderColor: '#E1D9BC' }} onClick={(e) => e.stopPropagation()}>

        {/* Modal Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '1.5px solid #ACBAC4', paddingBottom: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Film size={22} color="#E1D9BC" />
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#F0F0DB' }}>Video Package Production Studio</h3>
              <p style={{ fontSize: '0.75rem', color: '#ACBAC4' }}>Dynamic canvas video renderer with real voiceover synthesis & downloadable video file</p>
            </div>
          </div>

          <button className="btn btn-secondary btn-sm" onClick={onClose} style={{ padding: '0.4rem' }}>
            <X size={18} />
          </button>
        </div>

        {/* Dynamic HTML5 Motion Graphic Video Canvas */}
        <div style={{ position: 'relative', width: '100%', marginBottom: '1.25rem' }}>
          <canvas
            ref={canvasRef}
            width={960}
            height={540}
            style={{
              width: '100%',
              height: 'auto',
              borderRadius: 'var(--radius-md)',
              border: '2px solid #E1D9BC',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.4)',
              background: '#272B40'
            }}
          />

          {recordingStatus && (
            <div style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              background: '#E1D9BC',
              color: '#30364F',
              padding: '0.4rem 0.8rem',
              borderRadius: '6px',
              fontSize: '0.8rem',
              fontWeight: '700'
            }}>
              {recordingStatus}
            </div>
          )}
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
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

          {/* Scene Selector Buttons */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
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

        {/* Download Deliverables Action Bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.85rem', color: '#ACBAC4', fontWeight: '700' }}>
            Download Real Deliverables:
          </span>

          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button className="btn btn-primary btn-sm" onClick={handleDownloadVideo} disabled={isRecording}>
              <Video size={14} /> {isRecording ? 'Recording Video...' : 'Download Video (.webm)'}
            </button>

            <button className="btn btn-secondary btn-sm" onClick={handleExportPptx}>
              <Download size={14} /> Presentation (.pptx)
            </button>

            <button className="btn btn-secondary btn-sm" onClick={handleExportPdf}>
              <FileText size={14} /> PDF Brief (.pdf)
            </button>

            <button className="btn btn-secondary btn-sm" onClick={handleExportMd}>
              <Download size={14} /> Markdown (.md)
            </button>

            <button className="btn btn-secondary btn-sm" onClick={handleExportTxt}>
              <Download size={14} /> Text (.txt)
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}


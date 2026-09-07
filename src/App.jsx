import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import InputSection from './components/InputSection';
import OutputSelector from './components/OutputSelector';
import OrchestratorVisualizer from './components/OrchestratorVisualizer';
import ArtifactsWorkbench from './components/ArtifactsWorkbench';
import ArchitectureSection from './components/ArchitectureSection';
import ComparativeSection from './components/ComparativeSection';
import GroundingModal from './components/GroundingModal';
import Footer from './components/Footer';
import { SAMPLE_DOCUMENTS } from './data/mockData';

export default function App() {
  const [activeTab, setActiveTab] = useState('workbench');
  const [inputMode, setInputMode] = useState('sample');
  const [selectedDoc, setSelectedDoc] = useState(SAMPLE_DOCUMENTS[0]);
  const [customText, setCustomText] = useState('');
  
  // Dashboard Configurable Parameters & Selection
  const [selectedOutputs, setSelectedOutputs] = useState([
    'exec_summary', 
    'video_package', 
    'linkedin_post', 
    'twitter_thread',
    'advisory_doc',
    'infographic_pkg',
    'presentation'
  ]);
  const [selectedTone, setSelectedTone] = useState('formal');
  const [detailLevel, setDetailLevel] = useState('high');
  const [communicationStyle, setCommunicationStyle] = useState('bullet');

  const [isExecuting, setIsExecuting] = useState(false);
  const [executionProgress, setExecutionProgress] = useState(0);
  const [completedOutputs, setCompletedOutputs] = useState([
    'exec_summary', 
    'video_package', 
    'linkedin_post', 
    'twitter_thread',
    'advisory_doc',
    'infographic_pkg',
    'presentation'
  ]);

  const [backendResults, setBackendResults] = useState(null);
  const [apiProvider, setApiProvider] = useState('TransformAI Agentic Engine');
  const [serverHealth, setServerHealth] = useState(null);

  const [modalState, setModalState] = useState({
    isOpen: false,
    formatInfo: null,
    result: null
  });

  // Check health status of Python backend on mount
  useEffect(() => {
    fetch('http://localhost:8000/api/health')
      .then(res => res.json())
      .then(data => {
        setServerHealth(data);
      })
      .catch(() => setServerHealth(null));
  }, []);

  const handleRunOrchestration = async () => {
    setIsExecuting(true);
    setExecutionProgress(10);
    setCompletedOutputs([]);
    setBackendResults({});

    try {
      const payload = {
        doc_id: selectedDoc?.id || 'custom_doc',
        doc_title: selectedDoc?.title || 'Custom Ingested Content',
        source_text: inputMode === 'paste' ? customText : (selectedDoc?.rawText || ''),
        selected_outputs: selectedOutputs,
        selected_tone: selectedTone,
        detail_level: detailLevel,
        communication_style: communicationStyle
      };

      const response = await fetch('http://localhost:8000/api/transform/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok && response.body) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            const trimmed = line.replace(/^data:\s*/, '').trim();
            if (!trimmed) continue;
            try {
              const event = JSON.parse(trimmed);
              if (event.type === 'start') {
                setExecutionProgress(event.progress || 15);
              } else if (event.type === 'agent_complete') {
                setExecutionProgress(event.progress || 50);
                setCompletedOutputs(prev => [...new Set([...prev, event.agent_id])]);
                setBackendResults(prev => ({
                  ...(prev || {}),
                  [event.agent_id]: event.result
                }));
              } else if (event.type === 'complete') {
                setExecutionProgress(100);
                if (event.results) setBackendResults(event.results);
                if (event.api_provider) setApiProvider(event.api_provider);
              }
            } catch (e) {
              console.error("SSE Event parse error:", e);
            }
          }
        }
      } else {
        // Fallback to standard POST endpoint
        const fallbackRes = await fetch('http://localhost:8000/api/transform', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (fallbackRes.ok) {
          const data = await fallbackRes.json();
          setBackendResults(data.results);
          setApiProvider(data.api_provider);
          setCompletedOutputs(selectedOutputs);
          setExecutionProgress(100);
        }
      }
    } catch (err) {
      console.warn("Backend streaming API call fallback:", err);
      setCompletedOutputs(selectedOutputs);
      setExecutionProgress(100);
    } finally {
      setTimeout(() => {
        setIsExecuting(false);
      }, 300);
    }
  };

  const handleOpenGroundingModal = (formatInfo, result) => {
    setModalState({
      isOpen: true,
      formatInfo,
      result
    });
  };

  const handleCloseGroundingModal = () => {
    setModalState({
      isOpen: false,
      formatInfo: null,
      result: null
    });
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onLaunchDemo={handleRunOrchestration} 
        serverHealth={serverHealth}
        apiProvider={apiProvider}
      />

      <main style={{ flex: 1 }}>
        <Hero onStartTransformation={() => {
          setActiveTab('workbench');
          handleRunOrchestration();
        }} />

        <div className="container">
          {activeTab === 'workbench' && (
            <div className="animate-fade-in">
              <InputSection 
                selectedDoc={selectedDoc}
                setSelectedDoc={setSelectedDoc}
                customText={customText}
                setCustomText={setCustomText}
                inputMode={inputMode}
                setInputMode={setInputMode}
              />

              <OutputSelector 
                selectedOutputs={selectedOutputs}
                setSelectedOutputs={setSelectedOutputs}
                selectedTone={selectedTone}
                setSelectedTone={setSelectedTone}
                detailLevel={detailLevel}
                setDetailLevel={setDetailLevel}
                communicationStyle={communicationStyle}
                setCommunicationStyle={setCommunicationStyle}
              />

              <OrchestratorVisualizer 
                isExecuting={isExecuting}
                executionProgress={executionProgress}
                onRunOrchestration={handleRunOrchestration}
                selectedOutputs={selectedOutputs}
                completedOutputs={completedOutputs}
                apiProvider={apiProvider}
                serverHealth={serverHealth}
              />

              <ArtifactsWorkbench 
                selectedDoc={selectedDoc}
                selectedOutputs={selectedOutputs}
                completedOutputs={completedOutputs}
                backendResults={backendResults}
                onOpenGroundingModal={handleOpenGroundingModal}
              />
            </div>
          )}

          {activeTab === 'architecture' && (
            <div className="animate-fade-in">
              <ArchitectureSection />
            </div>
          )}

          {activeTab === 'comparative' && (
            <div className="animate-fade-in">
              <ComparativeSection />
            </div>
          )}
        </div>
      </main>

      <GroundingModal 
        isOpen={modalState.isOpen}
        onClose={handleCloseGroundingModal}
        modalData={modalState}
      />

      <Footer />
    </div>
  );
}

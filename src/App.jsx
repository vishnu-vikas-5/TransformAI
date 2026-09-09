import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import InputSection from './components/InputSection';
import OutputSelector from './components/OutputSelector';
import OrchestratorVisualizer from './components/OrchestratorVisualizer';
import ArtifactsWorkbench from './components/ArtifactsWorkbench';
import ArchitectureSection from './components/ArchitectureSection';
import ComparativeSection from './components/ComparativeSection';
import FullSummaryPage from './components/FullSummaryPage';
import GroundedQAChat from './components/GroundedQAChat';
import AgentInspectorModal from './components/AgentInspectorModal';
import GroundingModal from './components/GroundingModal';
import Footer from './components/Footer';
import { SAMPLE_DOCUMENTS } from './data/mockData';
import { API_BASE_URL } from './utils/apiConfig';

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
  const [completedOutputs, setCompletedOutputs] = useState([]);

  const [backendResults, setBackendResults] = useState(null);
  const [apiProvider, setApiProvider] = useState('TransformAI Agentic Engine');
  const [serverHealth, setServerHealth] = useState(null);
  const [isAgentInspectorOpen, setIsAgentInspectorOpen] = useState(false);

  const [modalState, setModalState] = useState({
    isOpen: false,
    formatInfo: null,
    result: null
  });

  // Check health status of Python backend on mount
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/health`)
      .then(res => res.json())
      .then(data => {
        setServerHealth(data);
      })
      .catch(() => setServerHealth(null));
  }, []);

  // Clear/invalidate backend results whenever selected source document changes
  useEffect(() => {
    setBackendResults(null);
  }, [selectedDoc?.id]);

  const handleRunOrchestration = async () => {
    // Development Logging as required by Specification Section 5
    console.log("SELECTED SOURCE:", selectedDoc);
    console.log("SELECTED SOURCE ID:", selectedDoc?.id);
    console.log("SELECTED SOURCE TITLE:", selectedDoc?.title);

    setIsExecuting(true);
    setExecutionProgress(10);
    setCompletedOutputs([]);
    setBackendResults({});

    try {
      const sourceContent = inputMode === 'paste' ? customText : (selectedDoc?.rawText || '');
      const payload = {
        source_id: selectedDoc?.id || 'custom_doc',
        doc_id: selectedDoc?.id || 'custom_doc',
        source_title: selectedDoc?.title || 'Custom Ingested Content',
        doc_title: selectedDoc?.title || 'Custom Ingested Content',
        source_content: sourceContent,
        source_text: sourceContent,
        output_types: selectedOutputs,
        selected_outputs: selectedOutputs,
        selected_tone: selectedTone,
        detail_level: detailLevel,
        communication_style: communicationStyle
      };

      const response = await fetch(`${API_BASE_URL}/api/transform/stream`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok && response.body) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const event = JSON.parse(line.slice(6));
                if (event.type === 'agent_complete') {
                  setCompletedOutputs(prev => [...prev, event.agent_id]);
                  setBackendResults(prev => ({ ...prev, [event.agent_id]: event.result }));
                  setExecutionProgress(event.progress);
                } else if (event.type === 'complete') {
                  setApiProvider(event.api_provider || 'TransformAI Agentic Engine');
                  setExecutionProgress(100);
                  setIsExecuting(false);
                }
              } catch (err) {
                console.warn("SSE JSON Parse error:", err);
              }
            }
          }
        }
      } else {
        // Fallback to standard POST endpoint
        const fallbackRes = await fetch(`${API_BASE_URL}/api/transform`, {
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
      console.warn("Real-time stream error, performing simulation batch execution:", err);
      // Fallback simulation sequence
      for (let i = 0; i < selectedOutputs.length; i++) {
        await new Promise(r => setTimeout(r, 250));
        const agentId = selectedOutputs[i];
        setCompletedOutputs(prev => [...prev, agentId]);
        setExecutionProgress(Math.min(95, Math.round(((i + 1) / selectedOutputs.length) * 95)));
      }
      setExecutionProgress(100);
      setIsExecuting(false);
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
    <div className="app-container" style={{ minHeight: '100vh', background: 'transparent', color: '#FFFFFF' }}>
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onLaunchDemo={() => {
          setActiveTab('workbench');
          handleRunOrchestration();
        }}
        serverHealth={serverHealth}
        apiProvider={apiProvider}
        onOpenAgentInspector={() => setIsAgentInspectorOpen(true)}
      />

      <main style={{ flex: 1 }}>
        <Hero 
          onStartTransformation={() => {
            setActiveTab('workbench');
            setTimeout(() => {
              const el = document.getElementById('workbench-section');
              if (el) {
                el.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
            }, 50);
          }} 
          onExploreArchitecture={() => {
            setActiveTab('architecture');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />

        <div className="container">
          {activeTab === 'workbench' && (
            <div id="workbench-section" className="animate-fade-in">
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
                onOpenAgentInspector={() => setIsAgentInspectorOpen(true)}
              />

              <ArtifactsWorkbench 
                selectedDoc={selectedDoc}
                selectedOutputs={selectedOutputs}
                completedOutputs={completedOutputs}
                backendResults={backendResults}
                onOpenGroundingModal={handleOpenGroundingModal}
                onRunOrchestration={handleRunOrchestration}
                onNavigateTab={(tab) => setActiveTab(tab)}
              />
            </div>
          )}

          {activeTab === 'summary' && (
            <div className="animate-fade-in">
              <FullSummaryPage 
                selectedDoc={selectedDoc}
                backendResults={backendResults}
                onNavigateToChat={() => setActiveTab('chat')}
              />
            </div>
          )}

          {activeTab === 'chat' && (
            <div className="animate-fade-in">
              <GroundedQAChat 
                selectedDoc={selectedDoc}
                customText={customText}
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

      <AgentInspectorModal
        isOpen={isAgentInspectorOpen}
        onClose={() => setIsAgentInspectorOpen(false)}
      />

      <Footer />
    </div>
  );
}

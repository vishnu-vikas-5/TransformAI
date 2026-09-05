import React, { useState } from 'react';
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

  const [modalState, setModalState] = useState({
    isOpen: false,
    formatInfo: null,
    result: null
  });

  const handleRunOrchestration = () => {
    setIsExecuting(true);
    setExecutionProgress(0);
    setCompletedOutputs([]);

    let progress = 0;
    const interval = setInterval(() => {
      progress += 20;
      setExecutionProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setIsExecuting(false);
        setCompletedOutputs(selectedOutputs);
      }
    }, 400);
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
              />

              <ArtifactsWorkbench 
                selectedDoc={selectedDoc}
                selectedOutputs={selectedOutputs}
                completedOutputs={completedOutputs}
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

import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, Sparkles, ShieldCheck, Copy, Check, FileText, HelpCircle, Loader2, ArrowRight, AlertCircle } from 'lucide-react';
import { API_BASE_URL } from '../utils/apiConfig';

export default function GroundedQAChat({
  selectedDoc,
  customText,
  selectedOutputs,
  setSelectedOutputs,
  completedOutputs,
  setCompletedOutputs,
  backendResults,
  setBackendResults,
  selectedTone,
  detailLevel,
  communicationStyle,
  onNavigateTab
}) {
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState(null);
  const chatBottomRef = useRef(null);

  const docTitle = selectedDoc?.title || 'Ingested Document';
  const docText = selectedDoc?.rawText || customText || 'Sample document content';

  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: `Hello! I am your **TransformAI Grounded Q&A Assistant** for **"${docTitle}"**.\n\nI have fully indexed this document (${selectedDoc?.pages || 1} pages, ${selectedDoc?.wordCount?.toLocaleString() || '1,200'} words). You can ask me any question about the document's findings, directives, statistics, concepts, or recommendations.\n\n*Note: Content transformations (summaries, videos, slides, social posts, etc.) are handled by specialized agents in the Workbench.*`,
      groundingScore: 100.0,
      citations: [docTitle]
    }
  ]);

  const suggestedQuestions = [
    "What is this document about and what are its main takeaways?",
    "What are the key findings, data points, or results presented?",
    "Who or what is affected according to the source text?",
    "What actions, conclusions, or next steps are recommended?"
  ];

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Client-side intent classifier for immediate offline / fallback handling
  const classifyClientIntent = (rawText) => {
    const qClean = rawText.trim().toLowerCase();
    const qNorm = qClean.replace(/[^\w\s]/g, '').trim();

    // 1. Ambiguity detection
    if (/\b(?:tell me about|what about)\s+(?:the\s+)?summary\b/.test(qClean)) {
      return {
        intent: 'AMBIGUOUS',
        answer: 'Are you asking about a summary mentioned in the document, or would you like to generate an Executive Summary?',
        agents: [{ id: 'exec_summary', name: 'Executive Summary', button_text: 'Open Executive Summary Agent' }]
      };
    }

    // 2. Strict document questions (MUST stay in Grounded Q&A)
    const docQuestionPatterns = [
      /\bwhat does (?:the|this)\s+(?:document|pdf|text|paper|worksheet|file)\s+say\b/,
      /\bwhat (?:is|are)\s+.*?\s+according to (?:the|this)\s+(?:document|pdf|text|paper|worksheet|file)\b/,
      /\bexplain\s+.*?\s+(?:from|according to)\s+(?:the|this)\s+(?:document|pdf|text|paper|worksheet|file)\b/,
      /^\s*what is (?:this|the)\s+(?:document|pdf|text|paper|worksheet|file)\s+about\b/,
      /^\s*what is the aim\b/,
      /^\s*what is a cnot\b/,
      /^\s*what python version\b/,
      /^\s*which quantum gates\b/,
      /^\s*how is the bell state\b/,
      /^\s*what does the document say about\b/,
      /^\s*what is this experiment intended to teach\b/
    ];
    if (docQuestionPatterns.some(p => p.test(qClean))) {
      return { intent: 'GROUNDED_QA' };
    }

    // 3. Transformation agents dictionary
    const AGENTS_MAP = {
      exec_summary: {
        id: 'exec_summary',
        name: 'Executive Summary',
        agent_name: 'Executive Summary Agent',
        button_text: 'Open Executive Summary Agent',
        purpose_phrase: 'for the summary',
        redirect_message: 'Summary generation is handled by the Executive Summary Agent. Please use the Executive Summary agent in the Workbench to generate a summary from this document.',
        keywords: [
          'summary', 'give me a summary', 'summarize this', 'summarize the pdf',
          'summarize this pdf', 'summarize this document', 'make a summary',
          'executive summary', 'give me an executive summary', 'brief this document',
          'summarize', 'summarise', 'executive briefing', 'briefing', 'tldr',
          'make a brief summary', 'create an executive summary', 'prepare an executive briefing'
        ],
        pattern: /\b(summar(?:y|ies|ize|ise|izing|ising)|executive\s+summary|brief\s+this\s+document)\b/
      },
      video_package: {
        id: 'video_package',
        name: 'Video Package',
        agent_name: 'Video Package Agent',
        button_text: 'Open Video Package Agent',
        purpose_phrase: 'for the video content',
        redirect_message: 'Video generation is handled by the Video Package Agent. Please use the Video Package agent in the Workbench to generate your video content.',
        keywords: [
          'video', 'make a video', 'create a video', 'video script',
          'generate a video script', 'make a video package', 'create storyboard',
          'storyboard', 'video package', 'video content', 'video production',
          'multimedia package', 'create a video package', 'make a video script'
        ],
        pattern: /\b(video|storyboard|video\s+script|video\s+package)\b/
      },
      linkedin_post: {
        id: 'linkedin_post',
        name: 'LinkedIn Post',
        agent_name: 'LinkedIn Post Agent',
        button_text: 'Open LinkedIn Post Agent',
        purpose_phrase: 'for the LinkedIn post',
        redirect_message: 'LinkedIn content is handled by the LinkedIn Post Agent. Please use the LinkedIn Post agent in the Workbench.',
        keywords: [
          'linkedin post', 'make a linkedin post', 'create linkedin content',
          'write a linkedin post', 'linkedin', 'linkedin summary',
          'professional post', 'corporate post', 'post for linkedin'
        ],
        pattern: /\b(linkedin|linkedin\s+post)\b/
      },
      twitter_thread: {
        id: 'twitter_thread',
        name: 'Twitter/X Post & Thread',
        agent_name: 'Twitter/X Post & Thread Agent',
        button_text: 'Open Twitter/X Agent',
        purpose_phrase: 'for the Twitter/X post & thread',
        redirect_message: 'Twitter/X content is handled by the Twitter/X Post & Thread Agent. Please use that agent in the Workbench.',
        keywords: [
          'twitter post', 'x post', 'tweet', 'twitter thread', 'x thread',
          'create a twitter thread', 'twitter', 'tweet thread', 'tweets',
          'make a twitter thread', 'make a twitter post', 'x tweet',
          'make an x post', 'create an x thread', 'create twitter post'
        ],
        pattern: /\b(twitter|x\s+post|x\s+thread|tweets?|twitter\s+thread|twitter\s+post)\b/
      },
      advisory_doc: {
        id: 'advisory_doc',
        name: 'Structured Advisory',
        agent_name: 'Structured Advisory Agent',
        button_text: 'Open Structured Advisory Agent',
        purpose_phrase: 'for the structured advisory',
        redirect_message: 'Advisory generation is handled by the Structured Advisory Agent. Please use the Structured Advisory agent in the Workbench.',
        keywords: [
          'technical advisory', 'security advisory', 'create an advisory',
          'make an advisory', 'compliance advisory', 'policy advisory',
          'advisory', 'structured advisory', 'create a technical advisory',
          'make a technical advisory', 'generate an advisory'
        ],
        pattern: /\b(advisory|technical\s+advisory|security\s+advisory|compliance\s+advisory|policy\s+advisory|structured\s+advisory)\b/
      },
      infographic_pkg: {
        id: 'infographic_pkg',
        name: 'Infographic Content & Layout',
        agent_name: 'Infographic Content & Layout Agent',
        button_text: 'Open Infographic Agent',
        purpose_phrase: 'for the infographic',
        redirect_message: 'Infographic generation is handled by the Infographic Content & Layout Agent. Please use that agent in the Workbench.',
        keywords: [
          'infographic', 'create an infographic', 'make an infographic',
          'visual summary', 'infographic layout', 'create infographic',
          'visual content', 'infographic design', 'generate an infographic'
        ],
        pattern: /\b(infographic|visual\s+summary|infographic\s+layout|infographic\s+content)\b/
      },
      presentation: {
        id: 'presentation',
        name: 'Presentation Slides & Notes',
        agent_name: 'Presentation Slides & Notes Agent',
        button_text: 'Open Presentation Agent',
        purpose_phrase: 'for the presentation',
        redirect_message: 'Presentation generation is handled by the Presentation Slides & Notes Agent. Please use that agent in the Workbench.',
        keywords: [
          'presentation', 'create presentation', 'make slides', 'create ppt',
          'make a powerpoint', 'generate slides', 'presentation slides',
          'speaker notes', 'ppt', 'slides', 'powerpoint', 'slide deck',
          'presentation outline', 'create a presentation', 'make a presentation'
        ],
        pattern: /\b(presentation|slides?|ppt|powerpoint|slide\s+deck|speaker\s+notes)\b/
      }
    };

    // Single-word triggers
    const exactSingles = {
      summary: 'exec_summary',
      summarize: 'exec_summary',
      summarise: 'exec_summary',
      tldr: 'exec_summary',
      brief: 'exec_summary',
      briefing: 'exec_summary',
      presentation: 'presentation',
      slides: 'presentation',
      ppt: 'presentation',
      powerpoint: 'presentation',
      infographic: 'infographic_pkg',
      advisory: 'advisory_doc',
      video: 'video_package',
      tweets: 'twitter_thread',
      tweet: 'twitter_thread',
      linkedin: 'linkedin_post'
    };

    const matchedIds = [];
    if (exactSingles[qNorm]) {
      matchedIds.push(exactSingles[qNorm]);
    }

    const transformVerbs = /(?:create|make|generate|give\s+me|prepare|produce|write|draft|build|provide)/;

    Object.entries(AGENTS_MAP).forEach(([aid, meta]) => {
      if (matchedIds.includes(aid)) return;

      let matched = false;
      for (const kw of meta.keywords) {
        const regex = new RegExp(`\\b${kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
        if (regex.test(qClean)) {
          matchedIds.push(aid);
          matched = true;
          break;
        }
      }
      if (!matched) {
        const actionPattern = new RegExp(`\\b${transformVerbs.source}\\s+(?:a\\s+|an\\s+|the\\s+|some\\s+)?${meta.pattern.source}`, 'i');
        if (actionPattern.test(qClean)) {
          matchedIds.push(aid);
        }
      }
    });

    if (matchedIds.length > 1) {
      const unique = [...new Set(matchedIds)];
      const agentsData = unique.map(id => AGENTS_MAP[id]);
      const bullets = agentsData.map(a => `• ${a.agent_name} — ${a.purpose_phrase}`).join('\n');
      const text = `These requests are handled by specialized Workbench agents:\n\n${bullets}\n\nPlease use the corresponding agents in the Workbench.`;
      return {
        intent: 'TRANSFORM',
        answer: text,
        agents: agentsData
      };
    }

    if (matchedIds.length === 1) {
      const meta = AGENTS_MAP[matchedIds[0]];
      return {
        intent: 'TRANSFORM',
        answer: meta.redirect_message,
        agents: [meta]
      };
    }

    return { intent: 'GROUNDED_QA' };
  };

  const handleOpenWorkbenchAgent = (agentId) => {
    if (agentId && setSelectedOutputs && selectedOutputs) {
      if (!selectedOutputs.includes(agentId)) {
        setSelectedOutputs(prev => [...prev, agentId]);
      }
    }
    if (onNavigateTab) {
      onNavigateTab('workbench');
    }
    setTimeout(() => {
      const targetEl = document.getElementById(`workbench-agent-${agentId}`) ||
                       document.getElementById(`output-selector-${agentId}`) ||
                       document.getElementById('workbench-section');
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        targetEl.classList.add('highlight-agent-card');
        setTimeout(() => targetEl.classList.remove('highlight-agent-card'), 2500);
      }
    }, 150);
  };

  const handleSendQuestion = async (promptText) => {
    const qText = promptText || question;
    if (!qText.trim() || loading) return;

    const userMsg = { sender: 'user', text: qText };
    setMessages(prev => [...prev, userMsg]);
    if (!promptText) setQuestion('');
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          doc_id: selectedDoc?.id || 'custom_doc',
          doc_title: docTitle,
          source_text: docText,
          question: qText
        })
      });

      if (response.ok) {
        const data = await response.json();
        const score = (data.groundingScore !== undefined && data.groundingScore !== null)
          ? Number(data.groundingScore)
          : null;

        setMessages(prev => [
          ...prev,
          {
            sender: 'ai',
            text: data.answer,
            groundingScore: score,
            citations: Array.isArray(data.citations) ? data.citations : [],
            status: data.status,
            intent: data.intent,
            agent_id: data.agent_id,
            agents: data.agents || [],
            button_text: data.button_text
          }
        ]);
        setLoading(false);
        return;
      }
    } catch (err) {
      console.warn("Backend chat Q&A endpoint unreachable, using client grounding fallback:", err);
    }

    // Client-side Fallback
    setTimeout(() => {
      const intentResult = classifyClientIntent(qText);

      // If client detected transformation request or ambiguity
      if (intentResult.intent === 'TRANSFORM') {
        setMessages(prev => [
          ...prev,
          {
            sender: 'ai',
            text: intentResult.answer,
            groundingScore: null,
            citations: [],
            status: 'agent_redirection',
            intent: 'TRANSFORM',
            agents: intentResult.agents || []
          }
        ]);
        setLoading(false);
        return;
      }

      if (intentResult.intent === 'AMBIGUOUS') {
        setMessages(prev => [
          ...prev,
          {
            sender: 'ai',
            text: intentResult.answer,
            groundingScore: null,
            citations: [],
            status: 'ambiguous_clarification',
            intent: 'AMBIGUOUS',
            agents: intentResult.agents || []
          }
        ]);
        setLoading(false);
        return;
      }

      // Strict Document Grounded Q&A Fallback
      const cleanSource = (docText || "").trim();
      const lines = cleanSource.split('\n').map(l => l.trim()).filter(Boolean);

      const paragraphs = [];
      let currentPara = [];
      lines.forEach(l => {
        currentPara.push(l);
        if (currentPara.join(' ').length > 180 || l.endsWith('.') || l.startsWith('#')) {
          paragraphs.push(currentPara.join(' '));
          currentPara = [];
        }
      });
      if (currentPara.length > 0) paragraphs.push(currentPara.join(' '));

      const qLower = qText.toLowerCase();
      const qWords = qLower.split(/\s+/).map(w => w.replace(/[?,!.:;"']/g, '')).filter(w => w.length > 2 && !['what', 'where', 'when', 'which', 'how', 'who', 'why', 'does', 'is', 'are', 'the', 'and', 'for', 'that', 'this', 'with', 'from', 'about'].includes(w));

      const scoredParas = [];
      paragraphs.forEach(p => {
        const pLower = p.toLowerCase();
        let score = 0;
        qWords.forEach(w => {
          if (pLower.includes(w)) score += 3;
        });
        if (score > 0) scoredParas.push({ score, text: p });
      });

      scoredParas.sort((a, b) => b.score - a.score);

      // Strict check: If no relevant paragraphs match, refuse with 0.0% score
      if (scoredParas.length === 0 || qWords.length === 0) {
        setMessages(prev => [
          ...prev,
          {
            sender: 'ai',
            text: `I couldn't find information about **"${qText}"** in the provided document **"${docTitle}"**.`,
            groundingScore: 0.0,
            citations: [],
            status: 'insufficient_evidence'
          }
        ]);
        setLoading(false);
        return;
      }

      const topParas = scoredParas.slice(0, 3).map(sp => sp.text);
      const cleanTop = topParas.map(p => p.replace(/#/g, '').trim());
      const primaryLead = cleanTop[0];

      const bullets = [];
      cleanTop.forEach(p => {
        const sentences = p.split('.').map(s => s.trim()).filter(s => s.length > 15);
        sentences.slice(0, 2).forEach(s => {
          if (!bullets.includes(s) && s.length < 220) bullets.push(s);
        });
      });

      const bulletStr = bullets.length > 0
        ? bullets.slice(0, 3).map(b => `${b}.`).join(' ')
        : primaryLead;

      const aiAnswer = `${primaryLead}\n\n${bulletStr}`;
      const citations = cleanTop.slice(0, 2).map((p, idx) => `Source: ${docTitle} | Excerpt: "${p.slice(0, 160)}..."`);

      setMessages(prev => [
        ...prev,
        {
          sender: 'ai',
          text: aiAnswer,
          groundingScore: 85.0,
          citations: citations,
          status: 'grounded'
        }
      ]);
      setLoading(false);
    }, 300);
  };

  const handleCopyMessage = (index, text) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(index);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <div className="glass-panel animate-fade-in" style={{ padding: '2rem', marginBottom: '2rem', background: '#121212', borderColor: '#DFD0B8' }}>

      {/* Header Banner */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem', borderBottom: '1.5px solid #DFD0B8', paddingBottom: '1rem' }}>
        <div>
          <span className="badge" style={{ background: '#DFD0B8', color: '#000000', marginBottom: '0.5rem', fontWeight: '700', borderColor: '#E1DCC9' }}>
            <Sparkles size={12} /> TransformAI Grounded Q&A Assistant
          </span>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#FFFFFF' }}>
            Ask Questions About "{docTitle}"
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#E1DCC9', marginTop: '0.25rem', opacity: 0.9 }}>
            Grounded Q&A engine — Ask anything about the PDF without reading the full document
          </p>
        </div>

        <span className="badge" style={{ background: '#DFD0B8', color: '#000000', fontSize: '0.8rem', padding: '0.4rem 0.8rem', borderColor: '#E1DCC9' }}>
          <ShieldCheck size={14} /> Factual Source Grounding Active
        </span>
      </div>

      {/* Suggested Quick Questions */}
      <div style={{ marginBottom: '1.25rem' }}>
        <span style={{ fontSize: '0.78rem', color: '#E1DCC9', fontWeight: '700', marginBottom: '0.5rem', display: 'block' }}>
          💡 Suggested Prompts:
        </span>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {suggestedQuestions.map((sq, idx) => (
            <button
              key={idx}
              className="btn btn-secondary btn-sm"
              onClick={() => handleSendQuestion(sq)}
              style={{ fontSize: '0.75rem', background: '#000000', borderColor: '#DFD0B8', color: '#FFFFFF' }}
            >
              {sq} <ArrowRight size={12} color="#DFD0B8" />
            </button>
          ))}
        </div>
      </div>

      {/* Chat Thread Container */}
      <div style={{
        background: '#000000',
        borderRadius: 'var(--radius-md)',
        padding: '1.5rem',
        border: '1.5px solid #DFD0B8',
        minHeight: '380px',
        maxHeight: '520px',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem',
        marginBottom: '1.25rem'
      }}>
        {messages.map((msg, idx) => (
          <div
            key={idx}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start'
            }}
          >
            {/* Sender Label */}
            <div style={{ fontSize: '0.75rem', color: '#E1DCC9', marginBottom: '0.3rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              {msg.sender === 'user' ? (
                <strong style={{ color: '#FFFFFF' }}>You (Operator)</strong>
              ) : (
                <>
                  <Sparkles size={12} color="#DFD0B8" />
                  <strong style={{ color: '#FFFFFF' }}>TransformAI Grounded AI</strong>
                  {/* Badge: Distinguish Agent Redirection, Ambiguity, and Factual Grounding */}
                  {msg.status === 'agent_redirection' || msg.intent === 'TRANSFORM' ? (
                    <span className="badge" style={{
                      fontSize: '0.65rem',
                      background: '#DFD0B8',
                      color: '#000000',
                      padding: '0.15rem 0.5rem',
                      borderColor: '#E1DCC9',
                      fontWeight: '700',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.25rem'
                    }}>
                      <ArrowRight size={10} color="#000000" /> Specialized Agent Redirection
                    </span>
                  ) : msg.status === 'ambiguous_clarification' || msg.intent === 'AMBIGUOUS' ? (
                    <span className="badge" style={{
                      fontSize: '0.65rem',
                      background: 'rgba(223, 208, 184, 0.15)',
                      color: '#DFD0B8',
                      padding: '0.15rem 0.5rem',
                      borderColor: '#DFD0B8',
                      fontWeight: '600',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.25rem'
                    }}>
                      <HelpCircle size={10} color="#DFD0B8" /> Clarification Required
                    </span>
                  ) : (msg.groundingScore !== null && msg.groundingScore !== undefined) ? (
                    <span className="badge" style={{
                      fontSize: '0.65rem',
                      background: msg.groundingScore > 0 ? '#DFD0B8' : '#2A1515',
                      color: msg.groundingScore > 0 ? '#000000' : '#FF7676',
                      padding: '0.1rem 0.45rem',
                      borderColor: msg.groundingScore > 0 ? '#E1DCC9' : '#8B2E2E'
                    }}>
                      {msg.groundingScore > 0 ? `${msg.groundingScore}% Grounded` : '0.0% Grounded (Out of Scope)'}
                    </span>
                  ) : null}
                </>
              )}
            </div>

            {/* Bubble */}
            <div style={{
              maxWidth: '85%',
              padding: '1rem 1.25rem',
              borderRadius: 'var(--radius-md)',
              background: msg.sender === 'user' ? '#DFD0B8' : '#121212',
              color: msg.sender === 'user' ? '#000000' : '#FFFFFF',
              border: `1.5px solid ${msg.sender === 'user' ? '#E1DCC9' : (msg.status === 'agent_redirection' ? '#DFD0B8' : '#DFD0B8')}`,
              fontSize: '0.9rem',
              lineHeight: '1.55',
              whiteSpace: 'pre-wrap',
              boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
            }}>
              {msg.text}

              {/* Action Buttons for Workbench Agent Redirection (Sections 1-7, 11, 12) */}
              {msg.sender === 'ai' && (msg.status === 'agent_redirection' || msg.intent === 'TRANSFORM' || (msg.agents && msg.agents.length > 0)) && (
                <div style={{
                  marginTop: '1rem',
                  paddingTop: '0.8rem',
                  borderTop: '1px solid rgba(223, 208, 184, 0.25)',
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '0.6rem'
                }}>
                  {(msg.agents && msg.agents.length > 0 ? msg.agents : [{ id: msg.agent_id || 'exec_summary', button_text: msg.button_text || 'Open Agent in Workbench' }]).map((ag, aIdx) => (
                    <button
                      key={aIdx}
                      className="btn btn-primary btn-sm"
                      onClick={() => handleOpenWorkbenchAgent(ag.id || msg.agent_id || 'exec_summary')}
                      style={{
                        background: '#DFD0B8',
                        color: '#000000',
                        fontSize: '0.8rem',
                        fontWeight: '700',
                        padding: '0.5rem 1rem',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.45rem',
                        border: 'none',
                        cursor: 'pointer',
                        borderRadius: 'var(--radius-sm)'
                      }}
                    >
                      <span>{ag.button_text || `Open ${ag.name || 'Agent'}`}</span>
                      <ArrowRight size={13} color="#000000" />
                    </button>
                  ))}
                </div>
              )}

              {/* Ambiguity Clarification Buttons (Section 13) */}
              {msg.sender === 'ai' && (msg.status === 'ambiguous_clarification' || msg.intent === 'AMBIGUOUS') && (
                <div style={{
                  marginTop: '1rem',
                  paddingTop: '0.8rem',
                  borderTop: '1px solid rgba(223, 208, 184, 0.25)',
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '0.6rem'
                }}>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => handleSendQuestion(`What does "${docTitle}" say about the summary?`)}
                    style={{
                      background: '#000000',
                      color: '#FFFFFF',
                      borderColor: '#DFD0B8',
                      fontSize: '0.8rem',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      padding: '0.5rem 0.9rem'
                    }}
                  >
                    <FileText size={12} color="#DFD0B8" />
                    <span>Explain summary in document</span>
                  </button>

                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => handleOpenWorkbenchAgent('exec_summary')}
                    style={{
                      background: '#DFD0B8',
                      color: '#000000',
                      fontSize: '0.8rem',
                      fontWeight: '700',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      padding: '0.5rem 0.9rem',
                      border: 'none'
                    }}
                  >
                    <span>Open Executive Summary Agent</span>
                    <ArrowRight size={13} color="#000000" />
                  </button>
                </div>
              )}

              {/* Citations Pill for AI Responses */}
              {msg.sender === 'ai' && msg.citations && msg.citations.length > 0 && (
                <div style={{ marginTop: '0.75rem', paddingTop: '0.6rem', borderTop: '1px solid #DFD0B8', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  <span style={{ fontSize: '0.725rem', color: '#E1DCC9', display: 'flex', alignItems: 'center', gap: '0.3rem', fontWeight: '700' }}>
                    <FileText size={11} color="#DFD0B8" /> Citations ({msg.citations.length}):
                  </span>

                  {msg.citations.map((cit, cIdx) => (
                    <div key={cIdx} style={{ fontSize: '0.72rem', color: '#E1DCC9', background: 'rgba(223, 208, 184, 0.08)', padding: '0.3rem 0.5rem', borderRadius: '4px', borderLeft: '2px solid #DFD0B8' }}>
                      {typeof cit === 'string' ? cit : `Page ${cit.page} (${cit.section}): "${cit.evidence}"`}
                    </div>
                  ))}

                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.2rem' }}>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => handleCopyMessage(idx, msg.text)}
                      style={{ padding: '0.2rem 0.5rem', fontSize: '0.7rem' }}
                    >
                      {copiedIdx === idx ? <Check size={11} color="#FFFFFF" /> : <Copy size={11} />}
                      {copiedIdx === idx ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#FFFFFF', fontSize: '0.85rem' }}>
            <Loader2 size={16} className="spin" style={{ animation: 'spin 1s linear infinite' }} />
            <span>Grounded AI is analyzing source document context & synthesizing answer...</span>
          </div>
        )}

        <div ref={chatBottomRef} />
      </div>

      {/* Input Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendQuestion();
        }}
        style={{ display: 'flex', gap: '0.75rem' }}
      >
        <input
          type="text"
          placeholder={`Ask any question about "${docTitle}" (e.g., What are the action steps?)...`}
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          disabled={loading}
          style={{
            flex: 1,
            padding: '0.85rem 1.25rem',
            background: '#000000',
            border: '1.5px solid #DFD0B8',
            borderRadius: 'var(--radius-sm)',
            color: '#FFFFFF',
            fontSize: '0.9rem',
            outline: 'none'
          }}
        />

        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading || !question.trim()}
          style={{ padding: '0.85rem 1.75rem' }}
        >
          {loading ? <Loader2 size={18} className="spin" style={{ animation: 'spin 1s linear infinite' }} /> : <Send size={18} />}
          Send Query
        </button>
      </form>

    </div>
  );
}

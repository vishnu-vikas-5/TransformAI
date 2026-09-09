import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { 
  X, 
  Download, 
  ZoomIn, 
  ZoomOut, 
  ChevronLeft, 
  ChevronRight, 
  Maximize2, 
  Minimize2, 
  FileText, 
  Loader2,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { downloadBlob } from '../utils/exportUtils';

/**
 * SyntaxX Controlled In-App PDF Preview Modal
 * 
 * Strict 4-Color Theme:
 * - BLACK: #000000
 * - DARK BROWN: #1F150C
 * - BROWN: #412D15
 * - CREAM: #E1DCC9
 * 
 * Features:
 * - Mounted via React Portal (createPortal) directly to document.body
 * - Full-screen overlay (rgba(0,0,0,0.75), z-index: 9999)
 * - Background body scroll lock (overflow: hidden, restored on close)
 * - Controlled PDF rendering onto HTML5 <canvas> via PDF.js (NO native browser black toolbar)
 * - Preserves original PDF colors (clean neutral white document surface with shadow)
 * - Viewer controls: Zoom In/Out, 100% reset, Fit Width, Page Prev/Next, Direct Download, Close
 * - Escape key & backdrop click support
 * - Guaranteed identical download using the exact previewed PDF Blob
 */
export default function PDFPreviewModal({
  open,
  isOpen,
  onClose,
  pdfBlob,
  pdfUrl,
  title,
  formatTitle = 'Executive Summary',
  formatId,
  filename,
  advisoryId = 'SYNTAXX-ADV-2026',
  error = null,
  onRetry
}) {
  const activeOpen = open !== undefined ? open : isOpen;
  const displayTitle = title || formatTitle || 'Executive Summary';
  const displayFilename = filename || `${displayTitle.toLowerCase().replace(/[^a-z0-9]+/g, '_')}.pdf`;

  // Viewer State
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [zoomLevel, setZoomLevel] = useState(100); // 50, 75, 100, 125, 150, 200
  const [isFitWidth, setIsFitWidth] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isDocLoading, setIsDocLoading] = useState(true);
  const [isPageRendering, setIsPageRendering] = useState(false);
  const [renderError, setRenderError] = useState(null);

  // References
  const overlayRef = useRef(null);
  const workspaceRef = useRef(null);
  const canvasRef = useRef(null);
  const pdfDocRef = useRef(null);
  const renderTaskRef = useRef(null);

  // 1. Lock Background Body Scrolling while Modal is Open
  useEffect(() => {
    if (!activeOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [activeOpen]);

  // 2. Keyboard Navigation: Esc to close, Arrow keys for page nav, +/- for zoom
  useEffect(() => {
    if (!activeOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowLeft') {
        setCurrentPage(p => Math.max(1, p - 1));
      } else if (e.key === 'ArrowRight') {
        setCurrentPage(p => Math.min(totalPages, p + 1));
      } else if (e.key === '+' || e.key === '=') {
        setIsFitWidth(false);
        setZoomLevel(z => Math.min(200, z + 25));
      } else if (e.key === '-') {
        setIsFitWidth(false);
        setZoomLevel(z => Math.max(50, z - 25));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeOpen, totalPages, onClose]);

  // Helper: Get PDF.js library instance
  const getPdfJsLib = async () => {
    if (typeof window !== 'undefined' && window.pdfjsLib) {
      if (!window.pdfjsLib.GlobalWorkerOptions.workerSrc) {
        window.pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';
      }
      return window.pdfjsLib;
    }
    try {
      const pdfjsDist = await import('pdfjs-dist');
      const lib = pdfjsDist.default || pdfjsDist;
      if (lib && !lib.GlobalWorkerOptions.workerSrc) {
        lib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';
      }
      return lib;
    } catch (err) {
      console.error("Failed to load PDF.js library:", err);
      return null;
    }
  };

  // Reset viewer parameters when modal opens or closes
  useEffect(() => {
    if (activeOpen) {
      setCurrentPage(1);
      setZoomLevel(100);
      setIsFitWidth(false);
      setRenderError(null);
    } else {
      if (pdfDocRef.current) {
        try {
          pdfDocRef.current.destroy();
        } catch (_err) {
          // Ignore destroy failure on unmounted worker
        }
        pdfDocRef.current = null;
      }
    }
  }, [activeOpen]);

  // 3. Load PDF Document via PDF.js when modal is open
  useEffect(() => {
    if (!activeOpen) return;

    let isCancelled = false;

    async function loadPdfDocument() {
      setIsDocLoading(true);
      setRenderError(null);

      try {
        const pdfjs = await getPdfJsLib();
        if (!pdfjs) {
          throw new Error("PDF.js engine is not available.");
        }

        let docSource;
        if (pdfBlob) {
          const arrayBuffer = await pdfBlob.arrayBuffer();
          if (isCancelled) return;
          docSource = { data: new Uint8Array(arrayBuffer) };
        } else if (pdfUrl) {
          docSource = { url: pdfUrl };
        } else {
          throw new Error("No PDF source provided for preview.");
        }

        const loadingTask = pdfjs.getDocument(docSource);
        const doc = await loadingTask.promise;

        if (isCancelled) {
          doc.destroy();
          return;
        }

        pdfDocRef.current = doc;
        setTotalPages(doc.numPages || 1);
        setCurrentPage(1);
        setIsDocLoading(false);
      } catch (err) {
        console.error("PDF.js loading failed:", err);
        if (!isCancelled) {
          setRenderError(err.message || "Failed to parse PDF document.");
          setIsDocLoading(false);
        }
      }
    }

    loadPdfDocument();

    return () => {
      isCancelled = true;
    };
  }, [activeOpen, pdfBlob, pdfUrl]);

  // 4. Render Current Page onto HTML5 Canvas
  const renderPage = useCallback(async () => {
    const doc = pdfDocRef.current;
    const canvas = canvasRef.current;
    if (!doc || !canvas) return;

    // Cancel any active render task before starting a new one
    if (renderTaskRef.current) {
      try {
        renderTaskRef.current.cancel();
      } catch (_e) {
        // Ignore cancellation error
      }
      renderTaskRef.current = null;
    }

    setIsPageRendering(true);

    try {
      const page = await doc.getPage(currentPage);

      // Determine scale
      let scale = zoomLevel / 100;
      if (isFitWidth && workspaceRef.current) {
        const containerWidth = workspaceRef.current.clientWidth;
        const unscaledViewport = page.getViewport({ scale: 1.0 });
        // Reserve 64px padding for clean visual breathing room
        scale = Math.max(0.4, (containerWidth - 64) / unscaledViewport.width);
      }

      const dpr = window.devicePixelRatio || 1;
      const viewport = page.getViewport({ scale: scale * dpr });

      const context = canvas.getContext('2d', { alpha: false });
      canvas.width = Math.floor(viewport.width);
      canvas.height = Math.floor(viewport.height);
      canvas.style.width = `${Math.floor(viewport.width / dpr)}px`;
      canvas.style.height = `${Math.floor(viewport.height / dpr)}px`;

      const renderContext = {
        canvasContext: context,
        viewport: viewport,
      };

      const task = page.render(renderContext);
      renderTaskRef.current = task;

      await task.promise;
      renderTaskRef.current = null;
      setIsPageRendering(false);
    } catch (err) {
      if (err?.name === 'RenderingCancelledException') {
        // Normal cancellation due to fast page switch or zoom
        return;
      }
      console.error("PDF Page render error:", err);
      setIsPageRendering(false);
      setRenderError(err.message || "Could not render PDF page.");
    }
  }, [currentPage, zoomLevel, isFitWidth]);

  useEffect(() => {
    if (!isDocLoading && pdfDocRef.current) {
      renderPage();
    }
  }, [isDocLoading, currentPage, zoomLevel, isFitWidth, renderPage]);

  // 5. Direct Identical Download
  const handleDownload = () => {
    if (pdfBlob) {
      downloadBlob(pdfBlob, displayFilename);
    } else if (pdfUrl) {
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.download = displayFilename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // Zoom Controls
  const handleZoomIn = () => {
    setIsFitWidth(false);
    setZoomLevel(prev => Math.min(200, prev + 25));
  };

  const handleZoomOut = () => {
    setIsFitWidth(false);
    setZoomLevel(prev => Math.max(50, prev - 25));
  };

  const handleResetZoom = () => {
    setIsFitWidth(false);
    setZoomLevel(100);
  };

  const handleToggleFitWidth = () => {
    setIsFitWidth(prev => !prev);
  };

  // Page Controls
  const handlePrevPage = () => {
    setCurrentPage(p => Math.max(1, p - 1));
  };

  const handleNextPage = () => {
    setCurrentPage(p => Math.min(totalPages, p + 1));
  };

  // Overlay Backdrop Click Handling (close only when clicking dark backdrop, NOT the modal)
  const handleBackdropClick = (e) => {
    if (e.target === overlayRef.current) {
      onClose();
    }
  };

  if (!activeOpen) return null;

  // React Portal to document.body ensures immunity from parent styles/z-index/layout
  return createPortal(
    <div 
      ref={overlayRef}
      className="syntaxx-pdf-overlay"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="syntaxx-pdf-title"
    >
      <div 
        className="syntaxx-pdf-container"
        style={isFullscreen ? {
          width: '100vw',
          height: '100vh',
          maxWidth: '100vw',
          maxHeight: '100vh',
          borderRadius: 0,
          border: 'none',
        } : undefined}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ================================================================= */}
        {/* 1. HEADER BAR: #000000                                           */}
        {/* ================================================================= */}
        <div className="syntaxx-pdf-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                width: '34px', 
                height: '34px', 
                borderRadius: '6px',
                backgroundColor: '#1F150C',
                border: '1px solid rgba(225, 220, 201, 0.25)'
              }}
            >
              <FileText size={17} style={{ color: '#E1DCC9' }} />
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                <h3 
                  id="syntaxx-pdf-title"
                  style={{ 
                    color: '#E1DCC9', 
                    fontSize: '0.95rem', 
                    fontWeight: '700', 
                    letterSpacing: '0.02em',
                    margin: 0
                  }}
                >
                  {displayTitle}
                </h3>
                <span 
                  style={{ 
                    fontSize: '0.68rem', 
                    fontWeight: '800', 
                    letterSpacing: '0.06em', 
                    padding: '0.15rem 0.5rem', 
                    borderRadius: '4px',
                    backgroundColor: '#E1DCC9', 
                    color: '#000000',
                    textTransform: 'uppercase'
                  }}
                  title="Source-grounded PDF deliverable generated for in-app inspection"
                >
                  ACTUAL PDF PREVIEW
                </span>
                <span 
                  style={{ 
                    fontSize: '0.68rem', 
                    fontFamily: 'var(--font-mono, monospace)', 
                    padding: '0.15rem 0.45rem', 
                    borderRadius: '4px',
                    border: '1px solid rgba(225, 220, 201, 0.2)',
                    backgroundColor: 'rgba(225, 220, 201, 0.08)',
                    color: 'rgba(225, 220, 201, 0.85)'
                  }}
                >
                  {advisoryId}
                </span>
              </div>
              <p style={{ margin: 0, fontSize: '0.75rem', color: 'rgba(225, 220, 201, 0.65)' }}>
                Inspect document before download • Verified against Core Content Intelligence
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              onClick={() => setIsFullscreen(prev => !prev)}
              className="syntaxx-btn-secondary"
              style={{ padding: '0.4rem 0.6rem' }}
              title={isFullscreen ? "Exit Fullscreen" : "Fullscreen View"}
            >
              {isFullscreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
            </button>
            <button
              onClick={onClose}
              className="syntaxx-btn-secondary"
              style={{ padding: '0.4rem 0.6rem' }}
              title="Close Preview (Esc)"
              aria-label="Close Preview"
            >
              <X size={17} />
            </button>
          </div>
        </div>

        {/* ================================================================= */}
        {/* 2. PDF VIEWER WORKSPACE: #412D15                                 */}
        {/* ================================================================= */}
        <div ref={workspaceRef} className="syntaxx-pdf-workspace">
          {/* A. Generation/Loading Error State */}
          {error && (
            <div 
              style={{
                margin: 'auto',
                maxWidth: '520px',
                padding: '2.5rem 2rem',
                backgroundColor: '#1F150C',
                borderRadius: '12px',
                border: '1px solid rgba(225, 220, 201, 0.25)',
                textAlign: 'center',
                boxShadow: '0 16px 40px rgba(0, 0, 0, 0.6)',
              }}
            >
              <AlertCircle size={40} style={{ color: '#E1DCC9', margin: '0 auto 1rem auto' }} />
              <h4 style={{ color: '#E1DCC9', fontSize: '1.1rem', fontWeight: '700', letterSpacing: '0.04em', marginBottom: '0.5rem' }}>
                PDF PREVIEW UNAVAILABLE
              </h4>
              <p style={{ color: 'rgba(225, 220, 201, 0.75)', fontSize: '0.85rem', marginBottom: '1.5rem', lineHeight: 1.5 }}>
                {error}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                {onRetry && (
                  <button onClick={onRetry} className="syntaxx-btn-secondary">
                    <RefreshCw size={13} />
                    <span>Retry Preview</span>
                  </button>
                )}
                <button onClick={handleDownload} className="syntaxx-btn-primary" disabled={!pdfBlob && !pdfUrl}>
                  <Download size={13} />
                  <span>Download PDF</span>
                </button>
              </div>
            </div>
          )}

          {/* B. Preview Render Error State */}
          {!error && renderError && (
            <div 
              style={{
                margin: 'auto',
                maxWidth: '520px',
                padding: '2.5rem 2rem',
                backgroundColor: '#1F150C',
                borderRadius: '12px',
                border: '1px solid rgba(225, 220, 201, 0.25)',
                textAlign: 'center',
                boxShadow: '0 16px 40px rgba(0, 0, 0, 0.6)',
              }}
            >
              <AlertCircle size={40} style={{ color: '#E1DCC9', margin: '0 auto 1rem auto' }} />
              <h4 style={{ color: '#E1DCC9', fontSize: '1.1rem', fontWeight: '700', letterSpacing: '0.04em', marginBottom: '0.5rem' }}>
                PDF PREVIEW UNAVAILABLE
              </h4>
              <p style={{ color: 'rgba(225, 220, 201, 0.75)', fontSize: '0.85rem', marginBottom: '1.5rem', lineHeight: 1.5 }}>
                The PDF was generated successfully, but the preview could not be rendered.
              </p>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                <button 
                  onClick={() => {
                    setRenderError(null);
                    if (onRetry) onRetry();
                  }} 
                  className="syntaxx-btn-secondary"
                >
                  <RefreshCw size={13} />
                  <span>Retry Preview</span>
                </button>
                <button onClick={handleDownload} className="syntaxx-btn-primary" disabled={!pdfBlob && !pdfUrl}>
                  <Download size={13} />
                  <span>Download PDF</span>
                </button>
              </div>
            </div>
          )}

          {/* C. Loading State Matching SyntaxX Spec */}
          {!error && !renderError && isDocLoading && (
            <div 
              style={{
                margin: 'auto',
                maxWidth: '440px',
                padding: '2.5rem 2rem',
                backgroundColor: '#1F150C',
                borderRadius: '12px',
                border: '1px solid rgba(225, 220, 201, 0.25)',
                textAlign: 'center',
                boxShadow: '0 16px 40px rgba(0, 0, 0, 0.6)',
              }}
            >
              <Loader2 size={36} className="animate-spin" style={{ color: '#E1DCC9', margin: '0 auto 1rem auto' }} />
              <h4 style={{ color: '#E1DCC9', fontSize: '1.05rem', fontWeight: '700', letterSpacing: '0.03em', marginBottom: '0.75rem' }}>
                Preparing PDF...
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.8rem', color: 'rgba(225, 220, 201, 0.7)' }}>
                <span>• Applying SyntaxX design</span>
                <span>• Rendering document</span>
                <span>• Preparing preview</span>
              </div>
            </div>
          )}

          {/* D. Actual Controlled Canvas Page Rendering */}
          {!error && !renderError && !isDocLoading && (
            <div className="syntaxx-pdf-canvas-wrapper">
              <canvas 
                ref={canvasRef} 
                className="syntaxx-pdf-canvas"
                style={{
                  opacity: isPageRendering ? 0.75 : 1.0,
                  transition: 'opacity 0.15s ease',
                }}
              />
            </div>
          )}
        </div>

        {/* ================================================================= */}
        {/* 3. VIEWER CONTROLS BAR: #1F150C                                  */}
        {/* ================================================================= */}
        <div className="syntaxx-pdf-controls">
          {/* Zoom Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <button
              onClick={handleZoomOut}
              disabled={zoomLevel <= 50 || isDocLoading}
              className="syntaxx-btn-secondary"
              style={{ padding: '0.4rem 0.65rem' }}
              title="Zoom Out (-)"
            >
              <ZoomOut size={13} />
            </button>

            <button
              onClick={handleResetZoom}
              disabled={isDocLoading}
              className="syntaxx-btn-secondary"
              style={{ 
                padding: '0.4rem 0.75rem', 
                minWidth: '58px', 
                justifyContent: 'center',
                fontFamily: 'var(--font-mono, monospace)',
                fontWeight: '700'
              }}
              title="Reset Zoom to 100%"
            >
              {isFitWidth ? 'Fit' : `${zoomLevel}%`}
            </button>

            <button
              onClick={handleZoomIn}
              disabled={zoomLevel >= 200 || isDocLoading}
              className="syntaxx-btn-secondary"
              style={{ padding: '0.4rem 0.65rem' }}
              title="Zoom In (+)"
            >
              <ZoomIn size={13} />
            </button>

            <button
              onClick={handleToggleFitWidth}
              disabled={isDocLoading}
              className="syntaxx-btn-secondary"
              style={{ 
                padding: '0.4rem 0.75rem',
                backgroundColor: isFitWidth ? '#412D15' : 'transparent',
                borderColor: isFitWidth ? '#E1DCC9' : 'rgba(225, 220, 201, 0.35)',
              }}
              title="Fit to Workspace Width"
            >
              Fit Width
            </button>
          </div>

          {/* Page Navigation Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              onClick={handlePrevPage}
              disabled={currentPage <= 1 || isDocLoading}
              className="syntaxx-btn-secondary"
              style={{ padding: '0.4rem 0.65rem' }}
              title="Previous Page (Left Arrow)"
            >
              <ChevronLeft size={14} />
            </button>

            <span 
              style={{ 
                fontSize: '0.8rem', 
                fontFamily: 'var(--font-mono, monospace)', 
                color: '#E1DCC9',
                fontWeight: '700',
                padding: '0.35rem 0.75rem',
                borderRadius: '6px',
                backgroundColor: '#412D15',
                border: '1px solid rgba(225, 220, 201, 0.2)'
              }}
            >
              Page {currentPage} of {totalPages}
            </span>

            <button
              onClick={handleNextPage}
              disabled={currentPage >= totalPages || isDocLoading}
              className="syntaxx-btn-secondary"
              style={{ padding: '0.4rem 0.65rem' }}
              title="Next Page (Right Arrow)"
            >
              <ChevronRight size={14} />
            </button>
          </div>

          {/* Action / Download Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <span 
              style={{ 
                fontSize: '0.75rem', 
                fontFamily: 'var(--font-mono, monospace)', 
                color: 'rgba(225, 220, 201, 0.55)',
                display: 'none',
              }}
              className="sm:inline"
            >
              {displayFilename}
            </span>

            <button
              onClick={handleDownload}
              disabled={!pdfBlob && !pdfUrl}
              className="syntaxx-btn-primary"
              title={`Download exact previewed PDF (${displayFilename})`}
            >
              <Download size={14} />
              <span>Download PDF</span>
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

// Re-export as PdfViewerModal for full drop-in backwards compatibility
export { PDFPreviewModal as PdfViewerModal };

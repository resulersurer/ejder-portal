'use client';

import React from 'react';

interface PdfViewerProps {
  isOpen: boolean;
  portalName: string;
  pdfUrl: string;
  onClose: () => void;
}

const PdfViewer: React.FC<PdfViewerProps> = ({ isOpen, portalName, pdfUrl, onClose }) => {
  return (
    <div
      className={`pdf-mov ${isOpen ? 'open' : ''}`}
      id="pdfViewerModal"
      onClick={(e) => (e.target as HTMLElement).id === 'pdfViewerModal' && onClose()}
    >
      <div className="pdf-mbox">
        <div className="pdf-mhead">
          <div className="pdf-mt">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <line x1="10" y1="9" x2="8" y2="9" />
            </svg>
            <span id="pdfViewerTitle">{portalName} - Eğitim PDF</span>
          </div>
          <button
            type="button"
            className="pdf-mclose"
            onClick={onClose}
            aria-label="Close"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <div className="pdf-mbody">
          <iframe id="pdfViewerIframe" className="pdf-iframe" src={pdfUrl} />
        </div>
      </div>
    </div>
  );
};

export default PdfViewer;

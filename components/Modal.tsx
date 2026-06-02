'use client';

import React from 'react';

interface ModalProps {
  id: string;
  isOpen: boolean;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  onClose: () => void;
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
}

const Modal: React.FC<ModalProps> = ({
  id,
  isOpen,
  title,
  subtitle,
  children,
  onClose,
  onConfirm,
  confirmText = 'Kaydet',
  cancelText = 'İptal',
  isLoading = false,
}) => {
  return (
    <div
      className={`mov ${isOpen ? 'open' : ''}`}
      id={id}
      onClick={(e) => (e.target as HTMLElement).id === id && onClose()}
    >
      <div className="mbox">
        <div className="mt">{title}</div>
        {subtitle && <div className="ms">{subtitle}</div>}
        {children}
        <div className="mf">
          <button className="btn btn-s" onClick={onClose} disabled={isLoading}>
            {cancelText}
          </button>
          {onConfirm && (
            <button className="btn btn-p" onClick={onConfirm} disabled={isLoading}>
              {confirmText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;

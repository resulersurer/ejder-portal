'use client';

import React, { useState, useEffect } from 'react';

export interface ToastMessage {
  message: string;
  type?: 'success' | 'error' | '';
}

interface ToastProps {}

let toastCallback: ((msg: ToastMessage) => void) | null = null;

export const showToast = (message: string, type: 'success' | 'error' | '' = '') => {
  if (toastCallback) {
    toastCallback({ message, type });
  }
};

const Toast: React.FC<ToastProps> = () => {
  const [message, setMessage] = useState<ToastMessage | null>(null);

  useEffect(() => {
    toastCallback = (msg: ToastMessage) => {
      setMessage(msg);
      setTimeout(() => setMessage(null), 3000);
    };
  }, []);

  if (!message) return null;

  return (
    <div className={`toast ${message.type ? 'show ' + message.type : 'show'}`}>
      {message.message}
    </div>
  );
};

export default Toast;

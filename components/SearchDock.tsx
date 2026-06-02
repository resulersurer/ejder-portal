'use client';

import React, { useState, useCallback } from 'react';
import { debounce } from '@/lib/utils';

interface SearchDockProps {
  onSearch: (term: string) => void;
  visible: boolean;
}

const SearchDock: React.FC<SearchDockProps> = ({ onSearch, visible }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showClear, setShowClear] = useState(false);

  const handleDebouncedSearch = useCallback(
    debounce((term: string) => {
      onSearch(term);
    }, 200),
    [onSearch]
  );

  const handleInput = (value: string) => {
    setSearchTerm(value);
    setShowClear(value.length > 0);
    handleDebouncedSearch(value);
  };

  const handleClear = () => {
    setSearchTerm('');
    setShowClear(false);
    onSearch('');
  };

  if (!visible) return null;

  return (
    <div className="sz">
      <div className="sz-in">
        <div className="sf">
          <div className="sf-ic">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Sistem, araç veya portal ara…"
            value={searchTerm}
            onChange={(e) => handleInput(e.target.value)}
            autoComplete="off"
            spellCheck="false"
          />
          <button
            className={`sf-x ${showClear ? 'on' : ''}`}
            onClick={handleClear}
            aria-label="Clear search"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchDock;

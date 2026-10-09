'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Search as SearchIcon, X } from 'lucide-react';

interface SearchResult {
  title: string;
  url: string;
  category: string;
  description: string;
}

export function Search() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [index, setIndex] = useState<SearchResult[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && index.length === 0) {
      fetch('/search.json')
        .then(res => res.json())
        .then(data => setIndex(data))
        .catch(err => console.error('Failed to load search index', err));
    }
  }, [isOpen, index.length]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (query.trim() === '') {
      setResults([]);
      return;
    }

    const q = query.toLowerCase();
    const filtered = index.filter(item => 
      item.title.toLowerCase().includes(q) || 
      item.description.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q)
    ).slice(0, 8); // limit results
    setResults(filtered);
  }, [query, index]);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 text-[var(--text-muted)] hover:text-[var(--neon-accent)] transition-colors rounded-full"
        aria-label="Search"
      >
        <SearchIcon className="w-4 h-4" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-20 px-4 bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg shadow-2xl overflow-hidden font-mono">
            
            <div className="flex items-center px-4 py-3 border-b border-[var(--border-color)]">
              <SearchIcon className="w-5 h-5 text-[var(--neon-accent)] mr-3" />
              <input
                ref={inputRef}
                type="text"
                className="flex-1 bg-transparent border-none outline-none text-white placeholder-[var(--text-muted)]"
                placeholder="Search posts..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <button 
                onClick={() => { setIsOpen(false); setQuery(''); }} 
                className="p-1 ml-2 text-[var(--text-muted)] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="max-h-[60vh] overflow-y-auto p-2">
              {results.length === 0 && query !== '' && (
                <div className="p-4 text-center text-[var(--text-muted)]">No results found for "{query}".</div>
              )}
              {results.length === 0 && query === '' && (
                <div className="p-4 text-center text-[var(--text-muted)]">Type to start searching...</div>
              )}
              {results.map((res) => (
                <Link
                  key={res.url}
                  href={res.url}
                  onClick={() => { setIsOpen(false); setQuery(''); }}
                  className="block p-3 mb-1 rounded hover:bg-[var(--bg-secondary)] border border-transparent hover:border-[var(--border-color)] transition-colors group"
                >
                  <div className="flex justify-between items-center mb-1">
                    <h3 className="text-sm font-bold text-[var(--text-primary)] group-hover:text-[var(--neon-accent)]">{res.title}</h3>
                    <span className="text-[10px] px-2 py-0.5 border border-[var(--border-color)] rounded-full text-[var(--text-muted)] uppercase tracking-wider">{res.category}</span>
                  </div>
                  {res.description && (
                    <p className="text-xs text-[var(--text-muted)] line-clamp-1">{res.description}</p>
                  )}
                </Link>
              ))}
            </div>

          </div>
          {/* Click away overlay */}
          <div className="absolute inset-0 z-[-1]" onClick={() => { setIsOpen(false); setQuery(''); }}></div>
        </div>
      )}
    </>
  );
}

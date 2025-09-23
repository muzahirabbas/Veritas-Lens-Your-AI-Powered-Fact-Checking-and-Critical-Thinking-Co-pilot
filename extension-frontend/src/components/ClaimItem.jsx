
import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import VeracityScale from './VeracityScale';
import Loader from './Loader';

const API_BASE_URL = 'http://127.0.0.1:5000';

const ClaimItem = ({ timestamp, claim }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleToggle = async () => {
    const newIsOpen = !isOpen;
    setIsOpen(newIsOpen);

    if (newIsOpen && !result) {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API_BASE_URL}/verify_claim`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: claim }),
        });
        if (!response.ok) throw new Error('Network response was not ok.');
        const data = await response.json();
        setResult(data);
      } catch (e) {
        setError('Failed to verify claim. Please try again.');
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="border-b border-slate-200 dark:border-slate-700">
      <button
        onClick={handleToggle}
        className="w-full flex justify-between items-center text-left p-3 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors duration-150"
        aria-expanded={isOpen}
      >
        <div className="flex-1 pr-4">
          <span className="font-mono text-xs text-blue-500">{timestamp}</span>
          <p className="text-sm text-slate-800 dark:text-slate-200 mt-1">{claim}</p>
        </div>
        {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </button>
      {isOpen && (
        <div className="p-4 bg-slate-50 dark:bg-slate-900/50">
          {isLoading && <Loader text="Verifying claim..." />}
          {error && <p className="text-sm text-red-500">{error}</p>}
          {result && (
            <div className="space-y-4">
              <VeracityScale score={result.score} label={result.veracity} />
              <div>
                <h4 className="font-semibold text-sm mb-1 text-slate-800 dark:text-slate-200">Summary</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">{result.summary}</p>
              </div>
              <div>
                <h4 className="font-semibold text-sm mb-2 text-slate-800 dark:text-slate-200">Sources</h4>
                <ul className="list-disc list-inside space-y-1">
                  {result.sources?.map((source, index) => (
                    <li key={index} className="text-sm">
                      <a href={source.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">
                        {source.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ClaimItem;

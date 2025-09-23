
import React, { useState, useEffect } from 'react';
import { X, CheckSquare, Scale, MessageSquareQuote } from 'lucide-react';
import VeracityScale from './VeracityScale';
import Loader from './Loader';
import ClaimItem from './ClaimItem';

const API_BASE_URL = 'http://127.0.0.1:5000';

const SidePanel = ({ initialSelection, analysisMode = 'text', transcript, onClose }) => {
  const [activeTab, setActiveTab] = useState('verifier');
  const [isLoading, setIsLoading] = useState(true);
  const [verifierData, setVerifierData] = useState(null);
  const [dialecticData, setDialecticData] = useState(null);
  const [youtubeClaims, setYoutubeClaims] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        if (analysisMode === 'youtube') {
            // In a real scenario, the transcript would be extracted here.
            // For now, we use the placeholder passed in.
            if (!transcript) {
                throw new Error("Video transcript not available.");
            }
            const claimsResponse = await fetch(`${API_BASE_URL}/analyze_transcript`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ transcript }),
            });
            if (!claimsResponse.ok) throw new Error('Failed to analyze transcript.');
            const claimsData = await claimsResponse.json();
            setYoutubeClaims(claimsData.claims);
            setActiveTab('youtube');

        } else if (initialSelection) {
            const [verifierRes, dialecticRes] = await Promise.all([
              fetch(`${API_BASE_URL}/verify_claim`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: initialSelection }),
              }),
              fetch(`${API_BASE_URL}/generate_counterargument`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: initialSelection }),
              }),
            ]);

            if (!verifierRes.ok || !dialecticRes.ok) throw new Error('API request failed.');
            
            const verifierJson = await verifierRes.json();
            const dialecticJson = await dialecticRes.json();

            setVerifierData(verifierJson);
            setDialecticData(dialecticJson);
        }
      } catch (err) {
        setError(err.message || 'An error occurred while fetching data.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [initialSelection, analysisMode, transcript]);

  const TabButton = ({ id, label, icon: Icon }) => (
    <button
      onClick={() => setActiveTab(id)}
      role="tab"
      aria-selected={activeTab === id}
      className={`flex-1 flex items-center justify-center p-3 text-sm font-medium border-b-2 transition-colors duration-200 ${
        activeTab === id
          ? 'border-blue-500 text-blue-600 dark:text-blue-400'
          : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
      }`}
    >
      <Icon size={16} className="mr-2" />
      {label}
    </button>
  );

  return (
    <div className="w-96 max-w-sm h-full flex flex-col bg-white dark:bg-[#1A1A1B] text-slate-900 dark:text-slate-100 shadow-2xl border-l border-slate-200 dark:border-slate-700 font-sans">
      <header className="flex items-center justify-between p-3 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center">
            <Scale size={20} className="text-blue-500 mr-2"/>
            <h1 className="font-bold text-lg">Veritas Lens</h1>
        </div>
        <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
          <X size={20} />
        </button>
      </header>

      {analysisMode !== 'youtube' && (
        <nav className="flex border-b border-slate-200 dark:border-slate-700">
          <TabButton id="verifier" label="Verifier" icon={CheckSquare} />
          <TabButton id="dialectic" label="Dialectic Engine" icon={MessageSquareQuote} />
        </nav>
      )}

      <main className="flex-1 overflow-y-auto">
        {isLoading ? (
          <Loader />
        ) : error ? (
          <div className="p-6 text-center text-red-500">{error}</div>
        ) : (
          <div className="p-4">
            {activeTab === 'verifier' && verifierData && (
              <div className="space-y-6">
                <VeracityScale score={verifierData.score} label={verifierData.veracity} />
                <div>
                  <h3 className="font-semibold mb-2">Summary</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 p-3 rounded-md">{verifierData.summary}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Sources</h3>
                  <ul className="space-y-2">
                    {verifierData.sources?.map((source, i) => (
                      <li key={i}>
                        <a href={source.url} target="_blank" rel="noopener noreferrer" className="block text-sm p-2 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md text-blue-600 dark:text-blue-400 truncate">
                          {source.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
            {activeTab === 'dialectic' && dialecticData && (
                <div className="space-y-4">
                    {dialecticData.counterpoints?.map((point, i) => (
                        <div key={i} className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
                            <h4 className="font-semibold text-sm mb-1 text-blue-600 dark:text-blue-400">{point.perspective}</h4>
                            <p className="text-sm text-slate-700 dark:text-slate-300">{point.argument}</p>
                        </div>
                    ))}
                </div>
            )}
            {activeTab === 'youtube' && (
                <div>
                    <h2 className="font-bold text-md p-3">Extracted Claims</h2>
                    {youtubeClaims && youtubeClaims.length > 0 ? (
                        <div className="border-t border-slate-200 dark:border-slate-700">
                            {youtubeClaims.map((item, index) => (
                                <ClaimItem key={index} timestamp={item.timestamp} claim={item.claim} />
                            ))}
                        </div>
                    ) : (
                        <p className="p-4 text-sm text-slate-500">No verifiable claims could be extracted from this transcript.</p>
                    )}
                </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default SidePanel;

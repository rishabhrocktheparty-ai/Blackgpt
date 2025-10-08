/**
 * BLACK GPT Main Application
 * 
 * LEGAL NOTICE: This app only displays data from approved public sources.
 * No dark web, Tor, or illicit data is accessed or displayed.
 */

import { useState, useEffect } from 'react';
import MainPanel from './components/MainPanel';
import GistCard from './components/GistCard';
import VerificationModal from './components/VerificationModal';
import CorrelationModal from './components/CorrelationModal';
import AuditLog from './components/AuditLog';
import { api } from './utils/api';
import type { Signal } from './types';

function App() {
  const [currentSignal, setCurrentSignal] = useState<Signal | null>(null);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [showCorrelationModal, setShowCorrelationModal] = useState(false);
  const [correlationResult, setCorrelationResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(true);

  useEffect(() => {
    // Hide onboarding after 5 seconds
    const timer = setTimeout(() => setShowOnboarding(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  const handleUploadSignal = async (data: {
    scriptName: string;
    dateFrom: Date;
    dateTo: Date;
    gistText: string;
    provenanceTags: string[];
  }) => {
    setIsLoading(true);
    try {
      const response = await api.createSignal({
        ...data,
        createdBy: 'demo-user'
      });
      setCurrentSignal(response.data.data);
    } catch (error) {
      console.error('Failed to upload signal:', error);
      alert('Failed to upload signal. Please check your input.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResearchPublic = async () => {
    if (!currentSignal) return;

    setIsLoading(true);
    try {
      const response = await api.researchPublic(currentSignal.id, 'demo-user');
      setCorrelationResult(response.data.data);
      setShowCorrelationModal(true);
      
      // Refresh signal to get updated status
      const updatedSignal = await api.getSignal(currentSignal.id);
      setCurrentSignal(updatedSignal.data.data);
    } catch (error) {
      console.error('Failed to research public web:', error);
      alert('Failed to correlate with public sources.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifySignal = async (action: 'accept' | 'reject' | 'followup', notes: string) => {
    if (!currentSignal) return;

    try {
      await api.verifySignal(currentSignal.id, {
        reviewerId: 'demo-user',
        action,
        notes
      });

      // Refresh signal
      const updatedSignal = await api.getSignal(currentSignal.id);
      setCurrentSignal(updatedSignal.data.data);
      setShowVerifyModal(false);
    } catch (error) {
      console.error('Failed to verify signal:', error);
      alert('Failed to verify signal.');
    }
  };

  const requiresAttention = currentSignal ? (
    currentSignal.confidenceScore < 60 ||
    currentSignal.provenanceTags.some(tag => 
      tag.includes('manual') || tag.includes('unverified')
    )
  ) : false;

  return (
    <div className="min-h-screen bg-black-primary text-white">
      {/* Header */}
      <header className="border-b border-gray-800 py-6 px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-neon-teal to-neon-amber bg-clip-text text-transparent">
            BLACK GPT
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Hidden Market Signals • Legal Public Sources Only
          </p>
        </div>
      </header>

      {/* Onboarding Tooltip */}
      {showOnboarding && (
        <div className="fixed top-24 right-8 z-50 card p-4 max-w-sm animate-fade-in">
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 rounded-full bg-neon-teal mt-2 animate-pulse"></div>
            <div>
              <h3 className="font-semibold text-sm">Welcome to BLACK GPT</h3>
              <p className="text-xs text-gray-400 mt-1">
                All signals require human verification before being marked as actionable. 
                We only use legal public data sources.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Input Panel */}
          <div className="lg:col-span-1">
            <MainPanel onSubmit={handleUploadSignal} isLoading={isLoading} />
          </div>

          {/* Right: Signal Display */}
          <div className="lg:col-span-2">
            {currentSignal ? (
              <>
                <GistCard
                  signal={currentSignal}
                  requiresAttention={requiresAttention}
                  onVerify={() => setShowVerifyModal(true)}
                />
                
                {/* Audit Log */}
                <div className="mt-8">
                  <AuditLog signalId={currentSignal.id} />
                </div>
              </>
            ) : (
              <div className="card p-12 text-center">
                <div className="w-16 h-16 rounded-full bg-gray-800 mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-400">No Signal Selected</h3>
                <p className="text-gray-500 mt-2">
                  Upload a signal using the form to get started
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Fixed Research Button */}
      {currentSignal && (
        <button
          onClick={handleResearchPublic}
          disabled={isLoading}
          className="fixed bottom-8 right-8 btn-primary text-lg px-8 py-4 shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Researching...' : 'Re-search Public Web'}
        </button>
      )}

      {/* Modals */}
      {showVerifyModal && currentSignal && (
        <VerificationModal
          signal={currentSignal}
          onClose={() => setShowVerifyModal(false)}
          onVerify={handleVerifySignal}
        />
      )}

      {showCorrelationModal && correlationResult && (
        <CorrelationModal
          result={correlationResult}
          onClose={() => setShowCorrelationModal(false)}
        />
      )}
    </div>
  );
}

export default App;

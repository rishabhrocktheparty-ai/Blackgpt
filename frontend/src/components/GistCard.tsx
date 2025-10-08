/**
 * Gist Card Component
 * Displays signal details with verification and correlation controls
 */

import { useState, useEffect } from 'react';
import { getSignal, verifySignal, researchPublic } from '../services/api';
import MetadataBar from './MetadataBar';
import VerificationPanel from './VerificationPanel';
import CorrelationResults from './CorrelationResults';
import AuditLog from './AuditLog';

interface Signal {
  id: number;
  scriptName: string;
  dateFrom: string;
  dateTo: string;
  gistText: string;
  provenanceTags: string[];
  sourceType: string;
  confidenceScore: number;
  status: string;
  requiresAttention: boolean;
  contradictionFlag: boolean;
  contradictionNote?: string;
  creator: { email: string };
  audits: any[];
  correlationJobs: any[];
}

interface GistCardProps {
  signalId: number;
}

const GistCard = ({ signalId }: GistCardProps) => {
  const [signal, setSignal] = useState<Signal | null>(null);
  const [loading, setLoading] = useState(true);
  const [correlating, setCorrelating] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [showAuditLog, setShowAuditLog] = useState(false);

  useEffect(() => {
    loadSignal();
  }, [signalId]);

  const loadSignal = async () => {
    setLoading(true);
    try {
      const data = await getSignal(signalId);
      setSignal(data);
    } catch (error) {
      console.error('Failed to load signal:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleResearch = async () => {
    setCorrelating(true);
    try {
      await researchPublic(signalId, 1); // Demo actor ID
      await loadSignal(); // Reload to get updated correlation data
    } catch (error) {
      console.error('Correlation failed:', error);
      alert('Failed to perform public web research');
    } finally {
      setCorrelating(false);
    }
  };

  const handleVerify = async (action: 'accept' | 'reject' | 'followup', notes?: string) => {
    try {
      await verifySignal(signalId, {
        reviewerId: 1, // Demo reviewer ID
        action,
        notes
      });
      await loadSignal();
      setShowVerification(false);
    } catch (error) {
      console.error('Verification failed:', error);
      alert('Failed to verify signal');
    }
  };

  if (loading) {
    return (
      <div className="card h-full flex items-center justify-center">
        <div className="text-accent-teal">Loading signal...</div>
      </div>
    );
  }

  if (!signal) {
    return (
      <div className="card h-full flex items-center justify-center">
        <div className="text-text-secondary">Signal not found</div>
      </div>
    );
  }

  const latestCorrelation = signal.correlationJobs[0];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Main Gist Card */}
      <div className="card">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-subheadline text-accent-teal mb-1">
              {signal.scriptName}
            </h2>
            <p className="text-small text-text-secondary">
              {new Date(signal.dateFrom).toLocaleDateString()} → {new Date(signal.dateTo).toLocaleDateString()}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowVerification(true)}
              className="btn-secondary text-sm py-2 px-4"
            >
              Verify
            </button>
            <button
              onClick={() => setShowAuditLog(!showAuditLog)}
              className="btn-secondary text-sm py-2 px-4"
            >
              Audit Log
            </button>
          </div>
        </div>

        {/* Dark Signal Gist */}
        <div className="bg-black-primary border border-accent-teal border-opacity-30 rounded-lg p-6 mb-4">
          <h3 className="text-body font-semibold text-accent-teal mb-3">
            Dark-Signal Gist
          </h3>
          <p className="text-gist text-text-primary leading-relaxed whitespace-pre-wrap">
            {signal.gistText}
          </p>
        </div>

        {/* Metadata */}
        <MetadataBar
          provenanceTags={signal.provenanceTags}
          confidenceScore={signal.confidenceScore}
          status={signal.status}
          requiresAttention={signal.requiresAttention}
          contradictionFlag={signal.contradictionFlag}
        />

        {/* Warnings */}
        {signal.requiresAttention && (
          <div className="mt-4 bg-amber-900 bg-opacity-20 border border-accent-amber text-accent-amber px-4 py-3 rounded-lg text-small">
            ⚠️ Requires Attention: This signal needs human verification before further processing.
          </div>
        )}

        {signal.contradictionFlag && signal.contradictionNote && (
          <div className="mt-4 bg-red-900 bg-opacity-20 border border-red-600 text-red-400 px-4 py-3 rounded-lg text-small">
            🔍 Contradiction Detected: {signal.contradictionNote}
          </div>
        )}
      </div>

      {/* Correlation Results */}
      {latestCorrelation && (
        <CorrelationResults correlation={latestCorrelation} />
      )}

      {/* Verification Panel Modal */}
      {showVerification && (
        <VerificationPanel
          signal={signal}
          onVerify={handleVerify}
          onClose={() => setShowVerification(false)}
        />
      )}

      {/* Audit Log */}
      {showAuditLog && (
        <AuditLog audits={signal.audits} onClose={() => setShowAuditLog(false)} />
      )}

      {/* Re-search Public Web Button (Fixed Bottom Right) */}
      <button
        onClick={handleResearch}
        disabled={correlating || signal.status === 'REJECTED'}
        className="fixed bottom-8 right-8 btn-primary text-lg py-4 px-8 shadow-2xl z-50"
        style={{ 
          boxShadow: '0 0 20px rgba(0, 212, 170, 0.5)'
        }}
      >
        {correlating ? 'Researching...' : '🔍 Re-search Public Web'}
      </button>
    </div>
  );
};

export default GistCard;

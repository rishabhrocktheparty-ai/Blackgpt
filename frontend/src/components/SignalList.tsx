/**
 * Signal List Component
 * Lists all signals with filtering
 */

import { useState, useEffect } from 'react';
import { listSignals } from '../services/api';

interface Signal {
  id: number;
  scriptName: string;
  status: string;
  confidenceScore: number;
  createdAt: string;
  requiresAttention: boolean;
}

interface SignalListProps {
  refreshTrigger: number;
  onSignalSelected: (id: number) => void;
  selectedSignalId: number | null;
}

const SignalList = ({ refreshTrigger, onSignalSelected, selectedSignalId }: SignalListProps) => {
  const [signals, setSignals] = useState<Signal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSignals();
  }, [refreshTrigger]);

  const loadSignals = async () => {
    setLoading(true);
    try {
      const data = await listSignals();
      setSignals(data.signals);
      
      // Auto-select first signal if none selected
      if (!selectedSignalId && data.signals.length > 0) {
        onSignalSelected(data.signals[0].id);
      }
    } catch (error) {
      console.error('Failed to load signals:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colorMap: { [key: string]: string } = {
      'UNVERIFIED': 'text-gray-400',
      'HUMAN_VERIFIED': 'text-green-400',
      'CORRELATED': 'text-blue-400',
      'REQUIRES_REVIEW': 'text-amber-400',
      'REJECTED': 'text-red-400'
    };
    return colorMap[status] || 'text-gray-400';
  };

  if (loading) {
    return (
      <div className="card">
        <h3 className="text-body font-semibold mb-4">Recent Signals</h3>
        <p className="text-text-secondary text-small">Loading...</p>
      </div>
    );
  }

  return (
    <div className="card">
      <h3 className="text-body font-semibold mb-4">Recent Signals</h3>
      
      {signals.length === 0 ? (
        <p className="text-text-secondary text-small">No signals yet. Create one above!</p>
      ) : (
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {signals.map((signal) => (
            <button
              key={signal.id}
              onClick={() => onSignalSelected(signal.id)}
              className={`w-full text-left p-3 rounded-lg transition-all ${
                selectedSignalId === signal.id
                  ? 'bg-accent-teal bg-opacity-10 border border-accent-teal'
                  : 'bg-black-primary border border-border-subtle hover:border-accent-teal'
              }`}
            >
              <div className="flex items-start justify-between mb-1">
                <span className="text-body font-medium truncate flex-1">
                  {signal.scriptName}
                </span>
                {signal.requiresAttention && (
                  <span className="text-accent-amber text-xs ml-2">⚠️</span>
                )}
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className={getStatusColor(signal.status)}>
                  {signal.status.replace(/_/g, ' ')}
                </span>
                <span className="text-text-secondary">
                  {(signal.confidenceScore * 100).toFixed(0)}%
                </span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SignalList;

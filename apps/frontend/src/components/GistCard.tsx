import type { Signal } from '../types';
import { format } from 'date-fns';

interface GistCardProps {
  signal: Signal;
  requiresAttention?: boolean;
  onVerify: () => void;
}

export default function GistCard({ signal, requiresAttention, onVerify }: GistCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Unverified':
        return 'status-unverified';
      case 'HumanVerified':
        return 'status-verified';
      case 'Correlated':
        return 'status-correlated';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <div className={`gist-panel ${requiresAttention ? 'attention-required' : ''}`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold">{signal.scriptName}</h2>
          <p className="text-sm text-gray-400 mt-1">
            {format(new Date(signal.dateFrom), 'MMM dd, yyyy HH:mm')} → {format(new Date(signal.dateTo), 'MMM dd, yyyy HH:mm')}
          </p>
        </div>
        {requiresAttention && (
          <span className="px-3 py-1 rounded-full bg-neon-amber/20 text-neon-amber text-xs font-semibold border border-neon-amber/30">
            Requires Attention
          </span>
        )}
      </div>

      {/* Dark-Signal Gist */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-neon-teal mb-3">Dark-Signal Gist</h3>
        <p className="text-gray-300 text-base leading-relaxed">
          {signal.gistText}
        </p>
      </div>

      {/* Metadata */}
      <div className="border-t border-gray-800 pt-4">
        <div className="flex flex-wrap items-center gap-4 text-sm">
          {/* Provenance */}
          <div className="flex items-center gap-2">
            <span className="text-gray-500 font-medium">Provenance:</span>
            <div className="flex flex-wrap gap-1">
              {signal.provenanceTags.map((tag, i) => (
                <span key={i} className="metadata-tag">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Separator */}
          <span className="text-gray-700">•</span>

          {/* Confidence */}
          <div className="flex items-center gap-2">
            <span className="text-gray-500 font-medium">Confidence:</span>
            <span className={`font-semibold ${
              signal.confidenceScore >= 70 ? 'text-green-400' :
              signal.confidenceScore >= 50 ? 'text-yellow-400' :
              'text-red-400'
            }`}>
              {signal.confidenceScore}%
            </span>
          </div>

          {/* Separator */}
          <span className="text-gray-700">•</span>

          {/* Status */}
          <div className="flex items-center gap-2">
            <span className="text-gray-500 font-medium">Status:</span>
            <span className={`font-semibold ${getStatusColor(signal.status)}`}>
              {signal.status}
            </span>
          </div>
        </div>
      </div>

      {/* Verification Button */}
      {signal.status === 'Unverified' && (
        <div className="mt-6 pt-4 border-t border-gray-800">
          <button
            onClick={onVerify}
            className="btn-secondary w-full sm:w-auto"
          >
            Require Human Verification
          </button>
        </div>
      )}
    </div>
  );
}

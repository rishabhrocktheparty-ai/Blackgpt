import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { api } from '../utils/api';
import type { Audit } from '../types';

interface AuditLogProps {
  signalId: string;
}

export default function AuditLog({ signalId }: AuditLogProps) {
  const [audits, setAudits] = useState<Audit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    loadAudits();
  }, [signalId]);

  const loadAudits = async () => {
    setIsLoading(true);
    try {
      const response = await api.getAuditTrail(signalId);
      setAudits(response.data.data);
    } catch (error) {
      console.error('Failed to load audit trail:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getActionIcon = (action: string) => {
    if (action.includes('CREATED')) return '📝';
    if (action.includes('VERIFICATION')) return '✓';
    if (action.includes('CORRELATION')) return '🔍';
    return '•';
  };

  const getActionColor = (action: string) => {
    if (action.includes('ACCEPT')) return 'text-green-400';
    if (action.includes('REJECT')) return 'text-red-400';
    if (action.includes('CORRELATION')) return 'text-neon-teal';
    return 'text-gray-400';
  };

  return (
    <div className="card p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Audit Trail</h3>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-1"
        >
          {isExpanded ? 'Collapse' : 'Expand'}
          <svg
            className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="text-center py-8 text-gray-400">
          Loading audit trail...
        </div>
      )}

      {/* Audit Entries */}
      {!isLoading && audits.length > 0 && (
        <div className={`space-y-3 ${isExpanded ? 'max-h-none' : 'max-h-64 overflow-hidden'}`}>
          {audits.map((audit) => (
            <div
              key={audit.id}
              className="bg-black-secondary rounded-lg p-4 border border-gray-800"
            >
              <div className="flex items-start gap-3">
                <span className="text-xl">{getActionIcon(audit.action)}</span>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-1">
                    <span className={`font-semibold text-sm ${getActionColor(audit.action)}`}>
                      {audit.action.replace(/_/g, ' ')}
                    </span>
                    <span className="text-xs text-gray-500">
                      {format(new Date(audit.timestamp), 'MMM dd, HH:mm:ss')}
                    </span>
                  </div>
                  {audit.notes && (
                    <p className="text-sm text-gray-400 mt-1">
                      {audit.notes}
                    </p>
                  )}
                  <p className="text-xs text-gray-600 mt-1">
                    by {audit.actorId}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && audits.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No audit entries yet
        </div>
      )}

      {/* Legal Notice */}
      <p className="text-xs text-gray-600 mt-4 text-center">
        All actions are immutably logged for compliance
      </p>
    </div>
  );
}

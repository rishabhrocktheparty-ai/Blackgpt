/**
 * Audit Log Component
 * Displays immutable audit trail
 */

interface AuditLogProps {
  audits: Array<{
    id: number;
    action: string;
    notes?: string;
    timestamp: string;
    actor: {
      email: string;
    };
  }>;
  onClose: () => void;
}

const AuditLog = ({ audits, onClose }: AuditLogProps) => {
  const getActionIcon = (action: string) => {
    const icons: { [key: string]: string } = {
      'CREATED': '➕',
      'VERIFIED': '✓',
      'REJECTED': '✕',
      'CORRELATED': '🔍',
      'FLAGGED': '⚠️',
      'UPDATED': '📝',
      'DELETED': '🗑️'
    };
    return icons[action] || '📋';
  };

  const getActionColor = (action: string) => {
    const colors: { [key: string]: string } = {
      'CREATED': 'text-blue-400',
      'VERIFIED': 'text-green-400',
      'REJECTED': 'text-red-400',
      'CORRELATED': 'text-accent-teal',
      'FLAGGED': 'text-accent-amber',
      'UPDATED': 'text-blue-400',
      'DELETED': 'text-red-400'
    };
    return colors[action] || 'text-text-secondary';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
      <div className="card max-w-3xl w-full max-h-[90vh] overflow-y-auto animate-fade-in">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-subheadline text-accent-teal">Audit Log</h3>
          <button
            onClick={onClose}
            className="text-text-secondary hover:text-text-primary text-2xl"
          >
            ×
          </button>
        </div>

        <div className="space-y-4">
          {audits.length === 0 ? (
            <p className="text-text-secondary text-center py-8">No audit entries yet</p>
          ) : (
            audits.map((audit) => (
              <div
                key={audit.id}
                className="bg-black-primary border border-border-subtle rounded-lg p-4"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{getActionIcon(audit.action)}</span>
                    <div>
                      <span className={`text-body font-semibold ${getActionColor(audit.action)}`}>
                        {audit.action.replace(/_/g, ' ')}
                      </span>
                      <p className="text-small text-text-secondary mt-1">
                        by {audit.actor.email}
                      </p>
                    </div>
                  </div>
                  <span className="text-small text-text-secondary">
                    {new Date(audit.timestamp).toLocaleString()}
                  </span>
                </div>

                {audit.notes && (
                  <div className="mt-3 pl-11 text-small text-text-primary">
                    {audit.notes}
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        <div className="mt-6">
          <button onClick={onClose} className="btn-secondary w-full">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuditLog;

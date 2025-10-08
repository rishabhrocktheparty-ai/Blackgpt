/**
 * Metadata Bar Component
 * Displays provenance, confidence, and status
 */

interface MetadataBarProps {
  provenanceTags: string[];
  confidenceScore: number;
  status: string;
  requiresAttention: boolean;
  contradictionFlag: boolean;
}

const MetadataBar = ({
  provenanceTags,
  confidenceScore,
  status,
  requiresAttention,
  contradictionFlag
}: MetadataBarProps) => {
  const getStatusBadge = () => {
    const statusMap: { [key: string]: string } = {
      'UNVERIFIED': 'badge-unverified',
      'HUMAN_VERIFIED': 'badge-verified',
      'CORRELATED': 'badge-correlated',
      'REQUIRES_REVIEW': 'badge-review',
      'REJECTED': 'badge-rejected'
    };

    return `badge ${statusMap[status] || 'badge-unverified'}`;
  };

  const getStatusText = () => {
    return status.replace(/_/g, ' ').toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className="flex flex-wrap items-center gap-3 text-small text-text-secondary">
      <div className="flex items-center space-x-2">
        <span className="font-semibold">Provenance:</span>
        <div className="flex flex-wrap gap-1">
          {provenanceTags.map((tag, idx) => (
            <span key={idx} className="bg-border-subtle px-2 py-1 rounded text-xs">
              {tag}
            </span>
          ))}
        </div>
      </div>

      <span className="text-border-subtle">•</span>

      <div className="flex items-center space-x-2">
        <span className="font-semibold">Confidence:</span>
        <span className={`font-mono ${
          confidenceScore >= 0.7 ? 'text-green-400' : 
          confidenceScore >= 0.4 ? 'text-accent-amber' : 
          'text-red-400'
        }`}>
          {(confidenceScore * 100).toFixed(1)}%
        </span>
      </div>

      <span className="text-border-subtle">•</span>

      <div className="flex items-center space-x-2">
        <span className="font-semibold">Status:</span>
        <span className={getStatusBadge()}>
          {getStatusText()}
        </span>
      </div>

      {requiresAttention && (
        <>
          <span className="text-border-subtle">•</span>
          <span className="text-accent-amber font-semibold">⚠️ Requires Attention</span>
        </>
      )}

      {contradictionFlag && (
        <>
          <span className="text-border-subtle">•</span>
          <span className="text-red-400 font-semibold">🔍 Contradiction Flagged</span>
        </>
      )}
    </div>
  );
};

export default MetadataBar;

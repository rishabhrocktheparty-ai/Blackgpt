/**
 * Correlation Results Component
 * Displays public web correlation results
 */

interface CorrelationResultsProps {
  correlation: {
    jobId: string;
    status: string;
    resultGist: string;
    correlationConfidence: number;
    sourcesQueried: string[];
    startedAt: string;
    finishedAt?: string;
  };
}

const CorrelationResults = ({ correlation }: CorrelationResultsProps) => {
  const getStatusColor = () => {
    switch (correlation.status) {
      case 'COMPLETED':
        return 'text-green-400';
      case 'IN_PROGRESS':
        return 'text-accent-amber';
      case 'FAILED':
        return 'text-red-400';
      default:
        return 'text-text-secondary';
    }
  };

  return (
    <div className="card animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-body font-semibold text-accent-teal">
          Public Web Correlation
        </h3>
        <span className={`text-small font-semibold ${getStatusColor()}`}>
          {correlation.status}
        </span>
      </div>

      {correlation.status === 'COMPLETED' && correlation.resultGist && (
        <>
          <div className="bg-black-primary border border-accent-teal border-opacity-20 rounded-lg p-4 mb-4">
            <p className="text-body text-text-primary whitespace-pre-wrap">
              {correlation.resultGist}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-small">
            <div>
              <span className="text-text-secondary">Correlation Confidence:</span>
              <span className={`ml-2 font-mono font-semibold ${
                correlation.correlationConfidence >= 0.7 ? 'text-green-400' :
                correlation.correlationConfidence >= 0.4 ? 'text-accent-amber' :
                'text-red-400'
              }`}>
                {(correlation.correlationConfidence * 100).toFixed(1)}%
              </span>
            </div>

            <span className="text-border-subtle">•</span>

            <div>
              <span className="text-text-secondary">Sources Queried:</span>
              <span className="ml-2 text-text-primary">
                {correlation.sourcesQueried.join(', ')}
              </span>
            </div>

            {correlation.finishedAt && (
              <>
                <span className="text-border-subtle">•</span>
                <div>
                  <span className="text-text-secondary">Completed:</span>
                  <span className="ml-2 text-text-primary">
                    {new Date(correlation.finishedAt).toLocaleString()}
                  </span>
                </div>
              </>
            )}
          </div>
        </>
      )}

      {correlation.status === 'IN_PROGRESS' && (
        <div className="text-center py-8">
          <div className="text-accent-teal text-2xl mb-2">⏳</div>
          <p className="text-text-secondary">Querying public sources...</p>
        </div>
      )}

      {correlation.status === 'FAILED' && (
        <div className="bg-red-900 bg-opacity-20 border border-red-600 text-red-400 px-4 py-3 rounded-lg">
          Correlation job failed. Please try again.
        </div>
      )}
    </div>
  );
};

export default CorrelationResults;

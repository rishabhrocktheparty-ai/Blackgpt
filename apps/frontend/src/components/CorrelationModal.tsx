interface CorrelationModalProps {
  result: any;
  onClose: () => void;
}

export default function CorrelationModal({ result, onClose }: CorrelationModalProps) {
  const { summary, contradiction, sources } = result;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="card max-w-4xl w-full p-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold">Public Web Correlation Results</h2>
            <p className="text-sm text-gray-400 mt-1">
              Analyzed {sources?.length || 0} public sources
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Summary */}
        {summary && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-neon-teal mb-3">
              Correlation Summary
            </h3>
            <div className="bg-black-secondary rounded-lg p-4">
              <p className="text-gray-300 leading-relaxed mb-4">
                {summary.gist}
              </p>
              <div className="flex items-center gap-6 text-sm">
                <div>
                  <span className="text-gray-500">Confidence:</span>
                  <span className={`ml-2 font-semibold ${
                    summary.confidenceScore >= 70 ? 'text-green-400' :
                    summary.confidenceScore >= 50 ? 'text-yellow-400' :
                    'text-red-400'
                  }`}>
                    {summary.confidenceScore}%
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Model:</span>
                  <span className="ml-2 text-gray-300">{summary.modelUsed}</span>
                </div>
              </div>
              {summary.topSignals && (
                <div className="mt-4">
                  <span className="text-gray-500 text-sm">Key Signals:</span>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {summary.topSignals.map((signal: string, i: number) => (
                      <span key={i} className="metadata-tag">
                        {signal}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Contradiction Detection */}
        {contradiction && contradiction.confidence > 40 && (
          <div className="mb-6 border-l-4 border-neon-amber p-4 bg-neon-amber/5">
            <h3 className="text-lg font-semibold text-neon-amber mb-2">
              ⚠️ Contradiction Detected
            </h3>
            <p className="text-gray-300 text-sm">
              {contradiction.counterEvidence}
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Confidence: {contradiction.confidence}% • Requires additional review
            </p>
          </div>
        )}

        {/* Sources */}
        {sources && sources.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-3">
              Public Sources ({sources.length})
            </h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {sources.map((source: any, i: number) => (
                <div key={i} className="bg-black-secondary rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <span className="metadata-tag text-xs">
                      {source.source}
                    </span>
                    <span className="text-xs text-gray-500">
                      Relevance: {Math.round(source.relevance * 100)}%
                    </span>
                  </div>
                  <p className="text-sm text-gray-300 mb-2">
                    {source.content}
                  </p>
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-neon-teal hover:underline flex items-center gap-1"
                  >
                    View source
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-gray-800">
          <button onClick={onClose} className="btn-primary w-full">
            Close
          </button>
        </div>

        {/* Legal Notice */}
        <p className="text-xs text-gray-500 mt-4 text-center">
          All sources are from legal public APIs • Full audit trail maintained
        </p>
      </div>
    </div>
  );
}

/**
 * Verification Panel Component
 * Modal for human verification of signals
 */

import { useState } from 'react';

interface VerificationPanelProps {
  signal: any;
  onVerify: (action: 'accept' | 'reject' | 'followup', notes?: string) => void;
  onClose: () => void;
}

const VerificationPanel = ({ signal, onVerify, onClose }: VerificationPanelProps) => {
  const [notes, setNotes] = useState('');
  const [selectedAction, setSelectedAction] = useState<'accept' | 'reject' | 'followup' | null>(null);

  const handleSubmit = () => {
    if (!selectedAction) {
      alert('Please select an action');
      return;
    }
    onVerify(selectedAction, notes || undefined);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
      <div className="card max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-fade-in">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-subheadline text-accent-teal">Human Verification</h3>
          <button
            onClick={onClose}
            className="text-text-secondary hover:text-text-primary text-2xl"
          >
            ×
          </button>
        </div>

        <div className="mb-6">
          <h4 className="text-body font-semibold mb-2">Signal Details</h4>
          <div className="bg-black-primary rounded-lg p-4 space-y-2 text-small">
            <div>
              <span className="text-text-secondary">Script Name:</span>
              <span className="text-text-primary ml-2">{signal.scriptName}</span>
            </div>
            <div>
              <span className="text-text-secondary">Source:</span>
              <span className="text-text-primary ml-2">{signal.sourceType}</span>
            </div>
            <div>
              <span className="text-text-secondary">Provenance:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {signal.provenanceTags.map((tag: string, idx: number) => (
                  <span key={idx} className="bg-border-subtle px-2 py-1 rounded text-xs">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <span className="text-text-secondary">Confidence:</span>
              <span className="text-text-primary ml-2">
                {(signal.confidenceScore * 100).toFixed(1)}%
              </span>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h4 className="text-body font-semibold mb-2">Gist Content</h4>
          <div className="bg-black-primary rounded-lg p-4 text-small text-text-primary max-h-40 overflow-y-auto">
            {signal.gistText}
          </div>
        </div>

        <div className="mb-6">
          <h4 className="text-body font-semibold mb-3">Verification Action</h4>
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => setSelectedAction('accept')}
              className={`p-4 rounded-lg border-2 transition-all ${
                selectedAction === 'accept'
                  ? 'border-green-500 bg-green-500 bg-opacity-10'
                  : 'border-border-subtle hover:border-green-500'
              }`}
            >
              <div className="text-2xl mb-1">✓</div>
              <div className="text-small font-semibold">Accept</div>
            </button>
            <button
              onClick={() => setSelectedAction('followup')}
              className={`p-4 rounded-lg border-2 transition-all ${
                selectedAction === 'followup'
                  ? 'border-accent-amber bg-accent-amber bg-opacity-10'
                  : 'border-border-subtle hover:border-accent-amber'
              }`}
            >
              <div className="text-2xl mb-1">⚠️</div>
              <div className="text-small font-semibold">Follow-up</div>
            </button>
            <button
              onClick={() => setSelectedAction('reject')}
              className={`p-4 rounded-lg border-2 transition-all ${
                selectedAction === 'reject'
                  ? 'border-red-500 bg-red-500 bg-opacity-10'
                  : 'border-border-subtle hover:border-red-500'
              }`}
            >
              <div className="text-2xl mb-1">✕</div>
              <div className="text-small font-semibold">Reject</div>
            </button>
          </div>
        </div>

        <div className="mb-6">
          <label htmlFor="notes" className="block text-body font-semibold mb-2">
            Notes (Optional)
          </label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="input-field w-full"
            rows={4}
            placeholder="Add verification notes..."
          />
        </div>

        <div className="flex space-x-3">
          <button
            onClick={handleSubmit}
            className="btn-primary flex-1"
          >
            Submit Verification
          </button>
          <button
            onClick={onClose}
            className="btn-secondary"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerificationPanel;

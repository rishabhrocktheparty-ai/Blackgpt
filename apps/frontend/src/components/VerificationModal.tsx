import { useState } from 'react';
import type { Signal } from '../types';

interface VerificationModalProps {
  signal: Signal;
  onClose: () => void;
  onVerify: (action: 'accept' | 'reject' | 'followup', notes: string) => void;
}

export default function VerificationModal({ signal, onClose, onVerify }: VerificationModalProps) {
  const [notes, setNotes] = useState('');
  const [selectedAction, setSelectedAction] = useState<'accept' | 'reject' | 'followup' | null>(null);

  const handleSubmit = () => {
    if (!selectedAction) {
      alert('Please select an action');
      return;
    }
    onVerify(selectedAction, notes);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="card max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold">Human Verification</h2>
            <p className="text-sm text-gray-400 mt-1">Review and verify this signal</p>
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

        {/* Signal Info */}
        <div className="bg-black-secondary rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-neon-teal mb-2">{signal.scriptName}</h3>
          <p className="text-gray-300 text-sm leading-relaxed mb-3">
            {signal.gistText}
          </p>
          <div className="flex flex-wrap gap-2">
            {signal.provenanceTags.map((tag, i) => (
              <span key={i} className="metadata-tag text-xs">
                {tag}
              </span>
            ))}
          </div>
          <div className="mt-3 text-sm text-gray-400">
            Confidence: <span className="font-semibold">{signal.confidenceScore}%</span>
          </div>
        </div>

        {/* Actions */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-3">
            Verification Action
          </label>
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => setSelectedAction('accept')}
              className={`p-4 rounded-lg border-2 transition-all ${
                selectedAction === 'accept'
                  ? 'border-green-400 bg-green-400/10 text-green-400'
                  : 'border-gray-700 hover:border-gray-600 text-gray-400'
              }`}
            >
              <div className="text-2xl mb-1">✓</div>
              <div className="text-sm font-semibold">Accept</div>
            </button>
            <button
              onClick={() => setSelectedAction('reject')}
              className={`p-4 rounded-lg border-2 transition-all ${
                selectedAction === 'reject'
                  ? 'border-red-400 bg-red-400/10 text-red-400'
                  : 'border-gray-700 hover:border-gray-600 text-gray-400'
              }`}
            >
              <div className="text-2xl mb-1">✕</div>
              <div className="text-sm font-semibold">Reject</div>
            </button>
            <button
              onClick={() => setSelectedAction('followup')}
              className={`p-4 rounded-lg border-2 transition-all ${
                selectedAction === 'followup'
                  ? 'border-yellow-400 bg-yellow-400/10 text-yellow-400'
                  : 'border-gray-700 hover:border-gray-600 text-gray-400'
              }`}
            >
              <div className="text-2xl mb-1">⚠</div>
              <div className="text-sm font-semibold">Follow-up</div>
            </button>
          </div>
        </div>

        {/* Notes */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Reviewer Notes
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="input-field w-full h-24 resize-none"
            placeholder="Add your verification notes here..."
          />
        </div>

        {/* Footer */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="btn-secondary flex-1"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!selectedAction}
            className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Submit Verification
          </button>
        </div>

        {/* Legal Notice */}
        <p className="text-xs text-gray-500 mt-4 text-center">
          All verification actions are logged for audit compliance
        </p>
      </div>
    </div>
  );
}

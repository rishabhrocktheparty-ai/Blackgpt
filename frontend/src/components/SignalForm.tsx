/**
 * Signal Form Component
 * Form for creating new signals
 */

import { useState } from 'react';
import { createSignal } from '../services/api';

interface SignalFormProps {
  onSignalCreated: () => void;
}

const SignalForm = ({ onSignalCreated }: SignalFormProps) => {
  const [scriptName, setScriptName] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [gistText, setGistText] = useState('');
  const [sourceType, setSourceType] = useState('MANUAL_UPLOAD');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!scriptName || !dateFrom || !dateTo || !gistText) {
      setError('All fields are required');
      return;
    }

    setIsSubmitting(true);

    try {
      await createSignal({
        scriptName,
        dateFrom,
        dateTo,
        gistText,
        provenanceTags: [sourceType, 'user-uploaded'],
        sourceType,
        uploaderUserId: 1 // Demo user ID
      });

      // Reset form
      setScriptName('');
      setDateFrom('');
      setDateTo('');
      setGistText('');
      
      onSignalCreated();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create signal');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="card animate-fade-in">
      <h2 className="text-subheadline text-accent-teal mb-4">Create Signal</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="scriptName" className="block text-small text-text-secondary mb-2">
            Script Name
          </label>
          <input
            id="scriptName"
            type="text"
            value={scriptName}
            onChange={(e) => setScriptName(e.target.value)}
            className="input-field w-full"
            placeholder="Enter script name"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="dateFrom" className="block text-small text-text-secondary mb-2">
              Date From
            </label>
            <input
              id="dateFrom"
              type="datetime-local"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="input-field w-full"
              required
            />
          </div>
          <div>
            <label htmlFor="dateTo" className="block text-small text-text-secondary mb-2">
              Date To
            </label>
            <input
              id="dateTo"
              type="datetime-local"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="input-field w-full"
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="sourceType" className="block text-small text-text-secondary mb-2">
            Source Type
          </label>
          <select
            id="sourceType"
            value={sourceType}
            onChange={(e) => setSourceType(e.target.value)}
            className="input-field w-full"
          >
            <option value="MANUAL_UPLOAD">Manual Upload</option>
            <option value="REDDIT">Reddit</option>
            <option value="TWITTER">Twitter</option>
            <option value="NEWS_API">News API</option>
            <option value="BLOCKCHAIN">Blockchain</option>
            <option value="LICENSED_FEED">Licensed Feed</option>
            <option value="EXCHANGE_OTC">Exchange OTC</option>
          </select>
        </div>

        <div>
          <label htmlFor="gistText" className="block text-small text-text-secondary mb-2">
            Signal Gist
          </label>
          <textarea
            id="gistText"
            value={gistText}
            onChange={(e) => setGistText(e.target.value)}
            className="input-field w-full"
            rows={6}
            placeholder="Enter signal description (10-5000 characters)"
            required
          />
        </div>

        {error && (
          <div className="bg-red-900 bg-opacity-20 border border-red-600 text-red-400 px-4 py-3 rounded-lg text-small">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary w-full"
        >
          {isSubmitting ? 'Creating...' : 'Create Signal'}
        </button>
      </form>
    </div>
  );
};

export default SignalForm;

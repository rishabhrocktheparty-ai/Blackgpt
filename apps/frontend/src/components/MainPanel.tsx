import { useState } from 'react';

interface MainPanelProps {
  onSubmit: (data: {
    scriptName: string;
    dateFrom: Date;
    dateTo: Date;
    gistText: string;
    provenanceTags: string[];
  }) => void;
  isLoading: boolean;
}

const PROVENANCE_OPTIONS = [
  'reddit:public',
  'twitter:api',
  'news:licensed',
  'blockchain:public',
  'exchange:api',
  'manual:human-upload',
  'research:licensed'
];

export default function MainPanel({ onSubmit, isLoading }: MainPanelProps) {
  const [scriptName, setScriptName] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [gistText, setGistText] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>(['manual:human-upload']);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!scriptName || !dateFrom || !dateTo || !gistText || selectedTags.length === 0) {
      alert('Please fill in all fields');
      return;
    }

    onSubmit({
      scriptName,
      dateFrom: new Date(dateFrom),
      dateTo: new Date(dateTo),
      gistText,
      provenanceTags: selectedTags
    });
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  return (
    <div className="card p-6">
      <h2 className="text-xl font-semibold mb-6">Upload Signal</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Script Name */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Script Name
          </label>
          <input
            type="text"
            value={scriptName}
            onChange={(e) => setScriptName(e.target.value)}
            className="input-field w-full"
            placeholder="e.g., BTC-ETH-Arbitrage"
            required
          />
        </div>

        {/* Date Range */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              From
            </label>
            <input
              type="datetime-local"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="input-field w-full"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              To
            </label>
            <input
              type="datetime-local"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="input-field w-full"
              required
            />
          </div>
        </div>

        {/* Gist Text */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Signal Gist
          </label>
          <textarea
            value={gistText}
            onChange={(e) => setGistText(e.target.value)}
            className="input-field w-full h-32 resize-none"
            placeholder="Enter your market signal summary (max 120 words)..."
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            {gistText.split(/\s+/).filter(w => w).length} / 120 words
          </p>
        </div>

        {/* Provenance Tags */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Provenance Tags
          </label>
          <div className="flex flex-wrap gap-2">
            {PROVENANCE_OPTIONS.map(tag => (
              <button
                key={tag}
                type="button"
                onClick={() => toggleTag(tag)}
                className={`px-3 py-1 rounded-full text-xs border transition-colors ${
                  selectedTags.includes(tag)
                    ? 'bg-neon-teal text-black border-neon-teal'
                    : 'bg-gray-800 text-gray-300 border-gray-700 hover:border-gray-600'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-2">
            ⚠️ All sources must be legal and public. No dark web access.
          </p>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading}
          className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Uploading...' : 'Upload Signal'}
        </button>
      </form>
    </div>
  );
}

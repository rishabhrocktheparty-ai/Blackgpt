/**
 * Main Panel Component
 * Central UI for signal creation and management
 */

import { useState } from 'react';
import SignalForm from './SignalForm';
import GistCard from './GistCard';
import SignalList from './SignalList';

const MainPanel = () => {
  const [selectedSignalId, setSelectedSignalId] = useState<number | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleSignalCreated = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const handleSignalSelected = (id: number) => {
    setSelectedSignalId(id);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left: Signal Form and List */}
      <div className="lg:col-span-1 space-y-6">
        <SignalForm onSignalCreated={handleSignalCreated} />
        <SignalList 
          refreshTrigger={refreshTrigger}
          onSignalSelected={handleSignalSelected}
          selectedSignalId={selectedSignalId}
        />
      </div>

      {/* Right: Gist Card */}
      <div className="lg:col-span-2">
        {selectedSignalId ? (
          <GistCard signalId={selectedSignalId} />
        ) : (
          <div className="card h-full flex items-center justify-center">
            <p className="text-text-secondary text-center">
              Select a signal from the list to view details
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MainPanel;

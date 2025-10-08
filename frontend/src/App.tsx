/**
 * BLACK GPT Main Application
 * 
 * ⚠️ COMPLIANCE NOTICE ⚠️
 * This application processes ONLY legal, auditable data sources.
 * See legal_sources.md for approved sources.
 */

import { useState, useEffect } from 'react'
import MainPanel from './components/MainPanel'
import Header from './components/Header'
import OnboardingTooltip from './components/OnboardingTooltip'

function App() {
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    // Show onboarding for first-time users
    const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding');
    if (!hasSeenOnboarding) {
      setShowOnboarding(true);
    }
  }, []);

  const handleCloseOnboarding = () => {
    localStorage.setItem('hasSeenOnboarding', 'true');
    setShowOnboarding(false);
  };

  return (
    <div className="min-h-screen bg-black-primary">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <MainPanel />
      </main>
      {showOnboarding && (
        <OnboardingTooltip onClose={handleCloseOnboarding} />
      )}
    </div>
  )
}

export default App

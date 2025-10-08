/**
 * Onboarding Tooltip Component
 * First-time user guidance
 */

interface OnboardingTooltipProps {
  onClose: () => void;
}

const OnboardingTooltip = ({ onClose }: OnboardingTooltipProps) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
      <div className="card max-w-2xl w-full animate-fade-in">
        <div className="text-center mb-6">
          <h2 className="text-headline text-accent-teal mb-2">
            Welcome to BLACK GPT
          </h2>
          <p className="text-body text-text-secondary">
            Signal Intelligence Platform with Legal Compliance
          </p>
        </div>

        <div className="space-y-4 mb-6">
          <div className="bg-black-primary rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <span className="text-2xl">🔒</span>
              <div>
                <h3 className="text-body font-semibold mb-1">Legal Sources Only</h3>
                <p className="text-small text-text-secondary">
                  This platform only processes data from legal, auditable sources. 
                  All signals are validated for provenance and compliance.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-black-primary rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <span className="text-2xl">👤</span>
              <div>
                <h3 className="text-body font-semibold mb-1">Human Verification Required</h3>
                <p className="text-small text-text-secondary">
                  All signals must be verified by a human reviewer before they can be 
                  marked as actionable. This ensures quality and safety.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-black-primary rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <span className="text-2xl">🔍</span>
              <div>
                <h3 className="text-body font-semibold mb-1">Public Web Correlation</h3>
                <p className="text-small text-text-secondary">
                  Use the "Re-search Public Web" button to correlate signals with 
                  publicly available news, trading data, and social media.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-black-primary rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <span className="text-2xl">📋</span>
              <div>
                <h3 className="text-body font-semibold mb-1">Audit Trail</h3>
                <p className="text-small text-text-secondary">
                  Every action is logged in an immutable audit trail for compliance 
                  and accountability.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-amber-900 bg-opacity-20 border border-accent-amber rounded-lg p-4 mb-6">
          <p className="text-small text-accent-amber">
            ⚠️ <strong>Important:</strong> This platform does NOT access dark web, Tor, 
            or any illicit sources. See legal_sources.md for approved data sources.
          </p>
        </div>

        <button onClick={onClose} className="btn-primary w-full">
          Got it, let's start!
        </button>
      </div>
    </div>
  );
};

export default OnboardingTooltip;

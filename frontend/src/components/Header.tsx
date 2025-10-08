/**
 * Header Component
 */

const Header = () => {
  return (
    <header className="bg-black-card border-b border-border-subtle">
      <div className="container mx-auto px-4 py-4 max-w-7xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-headline text-accent-teal font-bold">
              BLACK GPT
            </h1>
            <span className="text-small text-text-secondary">
              Signal Intelligence Platform
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-small text-text-secondary">
              ✓ Legal Sources Only
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

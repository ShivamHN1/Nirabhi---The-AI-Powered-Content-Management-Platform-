import React from 'react';
import { Outlet, Link } from 'react-router-dom';

const MainLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-surface-primary">
      <nav className="bg-surface-secondary/95 backdrop-blur-sm border-b border-surface-tertiary/20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="text-xl font-bold text-accent-primary hover:text-accent-hover transition-colors">
                Nirabhi AI
              </Link>
            </div>
            <div className="flex space-x-4 items-center">
              <Link to="/dashboard" className="text-content-secondary hover:text-accent-primary transition-colors">
                Dashboard
              </Link>
              <Link to="/rules" className="text-content-secondary hover:text-accent-primary transition-colors">
                Rules
              </Link>
              <Link to="/analytics" className="text-content-secondary hover:text-accent-primary transition-colors">
                Analytics
              </Link>
              <Link to="/settings" className="text-content-secondary hover:text-accent-primary transition-colors">
                Settings
              </Link>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto py-6 px-4">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;

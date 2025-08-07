import React from 'react';
import { Outlet, Link } from 'react-router-dom';

const MainLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="text-xl font-bold text-indigo-600">
                Nirabhi AI
              </Link>
            </div>
            <div className="flex space-x-4 items-center">
              <Link to="/dashboard" className="text-gray-700 hover:text-indigo-600">
                Dashboard
              </Link>
              <Link to="/rules" className="text-gray-700 hover:text-indigo-600">
                Rules
              </Link>
              <Link to="/analytics" className="text-gray-700 hover:text-indigo-600">
                Analytics
              </Link>
              <Link to="/settings" className="text-gray-700 hover:text-indigo-600">
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

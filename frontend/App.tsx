import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import RulesConfig from './pages/RulesConfig';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="rules" element={<RulesConfig />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );

    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans">
            <header className="bg-zinc-950/80 backdrop-blur-sm sticky top-0 z-40 border-b border-zinc-800">
                <nav className="max-w-7xl mx-auto flex items-center justify-between p-4">
                    <a href="#/" className="flex items-center gap-2">
                        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-teal-500">
                            Nirabhi AI
                        </h1>
                    </a>
                    <div className="flex items-center gap-4">
                        <a href="#/" className={`text-sm font-medium transition-colors ${route === '#/' ? 'text-cyan-400' : 'text-zinc-400 hover:text-white'}`}>
                            Home
                        </a>
                        <a href="#/dashboard" className={`text-sm font-medium transition-colors ${route === '#/dashboard' ? 'text-cyan-400' : 'text-zinc-400 hover:text-white'}`}>
                            Dashboard
                        </a>
                    </div>
                </nav>
            </header>
            <main>
                <div key={route} className="page-fade-in">
                    {renderContent()}
                </div>
            </main>
        </div>
    );
};

export default App;

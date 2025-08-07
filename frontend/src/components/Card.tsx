import React from 'react';

interface CardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  icon?: JSX.Element;
}

export const Card: React.FC<CardProps> = ({ title, children, className = '', icon }) => (
  <div className={`bg-zinc-900/70 p-6 rounded-xl shadow-lg border border-zinc-800 ${className}`}>
    <div className="flex items-center gap-3 mb-4">
      {icon && <div className="text-zinc-400">{icon}</div>}
      <h2 className="text-xl font-bold text-white">{title}</h2>
    </div>
    {children}
  </div>
);

import React from 'react';

interface CardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  icon?: JSX.Element;
}

export const Card: React.FC<CardProps> = ({ title, children, className = '', icon }) => (
  <div className={`bg-surface-secondary/95 p-6 rounded-xl shadow-soft border border-surface-tertiary/20 backdrop-blur-sm hover:shadow-glow transition-shadow duration-300 ${className}`}>
    <div className="flex items-center gap-3 mb-4">
      {icon && <div className="text-accent-primary">{icon}</div>}
      <h2 className="text-xl font-bold text-content-primary">{title}</h2>
    </div>
    {children}
  </div>
);

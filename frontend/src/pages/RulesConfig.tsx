import React from 'react';

const RulesConfig: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-content-primary">Automation Rules</h1>
      <div className="bg-surface-secondary shadow-soft rounded-lg p-6 hover:shadow-glow transition-shadow">
        <div className="space-y-4">
          <h2 className="text-lg font-medium text-content-primary">Current Rules</h2>
          {/* Rule list will go here */}
          <div className="border border-surface-tertiary/20 rounded-md p-4 bg-surface-tertiary/50">
            <p className="text-content-secondary text-sm">No rules configured yet.</p>
          </div>
        </div>
        <div className="mt-6">
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-soft text-content-primary bg-accent-primary hover:bg-accent-hover"
          >
            Add New Rule
          </button>
        </div>
      </div>
    </div>
  );
};

export default RulesConfig;

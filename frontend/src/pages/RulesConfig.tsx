import React from 'react';

const RulesConfig: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">Automation Rules</h1>
      <div className="bg-white shadow rounded-lg p-6">
        <div className="space-y-4">
          <h2 className="text-lg font-medium text-gray-900">Current Rules</h2>
          {/* Rule list will go here */}
          <div className="border rounded-md p-4">
            <p className="text-gray-500 text-sm">No rules configured yet.</p>
          </div>
        </div>
        <div className="mt-6">
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Add New Rule
          </button>
        </div>
      </div>
    </div>
  );
};

export default RulesConfig;

import React from 'react';

const Settings: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-content-primary">Settings</h1>
      <div className="bg-surface-secondary shadow-soft rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-content-primary">API Configuration</h3>
              <div className="mt-2">
                <input
                  type="password"
                  name="apiKey"
                  className="bg-surface-tertiary text-content-primary shadow-soft focus:ring-accent-primary focus:border-accent-primary block w-full sm:text-sm border-surface-tertiary rounded-md"
                  placeholder="Enter your Gemini API key"
                />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-medium text-content-primary">Notification Preferences</h3>
              <div className="mt-2 space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-accent-primary focus:ring-accent-muted border-surface-tertiary rounded bg-surface-tertiary"
                  />
                  <label className="ml-2 text-sm text-content-secondary">
                    Email notifications for high-risk content
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-accent-primary focus:ring-accent-muted border-surface-tertiary rounded bg-surface-tertiary"
                  />
                  <label className="ml-2 text-sm text-content-secondary">
                    Daily summary reports
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="px-4 py-3 bg-surface-tertiary text-right sm:px-6 rounded-b-lg">
          <button
            type="submit"
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-soft text-sm font-medium rounded-md text-content-primary bg-accent-primary hover:bg-accent-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-muted"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;

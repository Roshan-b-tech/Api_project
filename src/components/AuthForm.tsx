import React, { useState } from 'react';
import { Key, AlertCircle } from 'lucide-react';

interface AuthFormProps {
  onAuth: (apiKey: string) => Promise<void>;
  loading: boolean;
  error: string | null;
}

export const AuthForm: React.FC<AuthFormProps> = ({ onAuth, loading, error }) => {
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey.trim()) return;

    await onAuth(apiKey.trim());
  };

  return (
    <div className="auth-card w-full max-w-4xl mx-auto">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl floating-animation"></div>
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl floating-animation" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="text-center mb-8 relative z-10">
        <div className="auth-icon mx-auto mb-6">
          <Key className="w-10 h-10 text-white" />
        </div>
        <h2 className="auth-title">
          Connect to Apify
        </h2>
        <p className="auth-subtitle">
          Enter your Apify API key to access your actors and execute them with powerful automation
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 relative z-10 w-full">
        <div className="input-group w-full">
          <label htmlFor="apiKey" className="input-label">
            API Key
          </label>
          <div className="input-wrapper w-full">
            <input
              id="apiKey"
              type={showKey ? 'text' : 'password'}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your Apify API key"
              className="input-field pr-24 w-full"
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowKey(!showKey)}
              className="show-hide-btn"
            >
              {showKey ? 'Hide' : 'Show'}
            </button>
          </div>
          <p className="help-text">
            You can find your API key in your{' '}
            <a
              href="https://console.apify.com/account/integrations"
              target="_blank"
              rel="noopener noreferrer"
              className="help-link"
            >
              Apify Console
            </a>
          </p>
        </div>

        {error && (
          <div className="error-message">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <p className="text-red-700 font-medium">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={!apiKey.trim() || loading}
          className="group relative w-full bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 hover:from-blue-700 hover:via-purple-700 hover:to-blue-800 text-white font-semibold py-4 px-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98] border-0 overflow-hidden"
        >
          {/* Animated background overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

          {/* Button content */}
          <div className="relative flex items-center justify-center space-x-3">
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span className="text-lg font-semibold">Connecting to Apify...</span>
              </>
            ) : (
              <>
                <div className="p-1.5 bg-white/20 rounded-lg group-hover:bg-white/30 transition-colors duration-300">
                  <Key className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-semibold">Connect & Explore</span>
                <div className="w-4 h-4 border-2 border-white border-l-transparent rounded-full animate-spin opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </>
            )}
          </div>
        </button>
      </form>

      {/* Feature highlights */}
      <div className="mt-8 pt-8 border-t border-gray-200/50">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="p-6 rounded-3xl bg-gradient-to-br from-blue-50/50 to-purple-50/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <span className="text-white text-3xl">🚀</span>
            </div>
            <p className="text-base font-semibold text-gray-800">Fast Execution</p>
          </div>
          <div className="p-6 rounded-3xl bg-gradient-to-br from-purple-50/50 to-pink-50/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <span className="text-white text-3xl">🔒</span>
            </div>
            <p className="text-base font-semibold text-gray-800">Secure API</p>
          </div>
          <div className="p-6 rounded-3xl bg-gradient-to-br from-pink-50/50 to-orange-50/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
            <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <span className="text-white text-3xl">⚡</span>
            </div>
            <p className="text-base font-semibold text-gray-800">Real-time Results</p>
          </div>
        </div>
      </div>
    </div>
  );
};
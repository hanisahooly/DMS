import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { LoadingSpinner } from '../Common/LoadingSpinner';

export const MFAForm: React.FC = () => {
  const { verifyMFA, isLoading, error, clearError } = useAuth();
  const [code, setCode] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    await verifyMFA(code);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-16 w-16 bg-primary-600 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-2xl">HS</span>
          </div>
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
            Two-Factor Authentication
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter the 6-digit code from your authenticator app
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}
          
          <div>
            <label htmlFor="code" className="block text-sm font-medium text-gray-700">
              Authentication Code
            </label>
            <input
              id="code"
              name="code"
              type="text"
              required
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-center tracking-widest font-mono focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="000000"
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading || code.length !== 6}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <LoadingSpinner size="sm" className="mr-2" />
              ) : null}
              {isLoading ? 'Verifying...' : 'Verify Code'}
            </button>
          </div>

          <div className="text-center">
            <p className="text-xs text-gray-500">
              Demo code: 123456
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
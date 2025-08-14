'use client';

import React, { useState, useEffect } from 'react';

export default function PrivacyNotice() {
  const [showNotice, setShowNotice] = useState(false);

  useEffect(() => {
    const hasSeenNotice = localStorage.getItem('privacy-notice-seen');
    if (!hasSeenNotice) {
      setShowNotice(true);
    }
  }, []);

  const acceptNotice = () => {
    localStorage.setItem('privacy-notice-seen', 'true');
    setShowNotice(false);
  };

  if (!showNotice) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full p-6">
        <div className="flex items-center mb-4">
          <svg className="w-6 h-6 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Your Privacy is Protected</h3>
        </div>
        
        <div className="space-y-3 text-sm text-gray-600 dark:text-gray-300 mb-6">
          <p>✅ <strong>No account required</strong> - Use immediately</p>
          <p>✅ <strong>No cloud storage</strong> - All data stays on your device</p>
          <p>✅ <strong>No tracking</strong> - We don't collect any personal information</p>
          <p>✅ <strong>Encrypted storage</strong> - Your data is protected locally</p>
          <p>✅ <strong>Auto-save</strong> - Never lose your information</p>
        </div>

        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3 mb-4">
          <p className="text-xs text-yellow-800 dark:text-yellow-200">
            <strong>Important:</strong> Your data is only stored on this device. Clear your browser data will delete all information.
          </p>
        </div>

        <button
          onClick={acceptNotice}
          className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:from-pink-600 hover:to-purple-700 transition-all"
        >
          I Understand - Start Hustling
        </button>
      </div>
    </div>
  );
}
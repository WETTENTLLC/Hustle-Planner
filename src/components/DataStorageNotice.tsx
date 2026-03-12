'use client';

import { useState, useEffect } from 'react';

export default function DataStorageNotice() {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const hasSeenNotice = localStorage.getItem('data-storage-notice-seen');
    if (!hasSeenNotice) {
      setIsVisible(true);
      setIsExpanded(true);
    }
  }, []);

  const handleDismiss = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('data-storage-notice-seen', 'true');
    }
    setIsVisible(false);
  };

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  if (!isVisible && !isExpanded) {
    return (
      <button
        onClick={() => setIsExpanded(true)}
        className="fixed bottom-4 right-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2 z-50"
        aria-label="Show data storage information"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
        <span className="font-semibold">Your Data Info</span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 max-w-md z-50">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 dark:from-white dark:to-gray-50 border-2 border-pink-500 dark:border-pink-600 rounded-lg shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-pink-500 to-purple-500 p-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <h3 className="font-bold text-white text-lg">Important: Your Data Storage</h3>
          </div>
          <button
            onClick={handleToggle}
            className="text-white hover:text-pink-200 transition-colors"
            aria-label="Toggle data storage notice"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        {/* Content */}
        {isExpanded && (
          <div className="p-5 text-gray-200 dark:text-gray-800">
            <div className="space-y-4">
              {/* Notice 1 */}
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400 dark:text-yellow-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-bold text-pink-400 dark:text-pink-600 mb-1">Browser-Specific Storage</h4>
                  <p className="text-sm">
                    Your data is saved <strong>only on this browser/device</strong>. If you switch browsers or devices, you won&apos;t see your data there. This is intentional for maximum privacy.
                  </p>
                </div>
              </div>

              {/* Notice 2 */}
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-400 dark:text-red-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-bold text-pink-400 dark:text-pink-600 mb-1">Don&apos;t Clear Browser Data</h4>
                  <p className="text-sm">
                    If you clear your browser cache or browsing data, <strong>all your information will be permanently lost</strong>. Be careful when using browser cleaning tools!
                  </p>
                </div>
              </div>

              {/* Notice 3 */}
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400 dark:text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M7 9a2 2 0 012-2h6a2 2 0 012 2v6a2 2 0 01-2 2H9a2 2 0 01-2-2V9z" />
                    <path d="M5 3a2 2 0 00-2 2v6a2 2 0 002 2V5h8a2 2 0 00-2-2H5z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-bold text-pink-400 dark:text-pink-600 mb-1">Consider Regular Screenshots</h4>
                  <p className="text-sm">
                    Since there&apos;s no cloud backup, we recommend taking screenshots or photos of your important data regularly. An export/backup feature may be added in the future.
                  </p>
                </div>
              </div>

              {/* Why This Matters */}
              <div className="mt-4 p-3 bg-purple-900/30 dark:bg-purple-100/50 rounded-lg border border-purple-500/30">
                <p className="text-xs text-gray-300 dark:text-gray-700">
                  <strong className="text-purple-400 dark:text-purple-600">Why no cloud storage?</strong> Your privacy and safety come first. No servers, no accounts, no data breaches. Everything stays on your device where it belongs.
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-5 flex space-x-3">
              <button
                onClick={handleDismiss}
                className="flex-1 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold py-2 px-4 rounded-lg hover:shadow-lg transition-all duration-300"
              >
                Got it!
              </button>
              <button
                onClick={handleToggle}
                className="px-4 py-2 border border-gray-600 dark:border-gray-400 text-gray-300 dark:text-gray-700 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
              >
                Minimize
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { isLocalStorageAvailable } from '@/lib/utils';

export default function StorageHealthCheck() {
  const [storageAvailable, setStorageAvailable] = useState(true);
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check storage availability on mount
    const available = isLocalStorageAvailable();
    setStorageAvailable(available);
    
    if (!available) {
      setShowWarning(true);
    }

    // Periodically check storage availability (every 30 seconds)
    const checkInterval = setInterval(() => {
      const currentlyAvailable = isLocalStorageAvailable();
      if (currentlyAvailable !== storageAvailable) {
        setStorageAvailable(currentlyAvailable);
        if (!currentlyAvailable) {
          setShowWarning(true);
        }
      }
    }, 30000);

    return () => clearInterval(checkInterval);
  }, [storageAvailable]);

  if (!showWarning || storageAvailable) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-40 bg-red-500 dark:bg-red-600 text-white rounded-lg shadow-lg p-4 max-w-md">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold mb-1">Storage Issue Detected</h3>
          <p className="text-sm opacity-90">
            Your browser is not allowing data to be saved. This might be because:
          </p>
          <ul className="text-sm opacity-90 mt-2 ml-4 list-disc">
            <li>You&apos;re using Private/Incognito mode</li>
            <li>Storage is disabled in your browser settings</li>
            <li>Your storage limit has been exceeded</li>
          </ul>
          <p className="text-sm opacity-90 mt-2">
            <strong>Important:</strong> Your data will NOT be saved. Please use a normal browsing mode and enable storage.
          </p>
        </div>
        <button
          onClick={() => setShowWarning(false)}
          className="text-white hover:text-gray-200 flex-shrink-0 ml-2"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

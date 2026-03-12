'use client';

import { useState } from 'react';
import { isLocalStorageAvailable } from '@/lib/utils';
import secureStorage from '@/lib/secureStorage';

interface StorageItem {
  key: string;
  size: number;
  value: string;
}

interface SecureStorageItem {
  key: string;
  type: string;
}

interface StorageInfo {
  localStorageAvailable?: boolean;
  totalItems?: number;
  estimatedSize?: number;
  regularItems?: StorageItem[];
  secureItems?: SecureStorageItem[];
  items?: Record<string, string>;
}

export default function StorageDiagnostics() {
  const [showDiagnostics, setShowDiagnostics] = useState(false);
  const [storageInfo, setStorageInfo] = useState<StorageInfo>({});

  const checkStorage = () => {
    if (typeof window === 'undefined') return;

    const info: StorageInfo = {
      localStorageAvailable: isLocalStorageAvailable(),
      totalItems: Object.keys(localStorage).length,
      estimatedSize: new Blob(Object.values(localStorage)).size,
    };

    // Get all items
    const regularItems: StorageItem[] = Object.entries(localStorage)
      .filter(([key]) => !key.startsWith('_') && !key.startsWith('secure_hustle_'))
      .map(([key, value]) => ({
        key,
        size: new Blob([value]).size,
        value: value.length > 100 ? value.substring(0, 100) + '...' : value
      }));

    const secureItems: SecureStorageItem[] = Object.entries(localStorage)
      .filter(([key]) => key.startsWith('secure_hustle_'))
      .map(([key]) => ({
        key: key.replace('secure_hustle_', ''),
        type: 'encrypted'
      }));

    info.regularItems = regularItems;
    info.secureItems = secureItems;

    setStorageInfo(info);
  };

  const clearAllData = () => {
    if (!confirm('Are you sure? This will delete ALL saved data permanently!')) return;
    
    try {
      secureStorage.clear();
      const keysToDelete = Object.keys(localStorage).filter(
        key => !key.startsWith('_')
      );
      keysToDelete.forEach(key => localStorage.removeItem(key));
      alert('All data cleared successfully');
      checkStorage();
    } catch (error) {
      alert('Failed to clear data: ' + (error instanceof Error ? error.message : String(error)));
    }
  };

  const exportData = () => {
    try {
      const backup = JSON.stringify({
        regular: Object.fromEntries(
          Object.entries(localStorage).filter(([key]) => !key.startsWith('_') && !key.startsWith('secure_hustle_'))
        ),
        encrypted: Object.fromEntries(
          Object.entries(localStorage).filter(([key]) => key.startsWith('secure_hustle_'))
        ),
        timestamp: new Date().toISOString()
      }, null, 2);

      const blob = new Blob([backup], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `hustle-planner-backup-${new Date().getTime()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      alert('Data exported successfully');
    } catch (error) {
      alert('Failed to export data: ' + (error instanceof Error ? error.message : String(error)));
    }
  };

  return (
    <div>
      <button
        onClick={() => {
          setShowDiagnostics(!showDiagnostics);
          if (!showDiagnostics) {
            setTimeout(checkStorage, 100);
          }
        }}
        className="fixed bottom-4 right-4 z-30 bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full shadow-lg text-sm"
        title="Storage Diagnostics"
      >
        🔧
      </button>

      {showDiagnostics && (
        <div className="fixed bottom-16 right-4 z-30 bg-gray-900 dark:bg-white rounded-lg shadow-xl p-4 max-w-md max-h-96 overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-white dark:text-gray-800">Storage Diagnostics</h3>
            <button
              onClick={() => setShowDiagnostics(false)}
              className="text-white dark:text-gray-800 hover:bg-gray-800 dark:hover:bg-gray-200 p-1 rounded"
            >
              ✕
            </button>
          </div>

          <div className="text-sm text-white dark:text-gray-800 space-y-2">
            <div>
              <strong>localStorage Available:</strong>{' '}
              <span className={storageInfo.localStorageAvailable ? 'text-green-400' : 'text-red-400'}>
                {String(storageInfo.localStorageAvailable)}
              </span>
            </div>
            <div>
              <strong>Total Items:</strong> {storageInfo.totalItems}
            </div>
            <div>
              <strong>Estimated Size:</strong> {((storageInfo.estimatedSize as number) / 1024).toFixed(2)} KB
            </div>

            {Array.isArray(storageInfo.regularItems) && storageInfo.regularItems.length > 0 && (
              <div className="mt-3 pt-3 border-t border-gray-700 dark:border-gray-300">
                <strong className="block mb-2">Regular Data:</strong>
                <div className="text-xs max-h-32 overflow-y-auto bg-gray-800 dark:bg-gray-200 p-2 rounded">
                  {storageInfo.regularItems.map((item: { key: string; size: number; value: string }) => (
                    <div key={item.key} className="mb-1 break-words">
                      <span className="text-yellow-400 dark:text-yellow-600">{item.key}</span>
                      {' '}({(item.size / 1024).toFixed(2)} KB)
                    </div>
                  ))}
                </div>
              </div>
            )}

            {Array.isArray(storageInfo.secureItems) && storageInfo.secureItems.length > 0 && (
              <div className="mt-3 pt-3 border-t border-gray-700 dark:border-gray-300">
                <strong className="block mb-2">Encrypted Data:</strong>
                <div className="text-xs max-h-32 overflow-y-auto bg-gray-800 dark:bg-gray-200 p-2 rounded">
                  {storageInfo.secureItems.map((item: { key: string; type: string }) => (
                    <div key={item.key} className="text-green-400 dark:text-green-600">
                      ✓ {item.key}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-4 pt-4 border-t border-gray-700 dark:border-gray-300 space-y-2">
              <button
                onClick={checkStorage}
                className="w-full px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded"
              >
                Refresh
              </button>
              <button
                onClick={exportData}
                className="w-full px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded"
              >
                Export Backup
              </button>
              <button
                onClick={clearAllData}
                className="w-full px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded"
              >
                Clear All Data
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

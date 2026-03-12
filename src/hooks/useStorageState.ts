import { useState, useEffect, useRef } from 'react';
import { getLocalStorage, setLocalStorage } from '@/lib/utils';

interface UseStorageStateOptions {
  key: string;
  onSaveError?: (error: Error) => void;
  onSaveSuccess?: () => void;
  debounceMs?: number;
}

/**
 * Custom hook for managing state that automatically persists to localStorage
 * @param initialValue - The initial value if nothing is saved
 * @param options - Configuration options
 * @returns [value, setValue] - Same as useState
 */
export function useStorageState<T>(
  initialValue: T,
  options: UseStorageStateOptions
): [T, React.Dispatch<React.SetStateAction<T>>] {
  const { key, onSaveError, onSaveSuccess, debounceMs = 500 } = options;
  const [value, setValue] = useState<T>(() => {
    if (typeof window === 'undefined') return initialValue;
    return getLocalStorage<T>(key, initialValue);
  });

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-save to localStorage with debouncing
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout for saving
    timeoutRef.current = setTimeout(() => {
      try {
        const success = setLocalStorage(key, value);
        if (success && onSaveSuccess) {
          onSaveSuccess();
        }
        if (!success && onSaveError) {
          onSaveError(new Error('Failed to save to localStorage'));
        }
      } catch (error) {
        if (onSaveError) {
          onSaveError(error instanceof Error ? error : new Error('Unknown error'));
        }
      }
    }, debounceMs);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [value, key, debounceMs, onSaveError, onSaveSuccess]);

  return [value, setValue];
}

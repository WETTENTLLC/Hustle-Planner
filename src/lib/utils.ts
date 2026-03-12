// Format time string from 24-hour format to 12-hour format with AM/PM
export function formatTime(time: string): string {
  if (!time) return '';
  
  const [hours, minutes] = time.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const formattedHours = hours % 12 || 12;
  
  return `${formattedHours}:${minutes.toString().padStart(2, '0')} ${period}`;
}

// Format date consistently across the application
export function formatDate(date: Date | string): string {
  if (!date) return '';
  
  // Ensure we're working with a Date object
  const dateObj = date instanceof Date ? date : new Date(date);
  
  // Format as YYYY-MM-DD for consistency
  return dateObj.toISOString().split('T')[0];
}

// Format date for display in a user-friendly format
export function formatDateForDisplay(date: Date | string): string {
  if (!date) return '';
  
  // Ensure we're working with a Date object
  const dateObj = date instanceof Date ? date : new Date(date);
  
  // Check if it's today or yesterday
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  const dateToCompare = new Date(dateObj);
  dateToCompare.setHours(0, 0, 0, 0);
  
  if (dateToCompare.getTime() === today.getTime()) {
    return 'Today';
  } else if (dateToCompare.getTime() === yesterday.getTime()) {
    return 'Yesterday';
  } else {
    return dateObj.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  }
}

// Generate a random ID for new items
export function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

// Handle localStorage with type safety and error handling
export function getLocalStorage<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  
  try {
    // Check if localStorage is available
    if (!isLocalStorageAvailable()) {
      console.warn(`localStorage is not available. Using default value for key: ${key}`);
      return defaultValue;
    }
    
    const stored = localStorage.getItem(key);
    if (!stored) return defaultValue;
    
    return JSON.parse(stored) as T;
  } catch (error) {
    console.error(`Failed to retrieve data from localStorage (${key}):`, error);
    // Return default value on any error
    return defaultValue;
  }
}

export function setLocalStorage<T>(key: string, value: T): boolean {
  if (typeof window === 'undefined') return false;
  
  try {
    // Check if localStorage is available
    if (!isLocalStorageAvailable()) {
      console.error('localStorage is not available. Data will not persist.');
      showStorageNotification('error', 'Storage unavailable - your changes may not be saved');
      return false;
    }
    
    const serialized = JSON.stringify(value);
    localStorage.setItem(key, serialized);
    return true;
  } catch (error) {
    // Handle quota exceeded or other errors
    if (error instanceof Error) {
      if (error.name === 'QuotaExceededError') {
        console.error('localStorage quota exceeded');
        showStorageNotification('error', 'Storage full - please delete some old data');
      } else {
        console.error(`Failed to save data to localStorage (${key}):`, error);
        showStorageNotification('error', 'Failed to save data - please try again');
      }
    }
    return false;
  }
}

// Check if localStorage is available and working
export function isLocalStorageAvailable(): boolean {
  try {
    const testKey = '__localStorage_test__';
    localStorage.setItem(testKey, 'test');
    localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

// Show notification to user about storage issues
function showStorageNotification(type: 'error' | 'warning', message: string): void {
  // Create a temporary notification div if it doesn't exist
  if (typeof window === 'undefined') return;
  
  const notificationId = `storage-notification-${Date.now()}`;
  const notification = document.createElement('div');
  notification.id = notificationId;
  notification.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg text-white animate-pulse ${
    type === 'error' ? 'bg-red-500' : 'bg-yellow-500'
  }`;
  notification.textContent = message;
  
  document.body.appendChild(notification);
  
  // Remove notification after 5 seconds
  setTimeout(() => {
    const el = document.getElementById(notificationId);
    if (el) el.remove();
  }, 5000);
}

// Check if two dates are the same day
export function isSameDay(date1: Date | string, date2: Date | string): boolean {
  const d1 = typeof date1 === 'string' ? new Date(date1) : date1;
  const d2 = typeof date2 === 'string' ? new Date(date2) : date2;
  
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

// Get a readable relative time (e.g., "3 days ago", "in 2 hours")
export function getRelativeTimeString(date: Date | string): string {
  const now = new Date();
  const targetDate = typeof date === 'string' ? new Date(date) : date;
  
  const diffInSeconds = Math.floor((targetDate.getTime() - now.getTime()) / 1000);
  const absSeconds = Math.abs(diffInSeconds);
  
  // Future or past indicator
  const suffix = diffInSeconds < 0 ? 'ago' : 'from now';
  
  // Time units in seconds
  const minute = 60;
  const hour = minute * 60;
  const day = hour * 24;
  const week = day * 7;
  const month = day * 30;
  const year = day * 365;
  
  if (absSeconds < minute) {
    return diffInSeconds < 0 ? 'just now' : 'in a moment';
  } else if (absSeconds < hour) {
    const minutes = Math.floor(absSeconds / minute);
    return `${minutes} minute${minutes > 1 ? 's' : ''} ${suffix}`;
  } else if (absSeconds < day) {
    const hours = Math.floor(absSeconds / hour);
    return `${hours} hour${hours > 1 ? 's' : ''} ${suffix}`;
  } else if (absSeconds < week) {
    const days = Math.floor(absSeconds / day);
    return `${days} day${days > 1 ? 's' : ''} ${suffix}`;
  } else if (absSeconds < month) {
    const weeks = Math.floor(absSeconds / week);
    return `${weeks} week${weeks > 1 ? 's' : ''} ${suffix}`;
  } else if (absSeconds < year) {
    const months = Math.floor(absSeconds / month);
    return `${months} month${months > 1 ? 's' : ''} ${suffix}`;
  } else {
    const years = Math.floor(absSeconds / year);
    return `${years} year${years > 1 ? 's' : ''} ${suffix}`;
  }
}
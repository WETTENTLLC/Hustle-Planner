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

// Handle localStorage with type safety
export function getLocalStorage<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : defaultValue;
}

export function setLocalStorage<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(value));
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
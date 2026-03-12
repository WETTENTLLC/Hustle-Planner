// Secure local storage utility with encryption
class SecureStorage {
  private static instance: SecureStorage;
  private readonly storagePrefix = 'secure_hustle_';

  private constructor() {}

  static getInstance(): SecureStorage {
    if (!SecureStorage.instance) {
      SecureStorage.instance = new SecureStorage();
    }
    return SecureStorage.instance;
  }

  // Check if localStorage is available
  private isAvailable(): boolean {
    try {
      const testKey = '__secure_storage_test__';
      localStorage.setItem(testKey, 'test');
      localStorage.removeItem(testKey);
      return true;
    } catch {
      return false;
    }
  }

  // Simple XOR encryption for local storage (client-side only)
  private encrypt(data: string): string {
    const key = this.getOrCreateKey();
    let encrypted = '';
    for (let i = 0; i < data.length; i++) {
      encrypted += String.fromCharCode(data.charCodeAt(i) ^ key.charCodeAt(i % key.length));
    }
    return btoa(encrypted);
  }

  private decrypt(encryptedData: string): string {
    try {
      const key = this.getOrCreateKey();
      const encrypted = atob(encryptedData);
      let decrypted = '';
      for (let i = 0; i < encrypted.length; i++) {
        decrypted += String.fromCharCode(encrypted.charCodeAt(i) ^ key.charCodeAt(i % key.length));
      }
      return decrypted;
    } catch {
      return '';
    }
  }

  private getOrCreateKey(): string {
    try {
      let key = localStorage.getItem('_sk');
      if (!key) {
        key = Math.random().toString(36).substring(2) + Date.now().toString(36);
        localStorage.setItem('_sk', key);
      }
      return key;
    } catch {
      // If localStorage is unavailable, return a fallback temporary key
      console.error('Cannot create storage key - localStorage may be unavailable');
      return Math.random().toString(36).substring(2);
    }
  }

  setItem(key: string, value: unknown): boolean {
    try {
      if (!this.isAvailable()) {
        console.error('localStorage is not available. Data will not persist.');
        this.showNotification('error', 'Storage unavailable - your changes may not be saved');
        return false;
      }

      const serialized = JSON.stringify(value);
      const encrypted = this.encrypt(serialized);
      localStorage.setItem(this.storagePrefix + key, encrypted);
      return true;
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'QuotaExceededError') {
          console.error('localStorage quota exceeded');
          this.showNotification('error', 'Storage full - please delete some old data');
        } else {
          console.error('Failed to save data securely:', error);
          this.showNotification('error', 'Failed to save data - please try again');
        }
      }
      return false;
    }
  }

  getItem<T>(key: string): T | null {
    try {
      if (!this.isAvailable()) {
        console.warn('localStorage is not available');
        return null;
      }

      const encrypted = localStorage.getItem(this.storagePrefix + key);
      if (!encrypted) return null;
      
      const decrypted = this.decrypt(encrypted);
      if (!decrypted) return null;
      
      return JSON.parse(decrypted) as T;
    } catch (error) {
      console.error('Failed to retrieve data securely:', error);
      return null;
    }
  }

  removeItem(key: string): boolean {
    try {
      if (!this.isAvailable()) {
        console.warn('localStorage is not available');
        return false;
      }
      localStorage.removeItem(this.storagePrefix + key);
      return true;
    } catch (error) {
      console.error('Failed to remove data:', error);
      return false;
    }
  }

  clear(): boolean {
    try {
      if (!this.isAvailable()) {
        console.warn('localStorage is not available');
        return false;
      }

      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith(this.storagePrefix)) {
          localStorage.removeItem(key);
        }
      });
      return true;
    } catch (error) {
      console.error('Failed to clear storage:', error);
      return false;
    }
  }

  // Show notification to user about storage issues
  private showNotification(type: 'error' | 'warning', message: string): void {
    if (typeof window === 'undefined') return;
    
    try {
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
    } catch (error) {
      console.error('Failed to show notification:', error);
    }
  }
}

export default SecureStorage.getInstance();
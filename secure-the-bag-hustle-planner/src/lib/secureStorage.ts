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
    let key = localStorage.getItem('_sk');
    if (!key) {
      key = Math.random().toString(36).substring(2) + Date.now().toString(36);
      localStorage.setItem('_sk', key);
    }
    return key;
  }

  setItem(key: string, value: unknown): void {
    try {
      const serialized = JSON.stringify(value);
      const encrypted = this.encrypt(serialized);
      localStorage.setItem(this.storagePrefix + key, encrypted);
    } catch {
      console.error('Failed to save data securely');
    }
  }

  getItem<T>(key: string): T | null {
    try {
      const encrypted = localStorage.getItem(this.storagePrefix + key);
      if (!encrypted) return null;
      
      const decrypted = this.decrypt(encrypted);
      if (!decrypted) return null;
      
      return JSON.parse(decrypted);
    } catch {
      console.error('Failed to retrieve data securely');
      return null;
    }
  }

  removeItem(key: string): void {
    localStorage.removeItem(this.storagePrefix + key);
  }

  clear(): void {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith(this.storagePrefix)) {
        localStorage.removeItem(key);
      }
    });
  }
}

export default SecureStorage.getInstance();
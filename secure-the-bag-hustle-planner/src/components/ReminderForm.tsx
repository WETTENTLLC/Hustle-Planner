'use client';

import { useState, useEffect } from 'react';
import { generateId, getLocalStorage, setLocalStorage } from '@/lib/utils';

interface Reminder {
  id: string;
  time: string;
  date: string;
  message: string;
  enabled: boolean;
  repeats: 'none' | 'daily' | 'weekly';
}

export default function ReminderForm() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [newReminder, setNewReminder] = useState<Partial<Reminder>>({
    time: '',
    date: new Date().toISOString().split('T')[0], // Today's date
    message: '',
    repeats: 'none'
  });
  const [notificationPermission, setNotificationPermission] = useState<string>('default');
  const [showPermissionPrompt, setShowPermissionPrompt] = useState<boolean>(false);
  const [notificationSetupInfo, setNotificationSetupInfo] = useState<boolean>(false);
  
  // Load reminders from localStorage and check notification permission on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const savedReminders = getLocalStorage<Reminder[]>('hustle-reminders', []);
    setReminders(savedReminders);
    
    // Check notification permission
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setNotificationPermission(Notification.permission);
      
      // Show permission prompt if not granted or denied yet
      if (Notification.permission === 'default') {
        setShowPermissionPrompt(true);
      }
    }
    
    // Set up reminder check interval
    const checkInterval = setInterval(() => {
      checkReminders();
    }, 60000); // Check every minute
    
    return () => clearInterval(checkInterval);
  }, []);
  
  // Save reminders to localStorage when updated
  useEffect(() => {
    if (typeof window === 'undefined') return;
    setLocalStorage('hustle-reminders', reminders);
    
    // Schedule active reminders
    reminders
      .filter(reminder => reminder.enabled)
      .forEach(reminder => {
        const [year, month, day] = reminder.date.split('-').map(Number);
        const [hours, minutes] = reminder.time.split(':').map(Number);
        
        // Create date in local timezone
        const reminderDate = new Date();
        reminderDate.setFullYear(year, month - 1, day);
        reminderDate.setHours(hours, minutes, 0, 0);
        
        // Only schedule future reminders
        if (reminderDate > new Date()) {
          scheduleNotification(
            'Hustle Planner Reminder', 
            reminder.message, 
            reminderDate
          );
        }
      });
  }, [reminders]);
  
  // Request notification permissions
  const handleRequestPermission = async () => {
    const granted = await requestNotificationPermission();
    setNotificationPermission(granted ? 'granted' : 'denied');
    setShowPermissionPrompt(false);
    
    if (granted) {
      // Show a test notification
      const testNotification = new Notification('Notifications Enabled', {
        body: 'You will now receive hustle reminders even when the app is closed.',
        icon: '/favicon.ico'
      });
      
      // Close the notification after 5 seconds
      const timeoutId = setTimeout(() => testNotification.close(), 5000);
      
      // Clean up timeout if component unmounts
      return () => clearTimeout(timeoutId);
    }
  };
  
  // Add a new reminder
  const handleAddReminder = () => {
    if (!newReminder.time || !newReminder.message) return;
    
    const reminder: Reminder = {
      id: generateId(),
      time: newReminder.time || '',
      date: newReminder.date || new Date().toISOString().split('T')[0],
      message: newReminder.message || '',
      enabled: true,
      repeats: newReminder.repeats || 'none'
    };
    
    setReminders(prev => [...prev, reminder]);
    setNewReminder({
      time: '',
      date: new Date().toISOString().split('T')[0],
      message: '',
      repeats: 'none'
    });
    
    // Schedule the notification
    if (notificationPermission === 'granted') {
      const [year, month, day] = reminder.date.split('-').map(Number);
      const [hours, minutes] = reminder.time.split(':').map(Number);
      
      // Create date in local timezone
      const reminderDate = new Date();
      reminderDate.setFullYear(year, month - 1, day);
      reminderDate.setHours(hours, minutes, 0, 0);
      
      if (reminderDate > new Date()) {
        scheduleNotification(
          'Hustle Planner Reminder', 
          reminder.message, 
          reminderDate
        );
      }
    }
  };
  
  // Delete a reminder
  const handleDeleteReminder = (id: string) => {
    setReminders(prev => prev.filter(reminder => reminder.id !== id));
  };
  
  // Toggle a reminder on/off
  const handleToggleReminder = (id: string) => {
    setReminders(prev => 
      prev.map(reminder => 
        reminder.id === id 
          ? { ...reminder, enabled: !reminder.enabled } 
          : reminder
      )
    );
  };
  
  // Update an existing reminder
  const handleUpdateReminder = (id: string, updates: Partial<Reminder>) => {
    setReminders(prev => 
      prev.map(reminder => 
        reminder.id === id 
          ? { ...reminder, ...updates } 
          : reminder
      )
    );
  };
  
  // Check if any reminders need to be triggered
  const checkReminders = () => {
    if (notificationPermission !== 'granted' || typeof window === 'undefined') return;
    
    const now = new Date();
    const currentDate = now.toISOString().split('T')[0];
    const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    
    reminders.forEach(reminder => {
      if (reminder.enabled) {
        // Check if this reminder should fire now
        if (reminder.time === currentTime) {
          let shouldFire = false;
          
          // Handle different repeat types
          switch(reminder.repeats) {
            case 'none':
              // For one-time reminders, only fire if the date matches
              shouldFire = reminder.date === currentDate;
              break;
            
            case 'daily':
              // For daily reminders, fire every day at the specified time
              shouldFire = true;
              break;
            
            case 'weekly':
              // For weekly reminders, fire on the same day of week
              const reminderDate = new Date();
              const [year, month, day] = reminder.date.split('-').map(Number);
              reminderDate.setFullYear(year, month - 1, day);
              shouldFire = reminderDate.getDay() === now.getDay();
              break;
          }
          
          if (shouldFire) {
            // Send the notification
            new Notification('Hustle Planner Reminder', {
              body: reminder.message,
              icon: '/favicon.ico'
            });
            
            // If reminder is not repeating, disable it after triggering
            if (reminder.repeats === 'none') {
              handleUpdateReminder(reminder.id, { enabled: false });
            }
          }
        }
      }
    });
  };
  
  return (
    <div className="space-y-6">
      {/* Notification Setup Information Button */}
      <div className="flex justify-end">
        <button 
          onClick={() => setNotificationSetupInfo(!notificationSetupInfo)}
          className="text-sm text-gray-400 hover:text-white dark:hover:text-gray-800 flex items-center"
          aria-label="Show notification setup information"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          How notifications work
        </button>
      </div>
      
      {notificationSetupInfo && (
        <div className="bg-gray-800/80 dark:bg-white/90 border border-gray-700 dark:border-gray-300 rounded-lg p-4 mb-4 text-sm">
          <h4 className="font-bold mb-2 text-pink-400 dark:text-pink-600">About Browser Notifications</h4>
          <ul className="list-disc pl-5 space-y-2 text-gray-300 dark:text-gray-700">
            <li>Notifications will pop up even when this site is not your active tab</li>
            <li>For reminders to work when the browser is closed, enable <strong>Background Sync</strong> in your browser settings</li>
            <li>On mobile devices, add this site to your home screen for better notification support</li>
            <li>If notifications stop working, come back to this page and refresh</li>
          </ul>
          <button 
            onClick={() => setNotificationSetupInfo(false)}
            className="mt-3 text-pink-400 dark:text-pink-600 hover:underline"
          >
            Got it
          </button>
        </div>
      )}
      
      {/* Notification Permission Warning */}
      {showPermissionPrompt && (
        <div className="bg-yellow-900/50 dark:bg-yellow-100 border border-yellow-600 dark:border-yellow-300 rounded-lg p-4 mb-4">
          <p className="text-yellow-200 dark:text-yellow-800 mb-2">
            ⚠️ Enable notifications to get hustle reminders, even when this tab isn&#39;t focused.
          </p>
          <button 
            onClick={handleRequestPermission}
            className="bg-yellow-600 hover:bg-yellow-500 dark:bg-yellow-600 dark:hover:bg-yellow-700 text-white px-4 py-1 rounded-md text-sm"
          >
            Enable Notifications
          </button>
        </div>
      )}
      
      {/* Add New Reminder */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Set A New Reminder</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-300 dark:text-gray-700 mb-1">Date</label>
            <input
              type="date"
              value={newReminder.date}
              onChange={(e) => setNewReminder(prev => ({ ...prev, date: e.target.value }))}
              min={new Date().toISOString().split('T')[0]}
              className="w-full bg-gray-800 dark:bg-white border border-gray-600 dark:border-gray-300 rounded px-3 py-2 text-white dark:text-gray-800"
              aria-label="Reminder date"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 dark:text-gray-700 mb-1">Time</label>
            <input
              type="time"
              value={newReminder.time}
              onChange={(e) => setNewReminder(prev => ({ ...prev, time: e.target.value }))}
              className="w-full bg-gray-800 dark:bg-white border border-gray-600 dark:border-gray-300 rounded px-3 py-2 text-white dark:text-gray-800"
              aria-label="Reminder time"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-300 dark:text-gray-700 mb-1">Message</label>
          <input
            type="text"
            value={newReminder.message}
            onChange={(e) => setNewReminder(prev => ({ ...prev, message: e.target.value }))}
            className="w-full bg-gray-800 dark:bg-white border border-gray-600 dark:border-gray-300 rounded px-3 py-2 text-white dark:text-gray-800"
            placeholder="Reminder message (e.g. 'Leave for the club!')"
            aria-label="Reminder message"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-300 dark:text-gray-700 mb-1">Repeat</label>
          <div className="flex flex-wrap gap-2">
            <label 
              className={`px-3 py-1.5 rounded border cursor-pointer transition ${
                newReminder.repeats === 'none' 
                  ? 'bg-pink-500 border-pink-500 text-white dark:bg-pink-600 dark:border-pink-600' 
                  : 'border-gray-600 text-gray-300 dark:border-gray-400 dark:text-gray-700'
              }`}
            >
              <input 
                type="radio" 
                name="repeat" 
                value="none" 
                checked={newReminder.repeats === 'none'} 
                onChange={() => setNewReminder(prev => ({ ...prev, repeats: 'none' }))} 
                className="sr-only"
              />
              Once
            </label>
            <label 
              className={`px-3 py-1.5 rounded border cursor-pointer transition ${
                newReminder.repeats === 'daily' 
                  ? 'bg-pink-500 border-pink-500 text-white dark:bg-pink-600 dark:border-pink-600' 
                  : 'border-gray-600 text-gray-300 dark:border-gray-400 dark:text-gray-700'
              }`}
            >
              <input 
                type="radio" 
                name="repeat" 
                value="daily" 
                checked={newReminder.repeats === 'daily'} 
                onChange={() => setNewReminder(prev => ({ ...prev, repeats: 'daily' }))} 
                className="sr-only"
              />
              Daily
            </label>
            <label 
              className={`px-3 py-1.5 rounded border cursor-pointer transition ${
                newReminder.repeats === 'weekly' 
                  ? 'bg-pink-500 border-pink-500 text-white dark:bg-pink-600 dark:border-pink-600' 
                  : 'border-gray-600 text-gray-300 dark:border-gray-400 dark:text-gray-700'
              }`}
            >
              <input 
                type="radio" 
                name="repeat" 
                value="weekly" 
                checked={newReminder.repeats === 'weekly'} 
                onChange={() => setNewReminder(prev => ({ ...prev, repeats: 'weekly' }))} 
                className="sr-only"
              />
              Weekly
            </label>
          </div>
        </div>
        
        <button
          onClick={handleAddReminder}
          disabled={!newReminder.time || !newReminder.message}
          className={`w-full py-3 rounded-lg font-medium
            ${(!newReminder.time || !newReminder.message)
              ? 'bg-gray-700 dark:bg-gray-300 text-gray-400 dark:text-gray-500 cursor-not-allowed' 
              : 'bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:from-pink-600 hover:to-purple-700'}
            transition duration-200`}
          aria-label="Set reminder"
        >
          ✅ Set Reminder
        </button>
      </div>
      
      {/* Reminder List */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Your Reminders</h3>
        
        {reminders.length === 0 ? (
          <p className="text-gray-400 dark:text-gray-500 text-center py-4">No reminders set yet</p>
        ) : (
          <div className="space-y-2">
            {reminders.map(reminder => (
              <div 
                key={reminder.id}
                className={`flex items-center justify-between p-3 rounded-lg border
                  ${reminder.enabled 
                    ? 'bg-gray-800/60 border-pink-400/30 dark:bg-white/60 dark:border-pink-400/30' 
                    : 'bg-gray-900/40 border-gray-700 opacity-60 dark:bg-gray-100/40 dark:border-gray-300'}`}
              >
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={reminder.enabled}
                    onChange={() => handleToggleReminder(reminder.id)}
                    className="form-checkbox h-5 w-5 text-pink-500 rounded mr-3"
                    aria-label={`Toggle ${reminder.message} reminder`}
                  />
                  <div>
                    <p className={reminder.enabled ? 'text-white dark:text-gray-800' : 'text-gray-400 dark:text-gray-500'}>
                      {reminder.message}
                    </p>
                    <div className="text-sm text-gray-400 dark:text-gray-500 flex items-center">
                      <span>{reminder.date}</span>
                      <span className="mx-2">•</span>
                      <span>{reminder.time}</span>
                      {reminder.repeats !== 'none' && (
                        <>
                          <span className="mx-2">•</span>
                          <span className="bg-pink-500/20 text-pink-300 dark:bg-pink-100 dark:text-pink-800 px-2 py-0.5 rounded-full text-xs">
                            Repeats {reminder.repeats}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteReminder(reminder.id)}
                  className="text-gray-400 dark:text-gray-500 hover:text-red-400 dark:hover:text-red-500 p-1"
                  aria-label={`Delete ${reminder.message} reminder`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function scheduleNotification(arg0: string, message: string, reminderDate: Date) {
  throw new Error('Function not implemented.');
}

'use client';

import { useState, useEffect } from 'react';
import { generateId, getLocalStorage, setLocalStorage, formatDate } from '@/lib/utils';

interface Habit {
  id: string;
  name: string;
  category: string;
  timesPerWeek: number;
  color: string;
  isArchived: boolean;
}

interface HabitLog {
  habitId: string;
  date: string;
  completed: boolean;
  notes?: string;
}

// Predefined habit categories and colors
const CATEGORIES = [
  { name: 'Self-care', color: '#f472b6' }, // pink-400
  { name: 'Career', color: '#a78bfa' },    // purple-400
  { name: 'Skill-building', color: '#60a5fa' },  // blue-400
  { name: 'Money', color: '#4ade80' },     // green-400
  { name: 'Health', color: '#fb923c' },    // orange-400
  { name: 'Custom', color: '#94a3b8' }     // slate-400
];

export default function HabitTracker() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [habitLogs, setHabitLogs] = useState<HabitLog[]>([]);
  const [newHabit, setNewHabit] = useState<Partial<Habit>>({
    name: '',
    category: 'Self-care',
    timesPerWeek: 7,
    color: CATEGORIES[0].color,
    isArchived: false
  });
  const [showArchived, setShowArchived] = useState(false);
  const [selectedView, setSelectedView] = useState<'weekly' | 'streak'>('weekly');
  const [showAddForm, setShowAddForm] = useState(false);
  const [dateRange] = useState<Date[]>(getDatesForLastDays(14));

  // Load data from localStorage on component mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const savedHabits = getLocalStorage<Habit[]>('hustle-habits', []);
    const savedLogs = getLocalStorage<HabitLog[]>('hustle-habit-logs', []);
    
    setHabits(savedHabits);
    setHabitLogs(savedLogs);
  }, []);
  
  // Save to localStorage whenever data changes
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    setLocalStorage('hustle-habits', habits);
  }, [habits]);
  
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    setLocalStorage('hustle-habit-logs', habitLogs);
  }, [habitLogs]);
  
  // Functions to handle form and data
  function getDatesForLastDays(days: number): Date[] {
    const dates: Date[] = [];
    const today = new Date();
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      dates.push(date);
    }
    
    return dates;
  }
  
  const handleAddHabit = () => {
    if (!newHabit.name) return;
    
    const habit: Habit = {
      id: generateId(),
      name: newHabit.name!,
      category: newHabit.category || 'Self-care',
      timesPerWeek: newHabit.timesPerWeek || 7,
      color: newHabit.color || CATEGORIES[0].color,
      isArchived: false
    };
    
    setHabits(prev => [...prev, habit]);
    setNewHabit({
      name: '',
      category: 'Self-care',
      timesPerWeek: 7,
      color: CATEGORIES[0].color,
      isArchived: false
    });
    setShowAddForm(false);
  };
  
  const handleArchiveHabit = (habitId: string) => {
    setHabits(prev => 
      prev.map(habit => 
        habit.id === habitId ? { ...habit, isArchived: !habit.isArchived } : habit
      )
    );
  };
  
  const handleDeleteHabit = (habitId: string) => {
    const confirmed = window.confirm('Are you sure you want to delete this habit and all associated logs?');
    if (!confirmed) return;
    
    setHabits(prev => prev.filter(habit => habit.id !== habitId));
    setHabitLogs(prev => prev.filter(log => log.habitId !== habitId));
  };
  
  const handleToggleHabitForDate = (habitId: string, date: string) => {
    // Ensure consistent date string format regardless of timezone
    const normalizedDateString = new Date(date).toISOString().split('T')[0];
    
    const existingLog = habitLogs.find(log => 
      log.habitId === habitId && log.date === normalizedDateString
    );
    
    if (existingLog) {
      // Toggle the completion status
      setHabitLogs(prev => 
        prev.map(log => 
          log.habitId === habitId && log.date === normalizedDateString
            ? { ...log, completed: !log.completed }
            : log
        )
      );
    } else {
      // Create a new log entry
      const newLog: HabitLog = {
        habitId,
        date: normalizedDateString,
        completed: true
      };
      
      setHabitLogs(prev => [...prev, newLog]);
    }
  };
  
  // Helper function to check if a habit is completed for a specific date
  const isHabitCompletedForDate = (habitId: string, date: string): boolean => {
    // Ensure consistent date string format regardless of timezone
    const normalizedDateString = new Date(date).toISOString().split('T')[0];
    
    const log = habitLogs.find(log => 
      log.habitId === habitId && log.date === normalizedDateString && log.completed
    );
    
    return !!log;
  };
  
  // Calculate current streak for a habit
  const getHabitStreak = (habitId: string): number => {
    const habit = habits.find(h => h.id === habitId);
    if (!habit) return 0;
    
    let streak = 0;
    const currentDate = new Date();
    let weeklyCompletions = 0;
    const weekStart = new Date(currentDate);
    weekStart.setDate(currentDate.getDate() - currentDate.getDay()); // Set to the beginning of current week (Sunday)
    let checkedDays = 0;
    
    // First check if we already have a streak going in the current week
    for (let i = 0; i < 7; i++) {
      const checkDate = new Date(currentDate);
      checkDate.setDate(currentDate.getDate() - i);
      
      if (checkDate >= weekStart) {
        const dateString = formatDate(checkDate);
        if (isHabitCompletedForDate(habitId, dateString)) {
          weeklyCompletions++;
        }
        checkedDays++;
      }
    }
    
    // If we've met the weekly goal or on track to meet it proportionally
    if (weeklyCompletions >= habit.timesPerWeek || 
        (checkedDays < 7 && weeklyCompletions >= Math.ceil((habit.timesPerWeek * checkedDays) / 7))) {
      streak = 1; // Count the current week
      
      // Now check previous weeks
      const prevWeekEnd = new Date(weekStart);
      prevWeekEnd.setDate(prevWeekEnd.getDate() - 1); // Last day of previous week
      
      while (true) {
        const prevWeekStart = new Date(prevWeekEnd);
        prevWeekStart.setDate(prevWeekEnd.getDate() - 6); // First day of this previous week
        
        let prevWeekCompletions = 0;
        
        // Check completions for each day of the previous week
        for (let day = new Date(prevWeekStart); day <= prevWeekEnd; day.setDate(day.getDate() + 1)) {
          const dateString = formatDate(day);
          if (isHabitCompletedForDate(habitId, dateString)) {
            prevWeekCompletions++;
          }
        }
        
        // If the previous week met the goal, increase streak
        if (prevWeekCompletions >= habit.timesPerWeek) {
          streak++;
          
          // Move to the week before
          prevWeekEnd.setDate(prevWeekStart.getDate() - 1);
        } else {
          break; // Stop if a week didn't meet the goal
        }
      }
    }
    
    return streak;
  };
  
  // Calculate completion percentage for a habit
  const getCompletionPercentage = (habitId: string): number => {
    const targetDays = 7; // Last week
    let completedCount = 0;
    
    for (let i = 0; i < targetDays; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      // Use our consistent date formatting utility
      const dateString = formatDate(date);
      
      if (isHabitCompletedForDate(habitId, dateString)) {
        completedCount++;
      }
    }
    
    const habit = habits.find(h => h.id === habitId);
    const targetCompletions = habit?.timesPerWeek || 7;
    const percentage = Math.min(100, Math.round((completedCount / targetCompletions) * 100));
    
    return percentage;
  };
  
  // Filter habits based on archive status
  const filteredHabits = habits.filter(habit => 
    showArchived ? habit.isArchived : !habit.isArchived
  );
  
  
  // Set category color when category changes
  const handleCategoryChange = (category: string) => {
    const selectedCategory = CATEGORIES.find(c => c.name === category);
    setNewHabit(prev => ({ 
      ...prev, 
      category,
      color: selectedCategory ? selectedCategory.color : prev.color 
    }));
  };
  
  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-wrap gap-3 justify-between items-center">
        <div className="flex space-x-2">
          <button
            onClick={() => setSelectedView('weekly')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
              ${selectedView === 'weekly' 
                ? 'bg-pink-500 text-white' 
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700 dark:bg-gray-200 dark:text-gray-700 dark:hover:bg-gray-300'}`}
          >
            Weekly View
          </button>
          <button
            onClick={() => setSelectedView('streak')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
              ${selectedView === 'streak' 
                ? 'bg-pink-500 text-white' 
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700 dark:bg-gray-200 dark:text-gray-700 dark:hover:bg-gray-300'}`}
          >
            Streak View
          </button>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setShowArchived(!showArchived)}
            className="px-3 py-1.5 bg-gray-800 text-gray-300 hover:bg-gray-700 rounded-lg text-sm font-medium transition-colors dark:bg-gray-200 dark:text-gray-700 dark:hover:bg-gray-300"
          >
            {showArchived ? 'Show Active' : 'Show Archived'}
          </button>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-3 py-1.5 bg-pink-500 hover:bg-pink-600 dark:bg-pink-600 dark:hover:bg-pink-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            {showAddForm ? 'Cancel' : 'Add Habit'}
          </button>
        </div>
      </div>
      
      {/* Add Habit Form */}
      {showAddForm && (
        <div className="bg-gray-800/80 dark:bg-gray-100 border border-gray-700 dark:border-gray-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-3 text-white dark:text-gray-800">Add New Habit</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 dark:text-gray-700 mb-1">
                Habit Name
              </label>
              <input
                type="text"
                value={newHabit.name}
                onChange={(e) => setNewHabit({...newHabit, name: e.target.value})}
                placeholder="e.g., Morning Stretching, Content Creation"
                className="w-full bg-gray-700 dark:bg-white border border-gray-600 dark:border-gray-300 rounded px-3 py-2 text-white dark:text-gray-800"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 dark:text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={newHabit.category}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className="w-full bg-gray-700 dark:bg-white border border-gray-600 dark:border-gray-300 rounded px-3 py-2 text-white dark:text-gray-800"
                >
                  {CATEGORIES.map(category => (
                    <option key={category.name} value={category.name}>{category.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 dark:text-gray-700 mb-1">
                  Goal (times per week)
                </label>
                <select
                  value={newHabit.timesPerWeek}
                  onChange={(e) => setNewHabit({...newHabit, timesPerWeek: Number(e.target.value)})}
                  className="w-full bg-gray-700 dark:bg-white border border-gray-600 dark:border-gray-300 rounded px-3 py-2 text-white dark:text-gray-800"
                >
                  {[1, 2, 3, 4, 5, 6, 7].map(num => (
                    <option key={num} value={num}>{num} {num === 1 ? 'time' : 'times'} per week</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="flex justify-end">
              <button
                onClick={handleAddHabit}
                disabled={!newHabit.name}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  !newHabit.name 
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                    : 'bg-pink-500 hover:bg-pink-600 text-white'
                }`}
              >
                Add Habit
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* No Habits Message */}
      {filteredHabits.length === 0 && (
        <div className="text-center py-10">
          <h3 className="text-xl font-bold text-gray-400 dark:text-gray-600 mb-2">No {showArchived ? 'archived' : 'active'} habits yet</h3>
          {!showArchived && (
            <p className="text-gray-500 dark:text-gray-500 max-w-md mx-auto">
              Start by adding habits you want to track. Creating consistent habits is key to career growth and self-improvement.
            </p>
          )}
          {showArchived && (
            <button
              onClick={() => setShowArchived(false)}
              className="mt-3 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg dark:bg-gray-200 dark:hover:bg-gray-300 dark:text-gray-800"
            >
              View Active Habits
            </button>
          )}
        </div>
      )}
      
      {/* Weekly View */}
      {selectedView === 'weekly' && filteredHabits.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-0">
            <thead>
              <tr>
                <th className="sticky left-0 z-10 bg-gray-900 dark:bg-white px-4 py-2 text-left w-40">
                  Habit
                </th>
                {dateRange.slice(-7).map((date, idx) => (
                  <th key={idx} className="px-2 py-2 text-xs text-center">
                    <div className="text-gray-400 dark:text-gray-600">
                      {date.toLocaleDateString('en-US', { weekday: 'short' })}
                    </div>
                    <div className="text-white dark:text-gray-800">
                      {date.getDate()}
                    </div>
                  </th>
                ))}
                <th className="px-4 py-2 text-right">Progress</th>
              </tr>
            </thead>
            <tbody>
              {filteredHabits.map(habit => (
                <tr key={habit.id} className="hover:bg-gray-800/30 dark:hover:bg-gray-100/60">
                  <td className="sticky left-0 z-10 bg-gray-900 dark:bg-white px-4 py-3 border-b border-gray-800 dark:border-gray-200">
                    <div className="flex items-center">
                      <div 
                        className="w-3 h-10 rounded-full mr-3"
                        style={{ backgroundColor: habit.color }}
                      ></div>
                      <div>
                        <p className="font-medium text-white dark:text-gray-800">{habit.name}</p>
                        <p className="text-xs text-gray-400 dark:text-gray-500">{habit.category}</p>
                      </div>
                    </div>
                  </td>
                  {dateRange.slice(-7).map((date, idx) => {
                    const dateString = date.toISOString().split('T')[0];
                    const isCompleted = isHabitCompletedForDate(habit.id, dateString);
                    
                    return (
                      <td key={idx} className="px-1 py-1 text-center border-b border-gray-800 dark:border-gray-200">
                        <button
                          onClick={() => handleToggleHabitForDate(habit.id, dateString)}
                          className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                            isCompleted
                              ? `bg-opacity-90 text-white` 
                              : 'bg-gray-800 bg-opacity-40 text-gray-400 hover:bg-opacity-60 dark:bg-gray-200 dark:text-gray-500'
                          }`}
                          style={{ backgroundColor: isCompleted ? habit.color : undefined }}
                          aria-label={`Mark ${habit.name} as ${isCompleted ? 'incomplete' : 'complete'} for ${dateString}`}
                        >
                          {isCompleted && (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </button>
                      </td>
                    );
                  })}
                  <td className="px-4 py-3 border-b border-gray-800 dark:border-gray-200">
                    <div className="flex items-center justify-end">
                      <div className="w-full max-w-[100px] bg-gray-800 dark:bg-gray-200 rounded-full h-2.5 mr-2">
                        <div 
                          className="h-2.5 rounded-full" 
                          style={{ 
                            width: `${getCompletionPercentage(habit.id)}%`,
                            backgroundColor: habit.color
                          }}
                        ></div>
                      </div>
                      <div className="text-sm text-gray-300 dark:text-gray-700 text-nowrap">
                        {getCompletionPercentage(habit.id)}%
                      </div>
                      <div className="flex ml-4">
                        <button
                          onClick={() => handleArchiveHabit(habit.id)}
                          className="p-1.5 text-gray-400 hover:text-gray-200 dark:hover:text-gray-800"
                          aria-label={`${habit.isArchived ? 'Unarchive' : 'Archive'} ${habit.name}`}
                        >
                          {habit.isArchived ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                            </svg>
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                            </svg>
                          )}
                        </button>
                        <button
                          onClick={() => handleDeleteHabit(habit.id)}
                          className="p-1.5 text-gray-400 hover:text-red-400"
                          aria-label={`Delete ${habit.name}`}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {/* Streak View */}
      {selectedView === 'streak' && filteredHabits.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredHabits.map(habit => {
            const streak = getHabitStreak(habit.id);
            const percentage = getCompletionPercentage(habit.id);
            
            return (
              <div 
                key={habit.id} 
                className="bg-gray-800/40 dark:bg-gray-100/60 rounded-lg p-4 border border-gray-700 dark:border-gray-200"
              >
                <div className="flex justify-between">
                  <div className="flex items-center">
                    <div 
                      className="w-3 h-10 rounded-full mr-3"
                      style={{ backgroundColor: habit.color }}
                    ></div>
                    <div>
                      <h4 className="font-medium text-white dark:text-gray-800">{habit.name}</h4>
                      <p className="text-xs text-gray-400 dark:text-gray-500">{habit.category}</p>
                    </div>
                  </div>
                  <div className="flex">
                    <button
                      onClick={() => handleArchiveHabit(habit.id)}
                      className="p-1.5 text-gray-400 hover:text-gray-200 dark:hover:text-gray-800"
                    >
                      {habit.isArchived ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                        </svg>
                      )}
                    </button>
                    <button
                      onClick={() => handleDeleteHabit(habit.id)}
                      className="p-1.5 text-gray-400 hover:text-red-400"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
                
                <div className="mt-4 flex items-center justify-between">
                  <div>
                    <div className="flex items-baseline">
                      <span className="text-3xl font-bold text-white dark:text-gray-800">{streak}</span>
                      <span className="ml-1 text-gray-400 dark:text-gray-500 text-sm">day streak</span>
                    </div>
                    <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                      Goal: {habit.timesPerWeek}x per week
                    </p>
                  </div>
                  
                  <div className="text-right">
                    <div className="inline-flex items-center justify-center">
                      <svg className="w-16 h-16" viewBox="0 0 36 36">
                        <path
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke={percentage > 0 ? habit.color : '#374151'}
                          strokeWidth="3"
                          strokeDasharray={`${percentage}, 100`}
                          className="transition-all duration-500"
                        />
                        <text x="18" y="21" textAnchor="middle" fontSize="10" fill="white" className="dark:fill-gray-800">
                          {percentage}%
                        </text>
                      </svg>
                    </div>
                    <p className="text-xs text-gray-400 dark:text-gray-500">Weekly progress</p>
                  </div>
                </div>
                
                {/* Recent Activity */}
                <div className="mt-3">
                  <h5 className="text-sm font-medium text-gray-300 dark:text-gray-700 mb-2">Recent Activity</h5>
                  <div className="flex space-x-1">
                    {dateRange.slice(-5).map((date, idx) => {
                      const dateString = date.toISOString().split('T')[0];
                      const isCompleted = isHabitCompletedForDate(habit.id, dateString);
                      
                      return (
                        <button
                          key={idx}
                          onClick={() => handleToggleHabitForDate(habit.id, dateString)}
                          className="flex flex-col items-center"
                        >
                          <div className="text-xs text-gray-500 mb-1">
                            {date.getDate()}
                          </div>
                          <div 
                            className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              isCompleted
                                ? 'text-white'
                                : 'bg-gray-800 text-gray-400 dark:bg-gray-200 dark:text-gray-500'
                            }`}
                            style={{ backgroundColor: isCompleted ? habit.color : undefined }}
                          >
                            {isCompleted && (
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      
      {/* Tips Section */}
      {filteredHabits.length > 0 && (
        <div className="mt-8 p-4 bg-gray-800/80 dark:bg-gray-100 rounded-lg">
          <h3 className="text-lg font-semibold text-pink-400 dark:text-pink-600 mb-2">Tips for Habit Building</h3>
          <ul className="list-disc list-inside space-y-2 text-sm text-gray-300 dark:text-gray-700">
            <li>Start small — consistency matters more than intensity</li>
            <li>Stack new habits onto existing routines (e.g., stretching after brushing teeth)</li>
            <li>Track your progress visually for motivation</li>
            <li>Focus on habits that support your career growth and wellbeing</li>
            <li>Celebrate small wins and streaks to reinforce the behavior</li>
          </ul>
        </div>
      )}
    </div>
  );
}
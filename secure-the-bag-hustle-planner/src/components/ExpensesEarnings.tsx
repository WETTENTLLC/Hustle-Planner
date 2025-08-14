'use client';

import React, { useState, useEffect } from 'react';
import secureStorage from '@/lib/secureStorage';

interface ExpenseEntry {
  id: string;
  date: string;
  category: string;
  description: string;
  amount: number;
}

interface EarningsEntry {
  id: string;
  date: string;
  tips: number;
  vipDances: number;
  afterDates: number;
  total: number;
}

export default function ExpensesEarnings() {
  const [expenses, setExpenses] = useState<ExpenseEntry[]>([]);
  const [earnings, setEarnings] = useState<EarningsEntry[]>([]);
  const [activeSection, setActiveSection] = useState<'expenses' | 'earnings'>('expenses');
  
  // Expense form state
  const [expenseForm, setExpenseForm] = useState({
    date: new Date().toISOString().split('T')[0],
    category: '',
    description: '',
    amount: ''
  });
  
  // Earnings form state
  const [earningsForm, setEarningsForm] = useState({
    date: new Date().toISOString().split('T')[0],
    tips: '',
    vipDances: '',
    afterDates: ''
  });

  const expenseCategories = [
    'Outfits & Costumes',
    'Makeup & Beauty',
    'Transportation',
    'Club Fees',
    'DJ Tips',
    'Security Tips',
    'Food & Drinks',
    'Phone & Internet',
    'Health & Fitness',
    'Other'
  ];

  useEffect(() => {
    const savedExpenses = secureStorage.getItem<ExpenseEntry[]>('work-expenses');
    const savedEarnings = secureStorage.getItem<EarningsEntry[]>('work-earnings');
    
    if (savedExpenses) setExpenses(savedExpenses);
    if (savedEarnings) setEarnings(savedEarnings);
  }, []);

  const saveExpenses = (newExpenses: ExpenseEntry[]) => {
    setExpenses(newExpenses);
    secureStorage.setItem('work-expenses', newExpenses);
  };

  const saveEarnings = (newEarnings: EarningsEntry[]) => {
    setEarnings(newEarnings);
    secureStorage.setItem('work-earnings', newEarnings);
  };

  const addExpense = () => {
    if (!expenseForm.category || !expenseForm.amount) return;
    
    const newExpense: ExpenseEntry = {
      id: Date.now().toString(),
      date: expenseForm.date,
      category: expenseForm.category,
      description: expenseForm.description,
      amount: parseFloat(expenseForm.amount)
    };
    
    saveExpenses([...expenses, newExpense]);
    setExpenseForm({
      date: new Date().toISOString().split('T')[0],
      category: '',
      description: '',
      amount: ''
    });
  };

  const addEarnings = () => {
    const tips = parseFloat(earningsForm.tips) || 0;
    const vipDances = parseFloat(earningsForm.vipDances) || 0;
    const afterDates = parseFloat(earningsForm.afterDates) || 0;
    
    const newEarnings: EarningsEntry = {
      id: Date.now().toString(),
      date: earningsForm.date,
      tips,
      vipDances,
      afterDates,
      total: tips + vipDances + afterDates
    };
    
    saveEarnings([...earnings, newEarnings]);
    setEarningsForm({
      date: new Date().toISOString().split('T')[0],
      tips: '',
      vipDances: '',
      afterDates: ''
    });
  };

  const deleteExpense = (id: string) => {
    saveExpenses(expenses.filter(expense => expense.id !== id));
  };

  const deleteEarnings = (id: string) => {
    saveEarnings(earnings.filter(earning => earning.id !== id));
  };

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const totalEarnings = earnings.reduce((sum, earning) => sum + earning.total, 0);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white p-6 rounded-t-xl">
        <h1 className="text-3xl font-bold">Expenses & Earnings Tracker</h1>
        <p className="mt-2 opacity-90">Track your work expenses for tax returns and daily earnings</p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-b-xl shadow-lg">
        {/* Section Toggle */}
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setActiveSection('expenses')}
            className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
              activeSection === 'expenses'
                ? 'bg-pink-50 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400 border-b-2 border-pink-500'
                : 'text-gray-600 dark:text-gray-400 hover:text-pink-500'
            }`}
          >
            Work Expenses
          </button>
          <button
            onClick={() => setActiveSection('earnings')}
            className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
              activeSection === 'earnings'
                ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 border-b-2 border-purple-500'
                : 'text-gray-600 dark:text-gray-400 hover:text-purple-500'
            }`}
          >
            Daily Earnings
          </button>
        </div>

        <div className="p-6">
          {activeSection === 'expenses' ? (
            <div>
              {/* Expense Form */}
              <div className="bg-pink-50 dark:bg-pink-900/10 p-6 rounded-lg mb-6">
                <h3 className="text-lg font-semibold text-pink-600 dark:text-pink-400 mb-4">Add Work Expense</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <input
                    type="date"
                    value={expenseForm.date}
                    onChange={(e) => setExpenseForm({...expenseForm, date: e.target.value})}
                    className="p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                  <select
                    value={expenseForm.category}
                    onChange={(e) => setExpenseForm({...expenseForm, category: e.target.value})}
                    className="p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="">Select Category</option>
                    {expenseCategories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                  <input
                    type="text"
                    placeholder="Description (optional)"
                    value={expenseForm.description}
                    onChange={(e) => setExpenseForm({...expenseForm, description: e.target.value})}
                    className="p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Amount"
                      step="0.01"
                      value={expenseForm.amount}
                      onChange={(e) => setExpenseForm({...expenseForm, amount: e.target.value})}
                      onBlur={() => expenseForm.category && expenseForm.amount && addExpense()}
                      className="flex-1 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                    <button
                      onClick={addExpense}
                      className="px-6 py-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>

              {/* Expenses Summary */}
              <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg mb-6">
                <h4 className="font-semibold text-gray-800 dark:text-gray-200">Total Expenses: ${totalExpenses.toFixed(2)}</h4>
              </div>

              {/* Expenses List */}
              <div className="space-y-3">
                {expenses.map(expense => (
                  <div key={expense.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-600 dark:text-gray-400">{expense.date}</span>
                        <span className="px-3 py-1 bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300 rounded-full text-sm">
                          {expense.category}
                        </span>
                        {expense.description && (
                          <span className="text-gray-700 dark:text-gray-300">{expense.description}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-gray-900 dark:text-white">${expense.amount.toFixed(2)}</span>
                      <button
                        onClick={() => deleteExpense(expense.id)}
                        className="text-red-500 hover:text-red-700 p-1"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div>
              {/* Earnings Form */}
              <div className="bg-purple-50 dark:bg-purple-900/10 p-6 rounded-lg mb-6">
                <h3 className="text-lg font-semibold text-purple-600 dark:text-purple-400 mb-4">Add Daily Earnings</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  <input
                    type="date"
                    value={earningsForm.date}
                    onChange={(e) => setEarningsForm({...earningsForm, date: e.target.value})}
                    className="p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                  <input
                    type="number"
                    placeholder="Tips"
                    step="0.01"
                    value={earningsForm.tips}
                    onChange={(e) => setEarningsForm({...earningsForm, tips: e.target.value})}
                    className="p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                  <input
                    type="number"
                    placeholder="VIP Dances"
                    step="0.01"
                    value={earningsForm.vipDances}
                    onChange={(e) => setEarningsForm({...earningsForm, vipDances: e.target.value})}
                    className="p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                  <input
                    type="number"
                    placeholder="After Dates"
                    step="0.01"
                    value={earningsForm.afterDates}
                    onChange={(e) => setEarningsForm({...earningsForm, afterDates: e.target.value})}
                    onBlur={() => (earningsForm.tips || earningsForm.vipDances || earningsForm.afterDates) && addEarnings()}
                    className="p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                  <button
                    onClick={addEarnings}
                    className="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Earnings Summary */}
              <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg mb-6">
                <h4 className="font-semibold text-gray-800 dark:text-gray-200">Total Earnings: ${totalEarnings.toFixed(2)}</h4>
              </div>

              {/* Earnings List */}
              <div className="space-y-3">
                {earnings.map(earning => (
                  <div key={earning.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-600 dark:text-gray-400">{earning.date}</span>
                        <div className="flex gap-3 text-sm">
                          <span className="text-green-600 dark:text-green-400">Tips: ${earning.tips.toFixed(2)}</span>
                          <span className="text-blue-600 dark:text-blue-400">VIP: ${earning.vipDances.toFixed(2)}</span>
                          <span className="text-purple-600 dark:text-purple-400">Dates: ${earning.afterDates.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-gray-900 dark:text-white">${earning.total.toFixed(2)}</span>
                      <button
                        onClick={() => deleteEarnings(earning.id)}
                        className="text-red-500 hover:text-red-700 p-1"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
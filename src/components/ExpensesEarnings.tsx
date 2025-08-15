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
  const netIncome = totalEarnings - totalExpenses;
  
  // Tax calculations for independent contractors
  const calculateTaxes = () => {
    const selfEmploymentTaxRate = 0.1413; // 14.13% (Social Security + Medicare)
    const federalTaxRate = 0.22; // Estimated 22% bracket for most entertainers
    const stateTaxRate = 0.05; // Average state tax (varies by state)
    
    const selfEmploymentTax = netIncome * selfEmploymentTaxRate;
    const federalTax = netIncome * federalTaxRate;
    const stateTax = netIncome * stateTaxRate;
    const totalTaxLiability = selfEmploymentTax + federalTax + stateTax;
    
    return {
      selfEmploymentTax,
      federalTax,
      stateTax,
      totalTaxLiability,
      quarterlyPayment: totalTaxLiability / 4,
      recommendedSavings: totalTaxLiability * 1.1 // 10% buffer
    };
  };
  
  const taxes = calculateTaxes();
  
  // Financial recommendations
  const getFinancialAdvice = () => {
    const monthlyIncome = netIncome / 12;
    const emergencyFund = monthlyIncome * 6;
    const savingsRate = 0.20; // 20% savings rate
    const monthlySavings = monthlyIncome * savingsRate;
    
    return {
      emergencyFund,
      monthlySavings,
      monthlyTaxSavings: taxes.recommendedSavings / 12,
      monthlySpending: monthlyIncome - monthlySavings - (taxes.recommendedSavings / 12)
    };
  };
  
  const advice = getFinancialAdvice();

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

        {/* Tax Calculator & Financial Dashboard */}
        <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border-t border-gray-200 dark:border-gray-700 p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Earnings</h4>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">${totalEarnings.toFixed(2)}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Expenses</h4>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">${totalExpenses.toFixed(2)}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400">Net Income</h4>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">${netIncome.toFixed(2)}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400">Est. Tax Owed</h4>
              <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">${taxes.totalTaxLiability.toFixed(2)}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Tax Breakdown */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold mb-4 text-orange-600 dark:text-orange-400">📊 Tax Breakdown (Annual)</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm">Self-Employment Tax (14.13%)</span>
                  <span className="font-medium">${taxes.selfEmploymentTax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Federal Income Tax (~22%)</span>
                  <span className="font-medium">${taxes.federalTax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">State Tax (~5%)</span>
                  <span className="font-medium">${taxes.stateTax.toFixed(2)}</span>
                </div>
                <div className="border-t pt-2 flex justify-between font-bold">
                  <span>Total Tax Liability</span>
                  <span>${taxes.totalTaxLiability.toFixed(2)}</span>
                </div>
                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded mt-4">
                  <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">💰 Quarterly Payment: ${taxes.quarterlyPayment.toFixed(2)}</p>
                  <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">Set aside ${taxes.recommendedSavings.toFixed(2)} total (includes 10% buffer)</p>
                </div>
              </div>
            </div>
            
            {/* Financial Recommendations */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold mb-4 text-blue-600 dark:text-blue-400">💡 Smart Money Management</h3>
              <div className="space-y-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded">
                  <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">Monthly Budget Breakdown</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Tax Savings (${(taxes.recommendedSavings/12).toFixed(0)}/month)</span>
                      <span className="font-medium">{((taxes.recommendedSavings/12) / (netIncome/12) * 100).toFixed(0)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Personal Savings (${advice.monthlySavings.toFixed(0)}/month)</span>
                      <span className="font-medium">20%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Living Expenses</span>
                      <span className="font-medium">{(advice.monthlySpending / (netIncome/12) * 100).toFixed(0)}%</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded">
                  <h4 className="font-medium text-green-800 dark:text-green-200 mb-2">🎯 Financial Goals</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Emergency Fund Target: ${advice.emergencyFund.toFixed(0)}</li>
                    <li>• Monthly Savings Goal: ${advice.monthlySavings.toFixed(0)}</li>
                    <li>• Tax Savings Account: ${(taxes.recommendedSavings/12).toFixed(0)}/month</li>
                  </ul>
                </div>
                
                <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded">
                  <h4 className="font-medium text-purple-800 dark:text-purple-200 mb-2">📈 Pro Tips</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Open separate savings accounts for taxes</li>
                    <li>• Track ALL business expenses for deductions</li>
                    <li>• Make quarterly tax payments to avoid penalties</li>
                    <li>• Consider a SEP-IRA for retirement savings</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
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
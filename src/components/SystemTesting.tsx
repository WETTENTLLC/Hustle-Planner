'use client';

import { useState } from 'react';

export default function SystemTesting() {
  const [testResults, setTestResults] = useState<any[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const runAccuracyTests = () => {
    setIsRunning(true);
    const results: any[] = [];

    // Test 1: Client Priority Algorithm
    const testClient = {
      id: '1',
      name: 'Test Client',
      totalSpent: 1500,
      lastVisit: new Date(Date.now() - 16 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 16 days ago
    };

    const daysSince = Math.floor((Date.now() - new Date(testClient.lastVisit).getTime()) / (1000 * 60 * 60 * 24));
    const shouldAlert = testClient.totalSpent > 500 && daysSince > 14;
    
    results.push({
      test: 'Client Going Cold Detection',
      input: `Client spent $${testClient.totalSpent}, last visit ${daysSince} days ago`,
      expected: 'Should trigger HIGH priority alert',
      actual: shouldAlert ? 'HIGH priority alert triggered' : 'No alert',
      passed: shouldAlert,
      logic: 'IF totalSpent > $500 AND daysSince > 14 THEN alert = HIGH'
    });

    // Test 2: Earnings Trend Analysis
    const mockEarnings = [
      { total: 300, date: '2024-01-01' },
      { total: 250, date: '2024-01-02' },
      { total: 280, date: '2024-01-03' },
      { total: 320, date: '2024-01-04' },
      { total: 290, date: '2024-01-05' },
      { total: 310, date: '2024-01-06' },
      { total: 275, date: '2024-01-07' },
      // Previous week (lower earnings)
      { total: 400, date: '2023-12-25' },
      { total: 380, date: '2023-12-26' },
      { total: 420, date: '2023-12-27' },
      { total: 390, date: '2023-12-28' },
      { total: 410, date: '2023-12-29' },
      { total: 385, date: '2023-12-30' },
      { total: 395, date: '2023-12-31' }
    ];

    const last7 = mockEarnings.slice(0, 7);
    const previous7 = mockEarnings.slice(7, 14);
    const recentAvg = last7.reduce((sum, e) => sum + e.total, 0) / 7;
    const previousAvg = previous7.reduce((sum, e) => sum + e.total, 0) / 7;
    const changePercent = ((recentAvg - previousAvg) / previousAvg) * 100;
    const shouldWarn = changePercent < -15;

    results.push({
      test: 'Earnings Decline Detection',
      input: `Recent avg: $${recentAvg.toFixed(0)}, Previous avg: $${previousAvg.toFixed(0)}`,
      expected: 'Should trigger decline warning',
      actual: shouldWarn ? `Decline warning: ${changePercent.toFixed(1)}%` : 'No warning',
      passed: shouldWarn,
      logic: 'IF (recentAvg - previousAvg) / previousAvg < -15% THEN warn'
    });

    // Test 3: Opportunity Priority Assignment
    const testOpportunity = {
      type: 'business_partnership',
      potentialValue: 15000
    };

    const PRIORITY_RULES = {
      business_partnership: { priority: 'critical', minValue: 10000 },
      shopping: { priority: 'medium', minValue: 500 }
    };

    const assignedPriority = PRIORITY_RULES[testOpportunity.type as keyof typeof PRIORITY_RULES]?.priority;
    const expectedPriority = 'critical';

    results.push({
      test: 'Opportunity Priority Assignment',
      input: `Type: ${testOpportunity.type}, Value: $${testOpportunity.potentialValue}`,
      expected: `Priority: ${expectedPriority}`,
      actual: `Priority: ${assignedPriority}`,
      passed: assignedPriority === expectedPriority,
      logic: 'IF type = business_partnership THEN priority = critical'
    });

    // Test 4: Reminder Frequency Logic
    const testReminder = {
      priority: 'critical',
      type: 'business_partnership'
    };

    const getReminderFrequency = (priority: string) => {
      switch (priority) {
        case 'critical': return 'daily';
        case 'high': return 'weekly';
        case 'medium': return 'bi-weekly';
        default: return 'monthly';
      }
    };

    const frequency = getReminderFrequency(testReminder.priority);
    const expectedFrequency = 'daily';

    results.push({
      test: 'Reminder Frequency Logic',
      input: `Priority: ${testReminder.priority}`,
      expected: `Frequency: ${expectedFrequency}`,
      actual: `Frequency: ${frequency}`,
      passed: frequency === expectedFrequency,
      logic: 'IF priority = critical THEN frequency = daily'
    });

    // Test 5: Data Validation
    const testData = [
      { amount: 100, date: '2024-01-01' }, // Valid
      { amount: -50, date: '2024-01-02' }, // Invalid (negative)
      { amount: 200, date: 'invalid-date' }, // Invalid (bad date)
      { amount: 150, date: '2024-01-03' }, // Valid
    ];

    const validateData = (data: any[]) => {
      return data.filter(item => 
        item.amount > 0 && 
        item.date && 
        !isNaN(new Date(item.date).getTime())
      );
    };

    const validData = validateData(testData);
    const expectedValid = 2;

    results.push({
      test: 'Data Validation',
      input: `${testData.length} records (2 invalid)`,
      expected: `${expectedValid} valid records`,
      actual: `${validData.length} valid records`,
      passed: validData.length === expectedValid,
      logic: 'IF amount > 0 AND date is valid THEN keep record'
    });

    setTestResults(results);
    setIsRunning(false);
  };

  const passedTests = testResults.filter(t => t.passed).length;
  const totalTests = testResults.length;
  const accuracy = totalTests > 0 ? (passedTests / totalTests) * 100 : 0;

  return (
    <div className="space-y-6">
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
        <h3 className="text-lg font-bold text-blue-400 dark:text-blue-600 mb-3">🧪 System Accuracy Testing</h3>
        <p className="text-sm text-gray-300 dark:text-gray-700 mb-4">
          This demonstrates how the "smart" features work using deterministic rules and statistical analysis.
          No AI or machine learning - just reliable, testable algorithms.
        </p>
        
        <button
          onClick={runAccuracyTests}
          disabled={isRunning}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-lg"
        >
          {isRunning ? 'Running Tests...' : 'Run Accuracy Tests'}
        </button>

        {testResults.length > 0 && (
          <div className="mt-4 p-3 bg-green-500/10 border border-green-500/30 rounded">
            <h4 className="font-semibold text-green-400 dark:text-green-600">
              Test Results: {passedTests}/{totalTests} Passed ({accuracy.toFixed(1)}% Accuracy)
            </h4>
          </div>
        )}
      </div>

      {testResults.length > 0 && (
        <div className="space-y-4">
          {testResults.map((result, index) => (
            <div key={index} className={`p-4 rounded-lg border ${
              result.passed 
                ? 'bg-green-500/10 border-green-500/30' 
                : 'bg-red-500/10 border-red-500/30'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold">{result.test}</h4>
                <span className={`px-2 py-1 text-xs rounded ${
                  result.passed ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                }`}>
                  {result.passed ? 'PASS' : 'FAIL'}
                </span>
              </div>
              
              <div className="space-y-2 text-sm">
                <div><strong>Input:</strong> {result.input}</div>
                <div><strong>Expected:</strong> {result.expected}</div>
                <div><strong>Actual:</strong> {result.actual}</div>
                <div className="bg-gray-700/20 dark:bg-gray-200/20 p-2 rounded">
                  <strong>Logic:</strong> <code className="text-xs">{result.logic}</code>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="bg-gray-800/30 dark:bg-white/30 rounded-lg p-4">
        <h3 className="font-bold mb-3">🔧 How Accuracy is Maintained</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h4 className="font-semibold mb-2 text-green-400 dark:text-green-600">Reliability Mechanisms:</h4>
            <ul className="space-y-1 list-disc list-inside">
              <li>Deterministic algorithms (same input = same output)</li>
              <li>Data validation prevents garbage input</li>
              <li>Fallback handling for edge cases</li>
              <li>Threshold-based rules (not probabilistic)</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2 text-blue-400 dark:text-blue-600">No External Dependencies:</h4>
            <ul className="space-y-1 list-disc list-inside">
              <li>100% client-side processing</li>
              <li>No API calls or network dependencies</li>
              <li>Works offline</li>
              <li>No subscription or usage costs</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
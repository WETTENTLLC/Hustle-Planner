'use client';

import { useState } from 'react';

export default function HowToUse() {
  const [openSection, setOpenSection] = useState<string | null>('overview');

  const sections = [
    {
      id: 'overview',
      title: '🎯 Complete Feature Overview',
      content: (
        <div className="space-y-6">
          <p className="text-lg font-medium text-pink-400 dark:text-pink-600">
            Your complete business management system with 11 powerful tools to maximize income and build wealth.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
              <h4 className="font-bold text-purple-400 mb-2">📅 Shift Planner</h4>
              <ul className="text-xs space-y-1">
                <li>• Schedule optimal work times</li>
                <li>• Set income goals per shift</li>
                <li>• Track actual vs planned earnings</li>
                <li>• Identify peak earning periods</li>
              </ul>
            </div>
            
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
              <h4 className="font-bold text-blue-400 mb-2">⏰ Smart Reminders</h4>
              <ul className="text-xs space-y-1">
                <li>• Browser notifications</li>
                <li>• Daily, weekly, or one-time alerts</li>
                <li>• Works even when tab is closed</li>
                <li>• Never miss important tasks</li>
              </ul>
            </div>
            
            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
              <h4 className="font-bold text-green-400 mb-2">👥 Client Manager</h4>
              <ul className="text-xs space-y-1">
                <li>• Track client preferences</li>
                <li>• Record spending patterns</li>
                <li>• Store personal notes</li>
                <li>• Build stronger relationships</li>
              </ul>
            </div>
            
            <div className="bg-pink-500/10 border border-pink-500/30 rounded-lg p-4">
              <h4 className="font-bold text-pink-400 mb-2">💎 Client Loyalty</h4>
              <ul className="text-xs space-y-1">
                <li>• Prioritize by spending amount</li>
                <li>• Track visit history</li>
                <li>• Expert advice for each tier</li>
                <li>• Maximize repeat business</li>
              </ul>
            </div>
            
            <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4">
              <h4 className="font-bold text-orange-400 mb-2">💪 Habit Tracker</h4>
              <ul className="text-xs space-y-1">
                <li>• Daily success routines</li>
                <li>• Physical & mental wellness</li>
                <li>• Business development habits</li>
                <li>• Consistency tracking</li>
              </ul>
            </div>
            
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
              <h4 className="font-bold text-yellow-600 mb-2">💡 Hustle Tips</h4>
              <ul className="text-xs space-y-1">
                <li>• Expert earning strategies</li>
                <li>• Client relationship advice</li>
                <li>• Stage presence tips</li>
                <li>• Professional mindset guidance</li>
              </ul>
            </div>
            
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
              <h4 className="font-bold text-red-400 mb-2">💰 Expenses & Earnings</h4>
              <ul className="text-xs space-y-1">
                <li>• Track all business expenses</li>
                <li>• Daily earnings breakdown</li>
                <li>• Automatic tax calculations</li>
                <li>• Quarterly payment planning</li>
              </ul>
            </div>
            
            <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
              <h4 className="font-bold text-cyan-400 mb-2">⚡ Opportunities</h4>
              <ul className="text-xs space-y-1">
                <li>• Track business partnerships</li>
                <li>• Shopping & travel plans</li>
                <li>• Investment opportunities</li>
                <li>• Automated follow-up alerts</li>
              </ul>
            </div>
            
            <div className="bg-indigo-500/10 border border-indigo-500/30 rounded-lg p-4">
              <h4 className="font-bold text-indigo-400 mb-2">🧠 Smart Insights</h4>
              <ul className="text-xs space-y-1">
                <li>• Pattern recognition</li>
                <li>• Earnings trend analysis</li>
                <li>• Client behavior insights</li>
                <li>• Performance optimization</li>
              </ul>
            </div>
            
            <div className="bg-teal-500/10 border border-teal-500/30 rounded-lg p-4">
              <h4 className="font-bold text-teal-400 mb-2">📚 How To Use</h4>
              <ul className="text-xs space-y-1">
                <li>• Complete success guide</li>
                <li>• Feature explanations</li>
                <li>• Best practices</li>
                <li>• Growth strategies</li>
              </ul>
            </div>
            
            <div className="bg-gray-500/10 border border-gray-500/30 rounded-lg p-4">
              <h4 className="font-bold text-gray-400 mb-2">❓ FAQ</h4>
              <ul className="text-xs space-y-1">
                <li>• Privacy & security info</li>
                <li>• Technical support</li>
                <li>• Feature questions</li>
                <li>• Troubleshooting help</li>
              </ul>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-pink-500/20 to-purple-500/20 border border-pink-500/30 rounded-lg p-6">
            <h4 className="font-bold text-pink-400 mb-3 text-lg">🚀 Why This System Works</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h5 className="font-semibold mb-2 text-green-400">💰 Income Maximization:</h5>
                <ul className="space-y-1 list-disc list-inside">
                  <li>Track every revenue stream</li>
                  <li>Identify your most profitable activities</li>
                  <li>Focus on high-value clients</li>
                  <li>Optimize your schedule for peak earnings</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold mb-2 text-blue-400">📊 Business Intelligence:</h5>
                <ul className="space-y-1 list-disc list-inside">
                  <li>Data-driven decision making</li>
                  <li>Pattern recognition for growth</li>
                  <li>Automated opportunity alerts</li>
                  <li>Performance optimization insights</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold mb-2 text-purple-400">🔒 Privacy & Security:</h5>
                <ul className="space-y-1 list-disc list-inside">
                  <li>100% local storage - no cloud</li>
                  <li>Encrypted data protection</li>
                  <li>No accounts or logins required</li>
                  <li>Complete anonymity guaranteed</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold mb-2 text-orange-400">💼 Professional Tools:</h5>
                <ul className="space-y-1 list-disc list-inside">
                  <li>Tax calculation & planning</li>
                  <li>Expense optimization</li>
                  <li>Client relationship management</li>
                  <li>Long-term wealth building</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'planner',
      title: '📅 Shift Planner - Your Success Foundation',
      content: (
        <div className="space-y-4">
          <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
            <h4 className="font-bold text-purple-400 mb-3">Why This Matters:</h4>
            <p className="text-sm mb-3">Successful entertainers work strategically, not randomly. Planning your shifts helps you:</p>
            <ul className="text-sm space-y-1 list-disc list-inside">
              <li>Work during peak earning times (Friday/Saturday nights, holidays)</li>
              <li>Avoid burnout by balancing work and rest</li>
              <li>Prepare mentally and physically for each shift</li>
              <li>Track which days/times earn you the most money</li>
            </ul>
          </div>
          <div className="bg-gray-700/30 dark:bg-gray-200/30 rounded-lg p-4">
            <h4 className="font-bold mb-2">How to Use:</h4>
            <ol className="text-sm space-y-2 list-decimal list-inside">
              <li>Plan your shifts 1-2 weeks in advance</li>
              <li>Include prep time (hair, makeup, outfit selection)</li>
              <li>Set income goals for each shift</li>
              <li>Note special events or promotions at the club</li>
              <li>Review and adjust based on actual earnings</li>
            </ol>
          </div>
        </div>
      )
    },
    {
      id: 'expenses',
      title: '💸 Expenses & Earnings - Your Tax Advantage',
      content: (
        <div className="space-y-4">
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
            <h4 className="font-bold text-red-400 mb-3">Critical for Independent Contractors:</h4>
            <p className="text-sm mb-3">As a 1099 contractor, you can deduct business expenses to reduce taxable income. This can save you 20-30% on taxes!</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-bold mb-2">✅ Deductible Expenses:</h4>
              <ul className="text-sm space-y-1 list-disc list-inside">
                <li>Costumes, lingerie, shoes</li>
                <li>Makeup, hair products, nails</li>
                <li>Transportation to/from work</li>
                <li>Phone bills (business use)</li>
                <li>Gym memberships</li>
                <li>Professional photos</li>
                <li>Stage fees, house fees</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-2">📱 How to Track:</h4>
              <ol className="text-sm space-y-1 list-decimal list-inside">
                <li>Enter every expense immediately</li>
                <li>Keep receipts (photo them)</li>
                <li>Use the tax calculator monthly</li>
                <li>Set aside recommended tax amount</li>
                <li>Review quarterly with accountant</li>
              </ol>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'clients',
      title: '👥 Client Management - Your Revenue Engine',
      content: (
        <div className="space-y-4">
          <div className="bg-pink-500/10 border border-pink-500/30 rounded-lg p-4">
            <h4 className="font-bold text-pink-400 mb-3">The 80/20 Rule:</h4>
            <p className="text-sm">80% of your income comes from 20% of your clients. Focus on building relationships with high-value regulars.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-bold mb-2">Client Manager:</h4>
              <ul className="text-sm space-y-1 list-disc list-inside">
                <li>Record every client interaction</li>
                <li>Note preferences and dislikes</li>
                <li>Track spending patterns</li>
                <li>Set follow-up reminders</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-2">Loyalty Tracking:</h4>
              <ul className="text-sm space-y-1 list-disc list-inside">
                <li>Prioritize highest spenders</li>
                <li>Record each visit amount</li>
                <li>Follow expert advice for each tier</li>
                <li>Build long-term relationships</li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'habits',
      title: '💪 Habit Tracker - Your Competitive Edge',
      content: (
        <div className="space-y-4">
          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
            <h4 className="font-bold text-green-400 mb-3">Success Habits:</h4>
            <p className="text-sm">Top earners maintain consistent habits that keep them physically and mentally sharp.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h4 className="font-bold mb-2">Physical:</h4>
              <ul className="text-sm space-y-1 list-disc list-inside">
                <li>Daily workouts</li>
                <li>Healthy eating</li>
                <li>Adequate sleep</li>
                <li>Skincare routine</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-2">Mental:</h4>
              <ul className="text-sm space-y-1 list-disc list-inside">
                <li>Meditation/mindfulness</li>
                <li>Goal setting</li>
                <li>Learning new skills</li>
                <li>Positive affirmations</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-2">Business:</h4>
              <ul className="text-sm space-y-1 list-disc list-inside">
                <li>Daily income tracking</li>
                <li>Client follow-ups</li>
                <li>Social media presence</li>
                <li>Skill development</li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'reminders',
      title: '⏰ Reminders - Stay Organized',
      content: (
        <div className="space-y-4">
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
            <h4 className="font-bold text-yellow-400 mb-3">Never Miss Important Tasks:</h4>
            <p className="text-sm">Set reminders for everything that impacts your income and success.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-bold mb-2">Work Reminders:</h4>
              <ul className="text-sm space-y-1 list-disc list-inside">
                <li>Shift start times</li>
                <li>Outfit preparation</li>
                <li>Client follow-ups</li>
                <li>Special club events</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-2">Business Reminders:</h4>
              <ul className="text-sm space-y-1 list-disc list-inside">
                <li>Quarterly tax payments</li>
                <li>Expense tracking</li>
                <li>Goal reviews</li>
                <li>Health appointments</li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'success',
      title: '🚀 Building Long-Term Success',
      content: (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-pink-500/20 to-purple-500/20 border border-pink-500/30 rounded-lg p-4">
            <h4 className="font-bold text-pink-400 mb-3">Your Path to Financial Freedom:</h4>
            <p className="text-sm">Use this planner consistently to build a sustainable, profitable career.</p>
          </div>
          <div className="space-y-3">
            <div className="bg-gray-700/30 dark:bg-gray-200/30 rounded-lg p-3">
              <h5 className="font-bold text-sm">Month 1-3: Foundation</h5>
              <p className="text-xs">Track everything, identify patterns, build client base</p>
            </div>
            <div className="bg-gray-700/30 dark:bg-gray-200/30 rounded-lg p-3">
              <h5 className="font-bold text-sm">Month 4-6: Optimization</h5>
              <p className="text-xs">Focus on highest-earning shifts and top clients</p>
            </div>
            <div className="bg-gray-700/30 dark:bg-gray-200/30 rounded-lg p-3">
              <h5 className="font-bold text-sm">Month 7+: Scaling</h5>
              <p className="text-xs">Maximize income, minimize taxes, plan for the future</p>
            </div>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">How to Use Your Hustle Planner</h2>
        <p className="text-gray-400 dark:text-gray-600">Master each component to maximize your success</p>
      </div>

      <div className="space-y-3">
        {sections.map((section) => (
          <div key={section.id} className="border border-gray-700 dark:border-gray-300 rounded-lg overflow-hidden">
            <button
              onClick={() => setOpenSection(openSection === section.id ? null : section.id)}
              className={`w-full px-4 py-3 flex items-center justify-between text-left font-medium transition-colors ${
                openSection === section.id
                  ? 'bg-pink-500/20 text-pink-300 dark:bg-pink-100 dark:text-pink-800'
                  : 'bg-gray-800/50 hover:bg-gray-700/50 text-white dark:bg-gray-100/50 dark:hover:bg-gray-200/50 dark:text-gray-800'
              }`}
            >
              <span>{section.title}</span>
              <svg
                className={`w-5 h-5 transition-transform duration-200 ${
                  openSection === section.id ? 'transform rotate-180' : ''
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {openSection === section.id && (
              <div className="px-4 py-4 bg-gray-900/40 dark:bg-gray-50 text-gray-200 dark:text-gray-800">
                {section.content}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/30 rounded-lg p-6 mt-8">
        <h3 className="font-bold text-lg mb-3 text-green-400 dark:text-green-600">💡 Success Formula</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="text-center">
            <div className="text-2xl mb-2">📊</div>
            <h4 className="font-semibold mb-1">Track Everything</h4>
            <p className="text-xs">10 minutes daily = Complete business intelligence</p>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-2">🎯</div>
            <h4 className="font-semibold mb-1">Follow Insights</h4>
            <p className="text-xs">Act on smart recommendations = Higher earnings</p>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-2">💰</div>
            <h4 className="font-semibold mb-1">Build Wealth</h4>
            <p className="text-xs">Consistent use = Financial freedom</p>
          </div>
        </div>
      </div>
    </div>
  );
}
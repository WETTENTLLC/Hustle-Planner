'use client';

import { useState, useEffect } from 'react';
import { getLocalStorage } from '@/lib/utils';
import SystemTesting from './SystemTesting';

interface Insight {
  id: string;
  type: 'pattern' | 'opportunity' | 'warning' | 'suggestion';
  priority: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  message: string;
  actionable: boolean;
  data?: any;
  dateGenerated: string;
}

export default function SmartInsights() {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    generateInsights();
  }, []);

  const generateInsights = () => {
    setLoading(true);
    const newInsights: Insight[] = [];

    // Get all data
    const clients = getLocalStorage<any[]>('hustle-clients', []);
    const earnings = getLocalStorage<any[]>('work-earnings', []);
    const expenses = getLocalStorage<any[]>('work-expenses', []);
    const opportunities = getLocalStorage<any[]>('client-opportunities', []);
    const shifts = getLocalStorage<any[]>('hustle-shifts', []);

    // Analyze client spending patterns
    analyzeClientPatterns(clients, newInsights);
    
    // Analyze earnings trends
    analyzeEarningsTrends(earnings, newInsights);
    
    // Analyze expense optimization
    analyzeExpenseOptimization(expenses, newInsights);
    
    // Analyze opportunity management
    analyzeOpportunityManagement(opportunities, clients, newInsights);
    
    // Analyze work patterns
    analyzeWorkPatterns(shifts, earnings, newInsights);

    setInsights(newInsights);
    setLoading(false);
  };

  const analyzeClientPatterns = (clients: any[], insights: Insight[]) => {
    if (clients.length === 0) return;

    // Find top spenders
    const topSpenders = clients
      .filter(c => c.totalSpent > 0)
      .sort((a, b) => (b.totalSpent || 0) - (a.totalSpent || 0))
      .slice(0, 3);

    if (topSpenders.length > 0) {
      const topClient = topSpenders[0];
      const daysSinceLastVisit = topClient.lastVisit ? 
        Math.floor((Date.now() - new Date(topClient.lastVisit).getTime()) / (1000 * 60 * 60 * 24)) : 999;

      if (daysSinceLastVisit > 14) {
        insights.push({
          id: `client-${topClient.id}-inactive`,
          type: 'warning',
          priority: 'high',
          title: '🚨 Top Client Going Cold',
          message: `${topClient.name} (${topClient.totalSpent ? '$' + topClient.totalSpent.toFixed(0) : 'high value'} spent) hasn't visited in ${daysSinceLastVisit} days. Reach out before you lose them!`,
          actionable: true,
          data: { clientId: topClient.id, daysSince: daysSinceLastVisit },
          dateGenerated: new Date().toISOString()
        });
      }
    }

    // Identify clients with growth potential
    const growthClients = clients.filter(c => {
      const visits = c.visits || [];
      if (visits.length < 2) return false;
      
      const recentVisits = visits.slice(-3);
      const avgSpend = recentVisits.reduce((sum: number, v: any) => sum + v.amount, 0) / recentVisits.length;
      return avgSpend > 100 && avgSpend < 500; // Sweet spot for upselling
    });

    if (growthClients.length > 0) {
      insights.push({
        id: 'growth-clients',
        type: 'opportunity',
        priority: 'medium',
        title: '📈 Upselling Opportunities',
        message: `${growthClients.length} clients are spending $100-500 per visit. Perfect candidates for VIP packages or premium services!`,
        actionable: true,
        data: { clients: growthClients.map(c => c.name) },
        dateGenerated: new Date().toISOString()
      });
    }
  };

  const analyzeEarningsTrends = (earnings: any[], insights: Insight[]) => {
    if (earnings.length < 7) return;

    const last7Days = earnings.slice(-7);
    const previous7Days = earnings.slice(-14, -7);
    
    const recentAvg = last7Days.reduce((sum, e) => sum + e.total, 0) / 7;
    const previousAvg = previous7Days.reduce((sum, e) => sum + e.total, 0) / 7;
    
    const changePercent = ((recentAvg - previousAvg) / previousAvg) * 100;

    if (changePercent < -15) {
      insights.push({
        id: 'earnings-decline',
        type: 'warning',
        priority: 'high',
        title: '📉 Earnings Declining',
        message: `Your average daily earnings dropped ${Math.abs(changePercent).toFixed(1)}% this week. Time to re-engage top clients or try new strategies.`,
        actionable: true,
        data: { changePercent, recentAvg, previousAvg },
        dateGenerated: new Date().toISOString()
      });
    } else if (changePercent > 20) {
      insights.push({
        id: 'earnings-surge',
        type: 'pattern',
        priority: 'medium',
        title: '🚀 Earnings Surge!',
        message: `Great job! Earnings up ${changePercent.toFixed(1)}% this week. Analyze what you did differently and repeat it!`,
        actionable: true,
        data: { changePercent, recentAvg },
        dateGenerated: new Date().toISOString()
      });
    }

    // Analyze best earning days
    const dayEarnings = earnings.reduce((acc: any, e) => {
      const day = new Date(e.date).getDay();
      acc[day] = (acc[day] || 0) + e.total;
      return acc;
    }, {});

    const bestDay = Object.entries(dayEarnings).reduce((a: any, b: any) => 
      dayEarnings[a[0]] > dayEarnings[b[0]] ? a : b
    );

    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    
    insights.push({
      id: 'best-day-pattern',
      type: 'pattern',
      priority: 'low',
      title: '📅 Peak Earning Day',
      message: `${dayNames[parseInt(bestDay[0])]} is your best earning day (avg $${(bestDay[1] / earnings.filter(e => new Date(e.date).getDay() === parseInt(bestDay[0])).length).toFixed(0)}). Schedule more shifts on this day!`,
      actionable: true,
      data: { bestDay: dayNames[parseInt(bestDay[0])], avgEarnings: bestDay[1] },
      dateGenerated: new Date().toISOString()
    });
  };

  const analyzeExpenseOptimization = (expenses: any[], insights: Insight[]) => {
    if (expenses.length === 0) return;

    const monthlyExpenses = expenses.reduce((acc: any, e) => {
      const category = e.category;
      acc[category] = (acc[category] || 0) + e.amount;
      return acc;
    }, {});

    const totalExpenses = Object.values(monthlyExpenses).reduce((sum: number, amount: any) => sum + amount, 0);
    
    // Find highest expense category
    const highestExpense = Object.entries(monthlyExpenses).reduce((a: any, b: any) => 
      a[1] > b[1] ? a : b
    );

    if (highestExpense[1] as number > totalExpenses * 0.3) {
      insights.push({
        id: 'expense-optimization',
        type: 'suggestion',
        priority: 'medium',
        title: '💰 Expense Optimization',
        message: `${highestExpense[0]} is ${((highestExpense[1] as number / totalExpenses) * 100).toFixed(1)}% of your expenses ($${(highestExpense[1] as number).toFixed(0)}). Look for ways to reduce this category.`,
        actionable: true,
        data: { category: highestExpense[0], amount: highestExpense[1], percentage: (highestExpense[1] as number / totalExpenses) * 100 },
        dateGenerated: new Date().toISOString()
      });
    }
  };

  const analyzeOpportunityManagement = (opportunities: any[], clients: any[], insights: Insight[]) => {
    const activeOpportunities = opportunities.filter(o => o.status === 'new' || o.status === 'in_progress');
    const overdueOpportunities = activeOpportunities.filter(o => new Date(o.followUpDate) < new Date());

    if (overdueOpportunities.length > 0) {
      insights.push({
        id: 'overdue-opportunities',
        type: 'warning',
        priority: 'critical',
        title: '⚠️ Overdue Opportunities',
        message: `${overdueOpportunities.length} high-value opportunities are overdue for follow-up. Don't let money slip away!`,
        actionable: true,
        data: { count: overdueOpportunities.length, opportunities: overdueOpportunities },
        dateGenerated: new Date().toISOString()
      });
    }

    const totalOpportunityValue = activeOpportunities.reduce((sum, o) => sum + o.potentialValue, 0);
    if (totalOpportunityValue > 10000) {
      insights.push({
        id: 'high-value-pipeline',
        type: 'opportunity',
        priority: 'high',
        title: '💎 High-Value Pipeline',
        message: `You have $${totalOpportunityValue.toLocaleString()} in active opportunities. Focus on converting these for maximum impact!`,
        actionable: true,
        data: { totalValue: totalOpportunityValue, count: activeOpportunities.length },
        dateGenerated: new Date().toISOString()
      });
    }
  };

  const analyzeWorkPatterns = (shifts: any[], earnings: any[], insights: Insight[]) => {
    if (shifts.length < 5) return;

    const recentShifts = shifts.slice(-10);
    const avgShiftLength = recentShifts.reduce((sum, s) => {
      const start = new Date(`2000-01-01 ${s.startTime}`);
      const end = new Date(`2000-01-01 ${s.endTime}`);
      return sum + (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    }, 0) / recentShifts.length;

    if (avgShiftLength > 8) {
      insights.push({
        id: 'long-shifts',
        type: 'warning',
        priority: 'medium',
        title: '⏰ Long Shift Alert',
        message: `Your average shift is ${avgShiftLength.toFixed(1)} hours. Consider shorter, more focused shifts to avoid burnout and maintain energy.`,
        actionable: true,
        data: { avgHours: avgShiftLength },
        dateGenerated: new Date().toISOString()
      });
    }

    // Analyze earnings per hour
    if (earnings.length > 0 && shifts.length > 0) {
      const totalEarnings = earnings.reduce((sum, e) => sum + e.total, 0);
      const totalHours = recentShifts.reduce((sum, s) => {
        const start = new Date(`2000-01-01 ${s.startTime}`);
        const end = new Date(`2000-01-01 ${s.endTime}`);
        return sum + (end.getTime() - start.getTime()) / (1000 * 60 * 60);
      }, 0);

      const earningsPerHour = totalEarnings / totalHours;

      if (earningsPerHour < 50) {
        insights.push({
          id: 'low-hourly-rate',
          type: 'suggestion',
          priority: 'high',
          title: '📊 Optimize Hourly Earnings',
          message: `Your current rate is $${earningsPerHour.toFixed(0)}/hour. Focus on VIP clients and premium services to increase this.`,
          actionable: true,
          data: { hourlyRate: earningsPerHour },
          dateGenerated: new Date().toISOString()
        });
      }
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'border-red-500 bg-red-500/10';
      case 'high': return 'border-orange-500 bg-orange-500/10';
      case 'medium': return 'border-yellow-500 bg-yellow-500/10';
      default: return 'border-blue-500 bg-blue-500/10';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'warning': return '⚠️';
      case 'opportunity': return '💰';
      case 'pattern': return '📊';
      default: return '💡';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p>Analyzing your data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Smart Insights & Recommendations</h2>
        <button
          onClick={generateInsights}
          className="px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-lg"
        >
          Refresh Analysis
        </button>
      </div>

      {insights.length === 0 ? (
        <div className="text-center py-12 bg-gray-800/30 dark:bg-white/30 rounded-lg">
          <p className="text-gray-400 dark:text-gray-600">
            Keep using the planner to generate personalized insights and recommendations!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {insights
            .sort((a, b) => {
              const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
              return priorityOrder[b.priority as keyof typeof priorityOrder] - priorityOrder[a.priority as keyof typeof priorityOrder];
            })
            .map(insight => (
              <div key={insight.id} className={`p-4 rounded-lg border ${getPriorityColor(insight.priority)}`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">{getTypeIcon(insight.type)}</span>
                      <h3 className="font-semibold">{insight.title}</h3>
                      <span className={`px-2 py-1 text-xs rounded ${
                        insight.priority === 'critical' ? 'bg-red-500 text-white' :
                        insight.priority === 'high' ? 'bg-orange-500 text-white' :
                        insight.priority === 'medium' ? 'bg-yellow-500 text-black' :
                        'bg-blue-500 text-white'
                      }`}>
                        {insight.priority.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-300 dark:text-gray-700 mb-2">{insight.message}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                      Generated: {new Date(insight.dateGenerated).toLocaleDateString()}
                    </p>
                  </div>
                  {insight.actionable && (
                    <button className="px-3 py-1 bg-pink-500 hover:bg-pink-600 text-white text-sm rounded">
                      Take Action
                    </button>
                  )}
                </div>
              </div>
            ))}
        </div>
      )}

      <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-lg p-4">
        <h3 className="font-bold text-purple-400 dark:text-purple-600 mb-2">🧠 How Smart Insights Work</h3>
        <ul className="text-sm space-y-1 text-gray-300 dark:text-gray-700">
          <li>• Analyzes your earnings, client patterns, and work habits</li>
          <li>• Identifies opportunities you might miss</li>
          <li>• Warns about potential problems before they impact income</li>
          <li>• Provides data-driven recommendations for growth</li>
          <li>• Updates automatically as you use the planner</li>
        </ul>
      </div>
      
      <SystemTesting />
    </div>
  );
}
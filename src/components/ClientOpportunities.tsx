'use client';

import { useState, useEffect } from 'react';
import { getLocalStorage, setLocalStorage } from '@/lib/utils';

interface Opportunity {
  id: string;
  clientId: string;
  type: 'business_partnership' | 'shopping' | 'travel' | 'investment' | 'mentorship' | 'networking' | 'other';
  title: string;
  description: string;
  potentialValue: number;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'new' | 'in_progress' | 'completed' | 'missed';
  dateCreated: string;
  followUpDate: string;
  lastContact: string;
  notes: string[];
}

interface Client {
  id: string;
  name: string;
  totalSpent: number;
  visits: any[];
  opportunities: Opportunity[];
}

const OPPORTUNITY_TYPES = {
  business_partnership: { label: 'Business Partnership', priority: 'critical', value: 10000 },
  investment: { label: 'Investment Opportunity', priority: 'critical', value: 5000 },
  mentorship: { label: 'Mentorship/Coaching', priority: 'high', value: 2000 },
  shopping: { label: 'Shopping Trip', priority: 'medium', value: 500 },
  travel: { label: 'Travel/Vacation', priority: 'high', value: 3000 },
  networking: { label: 'Networking Event', priority: 'medium', value: 1000 },
  other: { label: 'Other Opportunity', priority: 'low', value: 200 }
};

export default function ClientOpportunities() {
  const [clients, setClients] = useState<Client[]>([]);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [selectedClient, setSelectedClient] = useState<string>('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newOpportunity, setNewOpportunity] = useState({
    type: 'business_partnership' as keyof typeof OPPORTUNITY_TYPES,
    title: '',
    description: '',
    potentialValue: '',
    followUpDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const savedClients = getLocalStorage<Client[]>('hustle-clients', []);
    const savedOpportunities = getLocalStorage<Opportunity[]>('client-opportunities', []);
    
    setClients(savedClients);
    setOpportunities(savedOpportunities);
  }, []);

  const saveOpportunities = (newOpportunities: Opportunity[]) => {
    setOpportunities(newOpportunities);
    setLocalStorage('client-opportunities', newOpportunities);
  };

  const addOpportunity = () => {
    if (!selectedClient || !newOpportunity.title) return;

    const opportunity: Opportunity = {
      id: Date.now().toString(),
      clientId: selectedClient,
      type: newOpportunity.type,
      title: newOpportunity.title,
      description: newOpportunity.description,
      potentialValue: parseFloat(newOpportunity.potentialValue) || OPPORTUNITY_TYPES[newOpportunity.type].value,
      priority: OPPORTUNITY_TYPES[newOpportunity.type].priority as any,
      status: 'new',
      dateCreated: new Date().toISOString().split('T')[0],
      followUpDate: newOpportunity.followUpDate,
      lastContact: new Date().toISOString().split('T')[0],
      notes: []
    };

    saveOpportunities([...opportunities, opportunity]);
    
    // Create automatic reminder
    createSmartReminder(opportunity);
    
    setNewOpportunity({
      type: 'business_partnership',
      title: '',
      description: '',
      potentialValue: '',
      followUpDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    });
    setShowAddForm(false);
  };

  const createSmartReminder = (opportunity: Opportunity) => {
    const client = clients.find(c => c.id === opportunity.clientId);
    if (!client) return;

    const reminders = getLocalStorage<any[]>('hustle-reminders', []);
    
    // Create immediate follow-up reminder
    const followUpReminder = {
      id: `opp-${opportunity.id}-followup`,
      time: '10:00',
      date: opportunity.followUpDate,
      message: `🚨 HIGH PRIORITY: Follow up with ${client.name} about ${opportunity.title} (Potential: $${opportunity.potentialValue})`,
      enabled: true,
      repeats: 'none',
      priority: opportunity.priority,
      opportunityId: opportunity.id
    };

    // Create weekly check-in for high-value opportunities
    if (opportunity.priority === 'critical' || opportunity.priority === 'high') {
      const weeklyReminder = {
        id: `opp-${opportunity.id}-weekly`,
        time: '09:00',
        date: opportunity.followUpDate,
        message: `💰 OPPORTUNITY CHECK: ${client.name} - ${opportunity.title}. Don't let this slip away!`,
        enabled: true,
        repeats: 'weekly',
        priority: opportunity.priority,
        opportunityId: opportunity.id
      };
      reminders.push(weeklyReminder);
    }

    reminders.push(followUpReminder);
    setLocalStorage('hustle-reminders', reminders);
  };

  const updateOpportunityStatus = (opportunityId: string, status: Opportunity['status'], note?: string) => {
    const updatedOpportunities = opportunities.map(opp => {
      if (opp.id === opportunityId) {
        const updated = { 
          ...opp, 
          status, 
          lastContact: new Date().toISOString().split('T')[0] 
        };
        if (note) {
          updated.notes = [...opp.notes, `${new Date().toLocaleDateString()}: ${note}`];
        }
        return updated;
      }
      return opp;
    });
    saveOpportunities(updatedOpportunities);
  };

  const getClientOpportunities = (clientId: string) => {
    return opportunities.filter(opp => opp.clientId === clientId);
  };

  const getUrgentOpportunities = () => {
    const today = new Date().toISOString().split('T')[0];
    return opportunities.filter(opp => 
      opp.status === 'new' || opp.status === 'in_progress'
    ).filter(opp => opp.followUpDate <= today || opp.priority === 'critical');
  };

  const getTotalOpportunityValue = () => {
    return opportunities
      .filter(opp => opp.status !== 'missed')
      .reduce((sum, opp) => sum + opp.potentialValue, 0);
  };

  const urgentOpportunities = getUrgentOpportunities();
  const totalValue = getTotalOpportunityValue();

  return (
    <div className="space-y-6">
      {/* Alert Dashboard */}
      <div className="bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/30 rounded-lg p-4">
        <h3 className="text-lg font-bold text-red-400 dark:text-red-600 mb-3">🚨 Opportunity Alerts</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="bg-white dark:bg-gray-800 p-3 rounded border">
            <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400">Urgent Follow-ups</h4>
            <p className="text-2xl font-bold text-red-600 dark:text-red-400">{urgentOpportunities.length}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-3 rounded border">
            <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Opportunity Value</h4>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">${totalValue.toLocaleString()}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-3 rounded border">
            <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Opportunities</h4>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{opportunities.filter(o => o.status !== 'completed' && o.status !== 'missed').length}</p>
          </div>
        </div>
        
        {urgentOpportunities.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-semibold text-red-400 dark:text-red-600">Action Required Today:</h4>
            {urgentOpportunities.slice(0, 3).map(opp => {
              const client = clients.find(c => c.id === opp.clientId);
              return (
                <div key={opp.id} className="bg-red-500/20 border border-red-500/50 rounded p-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h5 className="font-medium">{client?.name} - {opp.title}</h5>
                      <p className="text-sm text-gray-300 dark:text-gray-700">{opp.description}</p>
                      <p className="text-xs text-green-400 dark:text-green-600">Potential: ${opp.potentialValue.toLocaleString()}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => updateOpportunityStatus(opp.id, 'in_progress', 'Contacted client today')}
                        className="px-2 py-1 bg-blue-600 text-white text-xs rounded"
                      >
                        Contacted
                      </button>
                      <button
                        onClick={() => updateOpportunityStatus(opp.id, 'completed', 'Opportunity secured!')}
                        className="px-2 py-1 bg-green-600 text-white text-xs rounded"
                      >
                        Secured
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add New Opportunity */}
      <div className="bg-gray-800/30 dark:bg-white/30 rounded-lg p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Client Opportunities</h3>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-lg"
          >
            {showAddForm ? 'Cancel' : 'Add Opportunity'}
          </button>
        </div>

        {showAddForm && (
          <div className="bg-gray-700/30 dark:bg-gray-200/30 rounded-lg p-4 mb-4">
            <h4 className="font-semibold mb-3">New Opportunity</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <select
                value={selectedClient}
                onChange={(e) => setSelectedClient(e.target.value)}
                className="bg-gray-800 dark:bg-white border border-gray-600 dark:border-gray-300 rounded px-3 py-2 text-white dark:text-gray-800"
              >
                <option value="">Select Client</option>
                {clients.map(client => (
                  <option key={client.id} value={client.id}>{client.name}</option>
                ))}
              </select>
              
              <select
                value={newOpportunity.type}
                onChange={(e) => setNewOpportunity(prev => ({...prev, type: e.target.value as any}))}
                className="bg-gray-800 dark:bg-white border border-gray-600 dark:border-gray-300 rounded px-3 py-2 text-white dark:text-gray-800"
              >
                {Object.entries(OPPORTUNITY_TYPES).map(([key, value]) => (
                  <option key={key} value={key}>{value.label}</option>
                ))}
              </select>
              
              <input
                type="text"
                placeholder="Opportunity title"
                value={newOpportunity.title}
                onChange={(e) => setNewOpportunity(prev => ({...prev, title: e.target.value}))}
                className="bg-gray-800 dark:bg-white border border-gray-600 dark:border-gray-300 rounded px-3 py-2 text-white dark:text-gray-800"
              />
              
              <input
                type="number"
                placeholder="Potential value ($)"
                value={newOpportunity.potentialValue}
                onChange={(e) => setNewOpportunity(prev => ({...prev, potentialValue: e.target.value}))}
                className="bg-gray-800 dark:bg-white border border-gray-600 dark:border-gray-300 rounded px-3 py-2 text-white dark:text-gray-800"
              />
              
              <input
                type="date"
                value={newOpportunity.followUpDate}
                onChange={(e) => setNewOpportunity(prev => ({...prev, followUpDate: e.target.value}))}
                className="bg-gray-800 dark:bg-white border border-gray-600 dark:border-gray-300 rounded px-3 py-2 text-white dark:text-gray-800"
              />
            </div>
            
            <textarea
              placeholder="Opportunity description and details"
              value={newOpportunity.description}
              onChange={(e) => setNewOpportunity(prev => ({...prev, description: e.target.value}))}
              className="w-full mt-3 bg-gray-800 dark:bg-white border border-gray-600 dark:border-gray-300 rounded px-3 py-2 text-white dark:text-gray-800"
              rows={3}
            />
            
            <button
              onClick={addOpportunity}
              disabled={!selectedClient || !newOpportunity.title}
              className="mt-3 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white rounded-lg"
            >
              Create Opportunity & Set Reminders
            </button>
          </div>
        )}

        {/* Opportunities List */}
        <div className="space-y-3">
          {opportunities.map(opp => {
            const client = clients.find(c => c.id === opp.clientId);
            const isUrgent = urgentOpportunities.includes(opp);
            
            return (
              <div key={opp.id} className={`p-4 rounded-lg border ${
                isUrgent ? 'bg-red-500/10 border-red-500/30' : 'bg-gray-700/20 dark:bg-gray-200/20 border-gray-600 dark:border-gray-400'
              }`}>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold">{client?.name} - {opp.title}</h4>
                      <span className={`px-2 py-1 text-xs rounded ${
                        opp.priority === 'critical' ? 'bg-red-500 text-white' :
                        opp.priority === 'high' ? 'bg-orange-500 text-white' :
                        opp.priority === 'medium' ? 'bg-yellow-500 text-black' :
                        'bg-gray-500 text-white'
                      }`}>
                        {opp.priority.toUpperCase()}
                      </span>
                      <span className={`px-2 py-1 text-xs rounded ${
                        opp.status === 'new' ? 'bg-blue-500 text-white' :
                        opp.status === 'in_progress' ? 'bg-yellow-500 text-black' :
                        opp.status === 'completed' ? 'bg-green-500 text-white' :
                        'bg-red-500 text-white'
                      }`}>
                        {opp.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-300 dark:text-gray-700 mb-1">{opp.description}</p>
                    <div className="flex gap-4 text-xs text-gray-400 dark:text-gray-600">
                      <span>Value: ${opp.potentialValue.toLocaleString()}</span>
                      <span>Follow-up: {opp.followUpDate}</span>
                      <span>Last contact: {opp.lastContact}</span>
                    </div>
                    {opp.notes.length > 0 && (
                      <div className="mt-2">
                        <p className="text-xs font-medium">Recent notes:</p>
                        <p className="text-xs text-gray-400 dark:text-gray-600">{opp.notes[opp.notes.length - 1]}</p>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {opp.status !== 'completed' && (
                      <>
                        <button
                          onClick={() => updateOpportunityStatus(opp.id, 'in_progress')}
                          className="px-2 py-1 bg-blue-600 text-white text-xs rounded"
                        >
                          Update
                        </button>
                        <button
                          onClick={() => updateOpportunityStatus(opp.id, 'completed')}
                          className="px-2 py-1 bg-green-600 text-white text-xs rounded"
                        >
                          Complete
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
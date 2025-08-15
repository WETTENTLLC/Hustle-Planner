'use client';

import React, { useState, useEffect } from 'react';
import { getLocalStorage, setLocalStorage } from '@/lib/utils';

interface Client {
  id: string;
  name: string;
  notes: string;
  preferences: string;
  lastVisit: string;
  spendAmount: string;
  totalSpent: number;
  visits: Visit[];
}

interface Visit {
  id: string;
  date: string;
  amount: number;
  notes: string;
}

export default function ClientLoyalty() {
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [newVisit, setNewVisit] = useState({ date: new Date().toISOString().split('T')[0], amount: '', notes: '' });
  const [showAddVisit, setShowAddVisit] = useState(false);

  // Load clients from localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const savedClients = getLocalStorage<any[]>('hustle-clients', []);
    const clientsWithVisits = savedClients.map(client => ({
      ...client,
      totalSpent: client.totalSpent || 0,
      visits: client.visits || []
    }));
    setClients(clientsWithVisits);
  }, []);

  // Save clients when updated
  useEffect(() => {
    if (typeof window === 'undefined') return;
    setLocalStorage('hustle-clients', clients);
  }, [clients]);


  // Add visit to client
  const handleAddVisit = () => {
    if (!selectedClientId || !newVisit.amount) return;
    
    const visit: Visit = {
      id: Date.now().toString(),
      date: newVisit.date,
      amount: parseFloat(newVisit.amount),
      notes: newVisit.notes
    };
    
    setClients(prev => prev.map(client => {
      if (client.id === selectedClientId) {
        const updatedVisits = [...(client.visits || []), visit];
        const totalSpent = updatedVisits.reduce((sum, v) => sum + v.amount, 0);
        return { ...client, visits: updatedVisits, totalSpent, lastVisit: newVisit.date };
      }
      return client;
    }));
    
    setNewVisit({ date: new Date().toISOString().split('T')[0], amount: '', notes: '' });
    setShowAddVisit(false);
  };

  // Sort clients by totalSpent descending
  const sortedClients = [...clients].sort((a, b) => (b.totalSpent || 0) - (a.totalSpent || 0));

  const selectedClient = clients.find(c => c.id === selectedClientId);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-4">Client Loyalty & Prioritization</h2>
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Client List */}
        <div className="lg:w-1/3 bg-gray-800/30 dark:bg-white/30 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-3">Clients by Spending</h3>
          {clients.length === 0 ? (
            <p className="text-gray-400 dark:text-gray-600 text-sm">No clients added yet. Add clients in the Client Manager tab first.</p>
          ) : (
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {sortedClients.map(client => (
                <div
                  key={client.id}
                  className={`cursor-pointer p-3 rounded-lg transition-colors ${
                    client.id === selectedClientId 
                      ? 'bg-pink-500/30 border border-pink-400' 
                      : 'bg-gray-700/50 dark:bg-gray-200/50 hover:bg-gray-600/50 dark:hover:bg-gray-300/50'
                  }`}
                  onClick={() => setSelectedClientId(client.id)}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{client.name}</span>
                    <span className="text-sm font-bold text-green-400 dark:text-green-600">
                      ${(client.totalSpent || 0).toFixed(0)}
                    </span>
                  </div>
                  <div className="text-xs text-gray-400 dark:text-gray-600 mt-1">
                    {client.visits?.length || 0} visits
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Client Details and Visit Tracking */}
        <div className="lg:w-2/3 bg-gray-800/30 dark:bg-white/30 rounded-lg p-4">
          {selectedClient ? (
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold">{selectedClient.name}</h3>
                  <p className="text-2xl font-bold text-green-400 dark:text-green-600">
                    ${(selectedClient.totalSpent || 0).toFixed(0)} total spent
                  </p>
                </div>
                <button
                  onClick={() => setShowAddVisit(!showAddVisit)}
                  className="px-3 py-1 bg-pink-500 hover:bg-pink-600 text-white text-sm rounded-lg"
                >
                  {showAddVisit ? 'Cancel' : 'Add Visit'}
                </button>
              </div>

              {/* Add Visit Form */}
              {showAddVisit && (
                <div className="bg-gray-700/30 dark:bg-gray-200/30 rounded-lg p-4">
                  <h4 className="font-semibold mb-3">Record New Visit</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <input
                      type="date"
                      value={newVisit.date}
                      onChange={(e) => setNewVisit(prev => ({...prev, date: e.target.value}))}
                      className="bg-gray-800 dark:bg-white border border-gray-600 dark:border-gray-300 rounded px-3 py-2 text-white dark:text-gray-800"
                    />
                    <input
                      type="number"
                      placeholder="Amount spent"
                      value={newVisit.amount}
                      onChange={(e) => setNewVisit(prev => ({...prev, amount: e.target.value}))}
                      className="bg-gray-800 dark:bg-white border border-gray-600 dark:border-gray-300 rounded px-3 py-2 text-white dark:text-gray-800"
                    />
                    <input
                      type="text"
                      placeholder="Notes (optional)"
                      value={newVisit.notes}
                      onChange={(e) => setNewVisit(prev => ({...prev, notes: e.target.value}))}
                      className="bg-gray-800 dark:bg-white border border-gray-600 dark:border-gray-300 rounded px-3 py-2 text-white dark:text-gray-800"
                    />
                  </div>
                  <button
                    onClick={handleAddVisit}
                    disabled={!newVisit.amount}
                    className="mt-3 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white rounded-lg"
                  >
                    Save Visit
                  </button>
                </div>
              )}

              {/* Visit History */}
              <div>
                <h4 className="font-semibold mb-2">Visit History ({selectedClient.visits?.length || 0})</h4>
                {selectedClient.visits?.length > 0 ? (
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {selectedClient.visits.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(visit => (
                      <div key={visit.id} className="flex justify-between items-center bg-gray-700/20 dark:bg-gray-200/20 rounded p-2">
                        <div>
                          <span className="text-sm font-medium">{visit.date}</span>
                          {visit.notes && <p className="text-xs text-gray-400 dark:text-gray-600">{visit.notes}</p>}
                        </div>
                        <span className="font-bold text-green-400 dark:text-green-600">${visit.amount}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-400 dark:text-gray-600">No visits recorded yet</p>
                )}
              </div>

              {/* Expert Advice */}
              <div className="bg-pink-500/10 border border-pink-500/30 rounded-lg p-3">
                <h4 className="font-semibold mb-2 text-pink-400 dark:text-pink-600">Expert Advice</h4>
                {(selectedClient.totalSpent || 0) > 500 ? (
                  <ul className="text-sm space-y-1 list-disc list-inside">
                    <li>High-value client! Maintain with VIP treatment and exclusive perks</li>
                    <li>Send personalized messages and remember their preferences</li>
                    <li>Offer early access to special events or new services</li>
                  </ul>
                ) : (
                  <ul className="text-sm space-y-1 list-disc list-inside">
                    <li>Focus on building trust and rapport for repeat visits</li>
                    <li>Offer loyalty incentives and surprise bonuses</li>
                    <li>Remember personal details to create connection</li>
                  </ul>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-gray-400 dark:text-gray-600">Select a client to view details and track visits</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

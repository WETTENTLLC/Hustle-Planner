'use client';

import { useState, useEffect } from 'react';
import { getLocalStorage, setLocalStorage } from '@/lib/utils';

interface Client {
  id: string;
  name: string;
  notes: string;
  preferences: string;
  lastVisit: string;
  spendAmount: string;
  totalSpent?: number;
  visits?: Visit[];
}

interface Visit {
  id: string;
  date: string;
  amount: number;
  notes: string;
}

export default function ClientManager() {
  const [clients, setClients] = useState<Client[]>([]);
  const [newClient, setNewClient] = useState<Omit<Client, 'id'>>({
    name: '',
    notes: '',
    preferences: '',
    lastVisit: '',
    spendAmount: ''
  });
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Load saved clients on component mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const savedClients = getLocalStorage<Client[]>('hustle-clients', []);
    setClients(savedClients);
  }, []);

  // Save clients to localStorage when updated
  useEffect(() => {
    if (typeof window === 'undefined') return;
    setLocalStorage('hustle-clients', clients);
  }, [clients]);

  // Handle adding a new client
  const handleAddClient = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newClient.name) {
      alert('Client name is required');
      return;
    }
    
    const clientToAdd: Client = {
      ...newClient,
      id: Date.now().toString(),
      totalSpent: 0,
      visits: []
    };
    
    setClients([...clients, clientToAdd]);
    setNewClient({
      name: '',
      notes: '',
      preferences: '',
      lastVisit: '',
      spendAmount: ''
    });
    setIsFormOpen(false);
  };

  // Handle updating an existing client
  const handleUpdateClient = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingClient || !editingClient.name) {
      alert('Client name is required');
      return;
    }
    
    setClients(clients.map(client => 
      client.id === editingClient.id ? editingClient : client
    ));
    
    setEditingClient(null);
  };

  // Handle deleting a client
  const handleDeleteClient = (id: string) => {
    if (confirm('Are you sure you want to delete this client?')) {
      setClients(clients.filter(client => client.id !== id));
    }
  };

  // Start editing a client
  const startEditClient = (client: Client) => {
    setEditingClient(client);
    setIsFormOpen(true);
  };

  // Filter clients by search term
  const filteredClients = clients.filter(client => 
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.notes.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.preferences.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      {/* Header and Add Client Button */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Client Manager</h2>
        <button
          onClick={() => {
            setIsFormOpen(!isFormOpen);
            setEditingClient(null);
          }}
          className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-medium rounded-lg shadow-md"
        >
          {isFormOpen ? 'Cancel' : 'Add New Client'}
        </button>
      </div>
      
      {/* Search Input */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search clients..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-gray-800/50 border border-gray-700 dark:bg-white/50 dark:border-gray-300 rounded-lg px-3 py-2 text-white dark:text-gray-800"
        />
      </div>

      {/* Client Form (Add/Edit) */}
      {isFormOpen && (
        <form 
          onSubmit={editingClient ? handleUpdateClient : handleAddClient}
          className="bg-gray-800/30 dark:bg-white/30 rounded-lg p-4 mb-6"
        >
          <h3 className="text-lg font-semibold mb-4">
            {editingClient ? 'Edit Client' : 'Add New Client'}
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 dark:text-gray-700 mb-1">
                Name *
              </label>
              <input
                type="text"
                value={editingClient ? editingClient.name : newClient.name}
                onChange={(e) => 
                  editingClient 
                    ? setEditingClient({...editingClient, name: e.target.value})
                    : setNewClient({...newClient, name: e.target.value})
                }
                required
                className="w-full bg-gray-800/50 border border-gray-700 dark:bg-white/50 dark:border-gray-300 rounded-lg px-3 py-2 text-white dark:text-gray-800"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 dark:text-gray-700 mb-1">
                Preferences
              </label>
              <textarea
                value={editingClient ? editingClient.preferences : newClient.preferences}
                onChange={(e) => 
                  editingClient 
                    ? setEditingClient({...editingClient, preferences: e.target.value})
                    : setNewClient({...newClient, preferences: e.target.value})
                }
                className="w-full bg-gray-800/50 border border-gray-700 dark:bg-white/50 dark:border-gray-300 rounded-lg px-3 py-2 text-white dark:text-gray-800"
                rows={2}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 dark:text-gray-700 mb-1">
                Last Visit
              </label>
              <input
                type="text"
                value={editingClient ? editingClient.lastVisit : newClient.lastVisit}
                onChange={(e) => 
                  editingClient 
                    ? setEditingClient({...editingClient, lastVisit: e.target.value})
                    : setNewClient({...newClient, lastVisit: e.target.value})
                }
                placeholder="e.g., 04/15/2025"
                className="w-full bg-gray-800/50 border border-gray-700 dark:bg-white/50 dark:border-gray-300 rounded-lg px-3 py-2 text-white dark:text-gray-800"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 dark:text-gray-700 mb-1">
                Typical Spend
              </label>
              <input
                type="text"
                value={editingClient ? editingClient.spendAmount : newClient.spendAmount}
                onChange={(e) => 
                  editingClient 
                    ? setEditingClient({...editingClient, spendAmount: e.target.value})
                    : setNewClient({...newClient, spendAmount: e.target.value})
                }
                placeholder="e.g., $300-500"
                className="w-full bg-gray-800/50 border border-gray-700 dark:bg-white/50 dark:border-gray-300 rounded-lg px-3 py-2 text-white dark:text-gray-800"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 dark:text-gray-700 mb-1">
                Notes
              </label>
              <textarea
                value={editingClient ? editingClient.notes : newClient.notes}
                onChange={(e) => 
                  editingClient 
                    ? setEditingClient({...editingClient, notes: e.target.value})
                    : setNewClient({...newClient, notes: e.target.value})
                }
                className="w-full bg-gray-800/50 border border-gray-700 dark:bg-white/50 dark:border-gray-300 rounded-lg px-3 py-2 text-white dark:text-gray-800"
                rows={3}
              />
            </div>
          </div>
          
          <div className="mt-6">
            <button
              type="submit"
              className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-medium rounded-lg shadow-md"
            >
              {editingClient ? 'Update Client' : 'Save Client'}
            </button>
          </div>
        </form>
      )}

      {/* Client List */}
      <div className="space-y-4">
        {filteredClients.length > 0 ? (
          filteredClients.map(client => (
            <div key={client.id} className="bg-gray-800/20 dark:bg-white/20 rounded-lg p-4">
              <div className="flex justify-between items-start">
                <h4 className="font-medium text-lg">{client.name}</h4>
                <div className="flex space-x-2">
                  <button
                    onClick={() => startEditClient(client)}
                    className="text-xs px-2 py-1 bg-blue-600/80 hover:bg-blue-700 text-white rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteClient(client.id)}
                    className="text-xs px-2 py-1 bg-red-600/80 hover:bg-red-700 text-white rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
              
              {client.preferences && (
                <p className="text-sm text-gray-300 dark:text-gray-700 mt-2">
                  <span className="font-medium">Preferences:</span> {client.preferences}
                </p>
              )}
              
              <div className="flex flex-wrap gap-x-6 gap-y-1 mt-2">
                {client.lastVisit && (
                  <p className="text-sm text-gray-400 dark:text-gray-600">
                    <span className="font-medium">Last visit:</span> {client.lastVisit}
                  </p>
                )}
                
                {client.spendAmount && (
                  <p className="text-sm text-gray-400 dark:text-gray-600">
                    <span className="font-medium">Typical spend:</span> {client.spendAmount}
                  </p>
                )}
              </div>
              
              {client.notes && (
                <p className="text-sm text-gray-300 dark:text-gray-700 mt-2 border-t border-gray-700/50 dark:border-gray-300/50 pt-2">
                  {client.notes}
                </p>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-10">
            <p className="text-gray-500 dark:text-gray-500">
              {clients.length === 0
                ? "No clients added yet"
                : "No clients match your search"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
'use client';

import React, { useState } from 'react';

interface Client {
  id: number;
  name: string;
  totalSpent: number;
  notes: string;
}

const initialClients: Client[] = [
  { id: 1, name: 'Alice Johnson', totalSpent: 1200, notes: 'Prefers VIP rooms, likes surprise perks' },
  { id: 2, name: 'Bob Smith', totalSpent: 450, notes: 'Occasional visitor, responds well to discounts' },
  { id: 3, name: 'Charlie Davis', totalSpent: 800, notes: 'Loyal client, enjoys personalized experiences' },
  { id: 4, name: 'Diana Prince', totalSpent: 300, notes: 'New client, needs engagement to increase spending' },
];

export default function ClientLoyalty() {
  const [clients] = useState<Client[]>(initialClients);
  const [selectedClientId, setSelectedClientId] = useState<number | null>(null);

  // Sort clients by totalSpent descending
  const sortedClients = [...clients].sort((a, b) => b.totalSpent - a.totalSpent);

  const selectedClient = clients.find(c => c.id === selectedClientId);

  return (
    <div className="p-6 bg-gray-900 text-white rounded-lg max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Client Loyalty & Prioritization</h2>
      <div className="flex flex-col md:flex-row gap-6">
        {/* Client List */}
        <div className="md:w-1/3 bg-gray-800 rounded p-4 overflow-y-auto max-h-[400px]">
          <h3 className="text-xl font-semibold mb-2">Clients (Biggest to Smallest Spenders)</h3>
          <ul>
            {sortedClients.map(client => (
              <li
                key={client.id}
                className={`cursor-pointer p-2 rounded mb-1 ${
                  client.id === selectedClientId ? 'bg-pink-600' : 'hover:bg-pink-700'
                }`}
                onClick={() => setSelectedClientId(client.id)}
              >
                <div className="flex justify-between">
                  <span>{client.name}</span>
                  <span>${client.totalSpent.toFixed(2)}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Client Details and Advice */}
        <div className="md:w-2/3 bg-gray-800 rounded p-4">
          {selectedClient ? (
            <>
              <h3 className="text-xl font-semibold mb-2">{selectedClient.name}</h3>
              <p className="mb-4"><strong>Total Spent:</strong> ${selectedClient.totalSpent.toFixed(2)}</p>
              <div className="mb-4">
                <h4 className="font-semibold mb-1">Notes</h4>
                <p>{selectedClient.notes}</p>
              </div>
              <div className="mb-4">
                <h4 className="font-semibold mb-1">Expert Advice</h4>
                {selectedClient.totalSpent > 700 ? (
                  <ul className="list-disc list-inside">
                    <li>Keep engaging with personalized experiences and VIP perks.</li>
                    <li>Offer exclusive events and early access to promotions.</li>
                    <li>Maintain regular communication and appreciation gestures.</li>
                  </ul>
                ) : (
                  <ul className="list-disc list-inside">
                    <li>Encourage more frequent visits with targeted discounts.</li>
                    <li>Introduce loyalty programs and surprise bonuses.</li>
                    <li>Build rapport through personalized attention and follow-ups.</li>
                  </ul>
                )}
              </div>
              <div>
                <h4 className="font-semibold mb-1">Strategies to Increase Spending</h4>
                <p>
                  For smaller clients, focus on building trust and offering value through loyalty rewards and personalized offers.
                  For big spenders, maintain exclusivity and provide VIP experiences to keep them engaged and spending.
                </p>
              </div>
            </>
          ) : (
            <p>Select a client to view details and advice.</p>
          )}
        </div>
      </div>
    </div>
  );
}

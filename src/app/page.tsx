'use client';

import { useState } from 'react';
import PlannerForm from '@/components/PlannerForm';
import ReminderForm from '@/components/ReminderForm';
import TipsAccordion from '@/components/TipsAccordion';
import ClientManager from '@/components/ClientManager';
import ClientLoyalty from '@/components/ClientLoyalty';
import HabitTracker from '@/components/HabitTracker';
import ExpensesEarnings from '@/components/ExpensesEarnings';
import HowToUse from '@/components/HowToUse';
import ClientOpportunities from '@/components/ClientOpportunities';
import SmartInsights from '@/components/SmartInsights';
import FAQSection from '@/components/FAQSection';
import Navigation from '@/components/Navigation';
import ThemeToggle from '@/components/ThemeToggle';
import Footer from '@/components/Footer';
import PrivacyNotice from '@/components/PrivacyNotice';
import { useTheme } from '@/components/ThemeProvider';

export default function Home() {
  const [activeTab, setActiveTab] = useState<string>('planner');
  const { theme } = useTheme();
  
  return (
    <main className={`min-h-screen transition-colors duration-300 ${theme === 'dark' ? 'bg-gradient-to-br from-purple-900 to-black text-white' : 'bg-gradient-to-br from-pink-100 to-white text-gray-800'}`}>
      {/* App Header */}
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <h1 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">
          Secure the Bag
        </h1>
        <div className="flex items-center space-x-4">
          <ThemeToggle />
        </div>
      </header>
      
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-8 md:py-12 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">
          Hustle Smarter, Not Harder
        </h1>
        <h2 className="text-xl md:text-2xl font-bold mb-6">
          Privacy-first planning for dancers who do more than dance
        </h2>
        <p className="text-lg opacity-90 max-w-2xl mx-auto">
          No login. No cloud. All data stays on your device.
          Your hustle stays yours.
        </p>
      </section>

      {/* Navigation Tabs */}
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content */}
      <div className="container mx-auto px-4 pb-16">
        {/* Content Sections - Only one will be visible at a time */}
        <div className="bg-gray-900/60 backdrop-blur-sm rounded-xl p-6 shadow-xl dark:bg-white/90">
          {activeTab === 'planner' && (
            <>
              <h2 className="text-2xl font-bold mb-6 text-pink-400 dark:text-pink-600">Weekly Hustle Planner</h2>
              <PlannerForm />
            </>
          )}
          
          {activeTab === 'reminders' && (
            <>
              <h2 className="text-2xl font-bold mb-6 text-pink-400 dark:text-pink-600">Set Hustle Reminders</h2>
              <ReminderForm />
            </>
          )}
          
          {activeTab === 'clients' && (
            <>
              <h2 className="text-2xl font-bold mb-6 text-pink-400 dark:text-pink-600">Client Manager</h2>
              <ClientManager />
            </>
          )}
          
          {activeTab === 'client-loyalty' && (
            <>
              <h2 className="text-2xl font-bold mb-6 text-pink-400 dark:text-pink-600">Client Loyalty & Prioritization</h2>
              <ClientLoyalty />
            </>
          )}

          {activeTab === 'habits' && (
            <>
              <h2 className="text-2xl font-bold mb-6 text-pink-400 dark:text-pink-600">Habit Tracker</h2>
              <HabitTracker />
            </>
          )}
          
          {activeTab === 'tips' && (
            <>
              <h2 className="text-2xl font-bold mb-6 text-pink-400 dark:text-pink-600">Hustle Tips & Tricks</h2>
              <TipsAccordion />
            </>
          )}
          
          {activeTab === 'expenses' && (
            <ExpensesEarnings />
          )}
          
          {activeTab === 'opportunities' && (
            <>
              <h2 className="text-2xl font-bold mb-6 text-pink-400 dark:text-pink-600">Client Opportunities & Action Plans</h2>
              <ClientOpportunities />
            </>
          )}
          
          {activeTab === 'insights' && (
            <>
              <h2 className="text-2xl font-bold mb-6 text-pink-400 dark:text-pink-600">Smart Insights & Analytics</h2>
              <SmartInsights />
            </>
          )}
          
          {activeTab === 'how-to-use' && (
            <>
              <h2 className="text-2xl font-bold mb-6 text-pink-400 dark:text-pink-600">How to Use Your Hustle Planner</h2>
              <HowToUse />
            </>
          )}
          
          {activeTab === 'faq' && (
            <>
              <h2 className="text-2xl font-bold mb-6 text-pink-400 dark:text-pink-600">Frequently Asked Questions</h2>
              <FAQSection />
            </>
          )}
        </div>
      </div>

      {/* Footer */}
      <Footer />
      
      {/* Privacy Notice */}
      <PrivacyNotice />
    </main>
  );
}

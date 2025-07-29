'use client';

import { useState } from 'react';

interface FAQ {
  question: string;
  answer: string;
}

const faqs: FAQ[] = [
  {
    question: "Is my data secure? Who can see my information?",
    answer: "Your privacy is our top priority. All data is stored locally on your device using browser storage. Nothing is transmitted to any servers—there are no accounts, no logins, and no data collection. Only you can see your information."
  },
  {
    question: "Can I use this planner on multiple devices?",
    answer: "Currently, data doesn't sync between devices since everything is stored locally for privacy. We recommend using the planner on your primary device. We're exploring options for secure, encrypted cross-device syncing in the future."
  },
  {
    question: "Will I lose my data if I clear my browser history/cache?",
    answer: "Yes, clearing browser storage or cache will remove your planner data. Consider using the export function to periodically save your data as a backup. You can then import this data back if needed."
  },
  {
    question: "How do reminders work if there's no cloud service?",
    answer: "Reminders use your browser's built-in notification system. They'll work even when the tab isn't active, but the browser needs to be running. For important reminders, we recommend also setting a backup in your phone's alarm app."
  },
  {
    question: "Is this app free to use? Are there premium features?",
    answer: "Secure the Bag is completely free with no premium tier or subscription. We believe in providing privacy-focused tools for the dancer community without financial barriers. If you find it useful, consider sharing it with others."
  },
  {
    question: "Can I suggest new features or improvements?",
    answer: "Absolutely! We built this tool based on real dancer needs and welcome your feedback. Use the contact link in the footer to send us feature requests or improvement suggestions. We're continuously enhancing the planner."
  },
  {
    question: "How can I delete all my data if I want to start over?",
    answer: "Go to each section and use the delete/clear functions provided. Alternatively, you can completely reset by clearing your browser's local storage for this site (this will remove ALL data, so export anything you want to keep first)."
  },
  {
    question: "Is this app designed specifically for exotic dancers?",
    answer: "Yes, Secure the Bag was designed with the specific needs of exotic dancers in mind. However, many features are useful for other night workers, performers, or anyone with irregular income patterns who values privacy."
  },
  {
    question: "Why don't you have a mobile app in the app stores?",
    answer: "Our web app approach allows anyone to access the planner without downloading anything or creating accounts. It also avoids app store restrictions on adult industry-adjacent tools. For a mobile experience, you can add this site to your home screen."
  },
  {
    question: "The reminders aren't working for me. What should I do?",
    answer: "First, ensure you've granted notification permissions. On mobile, notifications can be less reliable due to system restrictions. Make sure the browser remains running in the background. For critical reminders, we recommend setting backup alarms."
  }
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };
  
  // Filter FAQs based on search query
  const filteredFAQs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="relative mb-6">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search questions..."
          className="w-full bg-gray-800 dark:bg-white border border-gray-700 dark:border-gray-300 rounded-lg pl-10 pr-4 py-2 text-white dark:text-gray-800"
          aria-label="Search FAQs"
        />
        <svg
          className="absolute left-3 top-2.5 h-5 w-5 text-gray-400 dark:text-gray-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
      
      {/* FAQ Accordion */}
      {filteredFAQs.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-400 dark:text-gray-500">No FAQs matching your search</p>
          <button 
            onClick={() => setSearchQuery('')}
            className="mt-3 text-pink-400 dark:text-pink-600 hover:underline"
          >
            Clear search
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredFAQs.map((faq, index) => (
            <div 
              key={index} 
              className="border border-gray-700 dark:border-gray-300 rounded-lg overflow-hidden"
            >
              <button
                onClick={() => handleToggle(index)}
                className={`w-full px-4 py-3 flex items-center justify-between text-left font-medium transition-colors
                  ${openIndex === index 
                    ? 'bg-pink-500/20 text-pink-300 dark:bg-pink-100 dark:text-pink-800' 
                    : 'bg-gray-800 hover:bg-gray-700 text-white dark:bg-gray-100 dark:hover:bg-gray-200 dark:text-gray-800'}`}
                aria-expanded={openIndex === index}
                aria-controls={`panel-${index}`}
              >
                <span className={searchQuery ? highlightMatches(faq.question, searchQuery) : faq.question} />
                <svg 
                  className={`w-5 h-5 transition-transform duration-200 ${openIndex === index ? 'transform rotate-180' : ''}`}
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {openIndex === index && (
                <div 
                  id={`panel-${index}`} 
                  className="px-4 py-3 bg-gray-900/40 dark:bg-gray-50"
                >
                  <p 
                    className="text-gray-200 dark:text-gray-700"
                    dangerouslySetInnerHTML={
                      searchQuery 
                        ? { __html: highlightMatches(faq.answer, searchQuery) } 
                        : { __html: faq.answer }
                    }
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      
      {/* Ask a question */}
      <div className="mt-10 p-6 bg-gray-800/60 dark:bg-gray-100/60 rounded-lg">
        <h3 className="text-lg font-semibold mb-3 text-white dark:text-gray-800">Didn't find an answer?</h3>
        <p className="text-gray-300 dark:text-gray-700 mb-4">
          Have a question that's not covered here? Send us a message and we'll get back to you.
        </p>
        <div className="space-y-3">
          <div>
            <input
              type="email"
              placeholder="Your email (optional)"
              className="w-full bg-gray-700 dark:bg-white border border-gray-600 dark:border-gray-300 rounded px-3 py-2 text-white dark:text-gray-800"
              aria-label="Your email address"
            />
          </div>
          <div>
            <textarea
              placeholder="Your question"
              rows={3}
              className="w-full bg-gray-700 dark:bg-white border border-gray-600 dark:border-gray-300 rounded px-3 py-2 text-white dark:text-gray-800"
              aria-label="Your question"
            ></textarea>
          </div>
          <div className="text-right">
            <button 
              className="px-4 py-2 bg-pink-500 hover:bg-pink-600 dark:bg-pink-600 dark:hover:bg-pink-700 text-white rounded transition-colors"
              aria-label="Submit your question"
            >
              Submit Question
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2 italic">
            We respect your privacy. Email is optional and only used to respond to your question.
          </p>
        </div>
      </div>
    </div>
  );
}

// Helper function to highlight search matches
function highlightMatches(text: string, query: string): string {
  if (!query.trim()) return text;
  
  const regex = new RegExp(`(${escapeRegExp(query)})`, 'gi');
  return text.replace(
    regex, 
    '<mark class="bg-pink-500/30 text-white dark:bg-pink-200 dark:text-pink-900 px-1 rounded">$1</mark>'
  );
}

// Helper to escape special regex characters
function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
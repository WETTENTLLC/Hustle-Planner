'use client';

import { useState } from 'react';

interface TipCategory {
  id: string;
  title: string;
  tips: string[];
}

const HUSTLE_TIPS: TipCategory[] = [
  {
    id: 'profits',
    title: 'Maximizing Club Profits',
    tips: [
      'Focus on early-evening clients to free up time for VIPs later',
      'Set a minimum dance goal per half hour (e.g., 5+)',
      'Promote VIP rooms after midnight when clients are looser with cash',
      "Don't chase whales—diversify your income streams nightly",
      "If stage sets aren't required, prioritize 1:1 hustling",
      'Stage presence is good branding—but floor dances = steady cash',
      'Track which shifts/days consistently earn more and adjust your schedule',
      'Develop relationships with staff for prime sections/tables'
    ]
  },
  {
    id: 'loyalty',
    title: 'Building Client Loyalty',
    tips: [
      'Remember names, preferences, and give small surprises',
      'Create a feeling of personal attention—this is a service industry',
      'Authentic conversation = more tips and repeat visits',
      'Ask questions, follow up, and act on feedback',
      'Name drinks or packages after regulars',
      'Offer surprise loyalty perks (bonus dance, personalized gifts)',
      'Create "experiences" not just dances—make them feel special',
      'Balance authenticity with boundaries—never share personal contact info'
    ]
  },
  {
    id: 'marketing',
    title: 'Marketing & Branding',
    tips: [
      'Use quick, sexy promo content (IG reels, flyers, TikTok)',
      'Keep socials clean, professional, and safe',
      'Reward social media engagement with shoutouts or upgrades',
      'Develop a consistent aesthetic that stands out',
      "Create a stage name that's memorable and fits your persona",
      'Build your online presence carefully—protect your privacy',
      'Consider themed nights or special performances to attract attention',
      'Collaborate with other dancers for cross-promotion'
    ]
  },
  {
    id: 'stage',
    title: 'Stage Presence',
    tips: [
      'Big, slow, fluid movements = sensual and less tiring',
      'Practice at home in your shoes on hard flooring',
      'Smile, make eye contact, use mirrors to boost stage presence',
      'Hydrate and strengthen your body—pole tricks need control, not just flair',
      'Create signature moves that become your trademark',
      'Match your energy to the music—slow songs need different movement',
      "Use the entire stage—don't get stuck in one spot",
      'End with a memorable finale to encourage tips'
    ]
  },
  {
    id: 'professional',
    title: 'Professional Mindset',
    tips: [
      'Avoid club gossip and stay in your financial lane',
      'Set nightly income targets and track them',
      'Stay positive, organized, and adaptable',
      'Treat dancing as a business with you as the CEO',
      'Budget for slow nights/seasons—income is never guaranteed',
      'Invest in your skills through classes and coaching',
      'Learn to handle rejection gracefully—not everyone will tip',
      'Create a long-term career plan with milestones'
    ]
  },
  {
    id: 'repeat',
    title: 'Rewarding Repeat Clients',
    tips: [
      'Create a VIP experience that feels exclusive',
      'Know when their birthdays are and make them feel special',
      'Consider private events or custom content for top spenders',
      'Build genuine connections while maintaining boundaries',
      'Recognize and appreciate their loyalty without being fake',
      'Document preferences, conversations, and spending habits',
      'Develop a tiered reward system based on visit frequency',
      'Give them "inside" information that makes them feel important'
    ]
  },
  {
    id: 'patterns',
    title: 'Club Patterns & Timing',
    tips: [
      'Learn peak hours for your specific club and maximize those times',
      'Identify seasonal patterns (tax refund season, holiday bonuses, etc.)',
      'Pay attention to local events that bring in different clientele',
      'Understand the psychological timing of client spending throughout the night',
      'Map out the club layout and identify high-traffic/high-tip areas',
      'Know when to take breaks and when to be on the floor hustling',
      'Recognize when regulars typically visit and be present then',
      'Adjust your approach based on crowd demographics each night'
    ]
  },
  {
    id: 'health',
    title: 'Health & Sustainability',
    tips: [
      'Develop a recovery routine for post-shift muscle care',
      'Schedule regular days off to prevent burnout',
      'Limit alcohol/substance use that affects long-term performance',
      'Invest in proper shoes and outfits that minimize physical strain',
      'Create boundaries between work and personal life',
      'Save and invest money—dancing careers have limited timespans',
      'Prioritize mental health and have support systems outside the club',
      'Cross-train with complementary exercise (yoga, strength training, etc.)'
    ]
  }
];

export default function TipsAccordion() {
  const [openCategory, setOpenCategory] = useState<string | null>('profits');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  const toggleCategory = (categoryId: string) => {
    setOpenCategory(currentOpen => 
      currentOpen === categoryId ? null : categoryId
    );
  };
  
  // Filter categories and tips based on search query
  const filteredTips = searchQuery
    ? HUSTLE_TIPS.map(category => ({
        ...category,
        tips: category.tips.filter(tip =>
          tip.toLowerCase().includes(searchQuery.toLowerCase())
        ),
      })).filter(category => category.tips.length > 0)
    : HUSTLE_TIPS;
  
  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for specific advice..."
            className="w-full bg-gray-800 dark:bg-white border border-gray-700 dark:border-gray-300 rounded-lg pl-10 pr-4 py-2 text-white dark:text-gray-800"
            aria-label="Search tips"
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
      </div>
      
      {/* Tips Categories */}
      {filteredTips.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-400 dark:text-gray-500">No tips matching your search</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredTips.map(category => (
            <div key={category.id} className="border border-gray-700 dark:border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={() => toggleCategory(category.id)}
                className={`w-full px-4 py-3 flex items-center justify-between text-left font-medium
                  ${openCategory === category.id 
                    ? 'bg-pink-500/20 text-pink-300 dark:bg-pink-100 dark:text-pink-800' 
                    : 'bg-gray-800/60 hover:bg-gray-800 text-white dark:bg-gray-100/60 dark:hover:bg-gray-200 dark:text-gray-800'}`}
                aria-expanded={openCategory === category.id}
                aria-controls={`panel-${category.id}`}
              >
                <span>{category.title}</span>
                <svg 
                  className={`w-5 h-5 transition-transform duration-200 ${openCategory === category.id ? 'transform rotate-180' : ''}`} 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {openCategory === category.id && (
                <div 
                  id={`panel-${category.id}`} 
                  className="px-4 py-3 bg-gray-900/40 dark:bg-gray-50"
                >
                  <ul className="space-y-2 list-disc pl-5">
                    {category.tips.map((tip, index) => (
                      <li 
                        key={index} 
                        className="text-gray-200 dark:text-gray-700"
                        // Highlight matches if searching
                        dangerouslySetInnerHTML={
                          searchQuery 
                            ? { 
                                __html: tip.replace(
                                  new RegExp(searchQuery, 'gi'),
                                  match => `<mark class="bg-pink-500/30 text-white dark:bg-pink-200 dark:text-pink-900 px-1 rounded">${match}</mark>`
                                ) 
                              }
                            : { __html: tip }
                        }
                      />
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      
      {/* Tip Submission */}
      <div className="mt-8 pt-6 border-t border-gray-700 dark:border-gray-300">
        <h3 className="text-lg font-semibold mb-2">Share Your Own Hustle Tips</h3>
        <p className="text-gray-400 dark:text-gray-600 text-sm mb-3">
          Got strategies that work for you? Help the community by sharing your knowledge!
        </p>
        <div className="flex flex-col md:flex-row gap-2">
          <textarea
            className="flex-grow bg-gray-800 dark:bg-white border border-gray-700 dark:border-gray-300 rounded px-3 py-2 text-white dark:text-gray-800"
            placeholder="Share your hustling advice here..."
            rows={2}
            aria-label="Your tip suggestion"
          />
          <button
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 dark:bg-gray-200 dark:hover:bg-gray-300 dark:text-gray-800 text-white font-medium rounded"
            aria-label="Submit your tip"
          >
            Submit Tip
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2 italic">
          All submissions are reviewed before being added to help maintain quality advice.
        </p>
      </div>
    </div>
  );
}

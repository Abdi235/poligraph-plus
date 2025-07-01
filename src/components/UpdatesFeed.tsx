// src/components/UpdatesFeed.tsx
import React from 'react';

interface UpdateItem {
  id: string;
  text: string;
  timestamp: string;
  tag?: string; // Optional tag
}

const UpdatesFeed = () => {
  const updates: UpdateItem[] = [
    { id: '1', text: 'System maintenance is scheduled for tonight at 2 AM PST. Expect brief downtime.', timestamp: '2024-07-28 10:00 AM', tag: 'System' },
    { id: '2', text: 'Exciting new feature: Dark mode is now available! You can enable it in your account settings.', timestamp: '2024-07-27 03:30 PM', tag: 'Feature' },
    { id: '3', text: 'Welcome to the revamped PoliGraph+ dashboard! We hope you enjoy the new look and feel.', timestamp: '2024-07-26 09:00 AM', tag: 'General' },
    { id: '4', text: 'Reminder: Our weekly sports trivia night is happening this Friday at 7 PM EST. Join us for fun and prizes!', timestamp: '2024-07-25 01:15 PM', tag: 'Event' },
    { id: '5', text: 'We\'ve updated our privacy policy. Please review the changes at your earliest convenience.', timestamp: '2024-07-24 11:00 AM', tag: 'Important' },
    { id: '6', text: 'Performance improvements deployed for faster live score updates. Experience the speed!', timestamp: '2024-07-23 05:00 PM', tag: 'System' },
  ];

  return (
    <div className="p-4 bg-white shadow-lg rounded-xl h-full flex flex-col">
      <h2 className="text-2xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">Latest Updates</h2>
      <ul className="space-y-3 overflow-y-auto flex-grow pr-1"> {/* Added pr-1 for scrollbar spacing if needed */}
        {updates.map(update => (
          <li key={update.id} className="p-3.5 bg-slate-50 rounded-lg hover:shadow-md transition-shadow duration-200 border border-slate-200">
            {update.tag && (
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full mb-1.5 inline-block ${ // mb-1.5 for a bit more space
                update.tag === 'System' ? 'bg-red-100 text-red-700' :
                update.tag === 'Feature' ? 'bg-green-100 text-green-700' :
                update.tag === 'Event' ? 'bg-yellow-100 text-yellow-700' :
                update.tag === 'Important' ? 'bg-orange-100 text-orange-700' :
                'bg-blue-100 text-blue-700'
              }`}>
                {update.tag}
              </span>
            )}
            <p className="text-sm text-slate-700 leading-relaxed">{update.text}</p>
            <p className="text-xs text-slate-500 mt-1.5 text-right">{update.timestamp}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UpdatesFeed;

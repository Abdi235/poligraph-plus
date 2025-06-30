"use client";

import React from 'react';

interface ChantModeProps {
  selectedTopic?: string; // Could be used to fetch topic-specific chants
  isVisible: boolean;    // To show/hide based on context
}

const ChantMode: React.FC<ChantModeProps> = ({ selectedTopic, isVisible }) => {
  if (!isVisible) {
    return null;
  }

  // Mock chant data - in a real app, this would come from keyword/phrase extraction
  const mockChants = [
    { id: '1', text: "We the North!", topic: "Sports", relevance: 0.9 },
    { id: '2', text: "Messi is GOAT", topic: "Sports", relevance: 0.85 },
    { id: '3', text: "Defense! Defense!", topic: "Sports", relevance: 0.7 },
    { id: '4', text: "Vote Now!", topic: "Politics", relevance: 0.9 },
    { id: '5', text: "Breaking News Update", topic: "News", relevance: 0.8 },
  ];

  const relevantChants = mockChants.filter(
    chant => chant.topic.toLowerCase() === selectedTopic?.toLowerCase()
  ).sort((a,b) => b.relevance - a.relevance).slice(0,3); // Show top 3

  return (
    <div className="p-4 border rounded shadow-lg bg-purple-50">
      <h3 className="text-lg font-semibold mb-3 text-center text-purple-700">📣 Chant Mode (Optional/Fun)</h3>
      {relevantChants.length === 0 ? (
        <p className="text-center text-gray-500">No popular chants/phrases detected for {selectedTopic}.</p>
      ) : (
        <ul className="space-y-2">
          {relevantChants.map(chant => (
            <li
              key={chant.id}
              className="p-2 bg-white rounded shadow-sm text-purple-600 italic text-center"
            >
              "{chant.text}"
            </li>
          ))}
        </ul>
      )}
       <p className="text-xs text-gray-400 mt-3 text-center">
        Highlights frequent catchphrases or hashtags by fans.
      </p>
    </div>
  );
};

export default ChantMode;

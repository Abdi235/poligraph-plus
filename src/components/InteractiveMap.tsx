"use client";

import React, { useEffect, useState } from 'react';
import { mockSentimentData } from '@/data/mockData'; // Using mock data for now

interface SentimentPoint {
  id: string;
  topic: string;
  region: string;
  sentiment: number; // e.g., -1 (negative) to 1 (positive)
  timestamp: number;
}

interface InteractiveMapProps {
  data?: SentimentPoint[];
  selectedTopic?: string;
}

const InteractiveMap: React.FC<InteractiveMapProps> = ({ data, selectedTopic }) => {
  const [displayData, setDisplayData] = useState<SentimentPoint[]>([]);

  useEffect(() => {
    // Simulate fetching or filtering data based on props
    const mapData = data || mockSentimentData;
    if (selectedTopic) {
      setDisplayData(mapData.filter(item => item.topic.toLowerCase() === selectedTopic.toLowerCase()));
    } else {
      setDisplayData(mapData);
    }
  }, [data, selectedTopic]);

  // Helper to determine color based on sentiment
  const getSentimentColor = (sentiment: number): string => {
    if (sentiment > 0.5) return 'bg-green-500'; // Strong positive
    if (sentiment > 0.1) return 'bg-green-300'; // Mild positive
    if (sentiment < -0.5) return 'bg-red-500'; // Strong negative
    if (sentiment < -0.1) return 'bg-red-300'; // Mild negative
    return 'bg-gray-400'; // Neutral
  };

  return (
    <div className="p-4 border rounded shadow-lg bg-gray-50 h-[400px] overflow-auto">
      <h2 className="text-xl font-semibold mb-4 text-center">Interactive Sentiment Map (Placeholder)</h2>
      {displayData.length === 0 ? (
        <p className="text-center text-gray-500">No sentiment data available for "{selectedTopic || 'any topic'}".</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {displayData.map(point => (
            <div
              key={point.id}
              className={`p-3 rounded-lg shadow ${getSentimentColor(point.sentiment)} text-white`}
            >
              <h3 className="font-semibold text-lg">{point.region}</h3>
              <p className="text-sm">Topic: {point.topic}</p>
              <p className="text-sm">Sentiment: {point.sentiment.toFixed(2)}</p>
              <p className="text-xs">Time: {new Date(point.timestamp).toLocaleTimeString()}</p>
            </div>
          ))}
        </div>
      )}
      <p className="text-xs text-gray-400 mt-4 text-center">
        Note: This is a simplified representation. A real map would show these points on a geographical interface.
      </p>
    </div>
  );
};

export default InteractiveMap;

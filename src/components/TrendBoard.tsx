"use client";

import React, { useEffect, useState } from 'react';
import { mockTrendData } from '@/data/mockData'; // Using mock data

interface TrendItem {
  id: string;
  topic: string;
  trend: string; // e.g., player name, team name, issue
  volume: number; // e.g., number of mentions
}

interface TrendBoardProps {
  data?: TrendItem[];
  selectedTopic?: string;
}

const TrendBoard: React.FC<TrendBoardProps> = ({ data, selectedTopic }) => {
  const [trends, setTrends] = useState<TrendItem[]>([]);

  useEffect(() => {
    const trendData = data || mockTrendData;
    if (selectedTopic) {
      setTrends(trendData.filter(item => item.topic.toLowerCase() === selectedTopic.toLowerCase())
                         .sort((a, b) => b.volume - a.volume));
    } else {
      setTrends(trendData.sort((a, b) => b.volume - a.volume));
    }
  }, [data, selectedTopic]);

  return (
    <div className="p-4 border rounded shadow-lg bg-gray-50">
      <h2 className="text-xl font-semibold mb-4 text-center">Trend Board</h2>
      {trends.length === 0 ? (
        <p className="text-center text-gray-500">No trends available for "{selectedTopic || 'any topic'}".</p>
      ) : (
        <ul className="space-y-2">
          {trends.map((item, index) => (
            <li
              key={item.id}
              className="p-3 rounded-lg shadow-sm bg-white hover:bg-gray-100 transition-colors"
            >
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-800">
                  {index + 1}. {item.trend}
                </span>
                <span className="text-sm text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                  Volume: {item.volume}
                </span>
              </div>
              <p className="text-xs text-gray-500">Topic: {item.topic}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TrendBoard;

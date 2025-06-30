"use client";

import React, { useMemo } from 'react';
import { ProcessedPost } from '@/services/dataProcessor';

interface ChantModeProps {
  selectedTopic?: string;
  processedPosts: ProcessedPost[]; // Receive processed posts from parent
  isVisible: boolean;
}

const ChantMode: React.FC<ChantModeProps> = ({ selectedTopic, processedPosts, isVisible }) => {
  if (!isVisible) {
    return null;
  }

  const popularChants = useMemo(() => {
    if (!processedPosts || processedPosts.length === 0) {
      return [];
    }

    const keywordFrequency: { [key: string]: number } = {};

    processedPosts.forEach(post => {
      // Assuming post.keywords is an array of strings from KeywordExtractionService
      if (post.keywords && Array.isArray(post.keywords)) {
        post.keywords.forEach(keyword => {
          // Simple cleaning: convert to lower case, ignore very short keywords/hashtags
          const cleanKeyword = keyword.toLowerCase().trim();
          if (cleanKeyword.length < 3) return;
          // Optional: filter out generic words or apply more sophisticated filtering
          // For hashtags, they usually start with #. NER might pick them up.

          keywordFrequency[cleanKeyword] = (keywordFrequency[cleanKeyword] || 0) + 1;
        });
      }
    });

    // Sort keywords by frequency
    const sortedKeywords = Object.entries(keywordFrequency)
      .sort(([, freqA], [, freqB]) => freqB - freqA)
      .map(([text, freq]) => ({ text, freq }));

    return sortedKeywords.slice(0, 5); // Return top 5 most frequent keywords/phrases
  }, [processedPosts]);

  return (
    <div className="p-4 border rounded shadow-lg bg-purple-50">
      <h3 className="text-lg font-semibold mb-3 text-center text-purple-700">📣 Trending Phrases/Keywords</h3>
      {popularChants.length === 0 ? (
        <p className="text-center text-gray-500">No significant phrases/keywords detected for {selectedTopic}.</p>
      ) : (
        <ul className="space-y-2">
          {popularChants.map((chant, index) => (
            <li
              key={`${chant.text}-${index}`}
              className="p-2 bg-white rounded shadow-sm text-purple-600 italic text-center flex justify-between items-center"
            >
              <span>"{chant.text}"</span>
              <span className="text-xs text-purple-400 ml-2">(freq: {chant.freq})</span>
            </li>
          ))}
        </ul>
      )}
       <p className="text-xs text-gray-400 mt-3 text-center">
        Highlights frequent phrases or keywords from recent posts.
      </p>
    </div>
  );
};

export default ChantMode;

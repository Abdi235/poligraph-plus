"use client";

import React, { useMemo } from 'react';
import dynamic from 'next/dynamic';
import { ProcessedPost, SentimentResult } from '@/services/dataProcessor';

// Define the props for InteractiveMap
interface InteractiveMapProps {
  processedPosts: ProcessedPost[];
  selectedTopic?: string;
  selectedTeam?: string; // For heatmap
}

// This interface is what DynamicMap will expect.
// It's derived from ProcessedPost but ensures coordinates are present.
export interface MapPoint {
  id: string;
  latitude: number;
  longitude: number;
  sentimentScore: number;
  displayText: string; // For popup: post text or location name
  locationDisplayName?: string | null;
}

const InteractiveMap: React.FC<InteractiveMapProps> = ({ processedPosts, selectedTopic }) => {
  const DynamicMap = useMemo(() =>
    dynamic(() => import('./DynamicMap'), { // Assuming DynamicMap is in the same directory
      ssr: false,
      loading: () => <p className="text-center p-4">Loading map...</p>,
    }),
  []);

  // Transform ProcessedPost[] to MapPoint[] for the map
  // Only include posts that have valid latitude and longitude
  const mapPoints: MapPoint[] = useMemo(() => {
    return processedPosts
      .filter(post => typeof post.latitude === 'number' && typeof post.longitude === 'number')
      .map(post => {
        let sentimentScore = 0;
        const sentiment = post.sentiment as SentimentResult[] | { error: string; label: string; score: number };

        if (sentiment && Array.isArray(sentiment) && sentiment.length > 0) {
          sentimentScore = sentiment[0].score;
          if (sentiment[0].label === 'NEGATIVE' || sentiment[0].label === 'LABEL_0') {
            sentimentScore = -sentimentScore;
          } else if (sentiment[0].label === 'NEUTRAL' || sentiment[0].label === 'LABEL_1') {
            sentimentScore = 0;
          }
        } else if (sentiment && typeof (sentiment as { score: number })?.score === 'number') { // Check for error structure or other single object
           // If it's an error object, or some other direct score, handle appropriately
           // For now, if it's the error object, sentimentScore remains 0 or could be set to a specific value
           if (!(sentiment as { error: string }).error) { // Not an error object
             sentimentScore = (sentiment as { score: number }).score;
           }
        }
        // else if (typeof post.sentiment === 'number') { // This case might be obsolete with new types
        //   sentimentScore = post.sentiment;
        // }

        return {
          id: post.id,
          latitude: post.latitude!, // Asserting non-null due to filter
          longitude: post.longitude!, // Asserting non-null due to filter
          sentimentScore: sentimentScore,
          displayText: post.text.substring(0, 100) + (post.text.length > 100 ? '...' : ''),
          locationDisplayName: post.locationDisplayName
        };
      });
  }, [processedPosts]);

  const heatmapData = useMemo(() => {
    if (selectedTopic !== "Sports" || !selectedTeam || selectedTeam.trim() === "" || mapPoints.length === 0) {
      return null; // No heatmap if not sports, no team selected, or no map points
    }

    // For heatmap, we need [lat, lng, intensity]
    // Intensity can be derived from positive sentiment for the selected team.
    // This is a simplified aggregation. A real app might average sentiment or count posts.
    const teamHeatmapPoints: [number, number, number][] = [];

    processedPosts.forEach(post => {
      // Check if the post is related to the selected team.
      // This is a very basic check. Ideally, backend would filter by team, or NLP would confirm team relevance.
      const postTextLower = post.text.toLowerCase();
      const teamLower = selectedTeam.toLowerCase();

      if (post.latitude != null && post.longitude != null && postTextLower.includes(teamLower)) {
        let positiveSentimentScore = 0;
        const sentiment = post.sentiment as SentimentResult[] | { error: string; label: string; score: number };

        if (sentiment && Array.isArray(sentiment) && sentiment.length > 0) {
          if (sentiment[0].label === 'POSITIVE' || sentiment[0].label === 'LABEL_2') {
            positiveSentimentScore = sentiment[0].score;
          }
        } else if (sentiment && typeof (sentiment as { score: number })?.score === 'number') {
           if (!(sentiment as { error: string }).error && (sentiment as any).label !== 'NEGATIVE' && (sentiment as any).label !== 'LABEL_0' && (sentiment as any).label !== 'NEUTRAL' && (sentiment as any).label !== 'LABEL_1') {
             // Assuming if not explicitly negative/neutral, it might be positive (crude)
             positiveSentimentScore = (sentiment as { score: number }).score;
           }
        }

        if (positiveSentimentScore > 0.1) { // Only include points with some positive sentiment
          teamHeatmapPoints.push([post.latitude, post.longitude, positiveSentimentScore * 100]); // Intensity scaled
        }
      }
    });
    return teamHeatmapPoints.length > 0 ? teamHeatmapPoints : null;
  }, [processedPosts, selectedTopic, selectedTeam, mapPoints]);


  return (
    <div className="border rounded shadow-lg bg-gray-50 h-[500px] p-1">
      <h2 className="text-xl font-semibold mb-2 text-center">
        Live Sentiment Map ({selectedTopic || 'All Topics'})
        {selectedTopic === "Sports" && selectedTeam && ` - Team: ${selectedTeam}`}
      </h2>
      {mapPoints.length === 0 && (
         <p className="text-center p-4">No geocoded data points to display on the map for &quot;{selectedTopic}&quot;.</p>
      )}
      {mapPoints.length > 0 && <DynamicMap points={mapPoints} heatmapData={heatmapData} />}
    </div>
  );
};

export default InteractiveMap;

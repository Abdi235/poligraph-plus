"use client"; // Keep this for the wrapper component as well

import React, { useMemo } from 'react';
import dynamic from 'next/dynamic';
import { ProcessedPost } from '@/services/dataProcessor'; // Using actual processed data type

// Mock coordinates for regions if not available in actual data
const mockRegionCoordinates: { [key: string]: [number, number] } = {
  'USA': [37.0902, -95.7129],
  'Canada': [56.1304, -106.3468],
  'UK': [55.3781, -3.4360],
  'Germany': [51.1657, 10.4515],
  'France': [46.6035, 1.8883],
  'Japan': [36.2048, 138.2529],
  'Australia': [ -25.2744, 133.7751],
  'Brazil': [-14.2350, -51.9253],
  // Add more regions as needed
};


// Define the props for InteractiveMap, which will now pass data to DynamicMap
interface InteractiveMapProps {
  // Data will come from ProcessedPost[], which needs to be mapped to MapSentimentPoint[]
  processedPosts: ProcessedPost[];
  selectedTopic?: string; // To filter or display
}

// Define the structure for points on the map
interface MapSentimentPoint {
  id: string;
  topic?: string;
  region: string;
  sentiment: number;
  coordinates: [number, number];
  text?: string;
}

const InteractiveMap: React.FC<InteractiveMapProps> = ({ processedPosts, selectedTopic }) => {
  // Dynamically import the Map component, ensuring it's only loaded on the client-side
  const DynamicMap = useMemo(() =>
    dynamic(() => import('./DynamicMap'), {
      ssr: false, // Disable server-side rendering for this component
      loading: () => <p className="text-center p-4">Loading map...</p>, // Optional loading indicator
    }),
  []);

  // Transform ProcessedPost[] to MapSentimentPoint[]
  // This is a crucial step: actual posts rarely have direct coordinates.
  // We need a strategy:
  // 1. Use geolocation from Twitter API if available (requires user permission, often sparse).
  // 2. Use NLP to extract locations mentioned in text (complex).
  // 3. For this example, we'll use the 'user.location' if available from Twitter (often unreliable/freeform)
  //    OR map known regions/countries from mockRegionCoordinates.
  //    A more robust solution would involve a geocoding service or more detailed location data.

  const mapData: MapSentimentPoint[] = processedPosts
    .map(post => {
      // Attempt to get coordinates
      // This is highly dependent on actual data structure from Twitter API via DataProcessorService
      // For now, let's assume 'post.user?.location' might give a hint or we use a default.
      // Or, if the post itself has geo data (e.g. from tweet.geo.place_id then expanded)

      let coordinates: [number, number] | undefined = undefined;
      let regionName = 'Unknown Region';

      // Simplistic region detection (replace with robust geocoding/location extraction)
      if (post.user) { // Assuming post.user might be a string like a country name for this mock
          const userLocation = post.user.toLowerCase(); // If user location is a string
          for (const key in mockRegionCoordinates) {
              if (userLocation.includes(key.toLowerCase())) {
                  coordinates = mockRegionCoordinates[key];
                  regionName = key;
                  break;
              }
          }
      }

      // Fallback if no coordinates found from user location
      if (!coordinates) {
        // Try to assign a random coordinate for demo if no region matches
        // This is not ideal for real data.
        const regions = Object.keys(mockRegionCoordinates);
        const randomRegion = regions[Math.floor(Math.random() * regions.length)];
        coordinates = mockRegionCoordinates[randomRegion];
        regionName = randomRegion; // Assign the random region name
      }

      // Ensure sentiment is a number. The `analyze` result from transformers.js
      // is usually an array like [{ label: 'POSITIVE', score: 0.99 }]
      let sentimentScore = 0;
      if (post.sentiment && Array.isArray(post.sentiment) && post.sentiment.length > 0) {
        sentimentScore = post.sentiment[0].score;
        // Adjust score: RoBERTa model for sentiment often gives POSITIVE, NEGATIVE, NEUTRAL.
        // We might want to map these to a numeric range, e.g. NEGATIVE: -score, POSITIVE: +score
        if (post.sentiment[0].label === 'NEGATIVE' || post.sentiment[0].label === 'LABEL_0') sentimentScore = -sentimentScore;
        else if (post.sentiment[0].label === 'NEUTRAL' || post.sentiment[0].label === 'LABEL_1') sentimentScore = 0; // Or a small value
        // LABEL_2 is often POSITIVE for cardiffnlp model
      } else if (typeof post.sentiment === 'number') { // If it's somehow already a number
        sentimentScore = post.sentiment;
      }


      return {
        id: post.id,
        topic: selectedTopic || post.eventType, // Or derive from post data
        region: regionName, // Use determined region name
        sentiment: sentimentScore,
        coordinates: coordinates!, // Asserting coordinates is found due to fallback
        text: post.text,
      };
    })
    .filter(point => point.coordinates); // Ensure we only try to render points with coordinates

  return (
    <div className="border rounded shadow-lg bg-gray-50 h-[500px] p-1"> {/* Ensure parent has height */}
      <h2 className="text-xl font-semibold mb-2 text-center">
        Live Sentiment Map ({selectedTopic || 'All Topics'})
      </h2>
      {mapData.length === 0 && !dynamic(() => Promise.resolve(true), { ssr: false }) && ( // Check to prevent flash of "No data" while map loads
         <p className="text-center p-4">No data points to display on the map for &quot;{selectedTopic}&quot;.</p>
      )}
      <DynamicMap data={mapData} />
    </div>
  );
};

export default InteractiveMap;

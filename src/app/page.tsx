"use client";

import { useTopic } from '@/context/TopicContext';
import InteractiveMap from '@/components/InteractiveMap';
import TimelineSlider from '@/components/TimelineSlider';
import TrendBoard from '@/components/TrendBoard';
import PostFeed from '@/components/PostFeed';
import SportsFilters from '@/components/SportsFilters';
import FanBaseHeatmap from '@/components/FanBaseHeatmap';
import ChantMode from '@/components/ChantMode';
import { mockTrendData } from '@/data/mockData';
import DataProcessorService, { ProcessedPost } from '@/services/dataProcessor';
import SpikeAlertService, { SentimentSpike } from '@/services/spikeAlertService'; // Import SpikeAlertService
import { useState, useEffect, useCallback } from 'react';

export default function Home() {
  const { selectedTopic } = useTopic();
  const [timeRange, setTimeRange] = useState<{ startDate: Date, endDate: Date }>({
    startDate: new Date(Date.now() - 24 * 60 * 60 * 1000),
    endDate: new Date(),
  });
  const [sportsFilters, setSportsFilters] = useState({ league: '', team: '', player: '', event: '' });

  const [processedPosts, setProcessedPosts] = useState<ProcessedPost[]>([]);
  const [isLoadingPosts, setIsLoadingPosts] = useState<boolean>(true);
  const [postsError, setPostsError] = useState<string | null>(null);
  const [latestSpike, setLatestSpike] = useState<SentimentSpike | null>(null); // State for spike alerts

  const spikeAlertService = SpikeAlertService.getInstance();

  // Effect to fetch posts when selectedTopic or relevant filters change
  const fetchAndProcessData = useCallback(async () => {
    if (!selectedTopic) {
      setProcessedPosts([]);
      setIsLoadingPosts(false);
      return;
    }
    setIsLoadingPosts(true);
    setPostsError(null);
    try {
      const dataProcessor = DataProcessorService.getInstance();
      let query = selectedTopic;
      if (selectedTopic === "Sports") {
        const activeFilters = Object.values(sportsFilters).filter(f => f).join(" ");
        if (activeFilters) query = `${query} ${activeFilters}`;
      }
      const data = await dataProcessor.fetchDataAndProcess(query, ['Twitter']);
      setProcessedPosts(data);

      // Check for spikes after fetching new data
      if (data.length > 0) {
        const spike = spikeAlertService.checkForSpike(selectedTopic, data);
        if (spike) {
          setLatestSpike(spike);
          // Optional: clear spike message after some time
          setTimeout(() => setLatestSpike(null), 10000); // Clear after 10 seconds
        }
      }
    } catch (error: unknown) {
      console.error("Error fetching page-level posts:", error);
      if (error instanceof Error) {
        setPostsError(error.message);
      } else {
        setPostsError("An unknown error occurred while fetching posts.");
      }
    } finally {
      setIsLoadingPosts(false);
    }
  }, [selectedTopic, sportsFilters, spikeAlertService]); // Removed timeRange, as it's not directly used by fetchAndProcessData

  useEffect(() => {
    fetchAndProcessData();
  }, [fetchAndProcessData]);


  const handleDateChange = (startDate: Date, endDate: Date) => {
    setTimeRange({ startDate, endDate });
  };

  const handleSportsFilterChange = (filters: { league: string; team: string; player: string; event: string }) => {
    setSportsFilters(filters);
  };

  const filteredTrendData = mockTrendData.filter(item =>
    item.topic.toLowerCase() === selectedTopic.toLowerCase()
  );

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-center my-4">
        PoliGraph+ Dashboard: <span className="text-blue-600">{selectedTopic}</span>
      </h1>

      {/* Display Spike Alert */}
      {latestSpike && (
        <div className="p-4 mb-4 text-sm text-yellow-700 bg-yellow-100 rounded-lg shadow-md" role="alert">
          <span className="font-medium">🔥 Sentiment Spike Alert!</span> {latestSpike.message}
          <br />
          <span className="text-xs">
            (Previous: {latestSpike.previousSentiment.toFixed(2)}, Current: {latestSpike.currentSentiment.toFixed(2)}, Change: {latestSpike.change > 0 ? '+' : ''}{latestSpike.change.toFixed(2)})
          </span>
        </div>
      )}

      <SportsFilters
        onFilterChange={handleSportsFilterChange}
        isVisible={selectedTopic === "Sports"}
      />

      <FanBaseHeatmap
        selectedTeam={sportsFilters.team}
        isVisible={selectedTopic === "Sports" && !!sportsFilters.team}
      />

      <ChantMode selectedTopic={selectedTopic} processedPosts={processedPosts} isVisible={true} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {isLoadingPosts && <p className="text-center p-4">Loading map data...</p>}
          {postsError && <p className="text-center text-red-500 p-4">Error loading map data: {postsError}</p>}
          {!isLoadingPosts && !postsError && (
            <InteractiveMap processedPosts={processedPosts} selectedTopic={selectedTopic} />
          )}
        </div>
        <div className="lg:col-span-1 space-y-6">
          <TrendBoard selectedTopic={selectedTopic} data={filteredTrendData} />
          <TimelineSlider onDateChange={handleDateChange} />
        </div>
      </div>

      <div>
        <PostFeed
          initialPosts={processedPosts}
          isLoading={isLoadingPosts}
          error={postsError}
          query={selectedTopic}
        />
      </div>

      {/* Placeholder for spike alerts can be removed if the above alert is sufficient for now */}
      {/* <div className="p-4 border rounded shadow-lg bg-yellow-100 text-yellow-800">
        <h2 className="text-xl font-semibold mb-2 text-center">🔥 Spike Alerts (Placeholder)</h2>
        <p className="text-center">Significant sentiment shift detected for "Player X" in "Sports"!</p>
      </div> */}
    </div>
  );
}

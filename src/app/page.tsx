"use client";

import { useTopic } from '@/context/TopicContext';
import InteractiveMap from '@/components/InteractiveMap';
import TimelineSlider from '@/components/TimelineSlider';
import TrendBoard from '@/components/TrendBoard';
import PostFeed from '@/components/PostFeed';
import SportsFilters from '@/components/SportsFilters';
import FanBaseHeatmap from '@/components/FanBaseHeatmap';
import ChantMode from '@/components/ChantMode'; // Import ChantMode
import { mockSentimentData, mockTrendData } from '@/data/mockData';
import { useState } from 'react';

export default function Home() {
  const { selectedTopic } = useTopic();
  const [timeRange, setTimeRange] = useState<{ startDate: Date, endDate: Date }>({
    startDate: new Date(Date.now() - 24 * 60 * 60 * 1000),
    endDate: new Date(),
  });
  const [sportsFilters, setSportsFilters] = useState({ league: '', team: '', player: '', event: '' });

  const handleDateChange = (startDate: Date, endDate: Date) => {
    setTimeRange({ startDate, endDate });
    console.log("Time range updated:", startDate, endDate);
    // TODO: Refetch or filter data
  };

  const handleSportsFilterChange = (filters: { league: string; team: string; player: string; event: string }) => {
    setSportsFilters(filters);
    console.log("Sports filters updated:", filters);
    // TODO: Refetch or filter data
  };

  // Mock filtering
  const filteredSentimentData = mockSentimentData.filter(item =>
    item.topic.toLowerCase() === selectedTopic.toLowerCase() &&
    item.timestamp >= timeRange.startDate.getTime() &&
    item.timestamp <= timeRange.endDate.getTime() &&
    (selectedTopic !== "Sports" || (
      (sportsFilters.league ? item.text?.toLowerCase().includes(sportsFilters.league.toLowerCase()) : true) &&
      (sportsFilters.team ? item.text?.toLowerCase().includes(sportsFilters.team.toLowerCase()) : true) &&
      (sportsFilters.player ? item.text?.toLowerCase().includes(sportsFilters.player.toLowerCase()) : true) &&
      (sportsFilters.event ? item.text?.toLowerCase().includes(sportsFilters.event.toLowerCase()) : true)
    ))
  );

  const filteredTrendData = mockTrendData.filter(item =>
    item.topic.toLowerCase() === selectedTopic.toLowerCase() &&
    (selectedTopic !== "Sports" || (
      (sportsFilters.league ? item.trend.toLowerCase().includes(sportsFilters.league.toLowerCase()) : true) &&
      (sportsFilters.team ? item.trend.toLowerCase().includes(sportsFilters.team.toLowerCase()) : true) &&
      (sportsFilters.player ? item.trend.toLowerCase().includes(sportsFilters.player.toLowerCase()) : true) &&
      (sportsFilters.event ? item.trend.toLowerCase().includes(sportsFilters.event.toLowerCase()) : true)
    ))
  );

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-center my-4">
        PoliGraph+ Dashboard: <span className="text-blue-600">{selectedTopic}</span>
      </h1>

      <SportsFilters
        onFilterChange={handleSportsFilterChange}
        isVisible={selectedTopic === "Sports"}
      />

      <FanBaseHeatmap
        selectedTeam={sportsFilters.team}
        isVisible={selectedTopic === "Sports" && !!sportsFilters.team}
      />

      <ChantMode selectedTopic={selectedTopic} isVisible={true} /> {/* ChantMode can be always visible or context-dependent */}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <InteractiveMap selectedTopic={selectedTopic} data={filteredSentimentData} />
        </div>
        <div className="lg:col-span-1 space-y-6">
          <TrendBoard selectedTopic={selectedTopic} data={filteredTrendData} />
          <TimelineSlider onDateChange={handleDateChange} />
        </div>
      </div>

      <div>
        <PostFeed query={selectedTopic} />
      </div>

      <div className="p-4 border rounded shadow-lg bg-yellow-100 text-yellow-800">
        <h2 className="text-xl font-semibold mb-2 text-center">🔥 Spike Alerts (Placeholder)</h2>
        <p className="text-center">Significant sentiment shift detected for "Player X" in "Sports"!</p>
      </div>
    </div>
  );
}

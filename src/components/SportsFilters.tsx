"use client";

import React, { useState } from 'react';

interface SportsFiltersProps {
  onFilterChange: (filters: { league: string; team: string; player: string; event: string }) => void;
  isVisible: boolean; // To show/hide based on selected topic
}

const SportsFilters: React.FC<SportsFiltersProps> = ({ onFilterChange, isVisible }) => {
  const [league, setLeague] = useState('');
  const [team, setTeam] = useState('');
  const [player, setPlayer] = useState('');
  const [event, setEvent] = useState('');

  const handleApplyFilters = () => {
    onFilterChange({ league, team, player, event });
  };

  if (!isVisible) {
    return null; // Don't render if not in Sports mode or relevant context
  }

  return (
    <div className="p-4 border rounded shadow-lg bg-gray-50">
      <h3 className="text-lg font-semibold mb-3 text-center">Sports Filters</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="league-filter" className="block text-sm font-medium text-gray-700 mb-1">
            League (e.g., NBA, NFL)
          </label>
          <input
            type="text"
            id="league-filter"
            value={league}
            onChange={(e) => setLeague(e.target.value)}
            placeholder="NBA, NFL, FIFA..."
            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label htmlFor="team-filter" className="block text-sm font-medium text-gray-700 mb-1">
            Team (e.g., Lakers)
          </label>
          <input
            type="text"
            id="team-filter"
            value={team}
            onChange={(e) => setTeam(e.target.value)}
            placeholder="Lakers, Real Madrid..."
            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label htmlFor="player-filter" className="block text-sm font-medium text-gray-700 mb-1">
            Player (e.g., Messi)
          </label>
          <input
            type="text"
            id="player-filter"
            value={player}
            onChange={(e) => setPlayer(e.target.value)}
            placeholder="Messi, LeBron James..."
            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label htmlFor="event-filter" className="block text-sm font-medium text-gray-700 mb-1">
            Event (e.g., Super Bowl)
          </label>
          <input
            type="text"
            id="event-filter"
            value={event}
            onChange={(e) => setEvent(e.target.value)}
            placeholder="Super Bowl, Olympics..."
            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>
      <button
        onClick={handleApplyFilters}
        className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
      >
        Apply Sports Filters
      </button>
    </div>
  );
};

export default SportsFilters;

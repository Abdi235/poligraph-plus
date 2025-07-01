"use client";

import React from 'react';

interface FanBaseHeatmapProps {
  selectedTeam?: string; // To display heatmap for a specific team
  isVisible: boolean; // To show/hide based on context (e.g., Sports topic and a team is selected)
}

const FanBaseHeatmap: React.FC<FanBaseHeatmapProps> = ({ selectedTeam, isVisible }) => {
  if (!isVisible || !selectedTeam) {
    return null;
  }

  // Mock data for heatmap - in a real app, this would come from processed sentiment data
  const mockHeatmapData = [
    { region: "California", intensity: 0.8, team: "Lakers" },
    { region: "New York", intensity: 0.6, team: "Lakers" },
    { region: "Texas", intensity: 0.7, team: "Rockets" },
    { region: "Florida", intensity: 0.9, team: "Heat" },
    { region: "Illinois", intensity: 0.5, team: "Bulls" },
  ];

  const teamData = mockHeatmapData.filter(
    data => data.team.toLowerCase() === selectedTeam.toLowerCase()
  );

  const getIntensityColor = (intensity: number): string => {
    if (intensity > 0.7) return 'bg-red-700';
    if (intensity > 0.5) return 'bg-red-500';
    if (intensity > 0.3) return 'bg-red-300';
    return 'bg-red-100';
  };

  return (
    <div className="p-4 border rounded shadow-lg bg-gray-50">
      <h3 className="text-lg font-semibold mb-3 text-center">
        Fan Base Heatmap for {selectedTeam} (Placeholder)
      </h3>
      {teamData.length === 0 ? (
        <p className="text-center text-gray-500">No heatmap data available for {selectedTeam}.</p>
      ) : (
        <div className="space-y-2">
          {teamData.map(data => (
            <div key={data.region} className="flex items-center justify-between p-2 bg-white rounded shadow-sm">
              <span className="font-medium">{data.region}</span>
              <div className="flex items-center">
                <span className="text-sm mr-2">Intensity:</span>
                <div
                  className={`w-16 h-4 rounded ${getIntensityColor(data.intensity)}`}
                  title={`Intensity: ${data.intensity.toFixed(2)}`}
                />
              </div>
            </div>
          ))}
        </div>
      )}
      <p className="text-xs text-gray-400 mt-3 text-center">
        Note: This is a visual placeholder. A real heatmap would overlay on the Interactive Map.
      </p>
    </div>
  );
};

export default FanBaseHeatmap;

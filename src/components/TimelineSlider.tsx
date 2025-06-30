"use client";

import React, { useState, ChangeEvent } from 'react';

interface TimelineSliderProps {
  onDateChange: (startDate: Date, endDate: Date) => void;
  // Assuming we have a known range of available data, e.g., last 24 hours
}

const TimelineSlider: React.FC<TimelineSliderProps> = ({ onDateChange }) => {
  const [hoursAgo, setHoursAgo] = useState<number>(24); // Default to last 24 hours

  const handleSliderChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value, 10);
    setHoursAgo(value);

    const endDate = new Date();
    const startDate = new Date();
    startDate.setHours(endDate.getHours() - value);

    onDateChange(startDate, endDate);
  };

  // Format date for display
  const formatDate = (date: Date): string => {
    return date.toLocaleString();
  }

  const currentEndDate = new Date();
  const currentStartDate = new Date();
  currentStartDate.setHours(currentEndDate.getHours() - hoursAgo);

  return (
    <div className="p-4 border rounded shadow-lg bg-gray-50">
      <h2 className="text-xl font-semibold mb-2 text-center">Timeline Slider (Placeholder)</h2>
      <div className="flex flex-col items-center">
        <label htmlFor="timeline-slider" className="mb-1 text-sm font-medium text-gray-700">
          Show data from the last {hoursAgo} hour(s)
        </label>
        <input
          id="timeline-slider"
          type="range"
          min="1" // Min 1 hour ago
          max="72" // Max 72 hours (3 days) ago
          step="1"
          value={hoursAgo}
          onChange={handleSliderChange}
          className="w-full max-w-md h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
        />
        <div className="mt-2 text-xs text-gray-600">
          <p>Start: {formatDate(currentStartDate)}</p>
          <p>End: {formatDate(currentEndDate)}</p>
        </div>
      </div>
      <p className="text-xs text-gray-400 mt-3 text-center">
        Note: This component simulates time range selection.
      </p>
    </div>
  );
};

export default TimelineSlider;

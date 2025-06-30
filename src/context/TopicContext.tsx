"use client";

import React, { createContext, useState, useContext, ReactNode } from 'react';

type Topic = "Politics" | "Sports" | "News" | "Custom Topic";

interface TopicContextType {
  selectedTopic: Topic;
  setSelectedTopic: (topic: Topic) => void;
}

const TopicContext = createContext<TopicContextType | undefined>(undefined);

export const TopicProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedTopic, setSelectedTopic] = useState<Topic>("Sports"); // Default to Sports

  return (
    <TopicContext.Provider value={{ selectedTopic, setSelectedTopic }}>
      {children}
    </TopicContext.Provider>
  );
};

export const useTopic = (): TopicContextType => {
  const context = useContext(TopicContext);
  if (context === undefined) {
    throw new Error('useTopic must be used within a TopicProvider');
  }
  return context;
};

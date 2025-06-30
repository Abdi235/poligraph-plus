export const mockSentimentData = [
  { id: '1', topic: 'Politics', region: 'USA', sentiment: 0.7, timestamp: Date.now() },
  { id: '2', topic: 'Sports', region: 'Canada', sentiment: -0.3, timestamp: Date.now() },
  { id: '3', topic: 'News', region: 'UK', sentiment: 0.1, timestamp: Date.now() },
];

export const mockTrendData = [
  { id: '1', topic: 'Politics', trend: 'Election Debate', volume: 1500 },
  { id: '2', topic: 'Sports', trend: 'World Cup Final', volume: 3000 },
  { id: '3', topic: 'News', trend: 'Economic Summit', volume: 1000 },
];

export const mockPostData = [
  { id: '1', topic: 'Politics', user: 'UserA', text: 'Great debate performance!', sentiment: 0.9 },
  { id: '2', topic: 'Sports', user: 'UserB', text: 'What a terrible call by the ref!', sentiment: -0.8 },
  { id: '3', topic: 'News', user: 'UserC', text: 'Interesting developments from the summit.', sentiment: 0.5 },
];

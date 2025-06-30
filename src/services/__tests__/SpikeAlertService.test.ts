// src/services/__tests__/SpikeAlertService.test.ts
import SpikeAlertService, { SentimentSpike } from '../spikeAlertService';
import { ProcessedPost } from '../dataProcessor';

describe('SpikeAlertService', () => {
  let service: SpikeAlertService;

  beforeEach(() => {
    service = SpikeAlertService.getInstance();
    // Reset history for the singleton instance for isolated tests
    (service as any).sentimentHistory = {};
  });

  const createMockPosts = (averageSentiment: number, count: number): ProcessedPost[] => {
    return Array(count).fill(null).map((_, i) => ({
      id: `post${i}`,
      text: `Test post ${i}`,
      source: 'Twitter',
      timestamp: new Date().toISOString(),
      // Simulate sentiment structure from CardiffNLP model
      sentiment: [{
        label: averageSentiment > 0.05 ? 'LABEL_2' : (averageSentiment < -0.05 ? 'LABEL_0' : 'LABEL_1'),
        score: Math.abs(averageSentiment)
      }],
      keywords: ['test'],
      eventType: 'General'
    }));
  };

  it('should correctly calculate average sentiment', () => {
    const postsPositive = createMockPosts(0.5, 10);
    const avgPositive = (service as any).calculateAverageSentiment(postsPositive);
    expect(avgPositive).toBeCloseTo(0.5);

    const postsNegative = createMockPosts(-0.8, 5);
    const avgNegative = (service as any).calculateAverageSentiment(postsNegative);
    expect(avgNegative).toBeCloseTo(-0.8);

    const postsNeutral = createMockPosts(0, 5); // score 0, label LABEL_1 (Neutral)
    const avgNeutral = (service as any).calculateAverageSentiment(postsNeutral);
    expect(avgNeutral).toBeCloseTo(0);
  });

  it('should not detect a spike for stable sentiment', () => {
    service.checkForSpike('TestTopic', createMockPosts(0.2, 5));
    const spike = service.checkForSpike('TestTopic', createMockPosts(0.21, 5));
    expect(spike).toBeNull();
  });

  it('should detect a positive spike', () => {
    service.checkForSpike('TestTopic', createMockPosts(0.1, 5));
    const spike = service.checkForSpike('TestTopic', createMockPosts(0.5, 5));
    expect(spike).not.toBeNull();
    if (spike) { // Type guard
      expect(spike.message).toContain('increased');
      expect(spike.currentSentiment).toBeCloseTo(0.5);
      expect(spike.previousSentiment).toBeCloseTo(0.1);
    }
  });

  it('should detect a negative spike', () => {
    service.checkForSpike('TestTopic', createMockPosts(-0.1, 5));
    const spike = service.checkForSpike('TestTopic', createMockPosts(-0.6, 5));
    expect(spike).not.toBeNull();
    if (spike) {
        expect(spike.message).toContain('decreased');
    }
  });

  it('should handle history length correctly', () => {
    const historyKey = 'HistoryTest';
    // Clear history for this specific test key if needed, though beforeEach does it globally
    (service as any).sentimentHistory[historyKey] = [];

    for(let i=0; i<5; i++) {
        service.checkForSpike(historyKey, createMockPosts(0.1 + i*0.01, 2));
    }
    // SENTIMENT_HISTORY_LENGTH is 3 in SpikeAlertService
    expect((service as any).sentimentHistory[historyKey]?.length).toBe(3);
  });

  it('should handle zero previous sentiment correctly when detecting spike', () => {
    service.checkForSpike('ZeroPrevTest', createMockPosts(0, 5)); // history: [0]
    const spike = service.checkForSpike('ZeroPrevTest', createMockPosts(0.5, 5)); // current: 0.5
    expect(spike).not.toBeNull();
    if (spike) {
      expect(spike.message).toContain('increased');
      // percentageChange would be Infinity, but the absolute change (0.5) also matters.
      expect(spike.change).toBeCloseTo(0.5);
    }
  });
});

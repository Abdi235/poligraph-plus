import { ProcessedPost } from './dataProcessor';

interface SentimentSpike {
  topic: string;
  message: string;
  timestamp: number;
  previousSentiment: number;
  currentSentiment: number;
  change: number;
}

const SENTIMENT_HISTORY_LENGTH = 3; // Keep history of last N average sentiments
const SPIKE_THRESHOLD_PERCENTAGE = 0.3; // 30% change to be considered a spike

class SpikeAlertService {
  private static instance: SpikeAlertService;
  private sentimentHistory: { [topic: string]: number[] } = {};

  private constructor() {}

  public static getInstance(): SpikeAlertService {
    if (!SpikeAlertService.instance) {
      SpikeAlertService.instance = new SpikeAlertService();
    }
    return SpikeAlertService.instance;
  }

  private calculateAverageSentiment(posts: ProcessedPost[]): number {
    if (posts.length === 0) return 0;

    let totalScore = 0;
    let validPostsCount = 0;

    posts.forEach(post => {
      if (post.sentiment && Array.isArray(post.sentiment) && post.sentiment.length > 0) {
        let score = post.sentiment[0].score;
        // Normalize score: NEGATIVE is negative, POSITIVE is positive
        if (post.sentiment[0].label === 'NEGATIVE' || post.sentiment[0].label === 'LABEL_0') score = -score;
        else if (post.sentiment[0].label === 'NEUTRAL' || post.sentiment[0].label === 'LABEL_1') score = 0;
        // LABEL_2 is POSITIVE

        totalScore += score;
        validPostsCount++;
      } else if (typeof post.sentiment === 'number') { // For older mock data or direct number
        totalScore += post.sentiment;
        validPostsCount++;
      }
    });
    return validPostsCount > 0 ? totalScore / validPostsCount : 0;
  }

  public checkForSpike(topic: string, newPosts: ProcessedPost[]): SentimentSpike | null {
    if (!this.sentimentHistory[topic]) {
      this.sentimentHistory[topic] = [];
    }

    const currentAverageSentiment = this.calculateAverageSentiment(newPosts);
    const history = this.sentimentHistory[topic];

    let spike: SentimentSpike | null = null;

    if (history.length > 0) {
      const previousAverageSentiment = history[history.length - 1];
      const change = currentAverageSentiment - previousAverageSentiment;
      // Avoid division by zero if previous sentiment was 0.
      // Calculate percentage change relative to the possible range (-1 to 1, so range of 2)
      // or simply look for a significant absolute change.
      // Let's use absolute change for simplicity first, then refine.
      // A more robust way: (current - prev) / Math.abs(prev) if prev is not 0.
      // Or, (current - prev) / ((Math.abs(current) + Math.abs(prev))/2) for a more stable percentage.

      let percentageChange = 0;
      if (previousAverageSentiment !== 0) {
        percentageChange = change / Math.abs(previousAverageSentiment);
      } else if (currentAverageSentiment !==0) { // If previous was 0, any non-zero current is infinite % change
        percentageChange = currentAverageSentiment > 0 ? Infinity : -Infinity;
      }


      if (Math.abs(percentageChange) >= SPIKE_THRESHOLD_PERCENTAGE && Math.abs(change) > 0.1) { // Add absolute change threshold
        const direction = change > 0 ? "increased" : "decreased";
        spike = {
          topic,
          message: `Sentiment for ${topic} has significantly ${direction}!`,
          timestamp: Date.now(),
          previousSentiment: previousAverageSentiment,
          currentSentiment: currentAverageSentiment,
          change: parseFloat(change.toFixed(3)),
        };
        console.log("SPIKE DETECTED:", spike);
      }
    }

    history.push(currentAverageSentiment);
    if (history.length > SENTIMENT_HISTORY_LENGTH) {
      history.shift(); // Keep history length bounded
    }
    this.sentimentHistory[topic] = history;

    return spike;
  }

  public getHistory(topic: string): number[] {
    return this.sentimentHistory[topic] || [];
  }
}

export default SpikeAlertService;
export type { SentimentSpike };

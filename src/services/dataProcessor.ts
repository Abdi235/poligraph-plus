import TwitterApiService from './twitterApi';
import RedditApiService from './redditApi';
import SentimentAnalysisService from './sentimentAnalysis';
import KeywordExtractionService from './keywordExtraction';
import EventClassificationService from './eventClassification';

export interface ProcessedPost {
  id: string;
  text: string;
  source: 'Twitter' | 'Reddit' | string;
  user?: string; // Twitter user, Reddit author
  timestamp: string;
  sentiment?: any; // Result from sentiment analysis
  keywords?: string[];
  eventType?: string; // Result from event classification
  // Add other relevant fields like geolocation if available later
}

class DataProcessorService {
  private static instance: DataProcessorService;
  private twitterApi: TwitterApiService;
  private redditApi: RedditApiService;
  private sentimentService: SentimentAnalysisService | null = null;
  private keywordService: KeywordExtractionService;
  private eventService: EventClassificationService;

  private constructor() {
    this.twitterApi = TwitterApiService.getInstance();
    this.redditApi = RedditApiService.getInstance();
    this.keywordService = KeywordExtractionService.getInstance();
    this.eventService = EventClassificationService.getInstance();
    this.initSentimentService();
  }

  private async initSentimentService() {
    this.sentimentService = await SentimentAnalysisService.getInstance();
  }


  public static getInstance(): DataProcessorService {
    if (!DataProcessorService.instance) {
      DataProcessorService.instance = new DataProcessorService();
    }
    return DataProcessorService.instance;
  }

  public async fetchDataAndProcess(query: string, sources: ('Twitter' | 'Reddit')[] = ['Twitter', 'Reddit']): Promise<ProcessedPost[]> {
    let rawPosts: any[] = [];

    if (sources.includes('Twitter')) {
      const tweets = await this.twitterApi.fetchTweets(query);
      rawPosts = rawPosts.concat(tweets);
    }
    if (sources.includes('Reddit')) {
      // Assuming query can be used as a subreddit for now, or a general keyword search
      const redditPosts = await this.redditApi.fetchRedditPosts(query);
      rawPosts = rawPosts.concat(redditPosts);
    }

    if (!this.sentimentService) {
        await this.initSentimentService(); // Ensure service is initialized
    }

    if (!this.sentimentService) {
        console.error("Sentiment service failed to initialize.");
        return []; // Or handle error appropriately
    }

    const processedPosts: ProcessedPost[] = [];
    for (const post of rawPosts) {
      const textToAnalyze = post.text || post.title || '';

      let sentiment = null;
      if (this.sentimentService) { // Check again due to async init
          sentiment = await this.sentimentService.analyze(textToAnalyze);
      }

      const keywords = await this.keywordService.extract(textToAnalyze);
      const eventType = await this.eventService.classify(textToAnalyze);

      processedPosts.push({
        id: post.id,
        text: textToAnalyze,
        source: post.source,
        user: post.user || post.author,
        timestamp: post.timestamp,
        sentiment,
        keywords,
        eventType,
      });
    }
    return processedPosts;
  }
}

export default DataProcessorService;

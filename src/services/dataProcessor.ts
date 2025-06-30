import TwitterApiService, { ProcessedTweet } from './twitterApi';
// RedditApiService removed for now
import SentimentAnalysisService from './sentimentAnalysis';
import KeywordExtractionService from './keywordExtraction';
import EventClassificationService from './eventClassification';

export interface ProcessedPost {
  id: string;
  text: string;
  source: 'Twitter' | string; // Only Twitter for now
  user?: string; // Twitter username
  name?: string; // Twitter display name
  profileImageUrl?: string;
  timestamp: string;
  sentiment?: any;
  keywords?: string[];
  eventType?: string;
  // Geolocation etc. can be added later
}

class DataProcessorService {
  private static instance: DataProcessorService;
  private twitterApi: TwitterApiService;
  private sentimentService: SentimentAnalysisService; // No longer nullable
  private keywordService: KeywordExtractionService;
  private eventService: EventClassificationService;

  private constructor() {
    this.twitterApi = TwitterApiService.getInstance();
    this.sentimentService = SentimentAnalysisService.getInstance(); // Get instance sync
    this.keywordService = KeywordExtractionService.getInstance();
    this.eventService = EventClassificationService.getInstance();
    // The SentimentAnalysisService constructor now handles initiating model loading.
    // Its analyze() method will await the loading promise.
  }

  public static getInstance(): DataProcessorService {
    if (!DataProcessorService.instance) {
      DataProcessorService.instance = new DataProcessorService();
    }
    return DataProcessorService.instance;
  }

  public async fetchDataAndProcess(query: string, sources: ('Twitter')[] = ['Twitter']): Promise<ProcessedPost[]> {
    let fetchedTweets: ProcessedTweet[] = [];

    if (sources.includes('Twitter')) {
      try {
        fetchedTweets = await this.twitterApi.fetchTweets(query);
      } catch (error) {
        console.error("Error fetching tweets in DataProcessorService:", error);
        return [];
      }
    }

    const processedPosts: ProcessedPost[] = [];
    for (const tweet of fetchedTweets) {
      const textToAnalyze = tweet.text || '';

      let sentiment = null;
      try {
        // The analyze method in SentimentAnalysisService will now internally await model readiness.
        sentiment = await this.sentimentService.analyze(textToAnalyze);
      } catch (e) {
        console.error(`Sentiment analysis failed for tweet ${tweet.id}:`, e);
        // Set a default/error sentiment structure if needed
        sentiment = { error: 'Analysis failed', label: 'neutral', score: 0 };
      }

      let keywords: string[] = [];
      try {
        keywords = await this.keywordService.extract(textToAnalyze);
      } catch(e) {
        console.error(`Keyword extraction failed for tweet ${tweet.id}:`, e);
      }

      let eventType = 'Other';
      try {
        eventType = await this.eventService.classify(textToAnalyze);
      } catch(e) {
        console.error(`Event classification failed for tweet ${tweet.id}:`, e);
      }

      processedPosts.push({
        id: tweet.id,
        text: textToAnalyze,
        source: tweet.source,
        user: tweet.user,
        name: tweet.name,
        profileImageUrl: tweet.profileImageUrl,
        timestamp: tweet.timestamp,
        sentiment,
        keywords,
        eventType,
      });
    }
    return processedPosts;
  }
}

export default DataProcessorService;

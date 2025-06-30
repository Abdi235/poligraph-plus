import TwitterApiService, { ProcessedTweet } from './twitterApi';
// RedditApiService removed for now
import SentimentAnalysisService from './sentimentAnalysis';
import KeywordExtractionService from './keywordExtraction';
import EventClassificationService from './eventClassification';

// Define a more specific type for sentiment analysis results
export interface SentimentResult {
  label: string;
  score: number;
}

export interface ProcessedPost {
  id: string;
  text: string;
  source: 'Twitter' | string; // Only Twitter for now
  user?: string; // Twitter username
  name?: string; // Twitter display name
  profileImageUrl?: string;
  timestamp: string;
  sentiment?: SentimentResult[] | { error: string; label: string; score: number }; // More specific type
  keywords?: string[];
  eventType?: string;
  latitude?: number | null; // New field for latitude
  longitude?: number | null; // New field for longitude
  locationDisplayName?: string | null; // Optional: display name from geocoding
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
    for (const tweet of fetchedTweets) { // tweet is of type ProcessedTweet from twitterApi.ts
      const textToAnalyze = tweet.text || '';
      let latitude: number | null = null;
      let longitude: number | null = null;
      let locationDisplayName: string | null = null;

      // Priority 1: Direct tweet geo (place_id centroid or coordinates)
      if (tweet.rawGeo?.place_id) {
        // In a real scenario, you'd look up this place_id in `includes.places` if it wasn't already expanded
        // For now, assuming if place_id is there, we might have some mock or direct way to get its centroid.
        // This part needs the full Twitter API response structure with `includes.places` to be robust.
        // Let's simulate finding a bbox if a place was included (not fully implemented here without includes.places)
        // For simplicity, if rawGeo.place_id exists, we'll try to use a mock coordinate for now.
        // This would be replaced by actual lookup in `includes.places[place_id].geo.bbox`
        // and then centroid calculation.
        // Example: const place = twitterResponse.includes.places.find(p => p.id === tweet.rawGeo.place_id);
        // if (place && place.geo && place.geo.bbox) {
        //    const bbox = place.geo.bbox; // [min_lon, min_lat, max_lon, max_lat]
        //    latitude = (bbox[1] + bbox[3]) / 2;
        //    longitude = (bbox[0] + bbox[2]) / 2;
        //    locationDisplayName = place.full_name;
        // }
        // Since we don't have includes.places readily available in ProcessedTweet, this is simplified:
         console.warn(`Tweet ${tweet.id} has place_id ${tweet.rawGeo.place_id}, but full place data lookup is not implemented here. Needs includes.places.`);
         // As a placeholder, let's assign a default if place_id exists
         // latitude = 40.7128; longitude = -74.0060; locationDisplayName = "Place ID (Mocked New York)";
      }
      // Direct coordinates (rarely available for tweets unless explicitly shared with coords)
      // if (tweet.rawGeo?.coordinates?.coordinates) {
      //   longitude = tweet.rawGeo.coordinates.coordinates[0];
      //   latitude = tweet.rawGeo.coordinates.coordinates[1];
      //   locationDisplayName = "Tweet precise coordinates";
      // }


      // Priority 2: Geocode user's profile location string
      if (!latitude && tweet.userLocationString && tweet.userLocationString.trim() !== "") {
        try {
          console.log(`Attempting to geocode user location: "${tweet.userLocationString}" for tweet ${tweet.id}`);
          // Fetch from our backend geocoding API route
          const geocodeResponse = await fetch(`/api/geocode?q=${encodeURIComponent(tweet.userLocationString)}`);
          if (geocodeResponse.ok) {
            const geocodeData = await geocodeResponse.json();
            if (geocodeData && geocodeData.latitude && geocodeData.longitude) {
              latitude = geocodeData.latitude;
              longitude = geocodeData.longitude;
              locationDisplayName = geocodeData.displayName || tweet.userLocationString;
              console.log(`Geocoded "${tweet.userLocationString}" to [${latitude}, ${longitude}]`);
            } else {
              console.log(`Geocoding for "${tweet.userLocationString}" returned no results or invalid data.`);
            }
          } else {
            const errorDetails = await geocodeResponse.text();
            console.warn(`Geocoding failed for "${tweet.userLocationString}": ${geocodeResponse.status} - ${errorDetails}`);
          }
        } catch (geoError) {
          console.error(`Error calling geocoding API for "${tweet.userLocationString}":`, geoError);
        }
      }

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
        latitude, // Add geocoded latitude
        longitude, // Add geocoded longitude
        locationDisplayName, // Add display name
      });
    }
    return processedPosts;
  }
}

export default DataProcessorService;

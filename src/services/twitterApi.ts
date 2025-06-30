// src/services/twitterApi.ts

interface Tweet {
  id: string;
  text: string;
  author_id?: string;
  created_at?: string;
  // Add other fields you expect, like user details from expansions
  user?: {
    username: string;
    name: string;
    profile_image_url?: string;
  };
  // Potentially more fields based on your query parameters
}

interface TwitterApiResponse {
  data?: Tweet[];
  includes?: {
    users?: any[]; // Define more specific user type if needed
    places?: any[];
  };
  meta?: {
    newest_id?: string;
    oldest_id?: string;
    result_count?: number;
    next_token?: string;
  };
  error?: any; // To capture API errors
  details?: any;
}


class TwitterApiService {
  private static instance: TwitterApiService;

  private constructor() {}

  public static getInstance(): TwitterApiService {
    if (!TwitterApiService.instance) {
      TwitterApiService.instance = new TwitterApiService();
    }
    return TwitterApiService.instance;
  }

  public async fetchTweets(query: string, count: number = 10): Promise<ProcessedTweet[]> {
    console.log(`Fetching live tweets for query: "${query}", count: ${count}`);
    try {
      // Make a request to our Next.js API route
      const response = await fetch(`/api/twitter/search?q=${encodeURIComponent(query)}&max_results=${count}`);

      if (!response.ok) {
        const errorData: TwitterApiResponse = await response.json();
        console.error(`Error fetching tweets from backend API: ${response.status}`, errorData.error || errorData);
        // You might want to throw an error or return a specific error structure
        throw new Error(errorData.error?.message || errorData.details?.detail || `Failed to fetch tweets: ${response.status}`);
      }

      const result: TwitterApiResponse = await response.json();

      if (result.error) {
         console.error('Twitter API returned an error:', result.error);
         throw new Error(result.error.message || 'Twitter API error');
      }

      if (!result.data) {
        console.log('No tweets found for the query or empty data array.');
        return [];
      }

      // Process and map tweets to a consistent format if needed
      return this.processRawTweets(result);

    } catch (error) {
      console.error('Exception in TwitterApiService.fetchTweets:', error);
      // Depending on how you want to handle errors, you could re-throw or return empty/error structure
      throw error; // Re-throw for the caller (e.g., DataProcessorService) to handle
    }
  }

  private processRawTweets(apiResponse: TwitterApiResponse): ProcessedTweet[] {
    const tweets = apiResponse.data || [];
    const users = apiResponse.includes?.users || [];
    // const places = apiResponse.includes?.places || []; // If you need place data

    const userMap = new Map(users.map(user => [user.id, user]));

    return tweets.map(tweet => ({
      id: tweet.id,
      text: tweet.text,
      user: tweet.author_id ? userMap.get(tweet.author_id)?.username : 'Unknown User',
      name: tweet.author_id ? userMap.get(tweet.author_id)?.name : 'Unknown User',
      profileImageUrl: tweet.author_id ? userMap.get(tweet.author_id)?.profile_image_url : undefined,
      timestamp: tweet.created_at || new Date().toISOString(),
      source: 'Twitter',
      // Add any other relevant fields from the tweet or expansions
      // e.g., public_metrics, geo data if available and processed
    }));
  }
}

// Define a more structured ProcessedTweet type for internal use
export interface ProcessedTweet {
  id: string;
  text: string;
  user: string; // username
  name: string; // display name
  profileImageUrl?: string;
  timestamp: string;
  source: 'Twitter';
  // Potentially add public_metrics, geo, etc.
}


export default TwitterApiService;

// src/services/twitterApi.ts

// Define more specific types based on Twitter API v2 response structure
interface TwitterApiUser {
  id: string;
  name: string;
  username: string;
  profile_image_url?: string;
  location?: string; // User's profile location (free-form text)
  // Add other user fields as needed: verified, public_metrics, etc.
}

interface TwitterApiTweetPublicMetrics {
  retweet_count: number;
  reply_count: number;
  like_count: number;
  quote_count: number;
  impression_count?: number; // May not always be present
}

interface TwitterApiTweetGeo {
  place_id?: string;
  // coordinates specific fields if direct geo-tagging is used (requires user permission)
}

interface TwitterApiTweet {
  id: string;
  text: string;
  author_id?: string;
  created_at?: string;
  public_metrics?: TwitterApiTweetPublicMetrics;
  geo?: TwitterApiTweetGeo;
  // Potentially 'entities' for hashtags, mentions, etc.
  // Potentially 'attachments' for media
}

interface TwitterApiPlace {
  id: string;
  full_name: string;
  geo?: {
    type: string; // e.g., 'Feature'
    bbox: [number, number, number, number];
    properties: object; // Can be more specific if needed
  };
  // Other place fields: country, country_code, place_type
}

interface TwitterApiResponseMeta {
  newest_id?: string;
  oldest_id?: string;
  result_count?: number;
  next_token?: string;
}

interface TwitterApiErrorDetail {
  field?: string;
  value?: string;
  detail?: string;
  title?: string;
  type?: string;
  // Potentially other error fields from Twitter
}

interface TwitterApiResponse {
  data?: TwitterApiTweet[];
  includes?: {
    users?: TwitterApiUser[];
    places?: TwitterApiPlace[];
    // tweets?: TwitterApiTweet[]; // For quoted/replied tweets
  };
  meta?: TwitterApiResponseMeta;
  errors?: TwitterApiErrorDetail[]; // For API operational errors
  title?: string; // For general error title (e.g., "Unauthorized")
  detail?: string; // For general error detail
  type?: string; // For general error type URL
  status?: number; // Sometimes included in error body
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
        // Log more structured error if available
        const errorMessage = errorData.detail || errorData.title || (errorData.errors && errorData.errors[0]?.detail) || `Failed to fetch tweets: ${response.status}`;
        console.error(`Error fetching tweets from backend API: ${response.status}`, errorData);
        throw new Error(errorMessage);
      }

      const result: TwitterApiResponse = await response.json();

      // Check for errors in the response body (Twitter API v2 often includes these)
      if (result.errors && result.errors.length > 0) {
         console.error('Twitter API returned errors:', result.errors);
         throw new Error(result.errors[0].detail || result.errors[0].title || 'Twitter API error');
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
    const users: TwitterApiUser[] = apiResponse.includes?.users || [];
    // const places: TwitterApiPlace[] = apiResponse.includes?.places || [];

    const userMap = new Map(users.map((user: TwitterApiUser) => [user.id, user]));

    return tweets.map(tweet => ({
      id: tweet.id,
      text: tweet.text,
      user: tweet.author_id ? userMap.get(tweet.author_id)?.username || 'Unknown User' : 'Unknown User',
      name: tweet.author_id ? userMap.get(tweet.author_id)?.name || 'Unknown User' : 'Unknown User',
      profileImageUrl: tweet.author_id ? userMap.get(tweet.author_id)?.profile_image_url : undefined,
      timestamp: tweet.created_at || new Date().toISOString(),
      source: 'Twitter',
      rawGeo: tweet.geo, // Pass the raw geo object
      userLocationString: tweet.author_id ? userMap.get(tweet.author_id)?.location : undefined, // Pass user's location string
      // Add any other relevant fields from the tweet or expansions
      // e.g., public_metrics
    }));
  }
}

// Define a more structured ProcessedTweet type for internal use
export interface ProcessedTweet {
  id: string;
  text: string;
  user: string; // username
  name:string; // display name
  profileImageUrl?: string;
  timestamp: string;
  source: 'Twitter';
  rawGeo?: TwitterApiTweetGeo; // Pass raw geo object from tweet
  userLocationString?: string; // Pass user's profile location string
  // Potentially add public_metrics, etc.
}


export default TwitterApiService;

import { mockPostData } from '@/data/mockData'; // Assuming mockPostData contains some tweet-like objects

class TwitterApiService {
  private static instance: TwitterApiService;

  private constructor() {}

  public static getInstance(): TwitterApiService {
    if (!TwitterApiService.instance) {
      TwitterApiService.instance = new TwitterApiService();
    }
    return TwitterApiService.instance;
  }

  public async fetchTweets(query: string, count: number = 10): Promise<any[]> {
    console.log(`Fetching tweets for query: ${query}, count: ${count}`);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));

    // Filter mock data based on a simple query (e.g., keyword in text)
    const filteredTweets = mockPostData.filter(post =>
      post.text.toLowerCase().includes(query.toLowerCase()) ||
      post.topic.toLowerCase().includes(query.toLowerCase())
    ).slice(0, count);

    // Simulate transforming API response to a desired format
    return filteredTweets.map(tweet => ({
      id: tweet.id,
      text: tweet.text,
      user: tweet.user,
      timestamp: new Date().toISOString(), // Simulate real timestamp
      source: 'Twitter'
    }));
  }
}

export default TwitterApiService;

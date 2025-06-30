import { mockPostData } from '@/data/mockData'; // Assuming mockPostData contains some post-like objects

class RedditApiService {
  private static instance: RedditApiService;

  private constructor() {}

  public static getInstance(): RedditApiService {
    if (!RedditApiService.instance) {
      RedditApiService.instance = new RedditApiService();
    }
    return RedditApiService.instance;
  }

  public async fetchRedditPosts(subreddit: string, limit: number = 10): Promise<any[]> {
    console.log(`Fetching posts from subreddit: r/${subreddit}, limit: ${limit}`);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));

    // Filter mock data (very simplistic, assuming topic might map to subreddit for mock purposes)
    const filteredPosts = mockPostData.filter(post =>
      post.topic.toLowerCase().includes(subreddit.toLowerCase()) // Simplistic match
    ).slice(0, limit);

    // Simulate transforming API response
    return filteredPosts.map(post => ({
      id: post.id,
      title: post.text.substring(0, 30) + '...', // Simulate a title
      text: post.text,
      author: post.user,
      url: `https://www.reddit.com/r/${subreddit}/comments/${post.id}`, // Simulated URL
      timestamp: new Date().toISOString(), // Simulate real timestamp
      source: 'Reddit'
    }));
  }
}

export default RedditApiService;

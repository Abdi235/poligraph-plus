"use client";

import React, { useEffect, useState } from 'react';
import { ProcessedPost } from '@/services/dataProcessor'; // Using the interface from DataProcessorService
import DataProcessorService from '@/services/dataProcessor'; // To fetch sample data

interface PostFeedProps {
  query?: string; // To fetch relevant posts
  maxPosts?: number;
}

const PostFeed: React.FC<PostFeedProps> = ({ query = "general", maxPosts = 5 }) => {
  const [posts, setPosts] = useState<ProcessedPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        setLoading(true);
        setError(null);
        const dataProcessor = DataProcessorService.getInstance();
        // Fetch a small number of posts related to the query or a default one
        const fetchedPosts = await dataProcessor.fetchDataAndProcess(query, ['Twitter', 'Reddit']);
        setPosts(fetchedPosts.slice(0, maxPosts));
      } catch (err: any) {
        console.error("Error fetching posts for feed:", err);
        setError(err.message || "Failed to load posts.");
      } finally {
        setLoading(false);
      }
    };
    loadPosts();
  }, [query, maxPosts]);

  const getSentimentColor = (sentimentScore: number): string => {
    if (sentimentScore > 0.5) return 'text-green-600';
    if (sentimentScore > 0.1) return 'text-green-400';
    if (sentimentScore < -0.5) return 'text-red-600';
    if (sentimentScore < -0.1) return 'text-red-400';
    return 'text-gray-500';
  };

  return (
    <div className="p-4 border rounded shadow-lg bg-gray-50">
      <h2 className="text-xl font-semibold mb-4 text-center">Post Feed</h2>
      {loading && <p className="text-center">Loading posts...</p>}
      {error && <p className="text-center text-red-500">Error: {error}</p>}
      {!loading && !error && posts.length === 0 && (
        <p className="text-center text-gray-500">No posts to display for "{query}".</p>
      )}
      {!loading && !error && posts.length > 0 && (
        <div className="space-y-3">
          {posts.map(post => (
            <div key={post.id} className="p-3 rounded-lg shadow-sm bg-white">
              <p className="text-sm text-gray-800">{post.text}</p>
              <div className="text-xs text-gray-500 mt-1">
                <span>Source: {post.source}</span> | <span>User: {post.user || 'N/A'}</span>
                {post.sentiment && post.sentiment[0] && (
                  <span className={`ml-2 font-semibold ${getSentimentColor(post.sentiment[0].score)}`}>
                    Sentiment: {post.sentiment[0].label} ({post.sentiment[0].score.toFixed(2)})
                  </span>
                )}
              </div>
               {post.keywords && post.keywords.length > 0 && (
                <p className="text-xs text-gray-500 mt-1">Keywords: {post.keywords.join(', ')}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PostFeed;

"use client";

import React, { useEffect, useState } from 'react'; // useEffect and useState might not be needed if all data comes via props
import { ProcessedPost } from '@/services/dataProcessor';
// DataProcessorService import might not be needed if PostFeed doesn't fetch its own data
import Image from 'next/image';

interface PostFeedProps {
  query?: string; // Can be used for display purposes or if there's still some internal filtering
  initialPosts: ProcessedPost[];
  isLoading: boolean;
  error: string | null;
  maxPosts?: number;
}

const PostFeed: React.FC<PostFeedProps> = ({
  query,
  initialPosts,
  isLoading,
  error,
  maxPosts = 10
}) => {

  // Posts are now primarily controlled by the parent through initialPosts.
  // If you want PostFeed to still be able to slice or further process, you can use useState/useEffect based on initialPosts.
  const postsToDisplay = initialPosts.slice(0, maxPosts);

  const getSentimentColor = (sentimentScore: number): string => {
    if (sentimentScore > 0.5) return 'text-green-600';
    if (sentimentScore > 0.1) return 'text-green-400';
    if (sentimentScore < -0.5) return 'text-red-600';
    if (sentimentScore < -0.1) return 'text-red-400';
    return 'text-gray-500';
  };

  return (
    <div className="p-4 border rounded shadow-lg bg-gray-50">
      <h2 className="text-xl font-semibold mb-4 text-center">Live Post Feed (Twitter)</h2>
      {loading && <p className="text-center">Loading posts...</p>}
      {error && <p className="text-center text-red-500">Error: {error}</p>}
      {!loading && !error && posts.length === 0 && (
        <p className="text-center text-gray-500">No posts to display for "{query}". Make sure API keys are set.</p>
      )}
      {!loading && !error && posts.length > 0 && (
        <div className="space-y-3 max-h-[600px] overflow-y-auto">
          {posts.map(post => (
            <div key={post.id} className="p-3 rounded-lg shadow-sm bg-white">
              <div className="flex items-start space-x-3">
                {post.profileImageUrl && (
                  <Image
                    src={post.profileImageUrl}
                    alt={post.name || post.user || 'User avatar'}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                )}
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-sm">{post.name || 'Unknown User'}</span>
                    <span className="text-xs text-gray-500">@{post.user || 'unknownuser'}</span>
                  </div>
                  <p className="text-sm text-gray-800 mt-1">{post.text}</p>
                  <div className="text-xs text-gray-500 mt-2">
                    <span>Source: {post.source}</span> | <span>{new Date(post.timestamp).toLocaleString()}</span>
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
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PostFeed;

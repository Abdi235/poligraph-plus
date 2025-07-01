import { NextRequest, NextResponse } from 'next/server';

const TWITTER_API_KEY = process.env.TWITTER_API_KEY;
const TWITTER_API_KEY_SECRET = process.env.TWITTER_API_KEY_SECRET;

let bearerToken: string | null = null;
let tokenExpiry: number | null = null;

// Function to get a new Bearer Token
async function getBearerToken(): Promise<string | null> {
  if (!TWITTER_API_KEY || !TWITTER_API_KEY_SECRET) {
    console.error('Twitter API Key or Secret is not set in environment variables.');
    return null;
  }

  const credentials = Buffer.from(`${encodeURIComponent(TWITTER_API_KEY)}:${encodeURIComponent(TWITTER_API_KEY_SECRET)}`).toString('base64');

  try {
    const response = await fetch('https://api.twitter.com/oauth2/token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      },
      body: 'grant_type=client_credentials',
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error(`Error fetching bearer token: ${response.status} - ${errorData}`);
      return null;
    }

    const data = await response.json();
    if (data.token_type === 'bearer') {
      bearerToken = data.access_token;
      // Twitter bearer tokens don't explicitly expire but it's good practice to refresh periodically or handle auth errors
      // For simplicity, we'll just store it. In a prod app, you might refresh it, e.g. daily or on auth errors.
      tokenExpiry = Date.now() + (24 * 60 * 60 * 1000); // Simple 24h expiry for potential refresh
      return bearerToken;
    } else {
      console.error('Invalid token type received:', data.token_type);
      return null;
    }
  } catch (error) {
    console.error('Exception while fetching bearer token:', error);
    return null;
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q');
  const maxResults = searchParams.get('max_results') || '10';

  if (!query) {
    return NextResponse.json({ error: 'Query parameter "q" is required' }, { status: 400 });
  }

  if (!bearerToken || (tokenExpiry && Date.now() >= tokenExpiry)) {
    console.log('Bearer token is null or expired, fetching new one...');
    const newBearerToken = await getBearerToken();
    if (!newBearerToken) {
      return NextResponse.json({ error: 'Failed to authenticate with Twitter API' }, { status: 500 });
    }
    bearerToken = newBearerToken;
  }

  if (!bearerToken) {
     // This case should ideally be covered by the block above
    return NextResponse.json({ error: 'Failed to authenticate with Twitter API (token still null)' }, { status: 500 });
  }

  const twitterApiUrl = `https://api.twitter.com/2/tweets/search/recent?query=${encodeURIComponent(query)}&max_results=${maxResults}&tweet.fields=created_at,author_id,public_metrics,geo&expansions=author_id,geo.place_id&user.fields=username,name,profile_image_url&place.fields=full_name,geo`;

  try {
    const response = await fetch(twitterApiUrl, {
      headers: {
        'Authorization': `Bearer ${bearerToken}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      // If auth error (e.g. token revoked), clear the token to force re-auth on next request
      if (response.status === 401 || response.status === 403) {
        bearerToken = null;
        tokenExpiry = null;
      }
      console.error(`Error fetching tweets: ${response.status}`, errorData);
      return NextResponse.json({ error: 'Failed to fetch tweets from Twitter API', details: errorData }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('Exception while fetching tweets:', error);
    return NextResponse.json({ error: 'Internal server error while fetching tweets' }, { status: 500 });
  }
}

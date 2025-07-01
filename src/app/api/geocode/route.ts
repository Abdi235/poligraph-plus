import { NextRequest, NextResponse } from 'next/server';

// Simple in-memory cache for geocoding results
interface CacheEntry {
  data: GeocodeResult | null;
  timestamp: number;
}
const geocodeCache = new Map<string, CacheEntry>();
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

interface GeocodeResult {
  latitude: number;
  longitude: number;
  displayName: string; // From Nominatim
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const locationQuery = searchParams.get('q');

  if (!locationQuery || locationQuery.trim() === '') {
    return NextResponse.json({ error: 'Location query parameter "q" is required.' }, { status: 400 });
  }

  const cacheKey = locationQuery.toLowerCase().trim();

  // Check cache first
  const cached = geocodeCache.get(cacheKey);
  if (cached && (Date.now() - cached.timestamp < CACHE_TTL)) {
    if (cached.data) {
      return NextResponse.json(cached.data);
    } else {
      // Null means it was previously geocoded and not found, or an error occurred.
      // We might want to differentiate this, but for simplicity, return not found.
      return NextResponse.json({ error: 'Location not found (cached as null)' }, { status: 404 });
    }
  }

  const nominatimUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(locationQuery)}&format=json&limit=1&addressdetails=1`;

  console.log(`Geocoding (Nominatim): ${locationQuery}`); // Log actual calls to Nominatim

  try {
    const response = await fetch(nominatimUrl, {
      headers: {
        // IMPORTANT: Nominatim requires a valid User-Agent.
        // Vercel might set a default one. For local dev, fetch might use a generic one.
        // Ideally, set a custom User-Agent like: 'PoliGraphPlus/0.1 contact@example.com'
        // This is crucial for not getting blocked by Nominatim.
        'User-Agent': 'PoliGraphPlus/0.1 (github.com/Abdi235/poligraph-plus; for educational purposes)',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Nominatim API error: ${response.status} - ${errorText}`);
      geocodeCache.set(cacheKey, { data: null, timestamp: Date.now() }); // Cache error as null
      return NextResponse.json({ error: 'Failed to fetch from geocoding service.', details: errorText }, { status: response.status });
    }

    const data = await response.json();

    if (data && data.length > 0) {
      const firstResult = data[0];
      const result: GeocodeResult = {
        latitude: parseFloat(firstResult.lat),
        longitude: parseFloat(firstResult.lon),
        displayName: firstResult.display_name,
      };
      geocodeCache.set(cacheKey, { data: result, timestamp: Date.now() });
      return NextResponse.json(result);
    } else {
      geocodeCache.set(cacheKey, { data: null, timestamp: Date.now() }); // Cache not found as null
      return NextResponse.json({ error: 'Location not found by geocoding service.' }, { status: 404 });
    }
  } catch (error) {
    console.error('Exception during geocoding:', error);
    // Don't cache general network errors, allow retries.
    return NextResponse.json({ error: 'Internal server error during geocoding.' }, { status: 500 });
  }
}
